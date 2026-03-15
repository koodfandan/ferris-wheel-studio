from __future__ import annotations

import base64
import hashlib
import hmac
import json
import mimetypes
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Protocol

from PIL import Image

from ..models import ImportJob
from ..schemas import RuntimeProviderStatus
from ..storage import LocalStorage
from ..utils.file_ids import build_storage_key

ProgressCallback = Callable[[str, int], None]
REAL_PROVIDER_PRIORITY: tuple[str, ...] = ("hunyuan-cloud", "meshy-api", "hunyuan-api-server", "hunyuan-local")


@dataclass(slots=True)
class ProviderContext:
    job: ImportJob
    subject_key: str
    subject_path: Path
    asset_id: str
    asset_prefix: str


@dataclass(slots=True)
class ProviderResult:
    asset_name: str
    generator: str
    texture_model: str
    model_glb_key: str | None
    preview_bytes: bytes | None = None


@dataclass(slots=True)
class ProviderUnavailableError(RuntimeError):
    provider: str
    code: str
    issues: list[str]
    hint: str | None = None

    def __post_init__(self) -> None:
        issue_text = ", ".join(self.issues) if self.issues else self.code
        hint_text = f" {self.hint}" if self.hint else ""
        RuntimeError.__init__(self, f"Provider {self.provider} is not ready: {issue_text}.{hint_text}".strip())


class GenerationProvider(Protocol):
    def generate(self, context: ProviderContext, on_progress: ProgressCallback | None = None) -> ProviderResult: ...


def _normalize_provider(value: str | None) -> str:
    provider = (value or "").strip().lower()
    return provider or "auto"


def _resolve_active_provider_from_real_statuses(settings, real_statuses: dict[str, RuntimeProviderStatus]) -> str:
    requested = _normalize_provider(settings.generator_provider)
    if requested != "auto":
        return requested
    for provider in REAL_PROVIDER_PRIORITY:
        if real_statuses[provider].ready:
            return provider
    if settings.enable_mock_pipeline:
        return "mock"
    for provider in REAL_PROVIDER_PRIORITY:
        if real_statuses[provider].configured:
            return provider
    return "hunyuan-local"


def _probe_real_provider_statuses(
    settings,
    active_provider: str | None = None,
) -> dict[str, RuntimeProviderStatus]:
    return {
        "hunyuan-cloud": probe_hunyuan_cloud_provider(settings, active_provider=active_provider),
        "meshy-api": probe_meshy_provider(settings, active_provider=active_provider),
        "hunyuan-api-server": probe_hunyuan_api_server_provider(settings, active_provider=active_provider),
        "hunyuan-local": probe_hunyuan_local_provider(settings, active_provider=active_provider),
    }


def resolve_active_provider(settings) -> str:
    real_statuses = _probe_real_provider_statuses(settings, active_provider=None)
    return _resolve_active_provider_from_real_statuses(settings, real_statuses)


def create_generation_provider(settings, storage: LocalStorage) -> GenerationProvider:
    provider = resolve_active_provider(settings)
    if provider == "mock":
        return MockGenerationProvider()
    if provider == "hunyuan-cloud":
        return HunyuanCloudGenerationProvider(settings=settings, storage=storage)
    if provider == "meshy-api":
        return MeshyApiGenerationProvider(settings=settings, storage=storage)
    if provider == "hunyuan-api-server":
        return HunyuanApiServerGenerationProvider(settings=settings, storage=storage)
    if provider == "hunyuan-local":
        return LocalHunyuanGenerationProvider(settings=settings, storage=storage)
    raise RuntimeError(f"Unsupported generator provider: {provider}")


def probe_runtime_providers(settings) -> list[RuntimeProviderStatus]:
    real_statuses = _probe_real_provider_statuses(settings, active_provider=None)
    active_provider = _resolve_active_provider_from_real_statuses(settings, real_statuses)
    for status in real_statuses.values():
        status.details["active"] = status.provider == active_provider
    return [
        RuntimeProviderStatus(
            provider="mock",
            configured=True,
            ready=True,
            issues=[],
            details={
                "active": active_provider == "mock",
                "mode": "local-mock",
                "hint": "Local mock mode is ready.",
            },
        ),
        real_statuses["hunyuan-cloud"],
        real_statuses["meshy-api"],
        real_statuses["hunyuan-api-server"],
        real_statuses["hunyuan-local"],
    ]


def get_runtime_provider_status(settings, provider: str | None = None) -> RuntimeProviderStatus:
    target = _normalize_provider(provider) if provider is not None else resolve_active_provider(settings)
    if target == "auto":
        target = resolve_active_provider(settings)
    for status in probe_runtime_providers(settings):
        if status.provider == target:
            return status
    raise RuntimeError(f"Unknown runtime provider: {target}")


def assert_runtime_provider_ready(settings, provider: str | None = None) -> RuntimeProviderStatus:
    status = get_runtime_provider_status(settings, provider)
    if status.ready:
        return status

    raise ProviderUnavailableError(
        provider=status.provider,
        code=f"{status.provider}_not_ready",
        issues=status.issues,
        hint=_build_provider_hint(status.provider, status.issues),
    )


def probe_hunyuan_cloud_provider(settings, active_provider: str | None = None) -> RuntimeProviderStatus:
    issues: list[str] = []
    endpoint = _normalize_tencent_cloud_endpoint(settings.hunyuan_cloud_endpoint)
    region = (settings.hunyuan_cloud_region or "").strip()
    version = (settings.hunyuan_cloud_version or "").strip()
    quality_mode = (settings.hunyuan_cloud_quality_mode or "").strip().lower()
    model = (settings.hunyuan_cloud_model or "").strip()
    has_secret_id = bool((settings.hunyuan_cloud_secret_id or "").strip())
    has_secret_key = bool((settings.hunyuan_cloud_secret_key or "").strip())
    configured = has_secret_id and has_secret_key and bool(endpoint) and bool(region) and bool(version)

    if not endpoint:
        issues.append("missing_hunyuan_cloud_endpoint")
    elif "tencentcloudapi.com" not in endpoint.lower():
        issues.append("invalid_hunyuan_cloud_endpoint")
    if not region:
        issues.append("missing_hunyuan_cloud_region")
    if not version:
        issues.append("missing_hunyuan_cloud_version")
    if not has_secret_id:
        issues.append("missing_hunyuan_cloud_secret_id")
    if not has_secret_key:
        issues.append("missing_hunyuan_cloud_secret_key")
    if quality_mode not in {"pro", "rapid"}:
        issues.append("invalid_hunyuan_cloud_quality_mode")

    return RuntimeProviderStatus(
        provider="hunyuan-cloud",
        configured=configured,
        ready=configured and not issues,
        issues=issues,
        details={
            "active": active_provider == "hunyuan-cloud",
            "endpoint": endpoint,
            "region": region or None,
            "version": version or None,
            "service": _derive_tencent_cloud_service(endpoint),
            "qualityMode": quality_mode or None,
            "model": model or None,
            "secretConfigured": has_secret_id and has_secret_key,
            "hint": _build_provider_hint("hunyuan-cloud", issues),
        },
    )


def probe_meshy_provider(settings, active_provider: str | None = None) -> RuntimeProviderStatus:
    issues: list[str] = []
    configured = bool(settings.meshy_api_key)
    if not configured:
        issues.append("missing_meshy_api_key")

    return RuntimeProviderStatus(
        provider="meshy-api",
        configured=configured,
        ready=configured,
        issues=issues,
        details={
            "active": active_provider == "meshy-api",
            "apiBaseUrl": settings.meshy_api_base_url,
            "aiModel": settings.meshy_ai_model,
            "modelType": settings.meshy_model_type,
            "hint": _build_provider_hint("meshy-api", issues),
        },
    )


def probe_hunyuan_local_provider(settings, active_provider: str | None = None) -> RuntimeProviderStatus:
    issues: list[str] = []
    repo_path = settings.hunyuan_repo_path
    repo_exists = bool(repo_path and repo_path.exists())

    if repo_path and not repo_exists:
        issues.append("hunyuan_repo_path_not_found")

    import_ok = _can_import_hunyuan_runtime(repo_path)
    if not import_ok:
        issues.append("hy3dgen_not_importable")

    configured = bool(settings.hunyuan_shape_model and settings.hunyuan_texture_model)
    if not configured:
        issues.append("missing_hunyuan_model_config")

    ready = import_ok and configured and (repo_path is None or repo_exists)

    return RuntimeProviderStatus(
        provider="hunyuan-local",
        configured=configured,
        ready=ready,
        issues=issues,
        details={
            "active": active_provider == "hunyuan-local",
            "repoPath": str(repo_path) if repo_path else None,
            "repoExists": repo_exists,
            "shapeModel": settings.hunyuan_shape_model,
            "textureModel": settings.hunyuan_texture_model,
            "device": settings.hunyuan_device,
            "hint": _build_provider_hint("hunyuan-local", issues),
        },
    )


def probe_hunyuan_api_server_provider(settings, active_provider: str | None = None) -> RuntimeProviderStatus:
    issues: list[str] = []
    base_url = settings.hunyuan_api_server_base_url.rstrip("/")
    configured = bool(base_url)
    looks_like_tencent_cloud_api = "tencentcloudapi.com" in base_url.lower()

    if not configured:
        issues.append("missing_hunyuan_api_server_base_url")
    if looks_like_tencent_cloud_api:
        issues.append("unsupported_hunyuan_cloud_endpoint")

    reachable = False
    if configured and not looks_like_tencent_cloud_api:
        probe_paths = ("/docs", "/openapi.json")
        for path in probe_paths:
            try:
                request = urllib.request.Request(f"{base_url}{path}", method="GET")
                with urllib.request.urlopen(request, timeout=5):
                    reachable = True
                    break
            except Exception:
                continue
        if not reachable:
            issues.append("hunyuan_api_server_unreachable")

    return RuntimeProviderStatus(
        provider="hunyuan-api-server",
        configured=configured,
        ready=configured and reachable,
        issues=issues,
        details={
            "active": active_provider == "hunyuan-api-server",
            "baseUrl": base_url,
            "reachable": reachable,
            "looksLikeTencentCloudApi": looks_like_tencent_cloud_api,
            "hint": _build_provider_hint("hunyuan-api-server", issues),
        },
    )


class MockGenerationProvider:
    def generate(self, context: ProviderContext, on_progress: ProgressCallback | None = None) -> ProviderResult:
        if on_progress:
            on_progress("shape_generating", 42)
            on_progress("texture_generating", 72)
            on_progress("normalizing_glb", 88)

        return ProviderResult(
            asset_name=build_asset_name(context.job.source_image_key),
            generator="mock-hunyuan-ui",
            texture_model="mock-hunyuan-paint-ui",
            model_glb_key=None,
        )


class LocalHunyuanGenerationProvider:
    def __init__(self, settings, storage: LocalStorage) -> None:
        self.settings = settings
        self.storage = storage
        self._shape_pipeline = None
        self._texture_pipeline = None

    def generate(self, context: ProviderContext, on_progress: ProgressCallback | None = None) -> ProviderResult:
        if on_progress:
            on_progress("shape_generating", 42)

        mesh = self._generate_shape_mesh(context.subject_path)

        if context.job.texture_enabled:
            if on_progress:
                on_progress("texture_generating", 72)
            mesh = self._paint_mesh(mesh, context.subject_path)

        if on_progress:
            on_progress("normalizing_glb", 88)

        model_glb_key = build_storage_key(context.asset_prefix, "model.glb")
        model_glb_path = self.storage.absolute_path(model_glb_key)
        model_glb_path.parent.mkdir(parents=True, exist_ok=True)
        self._export_mesh(mesh, model_glb_path)

        return ProviderResult(
            asset_name=build_asset_name(context.job.source_image_key),
            generator="hunyuan3d-2.1",
            texture_model="hunyuan3d-paint-v2.1",
            model_glb_key=model_glb_key,
        )

    def _generate_shape_mesh(self, subject_path: Path):
        shape_pipeline = self._get_shape_pipeline()
        with Image.open(subject_path) as image:
            result = shape_pipeline(image=image)
        if isinstance(result, (list, tuple)):
            return result[0]
        return result

    def _paint_mesh(self, mesh, subject_path: Path):
        texture_pipeline = self._get_texture_pipeline()
        with Image.open(subject_path) as image:
            return texture_pipeline(mesh, image=image)

    def _prepare_hunyuan_runtime(self) -> None:
        repo_path = self.settings.hunyuan_repo_path
        if repo_path is None:
            return
        repo_str = str(repo_path)
        if repo_str not in sys.path:
            sys.path.insert(0, repo_str)

    def _get_shape_pipeline(self):
        if self._shape_pipeline is not None:
            return self._shape_pipeline

        self._prepare_hunyuan_runtime()

        try:
            from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline  # type: ignore
        except ImportError as exc:  # pragma: no cover - env dependent
            raise ProviderUnavailableError(
                provider="hunyuan-local",
                code="hunyuan_local_shape_runtime_missing",
                issues=["hy3dgen_not_importable"],
                hint=_build_provider_hint("hunyuan-local", ["hy3dgen_not_importable"]),
            ) from exc

        pipeline = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained(self.settings.hunyuan_shape_model)
        if hasattr(pipeline, "to"):
            pipeline = pipeline.to(self.settings.hunyuan_device)
        self._shape_pipeline = pipeline
        return self._shape_pipeline

    def _get_texture_pipeline(self):
        if self._texture_pipeline is not None:
            return self._texture_pipeline

        self._prepare_hunyuan_runtime()

        try:
            from hy3dgen.texgen import Hunyuan3DPaintPipeline  # type: ignore
        except ImportError as exc:  # pragma: no cover - env dependent
            raise ProviderUnavailableError(
                provider="hunyuan-local",
                code="hunyuan_local_texture_runtime_missing",
                issues=["hy3dgen_not_importable"],
                hint=_build_provider_hint("hunyuan-local", ["hy3dgen_not_importable"]),
            ) from exc

        pipeline = Hunyuan3DPaintPipeline.from_pretrained(self.settings.hunyuan_texture_model)
        if hasattr(pipeline, "to"):
            pipeline = pipeline.to(self.settings.hunyuan_device)
        self._texture_pipeline = pipeline
        return self._texture_pipeline

    @staticmethod
    def _export_mesh(mesh, destination: Path) -> None:
        if hasattr(mesh, "export"):
            mesh.export(str(destination))
            return
        raise RuntimeError("Generated mesh object does not support export().")


class MeshyApiGenerationProvider:
    def __init__(self, settings, storage: LocalStorage) -> None:
        self.settings = settings
        self.storage = storage

    def generate(self, context: ProviderContext, on_progress: ProgressCallback | None = None) -> ProviderResult:
        if not self.settings.meshy_api_key:
            raise ProviderUnavailableError(
                provider="meshy-api",
                code="meshy_api_key_missing",
                issues=["missing_meshy_api_key"],
                hint=_build_provider_hint("meshy-api", ["missing_meshy_api_key"]),
            )

        task = self._create_task(context)
        task_id = task.get("id")
        if not task_id:
            raise RuntimeError("Meshy API did not return a task id.")

        task = self._poll_task(str(task_id), on_progress)
        model_urls = task.get("model_urls") or {}
        glb_url = model_urls.get("glb")
        if not glb_url:
            raise RuntimeError("Meshy task completed without model_urls.glb.")

        if on_progress:
            on_progress("normalizing_glb", 88)

        model_glb_key = build_storage_key(context.asset_prefix, "model.glb")
        self.storage.save_bytes(model_glb_key, self._request_bytes(str(glb_url)))

        thumbnail_url = task.get("thumbnail_url")
        preview_bytes = self._request_bytes(str(thumbnail_url)) if thumbnail_url else None

        return ProviderResult(
            asset_name=build_asset_name(context.job.source_image_key),
            generator=f"meshy-api:{self.settings.meshy_ai_model}",
            texture_model="meshy-api-texture" if context.job.texture_enabled else "mesh-only",
            model_glb_key=model_glb_key,
            preview_bytes=preview_bytes,
        )

    def _create_task(self, context: ProviderContext) -> dict:
        payload = {
            "image_url": build_data_uri(context.subject_path),
            "ai_model": self.settings.meshy_ai_model,
            "model_type": self.settings.meshy_model_type,
            "should_texture": bool(context.job.texture_enabled),
            "enable_pbr": bool(context.job.texture_enabled and self.settings.meshy_enable_pbr),
        }
        return self._request_json(
            "POST",
            f"{self.settings.meshy_api_base_url.rstrip('/')}/image-to-3d",
            payload=payload,
        )

    def _poll_task(self, task_id: str, on_progress: ProgressCallback | None) -> dict:
        deadline = time.monotonic() + self.settings.meshy_timeout_seconds
        task_url = f"{self.settings.meshy_api_base_url.rstrip('/')}/image-to-3d/{task_id}"

        while time.monotonic() < deadline:
            task = self._request_json("GET", task_url)
            status = str(task.get("status") or "").upper()
            progress = int(task.get("progress") or 0)

            if status == "SUCCEEDED":
                return task

            if status in {"FAILED", "CANCELLED", "EXPIRED"}:
                raise RuntimeError(self._extract_task_error(task))

            if on_progress:
                if progress < 70:
                    on_progress("shape_generating", max(progress, 20))
                else:
                    on_progress("texture_generating", max(progress, 72))

            time.sleep(self.settings.meshy_poll_interval_seconds)

        raise TimeoutError("Meshy task polling timed out.")

    def _request_json(self, method: str, url: str, payload: dict | None = None) -> dict:
        body = None
        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {self.settings.meshy_api_key}",
        }
        if payload is not None:
            body = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

        request = urllib.request.Request(url, data=body, method=method, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:  # pragma: no cover - network dependent
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Meshy API request failed ({exc.code}): {detail}") from exc
        except urllib.error.URLError as exc:  # pragma: no cover - network dependent
            raise ProviderUnavailableError(
                provider="meshy-api",
                code="meshy_api_unreachable",
                issues=["meshy_api_unreachable"],
                hint="Check MESHY_API_BASE_URL, outbound network access, and whether the API endpoint is reachable.",
            ) from exc

    @staticmethod
    def _request_bytes(url: str) -> bytes:
        with urllib.request.urlopen(url, timeout=180) as response:
            return response.read()

    @staticmethod
    def _extract_task_error(task: dict) -> str:
        task_error = task.get("task_error")
        if isinstance(task_error, dict):
            message = task_error.get("message")
            if isinstance(message, str) and message.strip():
                return message
        if isinstance(task_error, str) and task_error.strip():
            return task_error
        return f"Meshy task failed with status {task.get('status')}"


class HunyuanCloudGenerationProvider:
    def __init__(self, settings, storage: LocalStorage) -> None:
        self.settings = settings
        self.storage = storage

    def generate(self, context: ProviderContext, on_progress: ProgressCallback | None = None) -> ProviderResult:
        secret_id = (self.settings.hunyuan_cloud_secret_id or "").strip()
        secret_key = (self.settings.hunyuan_cloud_secret_key or "").strip()
        if not secret_id or not secret_key:
            raise ProviderUnavailableError(
                provider="hunyuan-cloud",
                code="hunyuan_cloud_credentials_missing",
                issues=["missing_hunyuan_cloud_secret_id", "missing_hunyuan_cloud_secret_key"],
                hint=_build_provider_hint(
                    "hunyuan-cloud",
                    ["missing_hunyuan_cloud_secret_id", "missing_hunyuan_cloud_secret_key"],
                ),
            )

        submit_action, query_action = self._resolve_actions()
        if on_progress:
            on_progress("shape_generating", 28)

        submit_response = self._request_json(submit_action, self._build_submit_payload(context))
        job_id = str(submit_response.get("JobId") or "").strip()
        if not job_id:
            raise RuntimeError("Tencent Cloud Hunyuan submit API did not return JobId.")

        query_response = self._poll_job(job_id, query_action, context.job.texture_enabled, on_progress)
        result_file_3ds = query_response.get("ResultFile3Ds")
        model_url, preview_url = self._pick_result_urls(result_file_3ds if isinstance(result_file_3ds, list) else [])
        if not model_url:
            raise RuntimeError("Tencent Cloud Hunyuan result has no GLB output URL.")

        if on_progress:
            on_progress("normalizing_glb", 88)

        model_glb_key = build_storage_key(context.asset_prefix, "model.glb")
        self.storage.save_bytes(model_glb_key, self._request_bytes(model_url))

        preview_bytes = self._request_bytes(preview_url) if preview_url else None

        texture_model = (
            f"hunyuan-cloud:{(self.settings.hunyuan_cloud_model or '3.0').strip()}"
            if context.job.texture_enabled
            else "mesh-only"
        )

        return ProviderResult(
            asset_name=build_asset_name(context.job.source_image_key),
            generator=f"hunyuan-cloud:{(self.settings.hunyuan_cloud_quality_mode or 'pro').strip().lower()}",
            texture_model=texture_model,
            model_glb_key=model_glb_key,
            preview_bytes=preview_bytes,
        )

    def _build_submit_payload(self, context: ProviderContext) -> dict[str, str | bool]:
        payload: dict[str, str | bool] = {
            "ImageBase64": encode_image_base64(context.subject_path),
            "Model": (self.settings.hunyuan_cloud_model or "3.0").strip() or "3.0",
            "GenerateType": "Normal" if context.job.texture_enabled else "Geometry",
        }
        return payload

    def _resolve_actions(self) -> tuple[str, str]:
        quality_mode = (self.settings.hunyuan_cloud_quality_mode or "pro").strip().lower()
        if quality_mode == "rapid":
            return ("SubmitHunyuanTo3DRapidJob", "QueryHunyuanTo3DRapidJob")
        return ("SubmitHunyuanTo3DProJob", "QueryHunyuanTo3DProJob")

    def _poll_job(
        self,
        job_id: str,
        query_action: str,
        texture_enabled: bool,
        on_progress: ProgressCallback | None,
    ) -> dict:
        timeout_seconds = max(int(self.settings.hunyuan_cloud_timeout_seconds), 30)
        poll_interval_seconds = max(float(self.settings.hunyuan_cloud_poll_interval_seconds), 0.8)
        deadline = time.monotonic() + timeout_seconds

        while time.monotonic() < deadline:
            response = self._request_json(query_action, {"JobId": job_id})
            status = str(response.get("Status") or "").strip().upper()

            if status == "DONE":
                return response
            if status == "FAIL":
                raise RuntimeError(self._extract_job_error(response))

            if on_progress:
                if status == "WAIT":
                    on_progress("shape_generating", 45)
                elif status == "RUN":
                    if texture_enabled:
                        on_progress("texture_generating", 76)
                    else:
                        on_progress("shape_generating", 82)

            time.sleep(poll_interval_seconds)

        raise TimeoutError("Tencent Cloud Hunyuan job polling timed out.")

    def _request_json(self, action: str, payload: dict) -> dict:
        endpoint = _normalize_tencent_cloud_endpoint(self.settings.hunyuan_cloud_endpoint)
        region = (self.settings.hunyuan_cloud_region or "").strip()
        version = (self.settings.hunyuan_cloud_version or "").strip()
        secret_id = (self.settings.hunyuan_cloud_secret_id or "").strip()
        secret_key = (self.settings.hunyuan_cloud_secret_key or "").strip()
        token = (self.settings.hunyuan_cloud_token or "").strip()
        if not endpoint or not region or not version or not secret_id or not secret_key:
            raise ProviderUnavailableError(
                provider="hunyuan-cloud",
                code="hunyuan_cloud_config_incomplete",
                issues=["hunyuan_cloud_config_incomplete"],
                hint=_build_provider_hint("hunyuan-cloud", ["hunyuan_cloud_config_incomplete"]),
            )

        service = _derive_tencent_cloud_service(endpoint)
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        content_type = "application/json; charset=utf-8"
        timestamp = int(time.time())
        date = time.strftime("%Y-%m-%d", time.gmtime(timestamp))
        hashed_body = hashlib.sha256(body).hexdigest()
        canonical_headers = f"content-type:{content_type}\nhost:{endpoint}\nx-tc-action:{action.lower()}\n"
        signed_headers = "content-type;host;x-tc-action"
        canonical_request = f"POST\n/\n\n{canonical_headers}\n{signed_headers}\n{hashed_body}"
        credential_scope = f"{date}/{service}/tc3_request"
        string_to_sign = (
            "TC3-HMAC-SHA256\n"
            f"{timestamp}\n"
            f"{credential_scope}\n"
            f"{hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()}"
        )

        secret_date = hmac.new(f"TC3{secret_key}".encode("utf-8"), date.encode("utf-8"), hashlib.sha256).digest()
        secret_service = hmac.new(secret_date, service.encode("utf-8"), hashlib.sha256).digest()
        secret_signing = hmac.new(secret_service, b"tc3_request", hashlib.sha256).digest()
        signature = hmac.new(secret_signing, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()
        authorization = (
            "TC3-HMAC-SHA256 "
            f"Credential={secret_id}/{credential_scope}, "
            f"SignedHeaders={signed_headers}, "
            f"Signature={signature}"
        )

        headers = {
            "Accept": "application/json",
            "Authorization": authorization,
            "Content-Type": content_type,
            "Host": endpoint,
            "X-TC-Action": action,
            "X-TC-Region": region,
            "X-TC-Timestamp": str(timestamp),
            "X-TC-Version": version,
        }
        if token:
            headers["X-TC-Token"] = token

        request = urllib.request.Request(
            f"https://{endpoint}/",
            data=body,
            method="POST",
            headers=headers,
        )
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                payload_json = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:  # pragma: no cover - network dependent
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Tencent Cloud request failed ({exc.code}): {detail}") from exc
        except urllib.error.URLError as exc:  # pragma: no cover - network dependent
            raise ProviderUnavailableError(
                provider="hunyuan-cloud",
                code="hunyuan_cloud_api_unreachable",
                issues=["hunyuan_cloud_api_unreachable"],
                hint=_build_provider_hint("hunyuan-cloud", ["hunyuan_cloud_api_unreachable"]),
            ) from exc

        response_payload = payload_json.get("Response")
        if not isinstance(response_payload, dict):
            raise RuntimeError("Tencent Cloud response format is invalid: missing Response object.")

        error_payload = response_payload.get("Error")
        if isinstance(error_payload, dict):
            error_code = str(error_payload.get("Code") or "unknown_error")
            error_message = str(error_payload.get("Message") or "unknown_error")
            raise RuntimeError(f"Tencent Cloud API {action} failed ({error_code}): {error_message}")

        return response_payload

    @staticmethod
    def _pick_result_urls(result_file_3ds: list[dict]) -> tuple[str | None, str | None]:
        model_url: str | None = None
        preview_url: str | None = None

        for item in result_file_3ds:
            if not isinstance(item, dict):
                continue
            url = str(item.get("Url") or "").strip()
            file_type = str(item.get("Type") or "").strip().upper()
            preview_candidate = str(item.get("PreviewImageUrl") or "").strip()

            if preview_candidate and not preview_url:
                preview_url = preview_candidate

            if not url:
                continue

            url_without_query = url.split("?", 1)[0].lower()
            if file_type == "GLB" or url_without_query.endswith(".glb"):
                model_url = url
                break

        return model_url, preview_url

    @staticmethod
    def _request_bytes(url: str) -> bytes:
        with urllib.request.urlopen(url, timeout=180) as response:
            return response.read()

    @staticmethod
    def _extract_job_error(response: dict) -> str:
        error_code = str(response.get("ErrorCode") or "").strip()
        error_message = str(response.get("ErrorMessage") or "").strip()
        if error_code or error_message:
            code_part = error_code or "unknown_error"
            message_part = error_message or "unknown_message"
            return f"Tencent Cloud Hunyuan job failed ({code_part}): {message_part}"
        return "Tencent Cloud Hunyuan job failed with unknown reason."


class HunyuanApiServerGenerationProvider:
    def __init__(self, settings, storage: LocalStorage) -> None:
        self.settings = settings
        self.storage = storage

    def generate(self, context: ProviderContext, on_progress: ProgressCallback | None = None) -> ProviderResult:
        if on_progress:
            on_progress("shape_generating", 42)

        payload = {
            "image": encode_image_base64(context.subject_path),
            "texture": bool(context.job.texture_enabled),
            "type": "glb",
        }

        response_bytes = self._request_generate(payload)

        if on_progress:
            on_progress("texture_generating", 72 if context.job.texture_enabled else 88)
            on_progress("normalizing_glb", 88)

        model_glb_key = build_storage_key(context.asset_prefix, "model.glb")
        self.storage.save_bytes(model_glb_key, response_bytes)

        return ProviderResult(
            asset_name=build_asset_name(context.job.source_image_key),
            generator="hunyuan-api-server",
            texture_model="hunyuan-api-server-texture" if context.job.texture_enabled else "mesh-only",
            model_glb_key=model_glb_key,
        )

    def _request_generate(self, payload: dict) -> bytes:
        base_url = self.settings.hunyuan_api_server_base_url.rstrip("/")
        request = urllib.request.Request(
            f"{base_url}/generate",
            data=json.dumps(payload).encode("utf-8"),
            method="POST",
            headers={
                "Accept": "*/*",
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=self.settings.hunyuan_api_server_timeout_seconds) as response:
                return response.read()
        except urllib.error.HTTPError as exc:  # pragma: no cover - network dependent
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Hunyuan API server request failed ({exc.code}): {detail}") from exc
        except urllib.error.URLError as exc:  # pragma: no cover - network dependent
            raise ProviderUnavailableError(
                provider="hunyuan-api-server",
                code="hunyuan_api_server_unreachable",
                issues=["hunyuan_api_server_unreachable"],
                hint=_build_provider_hint("hunyuan-api-server", ["hunyuan_api_server_unreachable"]),
            ) from exc


def _normalize_tencent_cloud_endpoint(raw_value: str | None) -> str:
    value = (raw_value or "").strip()
    if not value:
        return ""
    if "://" not in value:
        return value.rstrip("/").split("/", 1)[0].strip().lower()
    parsed = urllib.parse.urlparse(value)
    return parsed.netloc.strip().lower()


def _derive_tencent_cloud_service(endpoint: str) -> str:
    normalized = _normalize_tencent_cloud_endpoint(endpoint)
    if not normalized:
        return "ai3d"
    return normalized.split(".", 1)[0].strip().lower() or "ai3d"


def build_asset_name(source_image_key: str) -> str:
    stem = Path(source_image_key).stem.strip()
    return stem or "Imported Figure"


def build_data_uri(image_path: Path) -> str:
    mime_type = mimetypes.guess_type(image_path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(image_path.read_bytes()).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"


def encode_image_base64(image_path: Path) -> str:
    return base64.b64encode(image_path.read_bytes()).decode("ascii")


def _build_provider_hint(provider: str, issues: list[str]) -> str | None:
    issue_set = set(issues)
    if provider == "hunyuan-cloud":
        if {"missing_hunyuan_cloud_secret_id", "missing_hunyuan_cloud_secret_key"} & issue_set:
            return "Set HUNYUAN_CLOUD_SECRET_ID and HUNYUAN_CLOUD_SECRET_KEY before creating import jobs."
        if "missing_hunyuan_cloud_endpoint" in issue_set:
            return "Set HUNYUAN_CLOUD_ENDPOINT to ai3d.tencentcloudapi.com (or your Tencent Cloud API domain)."
        if "invalid_hunyuan_cloud_endpoint" in issue_set:
            return "Use a valid Tencent Cloud API domain such as ai3d.tencentcloudapi.com."
        if "missing_hunyuan_cloud_region" in issue_set:
            return "Set HUNYUAN_CLOUD_REGION, for example ap-guangzhou."
        if "missing_hunyuan_cloud_version" in issue_set:
            return "Set HUNYUAN_CLOUD_VERSION, for example 2025-05-13."
        if "invalid_hunyuan_cloud_quality_mode" in issue_set:
            return "Set HUNYUAN_CLOUD_QUALITY_MODE to pro or rapid."
        if "hunyuan_cloud_api_unreachable" in issue_set:
            return "Check outbound network access and whether HUNYUAN_CLOUD_ENDPOINT is reachable."
        if "hunyuan_cloud_config_incomplete" in issue_set:
            return "Tencent Cloud Hunyuan config is incomplete. Save endpoint, region, version, and credentials first."
    if provider == "meshy-api":
        if "missing_meshy_api_key" in issue_set:
            return "Set MESHY_API_KEY before creating import jobs."
        if "meshy_api_unreachable" in issue_set:
            return "Check MESHY_API_BASE_URL, outbound network access, and whether the Meshy API is reachable."
    if provider == "hunyuan-api-server":
        if "missing_hunyuan_api_server_base_url" in issue_set:
            return "Set HUNYUAN_API_SERVER_BASE_URL to the official Tencent api_server.py endpoint."
        if "unsupported_hunyuan_cloud_endpoint" in issue_set:
            return (
                "This provider expects the open-source Hunyuan3D api_server.py endpoint (for example "
                "http://127.0.0.1:8080/generate), not the Tencent Cloud hunyuan.tencentcloudapi.com SDK endpoint."
            )
        if "hunyuan_api_server_unreachable" in issue_set:
            return "Start api_server.py or point HUNYUAN_API_SERVER_BASE_URL at a reachable Hunyuan API server."
    if provider == "hunyuan-local":
        if "hunyuan_repo_path_not_found" in issue_set:
            return "Set HUNYUAN_REPO_PATH to a valid local checkout of the official Hunyuan3D repository."
        if "hy3dgen_not_importable" in issue_set:
            return "Install the official Hunyuan3D runtime, or set HUNYUAN_REPO_PATH so the backend can import hy3dgen."
        if "missing_hunyuan_model_config" in issue_set:
            return "Set HUNYUAN_SHAPE_MODEL and HUNYUAN_TEXTURE_MODEL before using GENERATOR_PROVIDER=hunyuan-local."
    return None


def _can_import_hunyuan_runtime(repo_path: Path | None) -> bool:
    inserted = False
    repo_str = str(repo_path) if repo_path else None
    if repo_str and repo_str not in sys.path:
        sys.path.insert(0, repo_str)
        inserted = True

    try:
        from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline  # type: ignore # noqa: F401
        from hy3dgen.texgen import Hunyuan3DPaintPipeline  # type: ignore # noqa: F401
        return True
    except Exception:
        return False
    finally:
        if inserted and repo_str in sys.path:
            sys.path.remove(repo_str)

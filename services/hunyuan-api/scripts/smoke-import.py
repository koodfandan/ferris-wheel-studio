from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
import uuid
import zlib


def build_png(width: int = 512, height: int = 512) -> bytes:
    row = b"\x00" + (b"\xff\xc9\xd9\xff" * width)
    raw = row * height

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            len(data).to_bytes(4, "big")
            + tag
            + data
            + zlib.crc32(tag + data).to_bytes(4, "big")
        )

    header = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", width.to_bytes(4, "big") + height.to_bytes(4, "big") + b"\x08\x06\x00\x00\x00")
    idat = chunk(b"IDAT", zlib.compress(raw, level=9))
    iend = chunk(b"IEND", b"")
    return header + ihdr + idat + iend


def http_json(method: str, url: str, payload: dict | None = None, headers: dict[str, str] | None = None) -> dict:
    body = None
    request_headers = {"Accept": "application/json"}
    if headers:
        request_headers.update(headers)

    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        request_headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url, data=body, method=method, headers=request_headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def http_bytes(url: str) -> bytes:
    with urllib.request.urlopen(url, timeout=30) as response:
        return response.read()


def upload_image(url: str, filename: str, payload: bytes) -> dict:
    return upload_multipart(url, filename, payload, "image/png")


def upload_multipart(url: str, filename: str, payload: bytes, content_type: str) -> dict:
    boundary = f"codex-{uuid.uuid4().hex}"
    disposition = f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
    body = (
        f"--{boundary}\r\n".encode("utf-8")
        + disposition.encode("utf-8")
        + f"Content-Type: {content_type}\r\n\r\n".encode("utf-8")
        + payload
        + f"\r\n--{boundary}--\r\n".encode("utf-8")
    )
    request = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Accept": "application/json",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def wait_for_job(job_url: str, timeout_seconds: int) -> dict:
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        payload = http_json("GET", job_url)
        status = payload.get("status")
        if status == "ready":
            return payload
        if status == "failed":
            raise RuntimeError(f"import job failed: {payload.get('error')}")
        time.sleep(0.8)
    raise TimeoutError("import job polling timed out")


def assert_http_error(url: str, filename: str, payload: bytes, content_type: str, expected_status: int) -> None:
    try:
        upload_multipart(url, filename, payload, content_type)
    except urllib.error.HTTPError as exc:
        if exc.code != expected_status:
            raise RuntimeError(f"expected_http_{expected_status}_got_{exc.code}") from exc
        return

    raise RuntimeError("expected_http_error_but_request_succeeded")


def run_failure_cases(api_url: str, timeout_seconds: int) -> dict:
    invalid_upload_url = f"{api_url}/uploads/image"
    invalid_file_checked = False
    too_small_checked = False

    assert_http_error(
        invalid_upload_url,
        "not-image.txt",
        b"plain-text-input",
        "text/plain",
        400,
    )
    invalid_file_checked = True

    tiny_upload = upload_image(invalid_upload_url, "tiny.png", build_png(256, 256))
    tiny_job = http_json(
        "POST",
        f"{api_url}/import-jobs",
        {
            "fileKey": tiny_upload["fileKey"],
            "mode": "single-image",
            "texture": True,
            "style": "toy",
        },
    )

    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        payload = http_json("GET", f"{api_url}/import-jobs/{tiny_job['jobId']}")
        if payload.get("status") == "failed":
            if payload.get("error") != "subject_not_clear":
                raise RuntimeError(f"unexpected_small_image_error:{payload.get('error')}")
            too_small_checked = True
            break
        time.sleep(0.5)

    if not too_small_checked:
        raise TimeoutError("tiny image job did not fail in time")

    return {
        "invalidFileRejected": invalid_file_checked,
        "tinyImageRejected": too_small_checked,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Smoke-test the Hunyuan import API.")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000")
    parser.add_argument("--api-prefix", default="/api")
    parser.add_argument("--timeout", type=int, default=30)
    parser.add_argument("--include-failure-cases", action="store_true")
    args = parser.parse_args()

    base_url = args.base_url.rstrip("/")
    api_prefix = args.api_prefix if args.api_prefix.startswith("/") else f"/{args.api_prefix}"
    api_url = f"{base_url}{api_prefix}"

    try:
        health = http_json("GET", f"{base_url}/health")
        upload = upload_image(f"{api_url}/uploads/image", "smoke-input.png", build_png())
        job = http_json(
            "POST",
            f"{api_url}/import-jobs",
            {
                "fileKey": upload["fileKey"],
                "mode": "single-image",
                "texture": True,
                "style": "toy",
            },
        )
        job_result = wait_for_job(f"{api_url}/import-jobs/{job['jobId']}", args.timeout)
        asset = http_json("GET", f"{api_url}/assets/{job_result['assetId']}")
        preview_size = len(http_bytes(asset["previewImageUrl"]))
        manifest = json.loads(http_bytes(asset["manifestUrl"]).decode("utf-8"))

        summary = {
            "health": health,
            "upload": upload,
            "job": job_result,
            "asset": {
                "assetId": asset["assetId"],
                "generator": asset["generator"],
                "textureModel": asset["textureModel"],
                "previewBytes": preview_size,
                "manifestAssetCount": len(manifest.get("assets", [])),
                "hasModelGlbUrl": bool(asset.get("modelGlbUrl")),
            },
        }
        if args.include_failure_cases:
            summary["negativeCases"] = run_failure_cases(api_url, args.timeout)
        print(json.dumps(summary, ensure_ascii=False, indent=2))
        return 0
    except urllib.error.HTTPError as exc:
        print(f"http-error:{exc.code}:{exc.reason}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"smoke-failed:{exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

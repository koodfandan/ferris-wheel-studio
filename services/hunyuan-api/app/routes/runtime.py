from fastapi import APIRouter, Depends

from ..config import Settings, get_settings
from ..schemas import RuntimeConfigSnapshot, RuntimeConfigUpdateRequest, RuntimeProvidersResponse
from ..workers.generation_providers import probe_runtime_providers, resolve_active_provider


router = APIRouter(tags=["runtime"])


@router.get("/runtime/providers", response_model=RuntimeProvidersResponse)
def get_runtime_providers(settings: Settings = Depends(get_settings)) -> RuntimeProvidersResponse:
    return RuntimeProvidersResponse(
        activeProvider=resolve_active_provider(settings),
        providers=probe_runtime_providers(settings),
        config=RuntimeConfigSnapshot(
            generatorProvider=settings.generator_provider,
            enableMockPipeline=settings.enable_mock_pipeline,
            hunyuanApiServerBaseUrl=settings.hunyuan_api_server_base_url,
            meshyApiKeyConfigured=bool(settings.meshy_api_key),
            hunyuanCloudEndpoint=settings.hunyuan_cloud_endpoint,
            hunyuanCloudRegion=settings.hunyuan_cloud_region,
            hunyuanCloudVersion=settings.hunyuan_cloud_version,
            hunyuanCloudQualityMode=settings.hunyuan_cloud_quality_mode,
            hunyuanCloudModel=settings.hunyuan_cloud_model,
            hunyuanCloudSecretConfigured=bool(settings.hunyuan_cloud_secret_id and settings.hunyuan_cloud_secret_key),
        ),
    )


@router.post("/runtime/config", response_model=RuntimeProvidersResponse)
def update_runtime_config(
    payload: RuntimeConfigUpdateRequest,
    settings: Settings = Depends(get_settings),
) -> RuntimeProvidersResponse:
    if payload.generatorProvider is not None:
        settings.generator_provider = payload.generatorProvider
    if payload.enableMockPipeline is not None:
        settings.enable_mock_pipeline = payload.enableMockPipeline
    if payload.meshyApiBaseUrl is not None:
        settings.meshy_api_base_url = payload.meshyApiBaseUrl.strip().rstrip("/")
    if payload.meshyApiKey is not None:
        settings.meshy_api_key = payload.meshyApiKey.strip()
    if payload.hunyuanApiServerBaseUrl is not None:
        settings.hunyuan_api_server_base_url = payload.hunyuanApiServerBaseUrl.strip().rstrip("/")
    if payload.hunyuanCloudEndpoint is not None:
        settings.hunyuan_cloud_endpoint = payload.hunyuanCloudEndpoint.strip().rstrip("/")
    if payload.hunyuanCloudRegion is not None:
        settings.hunyuan_cloud_region = payload.hunyuanCloudRegion.strip()
    if payload.hunyuanCloudVersion is not None:
        settings.hunyuan_cloud_version = payload.hunyuanCloudVersion.strip()
    if payload.hunyuanCloudSecretId is not None:
        settings.hunyuan_cloud_secret_id = payload.hunyuanCloudSecretId.strip()
    if payload.hunyuanCloudSecretKey is not None:
        settings.hunyuan_cloud_secret_key = payload.hunyuanCloudSecretKey.strip()
    if payload.hunyuanCloudToken is not None:
        settings.hunyuan_cloud_token = payload.hunyuanCloudToken.strip()
    if payload.hunyuanCloudQualityMode is not None:
        settings.hunyuan_cloud_quality_mode = payload.hunyuanCloudQualityMode
    if payload.hunyuanCloudModel is not None:
        settings.hunyuan_cloud_model = payload.hunyuanCloudModel.strip()

    return RuntimeProvidersResponse(
        activeProvider=resolve_active_provider(settings),
        providers=probe_runtime_providers(settings),
        config=RuntimeConfigSnapshot(
            generatorProvider=settings.generator_provider,
            enableMockPipeline=settings.enable_mock_pipeline,
            hunyuanApiServerBaseUrl=settings.hunyuan_api_server_base_url,
            meshyApiKeyConfigured=bool(settings.meshy_api_key),
            hunyuanCloudEndpoint=settings.hunyuan_cloud_endpoint,
            hunyuanCloudRegion=settings.hunyuan_cloud_region,
            hunyuanCloudVersion=settings.hunyuan_cloud_version,
            hunyuanCloudQualityMode=settings.hunyuan_cloud_quality_mode,
            hunyuanCloudModel=settings.hunyuan_cloud_model,
            hunyuanCloudSecretConfigured=bool(settings.hunyuan_cloud_secret_id and settings.hunyuan_cloud_secret_key),
        ),
    )

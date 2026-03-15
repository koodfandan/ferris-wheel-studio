from datetime import datetime
from typing import Any
from typing import Literal

from pydantic import BaseModel, ConfigDict


ImportJobStatus = Literal[
    "queued",
    "preprocessing",
    "shape_generating",
    "texture_generating",
    "normalizing_glb",
    "rendering_preview",
    "ready",
    "failed",
]


class HealthResponse(BaseModel):
    ok: bool
    env: str


class RuntimeProviderStatus(BaseModel):
    provider: str
    configured: bool
    ready: bool
    issues: list[str]
    details: dict[str, str | bool | None]


class RuntimeConfigSnapshot(BaseModel):
    generatorProvider: str
    enableMockPipeline: bool
    hunyuanApiServerBaseUrl: str
    meshyApiKeyConfigured: bool
    hunyuanCloudEndpoint: str
    hunyuanCloudRegion: str
    hunyuanCloudVersion: str
    hunyuanCloudQualityMode: str
    hunyuanCloudModel: str
    hunyuanCloudSecretConfigured: bool


class RuntimeProvidersResponse(BaseModel):
    activeProvider: str
    providers: list[RuntimeProviderStatus]
    config: RuntimeConfigSnapshot


RuntimeGeneratorProvider = Literal["auto", "mock", "meshy-api", "hunyuan-cloud", "hunyuan-api-server", "hunyuan-local"]
RuntimeHunyuanCloudQualityMode = Literal["pro", "rapid"]


class RuntimeConfigUpdateRequest(BaseModel):
    generatorProvider: RuntimeGeneratorProvider | None = None
    enableMockPipeline: bool | None = None
    meshyApiBaseUrl: str | None = None
    meshyApiKey: str | None = None
    hunyuanApiServerBaseUrl: str | None = None
    hunyuanCloudEndpoint: str | None = None
    hunyuanCloudRegion: str | None = None
    hunyuanCloudVersion: str | None = None
    hunyuanCloudSecretId: str | None = None
    hunyuanCloudSecretKey: str | None = None
    hunyuanCloudToken: str | None = None
    hunyuanCloudQualityMode: RuntimeHunyuanCloudQualityMode | None = None
    hunyuanCloudModel: str | None = None


class UploadImageResponse(BaseModel):
    fileKey: str
    url: str
    width: int
    height: int


class CreateImportJobRequest(BaseModel):
    fileKey: str
    mode: Literal["single-image"] = "single-image"
    texture: bool = True
    style: Literal["toy"] = "toy"


class CreateImportJobResponse(BaseModel):
    jobId: str
    status: ImportJobStatus


class ImportJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    jobId: str
    status: ImportJobStatus
    progress: int
    assetId: str | None
    error: str | None


class AssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    assetId: str
    name: str
    modelGlbUrl: str | None
    previewImageUrl: str
    sourceImageUrl: str
    manifestUrl: str
    manifest: dict[str, Any]
    generator: str
    textureModel: str
    createdAt: datetime

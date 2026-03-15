from functools import lru_cache
from pathlib import Path

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

SERVICE_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_PATH = (SERVICE_ROOT / "data" / "hunyuan.db").resolve()
DEFAULT_STORAGE_ROOT = (SERVICE_ROOT / "data" / "storage").resolve()


def _sqlite_url(path: Path) -> str:
    return f"sqlite:///{path.as_posix()}"


def _resolve_local_path(path_value: Path, base: Path) -> Path:
    return path_value if path_value.is_absolute() else (base / path_value).resolve()


def _resolve_database_url(database_url: str, base: Path) -> str:
    sqlite_prefix = "sqlite:///"
    if not database_url.startswith(sqlite_prefix):
        return database_url

    raw_path = database_url[len(sqlite_prefix) :]
    if raw_path == ":memory:":
        return database_url

    candidate = Path(raw_path)
    if candidate.is_absolute():
        return _sqlite_url(candidate)

    return _sqlite_url((base / candidate).resolve())


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=SERVICE_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    api_prefix: str = "/api"
    public_base_url: str = "http://127.0.0.1:8000"

    database_url: str = _sqlite_url(DEFAULT_DATABASE_PATH)
    redis_url: str = "redis://127.0.0.1:6379/0"

    storage_mode: str = "local"
    local_storage_root: Path = Field(default=DEFAULT_STORAGE_ROOT)

    enable_mock_pipeline: bool = True
    enable_inline_worker: bool = True
    generator_provider: str = "auto"

    hunyuan_device: str = "cuda"
    hunyuan_shape_model: str = "tencent/Hunyuan3D-2"
    hunyuan_texture_model: str = "tencent/Hunyuan3D-2"
    hunyuan_use_lite_shape: bool = False
    hunyuan_use_lite_texture: bool = False
    hunyuan_repo_path: Path | None = None

    meshy_api_base_url: str = "https://api.meshy.ai/openapi/v1"
    meshy_api_key: str = ""
    meshy_ai_model: str = "latest"
    meshy_model_type: str = "standard"
    meshy_enable_pbr: bool = False
    meshy_poll_interval_seconds: float = 5.0
    meshy_timeout_seconds: int = 900

    hunyuan_api_server_base_url: str = "http://127.0.0.1:8080"
    hunyuan_api_server_timeout_seconds: int = 900

    max_upload_size_bytes: int = 8 * 1024 * 1024
    min_image_dimension: int = 512

    @model_validator(mode="after")
    def normalize_paths(self) -> "Settings":
        self.local_storage_root = _resolve_local_path(self.local_storage_root, SERVICE_ROOT)
        self.database_url = _resolve_database_url(self.database_url, SERVICE_ROOT)
        if self.hunyuan_repo_path is not None:
            self.hunyuan_repo_path = _resolve_local_path(self.hunyuan_repo_path, SERVICE_ROOT)
        return self

    @property
    def local_data_root(self) -> Path:
        return self.local_storage_root.resolve()

    @property
    def active_generator_provider(self) -> str:
        provider = (self.generator_provider or "auto").strip().lower()
        if not provider:
            provider = "auto"
        if provider != "auto":
            return provider
        if self.enable_mock_pipeline:
            return "mock"
        return "auto"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()
    settings.local_data_root.mkdir(parents=True, exist_ok=True)
    return settings

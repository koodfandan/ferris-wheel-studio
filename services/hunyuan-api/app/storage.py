from pathlib import Path

from fastapi import UploadFile

from .config import get_settings


class LocalStorage:
    def __init__(self, root: Path, public_base_url: str) -> None:
        self.root = root
        self.public_base_url = public_base_url.rstrip("/")
        self.root.mkdir(parents=True, exist_ok=True)

    def save_upload(self, key: str, upload: UploadFile) -> None:
        destination = self.absolute_path(key)
        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("wb") as file_handle:
            upload.file.seek(0)
            file_handle.write(upload.file.read())

    def save_bytes(self, key: str, payload: bytes) -> None:
        destination = self.absolute_path(key)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(payload)

    def save_text(self, key: str, payload: str) -> None:
        destination = self.absolute_path(key)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(payload, encoding="utf-8")

    def exists(self, key: str) -> bool:
        return self.absolute_path(key).exists()

    def absolute_path(self, key: str) -> Path:
        return self.root / key

    def public_url(self, key: str) -> str:
        return f"{self.public_base_url}/api/files/{key}"


def get_storage() -> LocalStorage:
    settings = get_settings()
    return LocalStorage(settings.local_data_root, settings.public_base_url)

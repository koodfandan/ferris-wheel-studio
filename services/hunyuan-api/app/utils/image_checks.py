from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image


def validate_upload(upload: UploadFile, settings) -> None:
    if upload.content_type not in {"image/png", "image/jpeg", "image/webp"}:
        raise HTTPException(status_code=400, detail="unsupported_image_type")

    upload.file.seek(0, 2)
    size = upload.file.tell()
    upload.file.seek(0)

    if size > settings.max_upload_size_bytes:
        raise HTTPException(status_code=400, detail="image_too_large")


def inspect_image(path: Path) -> dict[str, int | str]:
    with Image.open(path) as image:
        width, height = image.size
        return {
            "width": width,
            "height": height,
            "format": image.format or "unknown",
        }

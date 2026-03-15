from pathlib import Path

from ..storage import LocalStorage
from ..utils.file_ids import build_storage_key
from ..utils.image_checks import inspect_image


def preprocess_image(image_path: Path, storage: LocalStorage, settings, asset_hint: str) -> dict[str, str]:
    meta = inspect_image(image_path)
    if meta["width"] < settings.min_image_dimension or meta["height"] < settings.min_image_dimension:
        raise ValueError("subject_not_clear")

    subject_key = build_storage_key(f"preprocessed/{asset_hint}", "subject.png")
    storage.save_bytes(subject_key, image_path.read_bytes())

    return {
        "subject_key": subject_key,
    }

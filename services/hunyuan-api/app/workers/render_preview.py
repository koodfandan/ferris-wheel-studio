from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps

PREVIEW_MAX_SIZE = (768, 768)


def build_preview_image(source_path: Path) -> bytes:
    with Image.open(source_path) as image:
        preview = ImageOps.exif_transpose(image).convert("RGBA")
        preview.thumbnail(PREVIEW_MAX_SIZE, Image.Resampling.LANCZOS)
        output = BytesIO()
        preview.save(output, format="PNG", optimize=True, compress_level=6)
        return output.getvalue()

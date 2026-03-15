from datetime import datetime
from pathlib import Path
from uuid import uuid4


def new_job_id() -> str:
    return f"imp_{uuid4().hex[:12]}"


def new_asset_id() -> str:
    return f"asset_{uuid4().hex[:12]}"


def build_storage_key(prefix: str, filename: str) -> str:
    safe_name = Path(filename).name or "file.bin"
    stamp = datetime.utcnow().strftime("%Y%m%d")
    return f"{prefix}/{stamp}/{safe_name}"

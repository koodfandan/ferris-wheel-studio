from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import json

from ..db import get_db
from ..models import GeneratedAsset
from ..schemas import AssetResponse
from ..storage import LocalStorage, get_storage


router = APIRouter(tags=["assets"])


@router.get("/assets/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: str,
    db: Session = Depends(get_db),
    storage: LocalStorage = Depends(get_storage),
) -> AssetResponse:
    asset = db.get(GeneratedAsset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="asset_not_found")

    manifest_path = storage.absolute_path(asset.manifest_key)
    if not manifest_path.exists():
        raise HTTPException(status_code=500, detail="asset_manifest_missing")

    return AssetResponse(
        assetId=asset.id,
        name=asset.name,
        modelGlbUrl=storage.public_url(asset.model_glb_key) if asset.model_glb_key else None,
        previewImageUrl=storage.public_url(asset.preview_image_key),
        sourceImageUrl=storage.public_url(asset.source_image_key),
        manifestUrl=storage.public_url(asset.manifest_key),
        manifest=json.loads(manifest_path.read_text(encoding="utf-8")),
        generator=asset.generator,
        textureModel=asset.texture_model,
        createdAt=asset.created_at,
    )


@router.get("/files/{file_path:path}")
def get_file(file_path: str, storage: LocalStorage = Depends(get_storage)) -> FileResponse:
    absolute_path = storage.absolute_path(file_path)
    if not absolute_path.exists():
        raise HTTPException(status_code=404, detail="file_not_found")
    return FileResponse(absolute_path)

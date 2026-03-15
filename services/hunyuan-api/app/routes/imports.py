from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..config import Settings, get_settings
from ..db import get_db
from ..models import ImportJob
from ..schemas import CreateImportJobRequest, CreateImportJobResponse, ImportJobResponse, UploadImageResponse
from ..storage import LocalStorage, get_storage
from ..utils.file_ids import build_storage_key, new_job_id
from ..utils.image_checks import inspect_image, validate_upload
from ..workers.generation_providers import ProviderUnavailableError, assert_runtime_provider_ready
from ..workers.tasks import enqueue_import_job


router = APIRouter(tags=["imports"])


@router.post("/uploads/image", response_model=UploadImageResponse)
def upload_image(
    file: UploadFile = File(...),
    settings: Settings = Depends(get_settings),
    storage: LocalStorage = Depends(get_storage),
) -> UploadImageResponse:
    validate_upload(file, settings)
    file_key = build_storage_key("uploads/raw", file.filename or "upload.png")
    storage.save_upload(file_key, file)
    file_meta = inspect_image(storage.absolute_path(file_key))
    return UploadImageResponse(
        fileKey=file_key,
        url=storage.public_url(file_key),
        width=file_meta["width"],
        height=file_meta["height"],
    )


@router.post("/import-jobs", response_model=CreateImportJobResponse)
def create_import_job(
    payload: CreateImportJobRequest,
    db: Session = Depends(get_db),
    storage: LocalStorage = Depends(get_storage),
    settings: Settings = Depends(get_settings),
) -> CreateImportJobResponse:
    if not storage.exists(payload.fileKey):
        raise HTTPException(status_code=404, detail="source_image_not_found")

    try:
        assert_runtime_provider_ready(settings)
    except ProviderUnavailableError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    job = ImportJob(
        id=new_job_id(),
        status="queued",
        progress=0,
        source_image_key=payload.fileKey,
        mode=payload.mode,
        texture_enabled=payload.texture,
        style=payload.style,
    )
    db.add(job)
    db.commit()

    enqueue_import_job(job.id)

    return CreateImportJobResponse(jobId=job.id, status="queued")


@router.get("/import-jobs/{job_id}", response_model=ImportJobResponse)
def get_import_job(job_id: str, db: Session = Depends(get_db)) -> ImportJobResponse:
    job = db.get(ImportJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job_not_found")

    error = job.error_message or job.error_code
    return ImportJobResponse(
        jobId=job.id,
        status=job.status,  # type: ignore[arg-type]
        progress=job.progress,
        assetId=job.asset_id,
        error=error,
    )

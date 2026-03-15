from celery import Celery

from ..config import get_settings
from ..db import SessionLocal
from ..models import GeneratedAsset, ImportJob
from ..storage import get_storage
from .generation_providers import ProviderUnavailableError, assert_runtime_provider_ready
from .hunyuan_pipeline import HunyuanImportPipeline


settings = get_settings()
celery_app = Celery("hunyuan_api", broker=settings.redis_url, backend=settings.redis_url)


def enqueue_import_job(job_id: str) -> None:
    if settings.enable_inline_worker:
        run_import_job(job_id)
        return

    run_import_job.delay(job_id)


@celery_app.task(name="app.workers.tasks.run_import_job")
def run_import_job(job_id: str) -> None:
    db = SessionLocal()
    storage = get_storage()

    def update_job(status: str, progress: int) -> None:
        job = db.get(ImportJob, job_id)
        if not job:
            return
        job.status = status
        job.progress = progress
        db.add(job)
        db.commit()

    try:
        job = db.get(ImportJob, job_id)
        if not job:
            return

        assert_runtime_provider_ready(settings)
        pipeline = HunyuanImportPipeline(settings=settings, storage=storage)

        update_job("preprocessing", 12)

        result = pipeline.execute(job, on_progress=update_job)

        asset = GeneratedAsset(
            id=result["asset_id"],
            name=result["asset_name"],
            model_glb_key=result.get("model_glb_key"),
            preview_image_key=result["preview_image_key"],
            source_image_key=job.source_image_key,
            manifest_key=result["manifest_key"],
            generator=result["generator"],
            texture_model=result["texture_model"],
        )
        db.add(asset)

        update_job("rendering_preview", 96)
        job = db.get(ImportJob, job_id)
        if not job:
            return

        job.status = "ready"
        job.progress = 100
        job.asset_id = asset.id
        job.error_code = None
        job.error_message = None
        db.add(job)
        db.commit()
    except ProviderUnavailableError as exc:  # pragma: no cover - env dependent
        job = db.get(ImportJob, job_id)
        if job:
            job.status = "failed"
            job.error_code = exc.code
            job.error_message = str(exc)
            db.add(job)
            db.commit()
    except Exception as exc:  # pragma: no cover - error path
        job = db.get(ImportJob, job_id)
        if job:
            job.status = "failed"
            job.error_code = "pipeline_failed"
            job.error_message = str(exc)
            db.add(job)
            db.commit()
    finally:
        db.close()

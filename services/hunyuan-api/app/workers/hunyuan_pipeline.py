from ..models import ImportJob
from ..storage import LocalStorage
from ..utils.file_ids import new_asset_id
from .generation_providers import ProgressCallback, ProviderContext, create_generation_provider
from .normalize_glb import build_mock_spatial_manifest
from .preprocess import preprocess_image
from .render_preview import build_preview_image


class HunyuanImportPipeline:
    def __init__(self, settings, storage: LocalStorage) -> None:
        self.settings = settings
        self.storage = storage

    def execute(self, job: ImportJob, on_progress: ProgressCallback | None = None) -> dict[str, str | None]:
        source_path = self.storage.absolute_path(job.source_image_key)
        preprocess_output = preprocess_image(
            image_path=source_path,
            storage=self.storage,
            settings=self.settings,
            asset_hint=job.id,
        )

        asset_id = new_asset_id()
        asset_prefix = f"assets/{asset_id}"
        preview_key = f"{asset_prefix}/preview.png"
        manifest_key = f"{asset_prefix}/spatial-manifest.json"

        provider = create_generation_provider(self.settings, self.storage)
        provider_result = provider.generate(
            ProviderContext(
                job=job,
                subject_key=preprocess_output["subject_key"],
                subject_path=self.storage.absolute_path(preprocess_output["subject_key"]),
                asset_id=asset_id,
                asset_prefix=asset_prefix,
            ),
            on_progress=on_progress,
        )

        preview_bytes = provider_result.preview_bytes or build_preview_image(
            self.storage.absolute_path(preprocess_output["subject_key"])
        )
        self.storage.save_bytes(preview_key, preview_bytes)
        self.storage.save_text(manifest_key, build_mock_spatial_manifest(asset_id))

        return {
            "asset_id": asset_id,
            "asset_name": provider_result.asset_name,
            "preview_image_key": preview_key,
            "manifest_key": manifest_key,
            "model_glb_key": provider_result.model_glb_key,
            "generator": provider_result.generator,
            "texture_model": provider_result.texture_model,
        }

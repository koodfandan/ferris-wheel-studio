# Hunyuan3D Image-to-3D Implementation Plan

## 1. Final Technical Route

This project will use:

- Frontend: `Vite + React + TypeScript + R3F`
- API layer: `FastAPI`
- Queue layer: `Redis + Celery`
- Generation worker: `Hunyuan3D-2.1 + Hunyuan3D-Paint-v2.1`
- Image preprocessing: `rembg`
- Storage: `S3 or MinIO`
- Metadata: `PostgreSQL`
- Output format: `GLB + preview PNG + spatial manifest JSON`

The chosen generation pipeline is:

`input image -> preprocess -> shape generation -> texture generation -> GLB normalization -> current 3D stage`

This route matches the current frontend architecture because the existing stage already accepts standardized 3D assets and already has spatial registry, framing, and interaction logic.

References:

- Hunyuan3D-2 official repo: https://github.com/Tencent-Hunyuan/Hunyuan3D-2
- rembg official repo: https://github.com/danielgatis/rembg

## 2. Why This Route

Hunyuan3D-2 is the main generation engine because the official repository currently provides:

- a two-stage pipeline: `shape -> texture`
- direct code usage for mesh generation and texturing
- a local `api_server.py`
- official support notes for `MacOS / Windows / Linux`
- explicit VRAM guidance: about `6 GB` for shape and `16 GB` for shape + texture

For this product, that means:

- V1 can start with `single-image -> single GLB`
- V1.1 can upgrade to `Hunyuan3D-2mv` for multi-image quality mode
- generated output can be normalized to the same stage contract as existing assets

## 3. Integration With Current Repo

Current frontend entry and stage integration points:

- app state root: `/D:/Codex/test/ferris-wheel-studio/src/App.tsx`
- 3D stage canvas: `/D:/Codex/test/ferris-wheel-studio/src/components/stage-engine/stage-canvas.tsx`
- stage asset normalization helpers: `/D:/Codex/test/ferris-wheel-studio/src/lib/glb-scene.ts`
- spatial registry and manifest format: `/D:/Codex/test/ferris-wheel-studio/src/lib/asset-registry.ts`
- spatial manifest parser: `/D:/Codex/test/ferris-wheel-studio/src/lib/spatial-manifest.ts`

This means the project does not need a new frontend rendering engine. It needs:

- a new import feature module
- a backend service
- a standardized generated asset contract

## 4. Scope For V1

V1 only supports:

- one clear image
- one main subject
- one generated full model
- display in the existing stage
- save as one new collectible asset

V1 does not support:

- automatic split into editable head / outfit / prop parts
- rigging
- skeletal animation
- guaranteed high-quality backside reconstruction from a single image
- batch generation

## 5. Repo-Level Directory Plan

### Frontend

Add:

```text
src/
  features/
    import-3d/
      components/
        import-entry-button.tsx
        import-image-dialog.tsx
        import-job-status-card.tsx
        import-result-card.tsx
      import-3d.machine.ts
      import-3d.api.ts
      import-3d.types.ts
      import-3d.schema.ts
      import-3d.selectors.ts
```

### Backend

Add a new service folder inside this repo:

```text
services/
  hunyuan-api/
    app/
      main.py
      config.py
      db.py
      models.py
      schemas.py
      storage.py
      routes/
        imports.py
        assets.py
      workers/
        tasks.py
        hunyuan_pipeline.py
        preprocess.py
        normalize_glb.py
        render_preview.py
      utils/
        image_checks.py
        file_ids.py
        mesh_metrics.py
    requirements.txt
    Dockerfile
    docker-compose.yml
```

## 6. Frontend Implementation Plan

### 6.1 New State In App Root

Add the following state to `/D:/Codex/test/ferris-wheel-studio/src/App.tsx`:

- `importDialogOpen`
- `activeImportJob`
- `generatedAsset`
- `generatedAssetManifest`
- `generatedAssetGlbUrl`

Rules:

- when no imported asset exists, the stage keeps using the current recipe flow
- when an imported asset is selected, the stage switches to imported-model mode
- imported asset should not break blindbox flow; it is a parallel entry mode

### 6.2 New Stage Input Contract

Extend stage props so the stage can optionally render an imported GLB:

- `importedAssetMode: boolean`
- `importedGlbUrl?: string`
- `importedManifest?: SpatialBundleManifest`
- `importedPreviewName?: string`

This change will mainly affect:

- `/D:/Codex/test/ferris-wheel-studio/src/components/studio-shell/main-stage-shell.tsx`
- `/D:/Codex/test/ferris-wheel-studio/src/components/stage-engine/stage-canvas.tsx`
- `/D:/Codex/test/ferris-wheel-studio/src/components/stage-engine/stage-scene.tsx`

### 6.3 Import Feature UX

Frontend flow:

1. user clicks `Import Image`
2. open dialog
3. validate image locally
4. upload image
5. create import job
6. poll status
7. show result card
8. user clicks `Place on Stage`
9. stage switches to generated model

### 6.4 Frontend Machine

`import-3d.machine.ts` states:

- `idle`
- `validating-image`
- `uploading`
- `creating-job`
- `polling-job`
- `result-ready`
- `placing-on-stage`
- `failed`

This machine should stay independent from `blindbox.machine.ts`.

## 7. Backend Implementation Plan

### 7.1 API Endpoints

#### `POST /api/import-jobs`

Purpose:

- accept upload metadata
- create a generation job

Request:

```json
{
  "fileKey": "uploads/raw/20260314/abc123.png",
  "mode": "single-image",
  "texture": true,
  "style": "toy"
}
```

Response:

```json
{
  "jobId": "imp_01JXYZ",
  "status": "queued"
}
```

#### `GET /api/import-jobs/{jobId}`

Response:

```json
{
  "jobId": "imp_01JXYZ",
  "status": "texture_generating",
  "progress": 68,
  "assetId": null,
  "error": null
}
```

#### `GET /api/assets/{assetId}`

Response:

```json
{
  "assetId": "asset_01JXYZ",
  "name": "Imported Figure 01",
  "modelGlbUrl": "https://cdn.example.com/assets/asset_01JXYZ/model.glb",
  "previewImageUrl": "https://cdn.example.com/assets/asset_01JXYZ/preview.png",
  "manifestUrl": "https://cdn.example.com/assets/asset_01JXYZ/spatial-manifest.json"
}
```

### 7.2 Job Status Model

Job statuses:

- `queued`
- `preprocessing`
- `shape_generating`
- `texture_generating`
- `normalizing_glb`
- `rendering_preview`
- `ready`
- `failed`

Failure reasons should be explicit:

- `subject_not_clear`
- `multiple_subjects_detected`
- `background_too_complex`
- `generation_failed`
- `normalization_failed`

## 8. Worker Pipeline

### 8.1 Preprocess

File:

- `services/hunyuan-api/app/workers/preprocess.py`

Responsibilities:

- remove background with `rembg`
- center crop
- normalize canvas size
- reject bad inputs

Output:

- `subject.png`
- `mask.png`
- metadata JSON

### 8.2 Shape Generation

File:

- `services/hunyuan-api/app/workers/hunyuan_pipeline.py`

Core call pattern:

```python
from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline

shape_pipeline = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained("tencent/Hunyuan3D-2")
mesh = shape_pipeline(image=image_path)[0]
```

For multi-image mode in V1.1, switch to:

- `Hunyuan3D-2mv`

### 8.3 Texture Generation

Same worker file:

```python
from hy3dgen.texgen import Hunyuan3DPaintPipeline

paint_pipeline = Hunyuan3DPaintPipeline.from_pretrained("tencent/Hunyuan3D-2")
textured_mesh = paint_pipeline(mesh, image=image_path)
```

### 8.4 GLB Normalization

File:

- `services/hunyuan-api/app/workers/normalize_glb.py`

Responsibilities:

- export mesh to `GLB`
- compute bounding box
- center model on floor plane
- normalize height to project stage scale
- generate `spatial-manifest.json`
- optionally add default display base metadata

### 8.5 Preview Rendering

File:

- `services/hunyuan-api/app/workers/render_preview.py`

Responsibilities:

- produce one preview PNG
- standard angle
- plain background
- fixed lighting

## 9. Generated Asset Contract

Each generated asset must output:

```text
assets/{assetId}/
  model.glb
  preview.png
  subject.png
  mask.png
  spatial-manifest.json
  metadata.json
```

### 9.1 metadata.json

```json
{
  "assetId": "asset_01JXYZ",
  "sourceType": "image-import",
  "generator": "hunyuan3d-2.1",
  "textureModel": "hunyuan3d-paint-v2.1",
  "mode": "single-image",
  "createdAt": "2026-03-14T10:00:00Z"
}
```

### 9.2 spatial-manifest.json

This must follow the existing frontend schema from `/D:/Codex/test/ferris-wheel-studio/src/lib/spatial-manifest.ts`.

V1 generated character example:

```json
{
  "version": 1,
  "bundleId": "asset_01JXYZ",
  "assets": [
    {
      "id": "generated-character-asset-01JXYZ",
      "role": "character",
      "anchors": {
        "root": [0, 0, 0],
        "head": [0, 1.7, 0],
        "left_hand": [0.72, 0.86, 0.34]
      },
      "proxies": [
        {
          "id": "character-body",
          "type": "box",
          "size": [1.6, 3.0, 1.4],
          "offset": [0, 1.45, 0.12]
        },
        {
          "id": "character-head",
          "type": "sphere",
          "radius": 1.04,
          "offset": [0, 1.74, 0]
        }
      ],
      "metrics": {
        "preferredZ": 0.36,
        "preferredY": 0.08
      },
      "solveAxes": ["x", "y", "z"],
      "fallbacks": []
    }
  ]
}
```

## 10. Database Tables

### `import_jobs`

- `id`
- `status`
- `source_image_key`
- `mode`
- `texture_enabled`
- `style`
- `asset_id`
- `error_code`
- `error_message`
- `created_at`
- `updated_at`

### `generated_assets`

- `id`
- `name`
- `model_glb_key`
- `preview_image_key`
- `manifest_key`
- `generator`
- `texture_model`
- `source_type`
- `created_at`

## 11. Infra Requirements

Recommended production setup:

- OS: `Ubuntu`
- GPU: `24 GB VRAM` or above
- Python: version required by current Hunyuan repo setup
- Redis for queueing
- PostgreSQL for metadata
- MinIO or S3 for asset storage

Official Hunyuan note currently states:

- around `6 GB VRAM` for shape generation
- around `16 GB VRAM` for shape + texture generation

For product stability, do not plan production around the minimum numbers.

## 12. Development Phases

### Phase 1: Frontend import shell

Deliver:

- import button
- import dialog
- polling UI
- result card

No Hunyuan integration yet. Mock API only.

### Phase 2: Backend job API

Deliver:

- FastAPI service
- upload and job endpoints
- PostgreSQL + Redis setup
- Celery queue

### Phase 3: Hunyuan worker

Deliver:

- preprocess pipeline
- Hunyuan shape generation
- Hunyuan texture generation
- GLB export

### Phase 4: Stage integration

Deliver:

- generated GLB enters current stage
- current controls and framing work
- manifest merges with current spatial system

### Phase 5: Hardening

Deliver:

- failure handling
- retry rules
- asset cleanup rules
- quality validation

## 13. Risks And Controls

### Risk: single-image backside quality is unstable

Control:

- keep V1 as single-image quick mode
- add V1.1 multi-image mode with `Hunyuan3D-2mv`

### Risk: generated model scale breaks current stage

Control:

- force normalization in `normalize_glb.py`
- require generated manifest before asset can enter stage

### Risk: queue blocks the app

Control:

- all generation is async
- frontend only polls jobs

### Risk: user uploads bad images

Control:

- strict image validation before generation
- explicit failure messages

## 14. Final Recommendation

Build in this order:

1. frontend import feature with mock jobs
2. FastAPI + Redis + Celery service
3. Hunyuan worker with single-image mode
4. GLB normalization + spatial manifest generation
5. stage integration
6. multi-image mode later

Do not start with automatic editable part-splitting. First make one stable imported collectible that can enter the current stage correctly.

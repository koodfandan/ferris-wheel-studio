# Hunyuan API Service

This service is the backend skeleton for the image-to-3D pipeline.

Current scope:

- image upload endpoint
- import job creation endpoint
- import job polling endpoint
- generated asset lookup endpoint
- local storage backend
- Celery task entrypoint
- mock pipeline hook and real Hunyuan invocation entrypoint
- provider-based generator layer for `mock`, `hunyuan-cloud`, `meshy-api`, `hunyuan-api-server`, and `hunyuan-local`

## Local Development

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy env values:

```bash
copy .env.example .env
```

4. Run the API:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

5. Optional: run the worker:

```bash
celery -A app.workers.tasks.celery_app worker --loglevel=INFO
```

### Windows quick start

For the current local mock pipeline, you do not need Redis or a separate worker.

The startup script first tries a local `.venv`. If this machine cannot create one, it automatically falls back to `py -3` with a local `.packages` directory.

The default local start is intentionally `no-reload` because it is more stable for smoke tests and mock pipeline verification on this Windows workspace. Reload is opt-in through `-Reload` or `npm run dev:api:reload`.

For local development on this Windows workspace, the startup script forces `sqlite+pysqlite:///:memory:` unless you explicitly provide `DATABASE_URL`. This avoids the file-based SQLite `disk I/O error` seen here, and it applies to both mock mode and real-provider mode.

1. Start the backend:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```

Or from the project root:

```powershell
npm run dev:api
```

If you specifically want reload mode:

```powershell
npm run dev:api:reload
```

If you want to start in real provider mode:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local.ps1 -UseRealPipeline -GeneratorProvider hunyuan-local -HunyuanRepoPath "D:\path\to\Hunyuan3D-2"
```

2. In the frontend root, copy the env example:

```powershell
copy ..\..\.env.local.example ..\..\.env.local
```

3. Run the smoke test against a running backend:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-smoke.ps1
```

Or from the project root:

```powershell
npm run smoke:api
```

The smoke test exercises:

- `GET /health`
- `POST /api/uploads/image`
- `POST /api/import-jobs`
- `GET /api/import-jobs/{jobId}`
- `GET /api/assets/{assetId}`

When `ENABLE_MOCK_PIPELINE=false`, the backend now performs provider preflight before job creation. If the selected real provider is not ready, `POST /api/import-jobs` returns `409` with an actionable error instead of queueing a job that will fail later.

To also verify rejection paths:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-smoke.ps1 -IncludeFailureCases
```

To probe local provider readiness without starting a job:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\probe-hunyuan-local.ps1
```

## Frontend Connection

To connect the Vite frontend to this service, set:

```bash
VITE_IMPORT_API_BASE_URL=http://127.0.0.1:8000/api
```

If this variable is not set, the frontend automatically falls back to the mock import flow.

The import dialog now also includes an in-page API settings panel (`Backend Base URL`, `Meshy API Key`, `Hunyuan API Server URL`, Tencent Cloud endpoint/region/version/credentials), so you can fill and save runtime settings directly in the UI without editing `.env` during local testing.

An example file already exists at:

- `D:\Codex\test\ferris-wheel-studio\.env.local.example`

## Hunyuan Enablement

When you are ready to use real Hunyuan generation:

1. Install the Hunyuan3D runtime and model dependencies required by the official repository.
2. Set `ENABLE_MOCK_PIPELINE=false`.
3. Configure:

```bash
HUNYUAN_DEVICE=cuda
HUNYUAN_SHAPE_MODEL=tencent/Hunyuan3D-2
HUNYUAN_TEXTURE_MODEL=tencent/Hunyuan3D-2
```

The worker entrypoint is:

- `app/workers/hunyuan_pipeline.py`
- `app/workers/generation_providers.py`

The current implementation already contains:

- provider-based selection between `mock`, `hunyuan-cloud`, `meshy-api`, `hunyuan-api-server`, and `hunyuan-local`
- lazy import of `hy3dgen.shapegen.Hunyuan3DDiTFlowMatchingPipeline`
- lazy import of `hy3dgen.texgen.Hunyuan3DPaintPipeline`
- GLB export hook
- stage manifest output hook
- runtime readiness probe at `/api/runtime/providers`
- automatic provider selection in `GENERATOR_PROVIDER=auto`

### Provider Modes

Use `GENERATOR_PROVIDER=auto` (default) when you only want to fill API settings and let the backend choose automatically.

Provider auto-priority is:

1. `hunyuan-cloud` (when Tencent Cloud credentials are configured)
2. `meshy-api` (when API key is configured)
3. `hunyuan-api-server` (when API server is reachable)
4. `hunyuan-local` (when `hy3dgen` runtime is importable)
5. `mock` fallback (only when `ENABLE_MOCK_PIPELINE=true`)

Use `ENABLE_MOCK_PIPELINE=true` to keep local mock fallback available.

If you want to force a specific provider instead of auto, set:

```bash
GENERATOR_PROVIDER=meshy-api
```

or

```bash
GENERATOR_PROVIDER=hunyuan-cloud
```

or

```bash
GENERATOR_PROVIDER=hunyuan-api-server
```

or

```bash
GENERATOR_PROVIDER=hunyuan-local
```

### Tencent Cloud Hunyuan Mode

For Tencent Cloud direct API mode, configure:

```bash
GENERATOR_PROVIDER=auto
HUNYUAN_CLOUD_ENDPOINT=ai3d.tencentcloudapi.com
HUNYUAN_CLOUD_REGION=ap-guangzhou
HUNYUAN_CLOUD_VERSION=2025-05-13
HUNYUAN_CLOUD_SECRET_ID=your_secret_id
HUNYUAN_CLOUD_SECRET_KEY=your_secret_key
HUNYUAN_CLOUD_QUALITY_MODE=pro
HUNYUAN_CLOUD_MODEL=3.0
```

The backend uses Tencent Cloud TC3 signature, calls `SubmitHunyuanTo3DProJob` (or `Rapid`), polls `QueryHunyuanTo3D*Job`, and downloads GLB output into the local asset bundle.

### Meshy API Mode

For third-party API mode, configure:

```bash
GENERATOR_PROVIDER=auto
MESHY_API_KEY=your_api_key
MESHY_AI_MODEL=latest
MESHY_MODEL_TYPE=standard
```

The current API provider uses Meshy's Image-to-3D task flow, polls the task result, downloads `model_urls.glb`, and stores it into the local asset bundle.

### Local Hunyuan Mode

For local Hunyuan mode, configure:

```bash
GENERATOR_PROVIDER=auto
HUNYUAN_REPO_PATH=path_to_official_hunyuan_repo
HUNYUAN_SHAPE_MODEL=tencent/Hunyuan3D-2
HUNYUAN_TEXTURE_MODEL=tencent/Hunyuan3D-2
```

If the Hunyuan runtime is not installed into Python directly, `HUNYUAN_REPO_PATH` lets the worker add the official repo to `sys.path` before importing `hy3dgen`.

### Official Hunyuan API Server Mode

Tencent's README also documents running the official server with:

```bash
python api_server.py --host 0.0.0.0 --port 8080
```

This project now supports that mode too:

```bash
GENERATOR_PROVIDER=auto
HUNYUAN_API_SERVER_BASE_URL=http://127.0.0.1:8080
```

The backend will POST to `/generate` using the official image base64 payload and store the returned GLB into the local asset bundle.

Important: this mode expects the open-source Hunyuan `api_server.py` endpoint (`/generate`), not the Tencent Cloud
`hunyuan.tencentcloudapi.com` SDK endpoint.

For convenience, you can launch Tencent's server with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-hunyuan-official-api.ps1 -RepoPath "D:\path\to\Hunyuan3D-2" -EnableTexture
```

You can also check readiness through:

- `GET /api/runtime/providers`
- `npm run probe:hunyuan`

When provider readiness is not satisfied, the UI now blocks job creation and surfaces the active provider hint, so you do not
get a silent mock fallback while expecting real Hunyuan output.

`GET /api/runtime/providers` now also returns a `config` snapshot (`generatorProvider`, `enableMockPipeline`, etc.) so the
frontend can show the currently effective mode and fallback state explicitly.

## Production Notes

- Replace `DATABASE_URL` with PostgreSQL
- Replace `STORAGE_MODE=local` with S3 or MinIO integration
- Set `ENABLE_MOCK_PIPELINE=false`
- Add real Hunyuan3D model weights and worker environment

## Current Local Defaults

- `.env` is resolved relative to `services/hunyuan-api`
- SQLite defaults to `services/hunyuan-api/data/hunyuan.db`
- local storage defaults to `services/hunyuan-api/data/storage`
- preview images are normalized to fixed-size PNG output during mock generation
- `start-local.ps1` overrides the DB to in-memory SQLite for local runs unless you set `DATABASE_URL` yourself
- `/api/assets/{assetId}` now returns the parsed manifest inline, so the frontend does not need a second manifest fetch

// @ts-nocheck
import { useEffect, useId, useState } from "react";
import { ImportJobStatusCard } from "./import-job-status-card";
// @ts-nocheck
import { ImportResultCardV2 } from "./import-result-card-v2";
import type { Import3DAsset, Import3DJobSnapshot } from "../import-3d.types";
import {
  getImportRuntimeSettings,
  saveImportRuntimeSettings,
  type ImportRuntimeSettings,
  type ImportRuntimeProvidersResponse,
} from "../import-3d.api";

type Locale = "zh" | "en";

type ImportDialogState =
  | "closed"
  | "editing"
  | "validating-image"
  | "uploading"
  | "creating-job"
  | "polling-wait"
  | "polling-job"
  | "result-ready"
  | "failed";

function deriveRuntimePatch(
  settings: Pick<
    ImportRuntimeSettings,
    | "meshyApiKey"
    | "hunyuanApiServerBaseUrl"
    | "hunyuanCloudSecretId"
    | "hunyuanCloudSecretKey"
    | "hunyuanCloudEndpoint"
  >,
): Pick<ImportRuntimeSettings, "generatorProvider" | "enableMockPipeline"> {
  const hasMeshyKey = settings.meshyApiKey.trim().length > 0;
  const hasHunyuanApiServer = settings.hunyuanApiServerBaseUrl.trim().length > 0;
  const hasAnyCloudCredentialInput =
    settings.hunyuanCloudSecretId.trim().length > 0 || settings.hunyuanCloudSecretKey.trim().length > 0;
  const hasHunyuanCloudCredential =
    settings.hunyuanCloudSecretId.trim().length > 0 &&
    settings.hunyuanCloudSecretKey.trim().length > 0 &&
    settings.hunyuanCloudEndpoint.trim().length > 0;

  if (hasAnyCloudCredentialInput || hasHunyuanCloudCredential) {
    return {
      generatorProvider: "hunyuan-cloud",
      enableMockPipeline: false,
    };
  }

  if (hasMeshyKey) {
    return {
      generatorProvider: "meshy-api",
      enableMockPipeline: false,
    };
  }

  if (hasHunyuanApiServer) {
    return {
      generatorProvider: "hunyuan-api-server",
      enableMockPipeline: false,
    };
  }

  return {
    generatorProvider: "auto",
    enableMockPipeline: false,
  };
}

function pickActiveProviderStatus(runtime: ImportRuntimeProvidersResponse | null) {
  if (!runtime) return null;
  return runtime.providers.find((item) => item.provider === runtime.activeProvider) ?? null;
}

function pickProviderHint(runtime: ImportRuntimeProvidersResponse | null) {
  const active = pickActiveProviderStatus(runtime);
  const hint = active?.details?.hint;
  if (typeof hint === "string" && hint.trim()) return hint.trim();
  if (active?.issues.length) return active.issues.join(", ");
  return null;
}

export function ImportImageDialog({
  open,
  locale,
  state,
  previewDataUrl,
  fileName,
  validationError,
  job,
  result,
  onClose,
  onStart,
  onRetry,
  onPlaceOnStage,
  onFileSelected,
}: {
  open: boolean;
  locale: Locale;
  state: ImportDialogState;
  previewDataUrl: string | null;
  fileName: string | null;
  validationError: string | null;
  job: Import3DJobSnapshot | null;
  result: Import3DAsset | null;
  onClose: () => void;
  onStart: () => void;
  onRetry: () => void;
  onPlaceOnStage: () => void;
  onFileSelected: (file: File) => void;
}) {
  const inputId = useId();
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [meshyApiKey, setMeshyApiKey] = useState("");
  const [hunyuanApiServerBaseUrl, setHunyuanApiServerBaseUrl] = useState("http://127.0.0.1:8080");
  const [hunyuanCloudEndpoint, setHunyuanCloudEndpoint] = useState("ai3d.tencentcloudapi.com");
  const [hunyuanCloudRegion, setHunyuanCloudRegion] = useState("ap-guangzhou");
  const [hunyuanCloudVersion, setHunyuanCloudVersion] = useState("2025-05-13");
  const [hunyuanCloudSecretId, setHunyuanCloudSecretId] = useState("");
  const [hunyuanCloudSecretKey, setHunyuanCloudSecretKey] = useState("");
  const [hunyuanCloudToken, setHunyuanCloudToken] = useState("");
  const [hunyuanCloudQualityMode, setHunyuanCloudQualityMode] = useState<"pro" | "rapid">("pro");
  const [hunyuanCloudModel, setHunyuanCloudModel] = useState("3.0");
  const [runtimeStatus, setRuntimeStatus] = useState<ImportRuntimeProvidersResponse | null>(null);
  const [runtimeSaving, setRuntimeSaving] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [runtimeSuccess, setRuntimeSuccess] = useState<string | null>(null);

  const busy =
    state === "validating-image" ||
    state === "uploading" ||
    state === "creating-job" ||
    state === "polling-job" ||
    state === "polling-wait";

  useEffect(() => {
    if (!open) return;

    const settings = getImportRuntimeSettings();
    setApiBaseUrl(settings.apiBaseUrl);
    setMeshyApiKey(settings.meshyApiKey);
    setHunyuanApiServerBaseUrl(settings.hunyuanApiServerBaseUrl || "http://127.0.0.1:8080");
    setHunyuanCloudEndpoint(settings.hunyuanCloudEndpoint || "ai3d.tencentcloudapi.com");
    setHunyuanCloudRegion(settings.hunyuanCloudRegion || "ap-guangzhou");
    setHunyuanCloudVersion(settings.hunyuanCloudVersion || "2025-05-13");
    setHunyuanCloudSecretId(settings.hunyuanCloudSecretId || "");
    setHunyuanCloudSecretKey(settings.hunyuanCloudSecretKey || "");
    setHunyuanCloudToken(settings.hunyuanCloudToken || "");
    setHunyuanCloudQualityMode(settings.hunyuanCloudQualityMode === "rapid" ? "rapid" : "pro");
    setHunyuanCloudModel(settings.hunyuanCloudModel || "3.0");
    setRuntimeError(null);
    setRuntimeSuccess(null);

    let cancelled = false;
    void (async () => {
      try {
        const output = await saveImportRuntimeSettings({
          apiBaseUrl: settings.apiBaseUrl,
          meshyApiKey: settings.meshyApiKey,
          hunyuanApiServerBaseUrl: settings.hunyuanApiServerBaseUrl || "http://127.0.0.1:8080",
          hunyuanCloudEndpoint: settings.hunyuanCloudEndpoint || "ai3d.tencentcloudapi.com",
          hunyuanCloudRegion: settings.hunyuanCloudRegion || "ap-guangzhou",
          hunyuanCloudVersion: settings.hunyuanCloudVersion || "2025-05-13",
          hunyuanCloudSecretId: settings.hunyuanCloudSecretId || "",
          hunyuanCloudSecretKey: settings.hunyuanCloudSecretKey || "",
          hunyuanCloudToken: settings.hunyuanCloudToken || "",
          hunyuanCloudQualityMode: settings.hunyuanCloudQualityMode === "rapid" ? "rapid" : "pro",
          hunyuanCloudModel: settings.hunyuanCloudModel || "3.0",
          ...deriveRuntimePatch({
            meshyApiKey: settings.meshyApiKey,
            hunyuanApiServerBaseUrl: settings.hunyuanApiServerBaseUrl || "http://127.0.0.1:8080",
            hunyuanCloudSecretId: settings.hunyuanCloudSecretId || "",
            hunyuanCloudSecretKey: settings.hunyuanCloudSecretKey || "",
            hunyuanCloudEndpoint: settings.hunyuanCloudEndpoint || "ai3d.tencentcloudapi.com",
          }),
        });
        if (!cancelled) {
          setRuntimeStatus(output.runtime);
          const active = pickActiveProviderStatus(output.runtime);
          const hint = pickProviderHint(output.runtime);
          if (active && !active.ready && hint) {
            setRuntimeError(hint);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setRuntimeStatus(null);
          setRuntimeError(error instanceof Error ? error.message : "runtime_probe_failed");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSaveRuntimeSettings() {
    setRuntimeSaving(true);
    setRuntimeError(null);
    setRuntimeSuccess(null);

    try {
      const output = await saveImportRuntimeSettings({
        apiBaseUrl,
        meshyApiKey,
        hunyuanApiServerBaseUrl,
        hunyuanCloudEndpoint,
        hunyuanCloudRegion,
        hunyuanCloudVersion,
        hunyuanCloudSecretId,
        hunyuanCloudSecretKey,
        hunyuanCloudToken,
        hunyuanCloudQualityMode,
        hunyuanCloudModel,
        ...deriveRuntimePatch({
          meshyApiKey,
          hunyuanApiServerBaseUrl,
          hunyuanCloudSecretId,
          hunyuanCloudSecretKey,
          hunyuanCloudEndpoint,
        }),
      });

      setRuntimeStatus(output.runtime);
      const active = pickActiveProviderStatus(output.runtime);
      const hint = pickProviderHint(output.runtime);
      if (active && !active.ready && hint) {
        setRuntimeError(hint);
      }
      setRuntimeSuccess(
        locale === "zh"
          ? `已保存${output.runtime ? `，当前通道：${output.runtime.activeProvider}` : ""}`
          : `Saved${output.runtime ? `, active provider: ${output.runtime.activeProvider}` : ""}`,
      );
    } catch (error) {
      setRuntimeError(error instanceof Error ? error.message : "runtime_config_update_failed");
    } finally {
      setRuntimeSaving(false);
    }
  }

  if (!open) return null;
  const activeProviderStatus = pickActiveProviderStatus(runtimeStatus);
  const runtimeBlocked =
    Boolean(apiBaseUrl.trim()) && activeProviderStatus !== null && !activeProviderStatus.ready;

  return (
    <div className="import-dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="import-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${inputId}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="import-dialog-header">
          <div>
            <p>{locale === "zh" ? "混元 3D 导入" : "Hunyuan 3D Import"}</p>
            <h3 id={`${inputId}-title`}>
              {locale === "zh" ? "图片转 3D 预演" : "Image-to-3D Preview Flow"}
            </h3>
          </div>
          <button type="button" className="import-dialog-close" onClick={onClose} aria-label={locale === "zh" ? "关闭" : "Close"}>
            ×
          </button>
        </header>

        <div className="import-dialog-body">
          <section className="import-dialog-panel">
            <label className="import-upload-drop" htmlFor={inputId}>
              {previewDataUrl ? (
                <img src={previewDataUrl} alt={fileName ?? "preview"} />
              ) : (
                <div className="import-upload-copy">
                  <strong>{locale === "zh" ? "上传一张清晰单主体图片" : "Upload one clear single-subject image"}</strong>
                  <span>{locale === "zh" ? "支持 PNG / JPG / WEBP，最大 8MB" : "PNG / JPG / WEBP up to 8MB"}</span>
                </div>
              )}
            </label>

            <input
              id={inputId}
              className="import-upload-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) onFileSelected(file);
                event.currentTarget.value = "";
              }}
            />

            {fileName ? <div className="import-upload-name">{fileName}</div> : null}
            {validationError ? <div className="import-dialog-error">{validationError}</div> : null}

            <section className="import-runtime-card">
              <div className="import-runtime-head">
                <strong>{locale === "zh" ? "API 设置" : "API Settings"}</strong>
                <span>
                  {locale === "zh"
                    ? "直接在这里填，点保存并检测即可"
                    : "Fill values here and click Save & Probe"}
                </span>
              </div>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "后端地址" : "Backend Base URL"}</span>
                <input
                  type="text"
                  value={apiBaseUrl}
                  placeholder="http://127.0.0.1:8000/api"
                  onChange={(event) => setApiBaseUrl(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>Meshy API Key</span>
                <input
                  type="password"
                  value={meshyApiKey}
                  placeholder={locale === "zh" ? "可选，在线模式需要" : "Optional, used for Meshy API mode"}
                  onChange={(event) => setMeshyApiKey(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "混元 API Server 地址" : "Hunyuan API Server URL"}</span>
                <input
                  type="text"
                  value={hunyuanApiServerBaseUrl}
                  placeholder="http://127.0.0.1:8080"
                  onChange={(event) => setHunyuanApiServerBaseUrl(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "腾讯云 AI3D 域名" : "Tencent Cloud AI3D Endpoint"}</span>
                <input
                  type="text"
                  value={hunyuanCloudEndpoint}
                  placeholder="ai3d.tencentcloudapi.com"
                  onChange={(event) => setHunyuanCloudEndpoint(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "腾讯云地域" : "Tencent Cloud Region"}</span>
                <input
                  type="text"
                  value={hunyuanCloudRegion}
                  placeholder="ap-guangzhou"
                  onChange={(event) => setHunyuanCloudRegion(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "腾讯云版本" : "Tencent Cloud Version"}</span>
                <input
                  type="text"
                  value={hunyuanCloudVersion}
                  placeholder="2025-05-13"
                  onChange={(event) => setHunyuanCloudVersion(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "腾讯云 SecretId" : "Tencent Cloud SecretId"}</span>
                <input
                  type="text"
                  value={hunyuanCloudSecretId}
                  placeholder={locale === "zh" ? "必填，开启云端混元" : "Required for cloud mode"}
                  onChange={(event) => setHunyuanCloudSecretId(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "腾讯云 SecretKey" : "Tencent Cloud SecretKey"}</span>
                <input
                  type="password"
                  value={hunyuanCloudSecretKey}
                  placeholder={locale === "zh" ? "必填，开启云端混元" : "Required for cloud mode"}
                  onChange={(event) => setHunyuanCloudSecretKey(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "腾讯云临时 Token（可选）" : "Tencent Cloud Token (Optional)"}</span>
                <input
                  type="password"
                  value={hunyuanCloudToken}
                  placeholder={locale === "zh" ? "使用临时凭证时填写" : "Use for temporary credentials"}
                  onChange={(event) => setHunyuanCloudToken(event.currentTarget.value)}
                />
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "混元云质量模式" : "Cloud Quality Mode"}</span>
                <select
                  value={hunyuanCloudQualityMode}
                  onChange={(event) => setHunyuanCloudQualityMode(event.currentTarget.value === "rapid" ? "rapid" : "pro")}
                >
                  <option value="pro">Pro</option>
                  <option value="rapid">Rapid</option>
                </select>
              </label>

              <label className="import-runtime-field">
                <span>{locale === "zh" ? "混元云模型版本" : "Cloud Model Version"}</span>
                <input
                  type="text"
                  value={hunyuanCloudModel}
                  placeholder="3.0"
                  onChange={(event) => setHunyuanCloudModel(event.currentTarget.value)}
                />
              </label>

              <div className="import-runtime-actions">
                <button
                  type="button"
                  className="import-dialog-secondary"
                  onClick={handleSaveRuntimeSettings}
                  disabled={runtimeSaving}
                >
                  {runtimeSaving ? (locale === "zh" ? "保存中..." : "Saving...") : (locale === "zh" ? "保存并检测" : "Save & Probe")}
                </button>

                {runtimeStatus ? (
                  <small>
                    {locale === "zh" ? "当前通道：" : "Active provider: "}
                    <b>{runtimeStatus.activeProvider}</b>
                  </small>
                ) : null}
              </div>

              {runtimeStatus?.config ? (
                <small className="import-runtime-meta">
                  {locale === "zh"
                    ? `模式：${runtimeStatus.config.generatorProvider} / Mock 回退：${runtimeStatus.config.enableMockPipeline ? "开" : "关"}`
                    : `Mode: ${runtimeStatus.config.generatorProvider} / Mock fallback: ${runtimeStatus.config.enableMockPipeline ? "on" : "off"}`}
                </small>
              ) : null}

              {runtimeSuccess ? <div className="import-dialog-hint">{runtimeSuccess}</div> : null}
              {runtimeError ? <div className="import-dialog-error">{runtimeError}</div> : null}
            </section>

            <div className="import-dialog-actions">
              <button
                type="button"
                className="import-dialog-primary"
                onClick={onStart}
                disabled={!previewDataUrl || busy || runtimeSaving || runtimeBlocked}
              >
                {busy ? (locale === "zh" ? "处理中..." : "Working...") : (locale === "zh" ? "开始生成" : "Start Generation")}
              </button>
              <button type="button" className="import-dialog-ghost" onClick={onClose}>
                {locale === "zh" ? "取消" : "Cancel"}
              </button>
            </div>

            {runtimeBlocked ? (
              <div className="import-dialog-error">
                {locale === "zh"
                  ? `当前通道不可用：${pickProviderHint(runtimeStatus) ?? "请检查 API 配置"}`
                  : `Active provider is not ready: ${pickProviderHint(runtimeStatus) ?? "check API settings"}`}
              </div>
            ) : null}
          </section>

          <section className="import-dialog-panel import-dialog-panel-side">
            <ImportJobStatusCard locale={locale} job={job} />

            {result ? (
              <ImportResultCardV2 locale={locale} asset={result} onPlaceOnStage={onPlaceOnStage} />
            ) : (
              <div className="import-side-note">
                <strong>{locale === "zh" ? "当前说明" : "Current Notes"}</strong>
                <p>
                  {locale === "zh"
                    ? "这一步先跑通上传、任务、结果、放入舞台。填好 API 后会自动切到对应通道。"
                    : "This phase validates upload, job state, result, and stage placement. After config, provider switching is automatic."}
                </p>
              </div>
            )}

            {state === "failed" ? (
              <button type="button" className="import-dialog-secondary" onClick={onRetry}>
                {locale === "zh" ? "重试生成" : "Retry"}
              </button>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

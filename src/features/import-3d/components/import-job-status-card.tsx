import type { Import3DJobSnapshot } from "../import-3d.types";

type Locale = "zh" | "en";

const STATUS_LABELS: Record<Import3DJobSnapshot["status"], { zh: string; en: string }> = {
  queued: { zh: "任务排队中", en: "Queued" },
  preprocessing: { zh: "图片预处理中", en: "Preprocessing" },
  shape_generating: { zh: "正在生成形体", en: "Generating shape" },
  texture_generating: { zh: "正在生成贴图", en: "Generating texture" },
  normalizing_glb: { zh: "正在标准化模型", en: "Normalizing GLB" },
  rendering_preview: { zh: "正在渲染预览", en: "Rendering preview" },
  ready: { zh: "结果已生成", en: "Ready" },
  failed: { zh: "生成失败", en: "Failed" },
};

export function ImportJobStatusCard({
  locale,
  job,
}: {
  locale: Locale;
  job: Import3DJobSnapshot | null;
}) {
  if (!job) return null;

  return (
    <div className="import-job-status-card">
      <div className="import-job-status-head">
        <strong>{locale === "zh" ? "生成任务" : "Generation Job"}</strong>
        <span>{locale === "zh" ? STATUS_LABELS[job.status].zh : STATUS_LABELS[job.status].en}</span>
      </div>
      <div className="import-job-progress">
        <i style={{ width: `${job.progress}%` }} />
      </div>
      <div className="import-job-meta">
        <small>{job.jobId}</small>
        <b>{job.progress}%</b>
      </div>
    </div>
  );
}

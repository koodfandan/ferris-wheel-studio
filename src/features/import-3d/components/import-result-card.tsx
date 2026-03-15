import type { Import3DAsset } from "../import-3d.types";
export { ImportResultCardV2 as ImportResultCard } from "./import-result-card-v2";

type Locale = "zh" | "en";

export function ImportResultCardLegacy({
  locale,
  asset,
  onPlaceOnStage,
}: {
  locale: Locale;
  asset: Import3DAsset;
  onPlaceOnStage: () => void;
}) {
  const isRealGlb = asset.modelKind === "glb" && Boolean(asset.modelGlbUrl);
  const generator = asset.metadata?.generator ?? "unknown";

  return (
    <div className="import-result-card">
      <div className="import-result-preview">
        <img src={asset.previewImageUrl} alt={asset.name} />
      </div>

      <div className="import-result-copy">
        <span className="import-result-badge">{locale === "zh" ? "导入结果" : "Generated Result"}</span>
        <strong>{asset.name}</strong>
        <p>{locale === "zh" ? `生成通道：${generator}` : `Generator: ${generator}`}</p>
        {!isRealGlb ? (
          <p>{locale === "zh" ? "当前结果不是可用的真实 3D GLB，请检查混元 API 配置。" : "This result is not a real 3D GLB model. Check Hunyuan API settings."}</p>
        ) : null}
        <p>
          {locale === "zh"
            ? "当前是前端预演结果，后续会接入真实混元生成链。"
            : "This is the frontend preview flow. Real Hunyuan generation will replace it later."}
        </p>
      </div>

      <button type="button" className="import-place-button" onClick={onPlaceOnStage}>
        {locale === "zh" ? "放入舞台" : "Place on Stage"}
      </button>
    </div>
  );
}

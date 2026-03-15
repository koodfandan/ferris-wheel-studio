import type { Import3DAsset } from "../import-3d.types";

type Locale = "zh" | "en";

export function ImportResultCardV2({
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
        <span className="import-result-badge">{locale === "zh" ? "\u5bfc\u5165\u7ed3\u679c" : "Generated Result"}</span>
        <strong>{asset.name}</strong>
        <p>{locale === "zh" ? `\u751f\u6210\u901a\u9053\uff1a${generator}` : `Generator: ${generator}`}</p>
        <p>
          {locale === "zh"
            ? isRealGlb
              ? "\u5df2\u751f\u6210\u53ef\u7528\u7684 3D GLB \u6a21\u578b\u3002"
              : "\u5f53\u524d\u7ed3\u679c\u4e0d\u662f\u53ef\u7528\u7684\u771f\u5b9e 3D GLB\uff0c\u8bf7\u68c0\u67e5\u6df7\u5143 API \u914d\u7f6e\u3002"
            : isRealGlb
              ? "A usable 3D GLB model is ready."
              : "This result is not a real 3D GLB model. Check Hunyuan API settings."}
        </p>
      </div>

      <button type="button" className="import-place-button" onClick={onPlaceOnStage}>
        {locale === "zh" ? "\u653e\u5165\u821e\u53f0" : "Place on Stage"}
      </button>
    </div>
  );
}

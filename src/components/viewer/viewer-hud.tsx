import type { AssetAvailability } from "./figure-asset";

type Props = {
  mode: "showcase" | "inspect";
  assetStatus: AssetAvailability;
};

export function ViewerHud({ mode, assetStatus }: Props) {
  return (
    <>
      <div className="canvas-hint">
        <span>
          {mode === "inspect"
            ? "Drag the figure to spin it in 360"
            : "Showcase runs like a product turntable"}
        </span>
        <span>{mode === "inspect" ? "Scroll to zoom into details" : "Switch to Inspect for manual spin"}</span>
      </div>
      {assetStatus.kind !== "bundle" && (
        <div className="asset-banner">
          <b>{assetStatus.kind === "local" ? "Local Preview Asset" : "Placeholder Asset"}</b>
          <span>
            {assetStatus.kind === "local"
              ? assetStatus.label
              : "Drop `public/models/dream-fair-wheel.glb` in place or import a local GLB to switch from the procedural prototype."}
          </span>
        </div>
      )}
    </>
  );
}

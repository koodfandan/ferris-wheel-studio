import type { FigureConfig } from "../../lib/config";
import type { ProductRecipe } from "../../lib/collector-studio";
import { getPartLabel } from "../../lib/collector-studio";
import type { ViewPreset } from "../../lib/camera-presets";
import { ViewerCanvas } from "../viewer/viewer-canvas";

export type StageMode = "assemble" | "preview" | "beauty";

type Props = {
  config: FigureConfig;
  recipe: ProductRecipe;
  assetUrl?: string | null;
  assetName?: string | null;
  stageMode: StageMode;
  activeView: ViewPreset;
  onStageModeChange: (mode: StageMode) => void;
  onActiveViewChange: (view: ViewPreset) => void;
};

const RECIPE_KEYS: Array<keyof Omit<ProductRecipe, "species" | "palette">> = [
  "face",
  "hairOrFur",
  "headAccessory",
  "bodyOutfit",
  "leftProp",
  "ring",
  "cabins",
  "base",
];

export function BuildStage({
  config,
  recipe,
  assetUrl,
  assetName,
  stageMode,
  activeView,
  onStageModeChange,
  onActiveViewChange,
}: Props) {
  return (
    <section className="build-stage">
      <div className="build-stage-top">
        <div className="stage-mode-tabs">
          {(["assemble", "preview", "beauty"] as StageMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={stageMode === mode ? "is-active" : ""}
              onClick={() => onStageModeChange(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="stage-toolbar">
          {(["front", "left", "right", "back"] as ViewPreset[]).map((view) => (
            <button
              key={view}
              type="button"
              className={activeView === view ? "is-active" : ""}
              onClick={() => onActiveViewChange(view)}
            >
              {view}
            </button>
          ))}
          <button type="button" onClick={() => onActiveViewChange("top")}>
            top
          </button>
          <button type="button" onClick={() => onActiveViewChange("front")}>
            reset
          </button>
        </div>
      </div>

      <div className="stage-frame">
        <div className="stage-backdrop-glow stage-backdrop-glow-a" />
        <div className="stage-backdrop-glow stage-backdrop-glow-b" />
        <div className="stage-copy">
          <span>Blind Box Assembly Stage</span>
          <strong>{assetName ? "Local asset plugged into the recipe" : "Using modular placeholder stage"}</strong>
        </div>

        <div className="stage-canvas-wrap">
          <ViewerCanvas
            config={config}
            assetUrl={assetUrl}
            assetName={assetName}
            showToolbar={false}
            showHud={false}
            activeView={activeView}
            onActiveViewChange={onActiveViewChange}
          />
        </div>
      </div>

      <div className="recipe-ribbon">
        {RECIPE_KEYS.map((key) => (
          <span key={key} className="recipe-chip">
            {getPartLabel(recipe[key])}
          </span>
        ))}
      </div>

      <div className="stage-footer-note">
        <span>Current build should feel like a real collectible, not a game avatar.</span>
        <span>Beauty mode is the shelf-facing presentation state.</span>
      </div>
    </section>
  );
}

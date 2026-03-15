import type { ViewPreset } from "../../lib/camera-presets";

type Props = {
  mode: "showcase" | "inspect";
  activeView: ViewPreset;
  onViewChange: (view: ViewPreset) => void;
  onReset: () => void;
};

export function ViewerToolbar({ mode, activeView, onViewChange, onReset }: Props) {
  return (
    <div className="canvas-toolbar">
      <div className="canvas-mode">{mode === "inspect" ? "Free 360 Drag" : "Showcase 360"}</div>
      {mode === "showcase" && (
        <div className="canvas-views">
          {(["front", "back", "left", "right", "top"] as ViewPreset[]).map((view) => (
            <button
              key={view}
              className={activeView === view ? "is-active" : ""}
              type="button"
              onClick={() => onViewChange(view)}
            >
              {view}
            </button>
          ))}
          <button type="button" onClick={onReset}>
            reset
          </button>
        </div>
      )}
    </div>
  );
}

import type { StudioMode } from "../../lib/collector-studio";
import { STUDIO_MODES } from "../../lib/collector-studio";

type Props = {
  activeMode: StudioMode;
  onModeChange: (mode: StudioMode) => void;
};

export function ModeSwitcher({ activeMode, onModeChange }: Props) {
  return (
    <section className="panel card">
      <div className="section-heading">
        <h2>Studio Modes</h2>
        <span>collector workflow</span>
      </div>
      <div className="mode-grid">
        {STUDIO_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`mode-card ${activeMode === mode.id ? "is-active" : ""}`}
            onClick={() => onModeChange(mode.id)}
          >
            <strong>{mode.label}</strong>
            <span>{mode.blurb}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

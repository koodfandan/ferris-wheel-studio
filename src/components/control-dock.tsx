import type { FigureConfig, LightMode } from "../lib/config";

type Props = {
  config: FigureConfig;
  onChange: <K extends keyof FigureConfig>(key: K, value: FigureConfig[K]) => void;
  assetName?: string | null;
  onAssetSelect: (file: File | null) => void;
  onAssetClear: () => void;
};

export function ControlDock({ config, onChange, assetName, onAssetSelect, onAssetClear }: Props) {
  const placeholderOnlyDisabled = Boolean(assetName);

  return (
    <section className="panel card">
      <h2>Control Dock</h2>
      <div className="field-list">
        <div className="field">
          <label htmlFor="assetInput">
            GLB Asset <span>{assetName ? "local preview ready" : "upload preview file"}</span>
          </label>
          <input
            id="assetInput"
            type="file"
            accept=".glb,model/gltf-binary"
            onChange={(event) => {
              onAssetSelect(event.target.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />
          <div className="asset-caption">
            {assetName ? assetName : "Use a local `.glb` to preview the final figurine without replacing the bundled model yet."}
          </div>
          {assetName && (
            <div className="inline-actions">
              <button type="button" className="mini-button" onClick={onAssetClear}>
                Clear local asset
              </button>
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="titleInput">
            Title <span>showcase name</span>
          </label>
          <input
            id="titleInput"
            type="text"
            value={config.title}
            onChange={(event) => onChange("title", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="ringSize">
            Ring Size <span>{placeholderOnlyDisabled ? "placeholder only" : `${config.ringSize}%`}</span>
          </label>
          <input
            id="ringSize"
            type="range"
            min={88}
            max={116}
            value={config.ringSize}
            disabled={placeholderOnlyDisabled}
            onChange={(event) => onChange("ringSize", Number(event.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="headScale">
            Head Scale <span>{placeholderOnlyDisabled ? "placeholder only" : `${config.headScale}%`}</span>
          </label>
          <input
            id="headScale"
            type="range"
            min={92}
            max={118}
            value={config.headScale}
            disabled={placeholderOnlyDisabled}
            onChange={(event) => onChange("headScale", Number(event.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="cabinCount">
            Cabins <span>{placeholderOnlyDisabled ? "placeholder only" : config.cabinCount}</span>
          </label>
          <input
            id="cabinCount"
            type="range"
            min={4}
            max={8}
            step={1}
            value={config.cabinCount}
            disabled={placeholderOnlyDisabled}
            onChange={(event) => onChange("cabinCount", Number(event.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="viewMode">
            View Mode <span>360 workflow</span>
          </label>
          <select
            id="viewMode"
            value={config.viewMode}
            onChange={(event) =>
              onChange("viewMode", event.target.value as FigureConfig["viewMode"])
            }
          >
            <option value="showcase">Showcase</option>
            <option value="inspect">Inspect</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="lightMode">
            Light Mode <span>palette</span>
          </label>
          <select
            id="lightMode"
            value={config.lightMode}
            onChange={(event) => onChange("lightMode", event.target.value as LightMode)}
          >
            <option value="warm">Warm Gold</option>
            <option value="blue">Ice Blue</option>
            <option value="rose">Rose Candy</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="glowStrength">
            Glow Strength <span>{config.glowStrength}%</span>
          </label>
          <input
            id="glowStrength"
            type="range"
            min={10}
            max={140}
            value={config.glowStrength}
            onChange={(event) => onChange("glowStrength", Number(event.target.value))}
          />
        </div>

        <div className="toggle-row">
          <label className="toggle" htmlFor="spinToggle">
            Spin
            <input
              id="spinToggle"
              type="checkbox"
              checked={config.spinEnabled}
              disabled={placeholderOnlyDisabled}
              onChange={(event) => onChange("spinEnabled", event.target.checked)}
            />
          </label>
          <label className="toggle" htmlFor="floatToggle">
            Float
            <input
              id="floatToggle"
              type="checkbox"
              checked={config.floatEnabled}
              disabled={placeholderOnlyDisabled}
              onChange={(event) => onChange("floatEnabled", event.target.checked)}
            />
          </label>
        </div>
      </div>
    </section>
  );
}

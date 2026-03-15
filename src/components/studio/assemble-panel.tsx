import type { FigureConfig, LightMode } from "../../lib/config";
import type {
  PaletteId,
  ProductRecipe,
  RecipeSlot,
  Species,
} from "../../lib/collector-studio";
import { PALETTE_OPTIONS, SLOT_META, SPECIES_OPTIONS, getParts } from "../../lib/collector-studio";

type Props = {
  config: FigureConfig;
  recipe: ProductRecipe;
  selectedSlot: RecipeSlot;
  assetName?: string | null;
  onAssetSelect: (file: File | null) => void;
  onAssetClear: () => void;
  onSpeciesChange: (species: Species) => void;
  onSlotChange: (slot: RecipeSlot) => void;
  onPartChange: (slot: RecipeSlot, partId: string) => void;
  onPaletteChange: (palette: PaletteId, lightMode: LightMode) => void;
  onRandomize: () => void;
};

export function AssemblePanel({
  config,
  recipe,
  selectedSlot,
  assetName,
  onAssetSelect,
  onAssetClear,
  onSpeciesChange,
  onSlotChange,
  onPartChange,
  onPaletteChange,
  onRandomize,
}: Props) {
  const parts = getParts(recipe.species, selectedSlot);

  return (
    <>
      <section className="panel card">
        <div className="section-heading">
          <h2>Assembly Dock</h2>
          <span>local asset + recipe</span>
        </div>
        <div className="field-list">
          <div className="field">
            <label htmlFor="assetInputAssemble">
              GLB Asset <span>{assetName ? "local preview ready" : "upload preview file"}</span>
            </label>
            <input
              id="assetInputAssemble"
              type="file"
              accept=".glb,model/gltf-binary"
              onChange={(event) => {
                onAssetSelect(event.target.files?.[0] ?? null);
                event.currentTarget.value = "";
              }}
            />
            <div className="asset-caption">
              {assetName
                ? assetName
                : "Upload a local `.glb` to test how the assembled recipe behaves on a real asset."}
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
            <label htmlFor="speciesSelect">
              Species <span>base body family</span>
            </label>
            <select
              id="speciesSelect"
              value={recipe.species}
              onChange={(event) => onSpeciesChange(event.target.value as Species)}
            >
              {SPECIES_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="lightModeAssemble">
              Display Light <span>{config.lightMode}</span>
            </label>
            <select
              id="lightModeAssemble"
              value={config.lightMode}
              onChange={(event) =>
                onPaletteChange(recipe.palette, event.target.value as LightMode)
              }
            >
              <option value="warm">Warm Gold</option>
              <option value="blue">Ice Blue</option>
              <option value="rose">Rose Candy</option>
            </select>
          </div>
        </div>
        <div className="inline-actions">
          <button type="button" className="action-button" onClick={onRandomize}>
            Randomize recipe
          </button>
        </div>
      </section>

      <section className="panel card">
        <div className="section-heading">
          <h2>Slots</h2>
          <span>swap one layer at a time</span>
        </div>
        <div className="slot-grid">
          {SLOT_META.map((slot) => (
            <button
              key={slot.id}
              type="button"
              className={`slot-card ${selectedSlot === slot.id ? "is-active" : ""}`}
              onClick={() => onSlotChange(slot.id)}
            >
              <strong>{slot.label}</strong>
              <span>{slot.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel card">
        <div className="section-heading">
          <h2>{SLOT_META.find((slot) => slot.id === selectedSlot)?.label}</h2>
          <span>available parts</span>
        </div>
        <div className="parts-grid">
          {parts.map((part) => (
            <button
              key={part.id}
              type="button"
              className={`part-card ${recipe[selectedSlot] === part.id ? "is-active" : ""}`}
              onClick={() => onPartChange(selectedSlot, part.id)}
            >
              <b>{part.label}</b>
              <span>{part.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel card">
        <div className="section-heading">
          <h2>Palette</h2>
          <span>series colorway</span>
        </div>
        <div className="parts-grid palette-grid">
          {PALETTE_OPTIONS.map((palette) => (
            <button
              key={palette.id}
              type="button"
              className={`part-card ${recipe.palette === palette.id ? "is-active" : ""}`}
              onClick={() => onPaletteChange(palette.id, palette.lightMode)}
            >
              <b>{palette.label}</b>
              <span>{palette.blurb}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

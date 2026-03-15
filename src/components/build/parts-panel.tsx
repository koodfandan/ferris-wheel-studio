import type { LightMode } from "../../lib/config";
import type {
  PaletteId,
  ProductRecipe,
  RecipeSlot,
  Species,
} from "../../lib/collector-studio";
import {
  PALETTE_OPTIONS,
  SPECIES_OPTIONS,
  SLOT_META,
  getParts,
} from "../../lib/collector-studio";

type Props = {
  recipe: ProductRecipe;
  selectedSlot: RecipeSlot;
  assetName?: string | null;
  onAssetSelect: (file: File | null) => void;
  onAssetClear: () => void;
  onSpeciesChange: (species: Species) => void;
  onPartChange: (slot: RecipeSlot, partId: string) => void;
  onPaletteChange: (paletteId: PaletteId, lightMode: LightMode) => void;
};

export function PartsPanel({
  recipe,
  selectedSlot,
  assetName,
  onAssetSelect,
  onAssetClear,
  onSpeciesChange,
  onPartChange,
  onPaletteChange,
}: Props) {
  const slotMeta = SLOT_META.find((slot) => slot.id === selectedSlot) ?? SLOT_META[0];
  const parts = getParts(recipe.species, selectedSlot);

  return (
    <aside className="parts-panel">
      <section className="panel-section">
        <div className="section-minihead">
          <h2>Parts Library</h2>
          <span>swap + preview</span>
        </div>

        <div className="species-switch">
          {SPECIES_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === recipe.species ? "is-active" : ""}
              onClick={() => onSpeciesChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="asset-upload-card">
          <label htmlFor="buildAssetInput">
            Local GLB
            <span>{assetName ? "previewing local asset" : "import final asset preview"}</span>
          </label>
          <input
            id="buildAssetInput"
            type="file"
            accept=".glb,model/gltf-binary"
            onChange={(event) => {
              onAssetSelect(event.target.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />
          <p>{assetName ? assetName : "Use a real GLB to test this recipe on a production-like asset."}</p>
          {assetName && (
            <button type="button" className="ghost-pill wide" onClick={onAssetClear}>
              Clear local asset
            </button>
          )}
        </div>
      </section>

      <section className="panel-section">
        <div className="section-minihead">
          <h2>{slotMeta.label}</h2>
          <span>{slotMeta.blurb}</span>
        </div>
        <div className="part-card-list">
          {parts.map((part) => (
            <button
              key={part.id}
              type="button"
              className={`part-library-card ${recipe[selectedSlot] === part.id ? "is-active" : ""}`}
              onClick={() => onPartChange(selectedSlot, part.id)}
            >
              <div className={`part-thumb part-thumb-${selectedSlot}`} />
              <div className="part-copy">
                <strong>{part.label}</strong>
                <p>{part.blurb}</p>
                <span>{part.tags.join(" · ")}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="section-minihead">
          <h2>Palette</h2>
          <span>series colorway</span>
        </div>
        <div className="palette-card-list">
          {PALETTE_OPTIONS.map((palette) => (
            <button
              key={palette.id}
              type="button"
              className={`palette-card ${recipe.palette === palette.id ? "is-active" : ""}`}
              onClick={() => onPaletteChange(palette.id, palette.lightMode)}
            >
              <div className={`palette-sample palette-${palette.id}`} />
              <div>
                <strong>{palette.label}</strong>
                <p>{palette.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

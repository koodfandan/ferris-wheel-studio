import type { ProductRecipe } from "../../lib/collector-studio";
import { PALETTE_OPTIONS, SPECIES_OPTIONS, SLOT_META, getPartLabel } from "../../lib/collector-studio";

type Props = {
  recipe: ProductRecipe;
};

export function BuildSummary({ recipe }: Props) {
  const species = SPECIES_OPTIONS.find((item) => item.id === recipe.species)?.label ?? recipe.species;
  const palette = PALETTE_OPTIONS.find((item) => item.id === recipe.palette)?.label ?? recipe.palette;

  return (
    <section className="build-summary">
      <div className="summary-card">
        <div className="section-minihead">
          <h2>Current Recipe</h2>
          <span>collector summary</span>
        </div>
        <div className="summary-list">
          <div className="summary-row">
            <b>Species</b>
            <span>{species}</span>
          </div>
          <div className="summary-row">
            <b>Palette</b>
            <span>{palette}</span>
          </div>
          {SLOT_META.map((slot) => (
            <div key={slot.id} className="summary-row">
              <b>{slot.label}</b>
              <span>{getPartLabel(recipe[slot.id])}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-card">
        <div className="section-minihead">
          <h2>Blind Box Rules</h2>
          <span>design guardrails</span>
        </div>
        <div className="summary-bullets">
          <p>Every combination should stay readable as one toy line, not a random pile of parts.</p>
          <p>Face readability and silhouette come first. Effects and glow must stay secondary.</p>
          <p>Transparent cabins and display boxes can shine, but the face must remain matte and legible.</p>
        </div>
      </div>
    </section>
  );
}

import type { ProductRecipe } from "../../lib/collector-studio";
import { PALETTE_OPTIONS, SLOT_META, SPECIES_OPTIONS, getPartLabel } from "../../lib/collector-studio";

type Props = {
  recipe: ProductRecipe;
};

export function RecipePanel({ recipe }: Props) {
  const speciesLabel =
    SPECIES_OPTIONS.find((item) => item.id === recipe.species)?.label ?? recipe.species;
  const palette = PALETTE_OPTIONS.find((item) => item.id === recipe.palette);

  return (
    <>
      <section className="panel card">
        <div className="section-heading">
          <h2>Recipe</h2>
          <span>current build</span>
        </div>
        <div className="list">
          <div className="item">
            <b>Species</b>
            <span>{speciesLabel}</span>
          </div>
          {SLOT_META.map((slot) => (
            <div key={slot.id} className="item">
              <b>{slot.label}</b>
              <span>{getPartLabel(recipe[slot.id])}</span>
            </div>
          ))}
          <div className="item">
            <b>Palette</b>
            <span>{palette?.label ?? recipe.palette}</span>
          </div>
        </div>
      </section>

      <section className="panel card">
        <div className="section-heading">
          <h2>Collector Feel</h2>
          <span>product direction</span>
        </div>
        <div className="list">
          <div className="item">
            <b>Assemble</b>
            <span>Swap parts like a toy rack, not a CAD editor</span>
          </div>
          <div className="item">
            <b>Inspect</b>
            <span>Use clean 360 viewing to check face and materials</span>
          </div>
          <div className="item">
            <b>Shelf</b>
            <span>Present the final recipe like a real blind-box launch shot</span>
          </div>
        </div>
      </section>
    </>
  );
}

import type { ProductRecipe } from "../../lib/collector-studio";
import { PALETTE_OPTIONS, SPECIES_OPTIONS } from "../../lib/collector-studio";

type Props = {
  recipe: ProductRecipe;
};

export function ShelfPanel({ recipe }: Props) {
  const speciesLabel =
    SPECIES_OPTIONS.find((item) => item.id === recipe.species)?.label ?? recipe.species;
  const palette = PALETTE_OPTIONS.find((item) => item.id === recipe.palette);

  return (
    <>
      <section className="panel card">
        <div className="section-heading">
          <h2>Shelf Output</h2>
          <span>beauty-first render plan</span>
        </div>
        <div className="list">
          <div className="item">
            <b>Hero</b>
            <span>{speciesLabel}</span>
          </div>
          <div className="item">
            <b>Palette</b>
            <span>{palette?.label ?? recipe.palette}</span>
          </div>
          <div className="item">
            <b>Turntable</b>
            <span>72-frame beauty sequence</span>
          </div>
          <div className="item">
            <b>Still Set</b>
            <span>Face / Back / Base / Cabins</span>
          </div>
        </div>
      </section>

      <section className="panel card">
        <div className="section-heading">
          <h2>Required Assets</h2>
          <span>for realistic shelf feel</span>
        </div>
        <div className="list">
          <div className="item">
            <b>Beauty Turntable</b>
            <span>Offline render or image sequence</span>
          </div>
          <div className="item">
            <b>Close-up Face</b>
            <span>Matte face, glossy eyes, readable blush</span>
          </div>
          <div className="item">
            <b>Packshot</b>
            <span>Retail box or display crate version</span>
          </div>
        </div>
      </section>
    </>
  );
}

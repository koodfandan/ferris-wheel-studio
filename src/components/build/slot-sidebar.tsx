import type { ProductRecipe, RecipeSlot } from "../../lib/collector-studio";
import { SLOT_META, getPartLabel } from "../../lib/collector-studio";

type Props = {
  recipe: ProductRecipe;
  selectedSlot: RecipeSlot;
  onSelectSlot: (slot: RecipeSlot) => void;
  onSmartMatch: () => void;
};

export function SlotSidebar({ recipe, selectedSlot, onSelectSlot, onSmartMatch }: Props) {
  return (
    <aside className="slot-sidebar">
      <div className="sidebar-heading">
        <h2>Slots</h2>
        <span>switch one layer at a time</span>
      </div>

      <div className="slot-sidebar-list">
        {SLOT_META.map((slot) => (
          <button
            key={slot.id}
            type="button"
            className={`slot-sidebar-card ${selectedSlot === slot.id ? "is-active" : ""}`}
            onClick={() => onSelectSlot(slot.id)}
          >
            <strong>{slot.label}</strong>
            <em>{slot.blurb}</em>
            <span>{getPartLabel(recipe[slot.id])}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-utility">
        <p>
          Smart Match keeps the current species and palette, then swaps the active slot to another
          compatible blind-box style option.
        </p>
        <button type="button" className="secondary-button" onClick={onSmartMatch}>
          Smart Match
        </button>
      </div>
    </aside>
  );
}

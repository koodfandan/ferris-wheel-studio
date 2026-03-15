import type { SpeciesId, StageMode, StudioRecipe, StudioSection, StudioSlot } from "../../lib/studio-system";
import { SECTION_OPTIONS, SLOT_OPTIONS, SPECIES_OPTIONS, STAGE_MODE_OPTIONS } from "../../lib/studio-system";
import {
  UI_TEXT,
  getLocalizedRecipeLabel,
  getLocalizedSection,
  getLocalizedSlot,
  getLocalizedSpecies,
  getLocalizedSpeciesMiddle,
  getLocalizedStageMode,
  type Locale,
} from "../../lib/ui-copy";

const SLOT_ICONS: Record<StudioSlot, string> = {
  expression: "◉",
  silhouette: "◌",
  headpiece: "✦",
  outfit: "▣",
  prop: "✳",
  frame: "◎",
  pods: "○",
  base: "▤",
  palette: "◐",
};

const MODE_ICONS: Record<StageMode, string> = {
  assemble: "组",
  inspect: "看",
  shelf: "展",
};

type Props = {
  activeSection: StudioSection;
  activeStageMode: StageMode;
  recipe: StudioRecipe;
  selectedSlot: StudioSlot;
  locale: Locale;
  onStageModeChange: (mode: StageMode) => void;
  onSpeciesChange: (species: SpeciesId) => void;
  onSlotChange: (slot: StudioSlot) => void;
  onRandomize: () => void;
  onSmartMatch: () => void;
};

export function WorldPanel({
  activeSection,
  activeStageMode,
  recipe,
  selectedSlot,
  locale,
  onStageModeChange,
  onSpeciesChange,
  onSlotChange,
  onRandomize,
  onSmartMatch,
}: Props) {
  const sectionMeta = SECTION_OPTIONS.find((item) => item.id === activeSection) ?? SECTION_OPTIONS[1];
  const copy = UI_TEXT[locale];

  return (
    <aside className="world-panel world-panel-compact">
      <section className="world-story-card world-story-card-compact">
        <p>{getLocalizedSection(sectionMeta.id, locale)?.kicker.zh ?? sectionMeta.kicker}</p>
        <h1>{getLocalizedSection(sectionMeta.id, locale)?.label.zh ?? sectionMeta.label}</h1>
        <span className="world-story-brief">
          {getLocalizedSection(sectionMeta.id, locale)?.blurb.zh ?? sectionMeta.blurb}
        </span>
      </section>

      <section className="world-mode-strip world-mode-strip-compact">
        {STAGE_MODE_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeStageMode === item.id ? "is-active" : ""}
            onClick={() => onStageModeChange(item.id)}
          >
            <span className="world-mode-icon">{MODE_ICONS[item.id]}</span>
            <strong>{getLocalizedStageMode(item.id, locale)?.label.zh ?? item.label}</strong>
          </button>
        ))}
      </section>

      <section className="world-block">
        <div className="world-block-title world-block-title-compact">
          <strong>{copy.speciesBase}</strong>
        </div>
        <div className="species-list species-list-compact">
          {SPECIES_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={recipe.species === item.id ? "species-card species-card-compact is-active" : "species-card species-card-compact"}
              onClick={() => onSpeciesChange(item.id)}
              title={getLocalizedSpecies(item.id, locale)?.blurb.zh ?? item.blurb}
            >
              <span className="species-card-top">
                <b>{getLocalizedSpecies(item.id, locale)?.label.zh ?? item.label}</b>
                <small>{getLocalizedSpecies(item.id, locale)?.badge.zh ?? item.badge}</small>
              </span>
              <span className="species-card-middle">
                {getLocalizedSpeciesMiddle(item.id, locale, item.chinese)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="world-block">
        <div className="world-block-title world-block-title-compact">
          <strong>{copy.slotRail}</strong>
        </div>
        <div className="slot-list slot-list-compact">
          {SLOT_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={selectedSlot === item.id ? "slot-card slot-card-compact is-active" : "slot-card slot-card-compact"}
              onClick={() => onSlotChange(item.id)}
              title={getLocalizedRecipeLabel(recipe, item.id, locale)}
            >
              <span className="slot-card-main">
                <i className="slot-card-icon" aria-hidden="true">
                  {SLOT_ICONS[item.id]}
                </i>
                <strong>{getLocalizedSlot(item.id, locale)?.label.zh ?? item.label}</strong>
              </span>
              <span className="slot-card-value" aria-hidden="true">
                {getLocalizedRecipeLabel(recipe, item.id, locale)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="world-actions">
        <button type="button" className="studio-primary-button" onClick={onRandomize}>
          {copy.blindMix}
        </button>
        <button type="button" className="studio-secondary-button" onClick={onSmartMatch}>
          {copy.smartMatch}
        </button>
      </section>
    </aside>
  );
}

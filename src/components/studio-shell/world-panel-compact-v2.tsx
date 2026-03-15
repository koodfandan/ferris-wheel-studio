import type { SpeciesId, StageMode, StudioRecipe, StudioSection, StudioSlot } from "../../lib/studio-system";
import { SECTION_OPTIONS, SLOT_OPTIONS, SPECIES_OPTIONS, STAGE_MODE_OPTIONS } from "../../lib/studio-system";
import {
  UI_TEXT,
  getLocalizedSection,
  getLocalizedSlot,
  getLocalizedSpecies,
  getLocalizedSpeciesMiddle,
  getLocalizedStageMode,
  type Locale,
} from "../../lib/ui-copy";

const SLOT_ICONS: Record<StudioSlot, string> = {
  expression: "E",
  silhouette: "S",
  headpiece: "H",
  outfit: "O",
  prop: "P",
  frame: "F",
  pods: "C",
  base: "B",
  palette: "L",
};

const MODE_ICONS: Record<StageMode, string> = {
  assemble: "A",
  inspect: "I",
  shelf: "S",
};

const SPECIES_ICONS: Record<SpeciesId, string> = {
  human: "H",
  animal: "A",
  creature: "C",
  robot: "R",
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
      <section className="world-story-strip" title={getLocalizedSection(sectionMeta.id, locale)?.blurb.zh ?? sectionMeta.blurb}>
        <span className="world-story-strip-kicker">
          {getLocalizedSection(sectionMeta.id, locale)?.kicker.zh ?? sectionMeta.kicker}
        </span>
        <strong>{getLocalizedSection(sectionMeta.id, locale)?.label.zh ?? sectionMeta.label}</strong>
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
              className={
                recipe.species === item.id
                  ? "species-card species-card-compact is-active"
                  : "species-card species-card-compact"
              }
              onClick={() => onSpeciesChange(item.id)}
              title={getLocalizedSpecies(item.id, locale)?.blurb.zh ?? item.blurb}
            >
              <span className="species-card-icon" aria-hidden="true">
                {SPECIES_ICONS[item.id]}
              </span>
              <span className="species-card-label">
                {getLocalizedSpecies(item.id, locale)?.label.zh ?? item.label}
              </span>
              <span className="species-card-tag">
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
              className={
                selectedSlot === item.id
                  ? "slot-card slot-card-compact is-active"
                  : "slot-card slot-card-compact"
              }
              onClick={() => onSlotChange(item.id)}
            >
              <span className="slot-card-main">
                <i className="slot-card-icon" aria-hidden="true">
                  {SLOT_ICONS[item.id]}
                </i>
                <strong>{getLocalizedSlot(item.id, locale)?.label.zh ?? item.label}</strong>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="world-actions">
        <button type="button" className="studio-primary-button studio-primary-button-compact" onClick={onRandomize}>
          {copy.blindMix}
        </button>
        <button type="button" className="studio-secondary-button studio-secondary-button-compact" onClick={onSmartMatch}>
          {copy.smartMatch}
        </button>
      </section>
    </aside>
  );
}

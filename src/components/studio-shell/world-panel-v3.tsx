import type { SpeciesId, StageMode, StudioRecipe, StudioSection, StudioSlot } from "../../lib/studio-system";
import { SECTION_OPTIONS, SLOT_OPTIONS, SPECIES_OPTIONS, STAGE_MODE_OPTIONS } from "../../lib/studio-system";
import {
  UI_TEXT,
  getLocalizedSection,
  getLocalizedSlot,
  getLocalizedSpecies,
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
    <aside className="world-panel world-panel-icon-rail">
      <div
        className="world-rail-badge"
        title={getLocalizedSection(sectionMeta.id, locale)?.label.zh ?? sectionMeta.label}
      >
        {getLocalizedSection(sectionMeta.id, locale)?.kicker.zh?.slice(0, 1) ?? sectionMeta.kicker.slice(0, 1)}
      </div>

      <section className="world-icon-group" aria-label={locale === "zh" ? "模式" : "Modes"}>
        {STAGE_MODE_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeStageMode === item.id ? "world-icon-button is-active" : "world-icon-button"}
            onClick={() => onStageModeChange(item.id)}
            title={getLocalizedStageMode(item.id, locale)?.label.zh ?? item.label}
          >
            <span className="world-icon-token" aria-hidden="true">
              {MODE_ICONS[item.id]}
            </span>
            <span className="world-icon-label">
              {getLocalizedStageMode(item.id, locale)?.label.zh ?? item.label}
            </span>
          </button>
        ))}
      </section>

      <section className="world-icon-group" aria-label={copy.speciesBase}>
        {SPECIES_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={recipe.species === item.id ? "world-icon-button is-active" : "world-icon-button"}
            onClick={() => onSpeciesChange(item.id)}
            title={getLocalizedSpecies(item.id, locale)?.label.zh ?? item.label}
          >
            <span className="world-icon-token" aria-hidden="true">
              {SPECIES_ICONS[item.id]}
            </span>
            <span className="world-icon-label">
              {getLocalizedSpecies(item.id, locale)?.label.zh ?? item.label}
            </span>
          </button>
        ))}
      </section>

      <section className="world-icon-group world-icon-group-slots" aria-label={copy.slotRail}>
        {SLOT_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={selectedSlot === item.id ? "world-icon-button is-active" : "world-icon-button"}
            onClick={() => onSlotChange(item.id)}
            title={getLocalizedSlot(item.id, locale)?.label.zh ?? item.label}
          >
            <span className="world-icon-token" aria-hidden="true">
              {SLOT_ICONS[item.id]}
            </span>
            <span className="world-icon-label">
              {getLocalizedSlot(item.id, locale)?.label.zh ?? item.label}
            </span>
          </button>
        ))}
      </section>

      <section className="world-icon-actions">
        <button
          type="button"
          className="world-icon-action world-icon-action-primary"
          onClick={onRandomize}
          title={copy.blindMix}
        >
          <span className="world-icon-token" aria-hidden="true">B</span>
          <span className="world-icon-label">{copy.blindMix}</span>
        </button>
        <button
          type="button"
          className="world-icon-action"
          onClick={onSmartMatch}
          title={copy.smartMatch}
        >
          <span className="world-icon-token" aria-hidden="true">M</span>
          <span className="world-icon-label">{copy.smartMatch}</span>
        </button>
      </section>
    </aside>
  );
}

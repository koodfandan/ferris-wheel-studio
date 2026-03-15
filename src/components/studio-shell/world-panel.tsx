import type {
  SpeciesId,
  StageMode,
  StudioRecipe,
  StudioSection,
  StudioSlot,
} from "../../lib/studio-system";
import type { SpatialRepairAdvice } from "../../lib/spatial-guard";
import {
  SECTION_OPTIONS,
  SLOT_OPTIONS,
  SPECIES_OPTIONS,
  STAGE_MODE_OPTIONS,
} from "../../lib/studio-system";
import {
  UI_TEXT,
  getLocalizedRecipeLabel,
  getLocalizedSection,
  getLocalizedSlot,
  getLocalizedSpecies,
  getLocalizedSpeciesMiddle,
  getLocalizedStageMode,
  localizeFreeText,
  type Locale,
} from "../../lib/ui-copy";

type Props = {
  activeSection: StudioSection;
  activeStageMode: StageMode;
  recipe: StudioRecipe;
  selectedSlot: StudioSlot;
  guardMessage: string;
  guardAdvice: SpatialRepairAdvice[];
  blockedOptionCount: number;
  locale: Locale;
  onApplyAdvice: (advice: SpatialRepairAdvice) => void;
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
  guardMessage,
  guardAdvice,
  blockedOptionCount,
  locale,
  onApplyAdvice,
  onStageModeChange,
  onSpeciesChange,
  onSlotChange,
  onRandomize,
  onSmartMatch,
}: Props) {
  const sectionMeta = SECTION_OPTIONS.find((item) => item.id === activeSection) ?? SECTION_OPTIONS[1];
  const autoAdvice = guardAdvice.filter((item) => item.kind === "auto");
  const suggestedAdvice = guardAdvice.filter((item) => item.kind === "suggested");
  const copy = UI_TEXT[locale];

  return (
    <aside className="world-panel">
      <section className="world-story-card">
        <p>{getLocalizedSection(sectionMeta.id, locale)?.kicker.zh ?? sectionMeta.kicker}</p>
        <h1>{getLocalizedSection(sectionMeta.id, locale)?.label.zh ?? sectionMeta.label}</h1>
        <span>{getLocalizedSection(sectionMeta.id, locale)?.blurb.zh ?? sectionMeta.blurb}</span>
      </section>

      <section className="world-mode-strip">
        {STAGE_MODE_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeStageMode === item.id ? "is-active" : ""}
            onClick={() => onStageModeChange(item.id)}
          >
            <strong>{getLocalizedStageMode(item.id, locale)?.label.zh ?? item.label}</strong>
            <small>{getLocalizedStageMode(item.id, locale)?.blurb.zh ?? item.blurb}</small>
          </button>
        ))}
      </section>

      <section className="world-block">
        <div className="world-block-title">
          <strong>{copy.speciesBase}</strong>
          <span>{copy.speciesHelp}</span>
        </div>
        <div className="species-list">
          {SPECIES_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={recipe.species === item.id ? "species-card is-active" : "species-card"}
              onClick={() => onSpeciesChange(item.id)}
            >
              <span className="species-card-top">
                <b>{getLocalizedSpecies(item.id, locale)?.label.zh ?? item.label}</b>
                <small>{getLocalizedSpecies(item.id, locale)?.badge.zh ?? item.badge}</small>
              </span>
              <span className="species-card-middle">{getLocalizedSpeciesMiddle(item.id, locale, item.chinese)}</span>
              <span className="species-card-bottom">{getLocalizedSpecies(item.id, locale)?.blurb.zh ?? item.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="world-block">
        <div className="world-block-title">
          <strong>{copy.slotRail}</strong>
          <span>{copy.slotHelp}</span>
        </div>
        <div className="slot-list">
          {SLOT_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={selectedSlot === item.id ? "slot-card is-active" : "slot-card"}
              onClick={() => onSlotChange(item.id)}
            >
              <span className="slot-card-head">
                <strong>{getLocalizedSlot(item.id, locale)?.label.zh ?? item.label}</strong>
                <small>{getLocalizedSlot(item.id, locale)?.blurb.zh ?? item.blurb}</small>
              </span>
              <span className="slot-card-value">{getLocalizedRecipeLabel(recipe, item.id, locale)}</span>
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

      <section className="world-guard-note">
        <strong>{copy.spatialGuard}</strong>
        <span>{localizeFreeText(guardMessage, locale)}</span>
        <small>
          {blockedOptionCount
            ? locale === "zh"
              ? `${blockedOptionCount} 个选项在 ${getLocalizedSlot(selectedSlot, locale)?.label.zh ?? selectedSlot} 中被拦截。`
              : `${blockedOptionCount} options are blocked in ${SLOT_OPTIONS.find((item) => item.id === selectedSlot)?.label ?? selectedSlot}.`
            : copy.noBlocked}
        </small>
        {autoAdvice.length ? (
          <div className="world-guard-advice">
            <p className="world-guard-group-label">{copy.autoFixed}</p>
            {autoAdvice.slice(0, 3).map((advice) => (
              <button
                key={`${advice.kind}-${advice.slot}-${advice.id}`}
                type="button"
                className="world-guard-advice-item"
                onClick={() => onApplyAdvice(advice)}
              >
                <strong>{`${localizeFreeText(advice.fromLabel, locale)} -> ${localizeFreeText(advice.label, locale)}`}</strong>
                <span>{localizeFreeText(advice.reason, locale)}</span>
              </button>
            ))}
          </div>
        ) : null}
        {suggestedAdvice.length ? (
          <div className="world-guard-advice">
            <p className="world-guard-group-label">{copy.suggestedFix}</p>
            {suggestedAdvice.slice(0, 3).map((advice) => (
              <button
                key={`${advice.kind}-${advice.slot}-${advice.id}`}
                type="button"
                className="world-guard-advice-item"
                onClick={() => onApplyAdvice(advice)}
              >
                <strong>{`${localizeFreeText(advice.fromLabel, locale)} -> ${localizeFreeText(advice.label, locale)}`}</strong>
                <span>{localizeFreeText(advice.reason, locale)}</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </aside>
  );
}

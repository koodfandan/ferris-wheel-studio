import { useMemo } from "react";
import type { SpatialRegistry } from "../../lib/asset-registry";
import type {
  StageMode,
  StudioRecipe,
  StudioSection,
  StudioSlot,
} from "../../lib/studio-system";
import { SECTION_OPTIONS, SLOT_OPTIONS, getPaletteOption } from "../../lib/studio-system";
import {
  UI_TEXT,
  getLocalizedPaletteMeta,
  getLocalizedRecipeLabel,
  getLocalizedSection,
  getLocalizedSlot,
  localizeFreeText,
  type Locale,
} from "../../lib/ui-copy";
import { createStageLayout } from "../stage-engine/stage-layout";
import { StageCanvas } from "../stage-engine/stage-canvas";
import type { BlindboxPhase } from "../../features/blindbox/blindbox.types";

type Props = {
  activeSection: StudioSection;
  activeStageMode: StageMode;
  recipe: StudioRecipe;
  displayRecipe: StudioRecipe;
  selectedSlot: StudioSlot;
  spatialRegistry: SpatialRegistry;
  spatialStatusLabel: string;
  locale: Locale;
};

export function StageShell({
  activeSection,
  activeStageMode,
  recipe,
  displayRecipe,
  selectedSlot,
  spatialRegistry,
  spatialStatusLabel,
  locale,
}: Props) {
  const sectionMeta = SECTION_OPTIONS.find((item) => item.id === activeSection) ?? SECTION_OPTIONS[1];
  const selectedSlotMeta = SLOT_OPTIONS.find((item) => item.id === selectedSlot) ?? SLOT_OPTIONS[0];
  const palette = getPaletteOption(displayRecipe.palette);
  const copy = UI_TEXT[locale];
  const layout = useMemo(
    () =>
      createStageLayout(
        displayRecipe.base,
        displayRecipe.frame,
        displayRecipe.species,
        displayRecipe.prop,
        spatialRegistry,
      ),
    [displayRecipe.base, displayRecipe.frame, displayRecipe.prop, displayRecipe.species, spatialRegistry],
  );

  return (
    <section className="stage-shell">
      <header className="stage-shell-header">
        <div>
          <p>{getLocalizedSection(sectionMeta.id, locale)?.kicker.zh ?? sectionMeta.kicker}</p>
          <h2>{`${getLocalizedPaletteMeta(displayRecipe.palette, locale)?.label.zh ?? palette.label} ${copy.showcaseSuffix}`}</h2>
          <span>
            {(getLocalizedSlot(selectedSlotMeta.id, locale)?.label.zh ?? selectedSlotMeta.label)} {copy.activeSlotNotice}
          </span>
        </div>

        <div className="stage-shell-metrics">
          <div>
            <small>{copy.currentFinish}</small>
            <strong>{getLocalizedPaletteMeta(displayRecipe.palette, locale)?.finish.zh ?? palette.finish}</strong>
          </div>
          <div>
            <small>{copy.activeSlot}</small>
            <strong>{getLocalizedSlot(selectedSlotMeta.id, locale)?.label.zh ?? selectedSlotMeta.label}</strong>
          </div>
          <div>
            <small>{copy.savedBase}</small>
            <strong>{getLocalizedRecipeLabel(recipe, "base", locale)}</strong>
          </div>
          <div>
            <small>{copy.spatialStatus}</small>
            <strong>{layout.warnings.length ? `${layout.warnings.length}${copy.warnings}` : copy.clean}</strong>
          </div>
        </div>
      </header>

      <div className="stage-shell-view">
        <div className="stage-shell-ticket stage-shell-ticket-left">
          <span>{copy.workbench}</span>
          <strong>{locale === "zh" ? (activeStageMode === "assemble" ? "拼装" : activeStageMode === "inspect" ? "检视" : "陈列") : activeStageMode}</strong>
        </div>
        <div className="stage-shell-ticket stage-shell-ticket-right">
          <span>{copy.previewing}</span>
          <strong>{getLocalizedRecipeLabel(displayRecipe, selectedSlot, locale)}</strong>
        </div>

        <StageCanvas
          recipe={displayRecipe}
          focusSlot={selectedSlot}
          stageMode={activeStageMode}
          layout={layout}
          locale={locale}
          blindboxActive={false}
          blindboxPhase={"idle" as BlindboxPhase}
          blindboxToken={0}
          blindboxRarity={null}
        />
      </div>

      <footer className="stage-shell-footer">
        <div>
          <strong>{copy.stageNote}</strong>
          <span>{copy.stageNoteBlurb}</span>
        </div>
        <div>
          <strong>{copy.displayNote}</strong>
          <span>{copy.displayNoteBlurb}</span>
        </div>
        <div>
          <strong>{copy.spatialRegistry}</strong>
          <span>{spatialStatusLabel}</span>
        </div>
        <div>
          <strong>{copy.clearanceCheck}</strong>
          <span>
            {layout.warnings.length
              ? layout.warnings.map((warning) => localizeFreeText(warning.message, locale)).join(" ")
              : copy.clearanceOk}
          </span>
        </div>
      </footer>
    </section>
  );
}

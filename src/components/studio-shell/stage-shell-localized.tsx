import type { StageLayout } from "../stage-engine/stage-layout";
import type { StageMode, StudioRecipe, StudioSection, StudioSlot } from "../../lib/studio-system";
import { SECTION_OPTIONS, SLOT_OPTIONS, getPaletteOption } from "../../lib/studio-system";
import {
  UI_TEXT,
  getLocalizedPaletteMeta,
  getLocalizedRecipeLabel,
  getLocalizedSection,
  getLocalizedSlot,
  getLocalizedStageMode,
  type Locale,
} from "../../lib/ui-copy";
import { StageCanvas } from "../stage-engine/stage-canvas";
import type { BlindboxPhase } from "../../features/blindbox/blindbox.types";

type Props = {
  activeSection: StudioSection;
  activeStageMode: StageMode;
  displayRecipe: StudioRecipe;
  selectedSlot: StudioSlot;
  layout: StageLayout;
  locale: Locale;
};

export function StageShell({
  activeSection,
  activeStageMode,
  displayRecipe,
  selectedSlot,
  layout,
  locale,
}: Props) {
  const sectionMeta = SECTION_OPTIONS.find((item) => item.id === activeSection) ?? SECTION_OPTIONS[1];
  const selectedSlotMeta = SLOT_OPTIONS.find((item) => item.id === selectedSlot) ?? SLOT_OPTIONS[0];
  const palette = getPaletteOption(displayRecipe.palette);
  const copy = UI_TEXT[locale];

  return (
    <section className="stage-shell">
      <header className="stage-shell-header">
        <div className="stage-shell-header-copy">
          <p>{getLocalizedSection(sectionMeta.id, locale)?.kicker.zh ?? sectionMeta.kicker}</p>
          <h2>
            {getLocalizedPaletteMeta(displayRecipe.palette, locale)?.label.zh ?? palette.label}{" "}
            {copy.showcaseSuffix}
          </h2>
          <span className="stage-shell-header-note">
            {getLocalizedSlot(selectedSlotMeta.id, locale)?.label.zh ?? selectedSlotMeta.label}{" "}
            {copy.activeSlotNotice}
          </span>
        </div>
      </header>

      <div className="stage-shell-view">
        <div className="stage-shell-ticket stage-shell-ticket-left">
          <span>{copy.workbench}</span>
          <strong>{getLocalizedStageMode(activeStageMode, locale)?.label.zh ?? activeStageMode}</strong>
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
    </section>
  );
}

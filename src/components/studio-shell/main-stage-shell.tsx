import type { StageLayout } from "../stage-engine/stage-layout";
import { getPaletteOption, type StageMode, type StudioRecipe, type StudioSection, type StudioSlot } from "../../lib/studio-system";
import type { CharacterPrototypeId } from "../../lib/character-prototypes-v2";
import { StageCanvas } from "../stage-engine/stage-canvas";
import { type Locale } from "../../lib/i18n-values";
import { UnboxShell } from "../../features/blindbox/components/unbox-shell";
import type { BlindboxPhase, BlindboxRarity } from "../../features/blindbox/blindbox.types";


type Props = {
  activeSection: StudioSection;
  activeStageMode: StageMode;
  displayRecipe: StudioRecipe;
  selectedSlot: StudioSlot;
  layout: StageLayout;
  locale: Locale;
  activePrototype: CharacterPrototypeId;
  blindboxActive: boolean;
  blindboxPhase: BlindboxPhase;
  blindboxToken: number;
  blindboxSelectedBoxIndex: number;
  blindboxRarity: BlindboxRarity | null;
};

export function StageShell({
  activeStageMode,
  displayRecipe,
  selectedSlot,
  layout,
  locale,
  activePrototype,
  blindboxActive,
  blindboxPhase,
  blindboxToken,
  blindboxSelectedBoxIndex,
  blindboxRarity,
}: Props) {
  const palette = getPaletteOption(displayRecipe.palette);

  return (
    <section className="main-stage-shell">
      <div className="main-stage-view">
        <StageCanvas
          recipe={displayRecipe}
          focusSlot={selectedSlot}
          stageMode={activeStageMode}
          layout={layout}
          locale={locale}
          activePrototype={activePrototype}
          blindboxActive={blindboxActive}
          blindboxPhase={blindboxPhase}
          blindboxToken={blindboxToken}
          blindboxRarity={blindboxRarity}
        />
        <UnboxShell
          active={blindboxActive}
          phase={blindboxPhase}
          token={blindboxToken}
          locale={locale}
          selectedBoxIndex={blindboxSelectedBoxIndex}
          rarity={blindboxRarity}
          accent={palette.colors.accent}
          accentSoft={palette.colors.accentSoft}
          accentStrong={palette.colors.accentStrong}
          glow={palette.colors.glow}
          glowSoft={palette.colors.glowSoft}
        />
      </div>
    </section>
  );
}

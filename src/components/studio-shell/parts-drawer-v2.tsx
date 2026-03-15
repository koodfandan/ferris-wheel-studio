import { useState } from "react";
import type { SpatialAutoFixRecord, SpatialOptionState, SpatialRepairAdvice } from "../../lib/spatial-guard";
import type { StageLayout } from "../stage-engine/stage-layout";
import type { PartSlot, StudioRecipe, StudioSlot } from "../../lib/studio-system";
import { PALETTE_OPTIONS, SLOT_OPTIONS, SPECIES_OPTIONS, getSlotOptions } from "../../lib/studio-system";
import {
  UI_TEXT,
  getLocalizedPaletteMeta,
  getLocalizedPartMeta,
  getLocalizedRecipeLabel,
  getLocalizedSlot,
  getLocalizedSpecies,
  localizeFreeText,
  type Locale,
} from "../../lib/ui-copy";
import { RecipeLedger } from "./recipe-ledger";

type RightRailTab = "parts" | "status" | "collection" | "history";

const RAIL_TAB_ICONS: Record<RightRailTab, string> = {
  parts: "P",
  status: "S",
  collection: "C",
  history: "H",
};

type Props = {
  recipe: StudioRecipe;
  displayRecipe: StudioRecipe;
  layout: StageLayout;
  spatialStatusLabel: string;
  selectedSlot: StudioSlot;
  optionStates: SpatialOptionState[];
  guardMessage: string;
  guardAdvice: SpatialRepairAdvice[];
  autoFixHistory: SpatialAutoFixRecord[];
  locale: Locale;
  onApplyAdvice: (advice: SpatialRepairAdvice) => void;
  onPartCommit: (slot: StudioSlot, id: string) => void;
  onPartPreview: (slot: StudioSlot, id: string | null) => void;
};

export function PartsDrawer({
  recipe,
  displayRecipe,
  layout,
  spatialStatusLabel,
  selectedSlot,
  optionStates,
  guardMessage,
  guardAdvice,
  autoFixHistory,
  locale,
  onApplyAdvice,
  onPartCommit,
  onPartPreview,
}: Props) {
  const [activeTab, setActiveTab] = useState<RightRailTab>("parts");
  const selectedMeta = SLOT_OPTIONS.find((item) => item.id === selectedSlot) ?? SLOT_OPTIONS[0];
  const speciesMeta = SPECIES_OPTIONS.find((item) => item.id === recipe.species) ?? SPECIES_OPTIONS[0];
  const displayPaletteMeta = getLocalizedPaletteMeta(displayRecipe.palette, locale);
  const optionStateMap = new Map(optionStates.map((state) => [state.id, state]));
  const blockedCount = optionStates.filter((state) => state.disabled).length;
  const autoAdvice = guardAdvice.filter((item) => item.kind === "auto");
  const suggestedAdvice = guardAdvice.filter((item) => item.kind === "suggested");
  const copy = UI_TEXT[locale];
  const railTabs: Array<{ id: RightRailTab; label: string }> = [
    { id: "parts", label: locale === "zh" ? "零件" : "Parts" },
    { id: "status", label: locale === "zh" ? "状态" : "Status" },
    { id: "collection", label: locale === "zh" ? "收藏" : "Collection" },
    { id: "history", label: locale === "zh" ? "历史" : "History" },
  ];

  const options = selectedSlot === "palette" ? [] : getSlotOptions(recipe.species, selectedSlot as PartSlot);

  return (
    <aside className="parts-drawer">
      <div className="parts-drawer-shell">
        <nav className="parts-drawer-tabs parts-drawer-tabs-vertical" aria-label={locale === "zh" ? "右侧导航" : "Right rail tabs"}>
          {railTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "is-active" : ""}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="parts-tab-icon" aria-hidden="true">
                {RAIL_TAB_ICONS[tab.id]}
              </span>
              <span className="parts-tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="parts-drawer-panel">
          {activeTab === "parts" ? (
            <>
              <DrawerHeader
                title={
                  selectedSlot === "palette"
                    ? copy.paletteLibrary
                    : getLocalizedSlot(selectedMeta.id, locale)?.label.zh ?? selectedMeta.label
                }
                blurb={
                  selectedSlot === "palette"
                    ? copy.paletteLibraryBlurb
                    : getLocalizedSlot(selectedMeta.id, locale)?.blurb.zh ?? selectedMeta.blurb
                }
                extra={getLocalizedSpecies(recipe.species, locale)?.label.zh ?? speciesMeta.label}
                locale={locale}
              />

              {selectedSlot !== "palette" && blockedCount ? (
                <div className="parts-guard-banner">
                  <strong>{`${blockedCount} ${copy.blockedOptions}`}</strong>
                  <span>{copy.blockedHelp}</span>
                </div>
              ) : null}

              {selectedSlot === "palette" ? (
                <div className="palette-grid">
                  {PALETTE_OPTIONS.map((item) => {
                    const selected = recipe.palette === item.id;
                    const state = optionStateMap.get(item.id);
                    const disabled = state?.disabled ?? false;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={buildCardClass("palette-card", selected, disabled)}
                        disabled={disabled}
                        title={state?.warnings[0]?.message}
                        onMouseEnter={() => {
                          if (!disabled) onPartPreview("palette", item.id);
                        }}
                        onMouseLeave={() => onPartPreview("palette", null)}
                        onClick={() => {
                          if (!disabled) onPartCommit("palette", item.id);
                        }}
                      >
                        <span className="palette-card-swatches">
                          <i style={{ background: item.colors.accent }} />
                          <i style={{ background: item.colors.body }} />
                          <i style={{ background: item.colors.glow }} />
                        </span>
                        <strong>{getLocalizedPaletteMeta(item.id, locale)?.label.zh ?? item.label}</strong>
                        <small>{getLocalizedPaletteMeta(item.id, locale)?.finish.zh ?? item.finish}</small>
                        <span>{getLocalizedPaletteMeta(item.id, locale)?.blurb.zh ?? item.blurb}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="parts-grid">
                  {options.map((item) => {
                    const selected = recipe[selectedSlot] === item.id;
                    const state = optionStateMap.get(item.id);
                    const disabled = state?.disabled ?? false;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={buildCardClass("part-card", selected, disabled)}
                        disabled={disabled}
                        title={state?.warnings[0]?.message}
                        onMouseEnter={() => {
                          if (!disabled) onPartPreview(selectedSlot, item.id);
                        }}
                        onMouseLeave={() => onPartPreview(selectedSlot, null)}
                        onClick={() => {
                          if (!disabled) onPartCommit(selectedSlot, item.id);
                        }}
                      >
                        <span className="part-card-preview" style={{ background: item.chip }} />
                        <span className="part-card-head">
                          <strong>{getLocalizedPartMeta(item.id, locale)?.label ?? item.label}</strong>
                          <small>{getLocalizedPartMeta(item.id, locale)?.badge ?? item.badge}</small>
                        </span>
                        <span className="part-card-body">{getLocalizedPartMeta(item.id, locale)?.blurb ?? item.blurb}</span>
                        {item.spatialTag ? <span className="part-card-spatial-tag">{localizeFreeText(item.spatialTag, locale)}</span> : null}
                        {disabled ? (
                          <div className="part-card-warning-stack">
                            <span className="part-card-warning">{copy.blockedByGuard}</span>
                            {state?.conflictTags.slice(0, 2).map((tag) => (
                              <span key={tag} className="part-card-conflict">
                                {localizeFreeText(tag, locale)}
                              </span>
                            ))}
                            {state?.details?.slice(0, 1).map((detail) => (
                              <span key={detail} className="part-card-detail">
                                {localizeFreeText(detail, locale)}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : null}

          {activeTab === "status" ? (
            <>
              <DrawerHeader
                title={locale === "zh" ? "状态面板" : "Status Panel"}
                blurb={locale === "zh" ? "查看当前舞台、净空和自动修复状态。" : "Review the live stage, clearance, and repair status."}
                extra={getLocalizedSpecies(recipe.species, locale)?.label.zh ?? speciesMeta.label}
                locale={locale}
              />
              <section className="parts-metrics-card">
                <div className="parts-metrics-grid">
                  <div className="parts-metric">
                    <small>{copy.currentFinish}</small>
                    <strong>{displayPaletteMeta?.finish.zh ?? displayRecipe.palette}</strong>
                  </div>
                  <div className="parts-metric">
                    <small>{copy.activeSlot}</small>
                    <strong>{getLocalizedSlot(selectedMeta.id, locale)?.label.zh ?? selectedMeta.label}</strong>
                  </div>
                  <div className="parts-metric">
                    <small>{copy.savedBase}</small>
                    <strong>{getLocalizedRecipeLabel(recipe, "base", locale)}</strong>
                  </div>
                  <div className="parts-metric">
                    <small>{copy.spatialStatus}</small>
                    <strong>{layout.warnings.length ? `${layout.warnings.length}${copy.warnings}` : copy.clean}</strong>
                  </div>
                </div>
                <div className="parts-info-chips">
                  <div className="parts-info-chip">
                    <strong>{copy.stageNote}</strong>
                    <span>{copy.stageNoteBlurb}</span>
                  </div>
                  <div className="parts-info-chip">
                    <strong>{copy.displayNote}</strong>
                    <span>{copy.displayNoteBlurb}</span>
                  </div>
                  <div className="parts-info-chip">
                    <strong>{copy.spatialRegistry}</strong>
                    <span>{localizeFreeText(spatialStatusLabel, locale)}</span>
                  </div>
                  <div className="parts-info-chip">
                    <strong>{copy.clearanceCheck}</strong>
                    <span>
                      {layout.warnings.length
                        ? layout.warnings.map((warning) => localizeFreeText(warning.message, locale)).join(" ")
                        : copy.clearanceOk}
                    </span>
                  </div>
                </div>
              </section>

              <div className="drawer-footer-card">
                <strong>{copy.spatialGuard}</strong>
                <span>{localizeFreeText(guardMessage, locale)}</span>
                {autoAdvice.length ? (
                  <div className="drawer-advice-list">
                    <p className="world-guard-group-label">{copy.autoFixed}</p>
                    {autoAdvice.slice(0, 2).map((advice) => (
                      <button
                        key={`${advice.kind}-${advice.slot}-${advice.id}`}
                        type="button"
                        className="drawer-advice-item"
                        onClick={() => onApplyAdvice(advice)}
                      >
                        <b>{`${localizeFreeText(advice.fromLabel, locale)} -> ${localizeFreeText(advice.label, locale)}`}</b>
                        <small>{localizeFreeText(advice.reason, locale)}</small>
                      </button>
                    ))}
                  </div>
                ) : null}
                {suggestedAdvice.length ? (
                  <div className="drawer-advice-list">
                    <p className="world-guard-group-label">{copy.suggestedFix}</p>
                    {suggestedAdvice.slice(0, 2).map((advice) => (
                      <button
                        key={`${advice.kind}-${advice.slot}-${advice.id}`}
                        type="button"
                        className="drawer-advice-item"
                        onClick={() => onApplyAdvice(advice)}
                      >
                        <b>{`${localizeFreeText(advice.fromLabel, locale)} -> ${localizeFreeText(advice.label, locale)}`}</b>
                        <small>{localizeFreeText(advice.reason, locale)}</small>
                      </button>
                    ))}
                  </div>
                ) : null}
                <small>
                  {copy.currentSelection}: {getLocalizedRecipeLabel(recipe, selectedSlot, locale)}
                </small>
              </div>
            </>
          ) : null}

          {activeTab === "collection" ? (
            <RecipeLedger recipe={recipe} autoFixHistory={autoFixHistory} locale={locale} compact view="collection" />
          ) : null}

          {activeTab === "history" ? (
            <RecipeLedger recipe={recipe} autoFixHistory={autoFixHistory} locale={locale} compact view="history" />
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function buildCardClass(base: string, active: boolean, disabled: boolean) {
  if (disabled) return `${base} is-disabled`;
  if (active) return `${base} is-active`;
  return base;
}

function DrawerHeader({
  title,
  blurb,
  extra,
  locale,
}: {
  title: string;
  blurb: string;
  extra: string;
  locale: Locale;
}) {
  const copy = UI_TEXT[locale];

  return (
    <div className="parts-drawer-header">
      <div>
        <p>{copy.partsLibrary}</p>
        <h3>{title}</h3>
        <span>{blurb}</span>
      </div>
      <small>{extra}</small>
    </div>
  );
}

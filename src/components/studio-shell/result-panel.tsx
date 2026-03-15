import { useState } from "react";
import type { SpatialAutoFixRecord, SpatialOptionState, SpatialRepairAdvice } from "../../lib/spatial-guard";
import type { StageLayout } from "../stage-engine/stage-layout";
import type { PartSlot, StudioRecipe, StudioSlot } from "../../lib/studio-system";
import { PALETTE_OPTIONS, getSlotOptions } from "../../lib/studio-system";
import { RecipeLedger } from "./recipe-ledger";
import { localizePhrase, localizeValue } from "../../lib/i18n-values";

type Locale = "zh" | "en";
type PanelTab = "parts" | "status" | "collection" | "history";
type Rarity = "basic" | "rare" | "secret";

const TAB_LABELS: Record<PanelTab, { zh: string; en: string }> = {
  parts: { zh: "零件库", en: "Parts" },
  status: { zh: "状态", en: "Status" },
  collection: { zh: "当前收藏", en: "Build" },
  history: { zh: "修复历史", en: "History" },
};

type Props = {
  recipe: StudioRecipe;
  layout: StageLayout;
  spatialStatusLabel: string;
  selectedSlot: StudioSlot;
  activePrototype?: import("../../lib/character-prototypes-v2").CharacterPrototypeId;
  optionStates: SpatialOptionState[];
  guardMessage: string;
  guardAdvice: SpatialRepairAdvice[];
  autoFixHistory: SpatialAutoFixRecord[];
  locale: Locale;
  onBlindMix: () => void;
  onApplyAdvice: (advice: SpatialRepairAdvice) => void;
  onPartCommit: (slot: StudioSlot, id: string) => void;
  onPartPreview: (slot: StudioSlot, id: string | null) => void;
  blindMixDisabled: boolean;
};

export function ResultPanel({
  recipe,
  layout,
  spatialStatusLabel,
  selectedSlot,
  activePrototype,
  optionStates,
  guardMessage,
  guardAdvice,
  autoFixHistory,
  locale,
  onBlindMix,
  onApplyAdvice,
  onPartCommit,
  onPartPreview,
  blindMixDisabled,
}: Props) {
  const [activeTab, setActiveTab] = useState<PanelTab>("parts");
  const optionStateMap = new Map(optionStates.map((item) => [item.id, item]));
  const options = selectedSlot === "palette" ? [] : getSlotOptions(recipe.species, selectedSlot as PartSlot, activePrototype);

  return (
    <aside className="result-panel">
      <div className="result-panel-tabs">
        {(Object.keys(TAB_LABELS) as PanelTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {locale === "zh" ? TAB_LABELS[tab].zh : TAB_LABELS[tab].en}
          </button>
        ))}
      </div>

      <div className="result-panel-body">
        {activeTab === "parts" ? (
          <section className="result-card-stack">
            <div className="blindbox-strip">
              <div className="blindbox-strip-copy">
                <strong>{locale === "zh" ? "盲盒抽取" : "Blind Box Draw"}</strong>
                <span>
                  {locale === "zh" ? "点击再抽一次，刷新整套风格" : "Draw again to refresh the full style"}
                </span>
              </div>
              <button type="button" className="blindbox-draw-button" onClick={onBlindMix} disabled={blindMixDisabled}>
                {locale === "zh" ? "再抽一次" : "Draw Again"}
              </button>
            </div>

            <div className="blindbox-prob-card">
              {buildRarityRows(locale).map((row) => (
                <div key={row.id} className="blindbox-prob-row" title={row.label}>
                  <span>{row.label}</span>
                  <div className="blindbox-prob-track">
                    <i style={{ width: `${row.value}%` }} />
                  </div>
                  <b>{row.value}%</b>
                </div>
              ))}
            </div>

            {selectedSlot === "palette" ? (
              <div className="result-part-grid result-palette-grid">
                {PALETTE_OPTIONS.map((item) => {
                  const selected = recipe.palette === item.id;
                  const state = optionStateMap.get(item.id);
                  const disabled = state?.disabled ?? false;
                  const rarity = getRarityById(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={selected ? "result-part-card is-active is-visual-only" : "result-part-card is-visual-only"}
                      disabled={disabled}
                      aria-label={localizeValue(item.id, locale)}
                      title={localizeValue(item.id, locale)}
                      onMouseEnter={() => !disabled && onPartPreview("palette", item.id)}
                      onMouseLeave={() => onPartPreview("palette", null)}
                      onClick={() => !disabled && onPartCommit("palette", item.id)}
                    >
                      <span className={`rarity-dot rarity-${rarity}`} />
                      <span className="result-swatches">
                        <i style={{ background: item.colors.accent }} />
                        <i style={{ background: item.colors.body }} />
                        <i style={{ background: item.colors.glow }} />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="result-part-grid">
                {options.map((item) => {
                  const selected = recipe[selectedSlot] === item.id;
                  const state = optionStateMap.get(item.id);
                  const disabled = state?.disabled ?? false;
                  const rarity = getRarityById(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={selected ? "result-part-card is-active is-visual-only" : "result-part-card is-visual-only"}
                      disabled={disabled}
                      aria-label={localizeValue(item.id, locale)}
                      title={localizeValue(item.id, locale)}
                      onMouseEnter={() => !disabled && onPartPreview(selectedSlot, item.id)}
                      onMouseLeave={() => onPartPreview(selectedSlot, null)}
                      onClick={() => !disabled && onPartCommit(selectedSlot, item.id)}
                    >
                      <span className={`rarity-dot rarity-${rarity}`} />
                      <span className="result-part-chip" style={{ background: item.chip }} />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        {activeTab === "status" ? (
          <section className="result-card-stack">
            <header className="result-card-head">
              <div>
                <p>{locale === "zh" ? "空间状态" : "Spatial Status"}</p>
                <h3>{locale === "zh" ? "结果面板" : "Result Panel"}</h3>
              </div>
              <small>{layout.warnings.length ? `${layout.warnings.length}` : (locale === "zh" ? "正常" : "Clear")}</small>
            </header>

            <div className="status-grid">
              <article><small>{locale === "zh" ? "空间注册" : "Registry"}</small><strong>{localizePhrase(spatialStatusLabel, locale)}</strong></article>
              <article><small>{locale === "zh" ? "警告数" : "Warnings"}</small><strong>{layout.warnings.length}</strong></article>
              <article><small>{locale === "zh" ? "当前底座" : "Base"}</small><strong>{localizeValue(recipe.base, locale)}</strong></article>
              <article><small>{locale === "zh" ? "当前外环" : "Frame"}</small><strong>{localizeValue(recipe.frame, locale)}</strong></article>
            </div>

            <div className="status-guard-box">
              <strong>{locale === "zh" ? "空间守卫" : "Spatial Guard"}</strong>
              <p>{localizePhrase(guardMessage, locale)}</p>
            </div>

            {guardAdvice.length ? (
              <div className="status-advice-list">
                {guardAdvice.slice(0, 4).map((advice) => (
                  <button
                    key={`${advice.kind}-${advice.slot}-${advice.id}`}
                    type="button"
                    className="status-advice-item"
                    onClick={() => onApplyAdvice(advice)}
                  >
                    <strong>{`${localizeValue(advice.fromLabel, locale)} -> ${localizeValue(advice.label, locale)}`}</strong>
                    <span>{localizePhrase(advice.reason, locale)}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {activeTab === "collection" ? (
          <RecipeLedger recipe={recipe} autoFixHistory={autoFixHistory} locale={locale} compact view="collection" />
        ) : null}

        {activeTab === "history" ? (
          <RecipeLedger recipe={recipe} autoFixHistory={autoFixHistory} locale={locale} compact view="history" />
        ) : null}
      </div>
    </aside>
  );
}

function getRarityById(id: string): Rarity {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 997;
  }
  const score = hash % 100;
  if (score >= 95) return "secret";
  if (score >= 72) return "rare";
  return "basic";
}

function buildRarityRows(locale: Locale): Array<{ id: Rarity; label: string; value: number }> {
  return [
    { id: "basic", label: locale === "zh" ? "基础款" : "Basic", value: 72 },
    { id: "rare", label: locale === "zh" ? "稀有款" : "Rare", value: 23 },
    { id: "secret", label: locale === "zh" ? "隐藏款" : "Secret", value: 5 },
  ];
}



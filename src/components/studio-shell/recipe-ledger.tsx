import type { StudioRecipe, StudioSlot } from "../../lib/studio-system";
import type { SpatialAutoFixRecord } from "../../lib/spatial-guard";
import { localizePhrase, localizeValue, type Locale } from "../../lib/i18n-values";

type Props = {
  recipe: StudioRecipe;
  autoFixHistory: SpatialAutoFixRecord[];
  locale: Locale;
  compact?: boolean;
  view?: "both" | "collection" | "history";
};

const LEDGER_ORDER: StudioSlot[] = ["expression", "silhouette", "headpiece", "outfit", "prop", "frame", "pods", "base", "palette"];

const SLOT_LABELS: Record<StudioSlot, { zh: string; en: string }> = {
  expression: { zh: "表情", en: "Expression" },
  silhouette: { zh: "轮廓", en: "Silhouette" },
  headpiece: { zh: "头饰", en: "Headpiece" },
  outfit: { zh: "服装", en: "Outfit" },
  prop: { zh: "道具", en: "Prop" },
  frame: { zh: "外环", en: "Frame" },
  pods: { zh: "吊舱", en: "Pods" },
  base: { zh: "底座", en: "Base" },
  palette: { zh: "配色", en: "Palette" },
};

export function RecipeLedger({ recipe, autoFixHistory, locale, compact = false, view = "both" }: Props) {
  return (
    <section className={compact ? "recipe-ledger recipe-ledger-compact-shell" : "recipe-ledger"}>
      {view !== "history" ? (
        <>
          <header className="recipe-ledger-header">
            <div>
              <p>{locale === "zh" ? "当前收藏品" : "Current Build"}</p>
              <h3>{locale === "zh" ? "组合摘要" : "Recipe Summary"}</h3>
            </div>
            {!compact ? <span>{locale === "zh" ? "快速回看当前每个部件的选择。" : "Quick view of the active build."}</span> : null}
          </header>

          <div className={compact ? "recipe-ledger-grid recipe-ledger-grid-side" : "recipe-ledger-grid recipe-ledger-grid-compact"}>
            {LEDGER_ORDER.map((slot) => (
              <article key={slot} className="ledger-card">
                <small>{locale === "zh" ? SLOT_LABELS[slot].zh : SLOT_LABELS[slot].en}</small>
                <strong>{localizeValue(recipe[slot], locale)}</strong>
              </article>
            ))}
          </div>
        </>
      ) : null}

      {view !== "collection" && autoFixHistory.length ? (
        <details className={compact ? "recipe-ledger-history recipe-ledger-history-compact recipe-ledger-history-side" : "recipe-ledger-history recipe-ledger-history-compact"} open={view === "history"}>
          <summary className="recipe-ledger-history-summary">
            <strong>{locale === "zh" ? "自动修复历史" : "Auto-fix History"}</strong>
            {!compact ? <span>{locale === "zh" ? "系统自动修复过的部件会记录在这里。" : "System auto-fixes are recorded here."}</span> : null}
          </summary>

          <div className="recipe-ledger-history-list">
            {autoFixHistory.map((item) => (
              <article key={item.entryId} className="recipe-ledger-history-item">
                <small>{localizeValue(item.source, locale)}</small>
                <strong>{`${localizeValue(item.fromLabel, locale)} -> ${localizeValue(item.label, locale)}`}</strong>
                <span>{locale === "zh" ? SLOT_LABELS[item.slot].zh : SLOT_LABELS[item.slot].en}</span>
                <p>{localizePhrase(item.reason, locale)}</p>
              </article>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}

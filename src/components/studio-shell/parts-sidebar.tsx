import { useMemo, useState } from "react";
import type { SpatialOptionState } from "../../lib/spatial-guard";
import { getPrototypeOptions, getPrototypeToken, type CharacterPrototypeId } from "../../lib/character-prototypes-v2";
import type { SpeciesId, StudioRecipe, StudioSection, StudioSlot } from "../../lib/studio-system";
import { SLOT_OPTIONS, SPECIES_OPTIONS, getPartOption } from "../../lib/studio-system";
import { localizeValue, type Locale } from "../../lib/i18n-values";

type SidebarGroup = "species" | "parts";

const GROUP_LABELS: Record<SidebarGroup, { zh: string; en: string }> = {
  species: { zh: "物种", en: "Species" },
  parts: { zh: "部件", en: "Parts" },
};

const SPECIES_LABELS: Record<SpeciesId, { zh: string; en: string; noteZh: string; noteEn: string }> = {
  human: { zh: "人物", en: "Human", noteZh: "大头人物", noteEn: "Doll head" },
  animal: { zh: "动物", en: "Animal", noteZh: "毛绒系", noteEn: "Plush feel" },
  creature: { zh: "精灵", en: "Creature", noteZh: "奇幻系", noteEn: "Dreamy" },
  robot: { zh: "机械宠物", en: "Robot", noteZh: "未来感", noteEn: "Neo toy" },
};

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

type Props = {
  recipe: StudioRecipe;
  activePrototype: CharacterPrototypeId;
  selectedSlot: StudioSlot;
  activeSection: StudioSection;
  locale: Locale;
  optionStates: SpatialOptionState[];
  onSpeciesChange: (species: SpeciesId) => void;
  onPrototypeChange: (prototypeId: CharacterPrototypeId) => void;
  onSlotChange: (slot: StudioSlot) => void;
  onRandomize: () => void;
  onSmartMatch: () => void;
};

export function PartsSidebar({
  recipe,
  activePrototype,
  selectedSlot,
  activeSection,
  locale,
  optionStates,
  onSpeciesChange,
  onPrototypeChange,
  onSlotChange,
  onRandomize,
  onSmartMatch,
}: Props) {
  const [activeGroup, setActiveGroup] = useState<SidebarGroup>("parts");
  const blockedCount = optionStates.filter((item) => item.disabled).length;
  const prototypeOptions = getPrototypeOptions(recipe.species);
  const activePrototypeMeta = prototypeOptions.find((item) => item.id === activePrototype) ?? prototypeOptions[0];

  const currentGroupMeta = useMemo(() => {
    if (activeGroup === "species") {
      return {
        title: locale === "zh" ? "切换角色物种" : "Switch Species",
        note:
          locale === "zh"
            ? "先选物种，再选角色原型，然后替换部件。"
            : "Pick species first, then choose a prototype, then swap parts.",
      };
    }
    return {
      title: locale === "zh" ? "切换当前部件层" : "Choose Active Slot",
      note: locale === "zh" ? "左边只负责决定你现在改哪一层。" : "Use this panel to decide which slot you are editing.",
    };
  }, [activeGroup, locale]);

  return (
    <aside className="parts-sidebar parts-sidebar-dual">
      <div className="parts-sidebar-rail">
        <div className="parts-sidebar-rail-mark" title={activeSection}>BB</div>

        {(Object.keys(GROUP_LABELS) as SidebarGroup[]).map((group) => (
          <button
            key={group}
            type="button"
            className={activeGroup === group ? "sidebar-group-tab is-active" : "sidebar-group-tab"}
            onClick={() => setActiveGroup(group)}
          >
            <span className="sidebar-group-tab-copy">
              <strong>{locale === "zh" ? GROUP_LABELS[group].zh : GROUP_LABELS[group].en}</strong>
              <small>
                {group === "parts"
                  ? locale === "zh"
                    ? `${blockedCount}受限`
                    : `${blockedCount} blocked`
                  : locale === "zh"
                    ? "基底"
                    : "Base"}
              </small>
            </span>
          </button>
        ))}
      </div>

      <div className="parts-sidebar-panel">
        <section className="sidebar-panel sidebar-panel-story">
          <p className="sidebar-kicker">{locale === "zh" ? "双层左栏" : "Dual Rail"}</p>
          <h1>{currentGroupMeta.title}</h1>
          <span>{currentGroupMeta.note}</span>
          <div className="sidebar-current-group-pill">
            <strong>{locale === "zh" ? GROUP_LABELS[activeGroup].zh : GROUP_LABELS[activeGroup].en}</strong>
            <small>
              {activeGroup === "species"
                ? `${locale === "zh" ? SPECIES_LABELS[recipe.species].zh : SPECIES_LABELS[recipe.species].en} · ${
                    locale === "zh" ? activePrototypeMeta?.labelZh : activePrototypeMeta?.label
                  }`
                : locale === "zh"
                  ? SLOT_LABELS[selectedSlot].zh
                  : SLOT_LABELS[selectedSlot].en}
            </small>
          </div>
        </section>

        {activeGroup === "species" ? (
          <section className="sidebar-panel">
            <div className="sidebar-section-head">
              <strong>{locale === "zh" ? "物种" : "Species"}</strong>
              <small>{locale === "zh" ? SPECIES_LABELS[recipe.species].zh : SPECIES_LABELS[recipe.species].en}</small>
            </div>
            <div className="sidebar-secondary-list">
              {SPECIES_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={recipe.species === item.id ? "secondary-row is-active" : "secondary-row"}
                  onClick={() => onSpeciesChange(item.id)}
                >
                  <span>{locale === "zh" ? SPECIES_LABELS[item.id].zh : SPECIES_LABELS[item.id].en}</span>
                  <small>{locale === "zh" ? SPECIES_LABELS[item.id].noteZh : SPECIES_LABELS[item.id].noteEn}</small>
                </button>
              ))}
            </div>
            <div className="sidebar-section-head sidebar-sub-head">
              <strong>{locale === "zh" ? "角色原型" : "Character Prototypes"}</strong>
              <small>{locale === "zh" ? `${prototypeOptions.length} 款` : `${prototypeOptions.length} options`}</small>
            </div>
            <div className="sidebar-secondary-list">
              {prototypeOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={activePrototype === item.id ? "secondary-row secondary-row-prototype is-active" : "secondary-row secondary-row-prototype"}
                  onClick={() => onPrototypeChange(item.id)}
                >
                  <span>{locale === "zh" ? item.labelZh : item.label}</span>
                  <small>{locale === "zh" ? item.badge : `${getPrototypeToken(item.id)} · ${item.badge}`}</small>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {activeGroup === "parts" ? (
          <section className="sidebar-panel sidebar-panel-slots">
            <div className="sidebar-section-head">
              <strong>{locale === "zh" ? "部件层" : "Slots"}</strong>
              <small>{locale === "zh" ? `${blockedCount} 个受限选项` : `${blockedCount} blocked`}</small>
            </div>
            <div className="sidebar-secondary-list">
              {SLOT_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={selectedSlot === item.id ? "secondary-row is-active" : "secondary-row"}
                  onClick={() => onSlotChange(item.id)}
                >
                  <span>{locale === "zh" ? SLOT_LABELS[item.id].zh : SLOT_LABELS[item.id].en}</span>
                  <small>
                    {item.id === "palette"
                      ? localizeValue(recipe.palette, locale)
                      : getPartOption(recipe[item.id])?.label ?? localizeValue(recipe[item.id], locale)}
                  </small>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="sidebar-actions">
          <button type="button" className="sidebar-action-primary" onClick={onRandomize}>
            {locale === "zh" ? "盲盒混搭" : "Blind Mix"}
          </button>
          <button type="button" className="sidebar-action-secondary" onClick={onSmartMatch}>
            {locale === "zh" ? "智能推荐" : "Smart Match"}
          </button>
        </section>
      </div>
    </aside>
  );
}

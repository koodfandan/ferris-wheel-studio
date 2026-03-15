import type { StudioSection } from "../../lib/studio-system";

type Locale = "zh" | "en";

const NAV_ITEMS: Array<{ id: StudioSection; labelZh: string; labelEn: string }> = [
  { id: "series", labelZh: "系列", labelEn: "Series" },
  { id: "build", labelZh: "拼装", labelEn: "Build" },
  { id: "inspect", labelZh: "检视", labelEn: "Inspect" },
  { id: "shelf", labelZh: "陈列", labelEn: "Shelf" },
  { id: "collection", labelZh: "收藏", labelEn: "Collection" },
];

type Props = {
  activeSection: StudioSection;
  locale: Locale;
  onSectionChange: (section: StudioSection) => void;
  onLocaleChange: (locale: Locale) => void;
};

export function WorkbenchNav({ activeSection, locale, onSectionChange, onLocaleChange }: Props) {
  return (
    <header className="workbench-nav">
      <div className="workbench-brand">
        <div className="workbench-brand-mark">BB</div>
        <div className="workbench-brand-copy">
          <strong>{locale === "zh" ? "盲盒拼装工作台" : "Blindbox Workbench"}</strong>
          <span>{locale === "zh" ? "像拼手办一样组合你的角色" : "Build collectible characters like toy parts."}</span>
        </div>
      </div>

      <nav className="workbench-nav-links" aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeSection === item.id ? "is-active" : ""}
            onClick={() => onSectionChange(item.id)}
          >
            {locale === "zh" ? item.labelZh : item.labelEn}
          </button>
        ))}
      </nav>

      <div className="workbench-nav-tools">
        <button type="button" className="workbench-chip" onClick={() => onLocaleChange(locale === "zh" ? "en" : "zh")}>
          {locale === "zh" ? "EN" : "中文"}
        </button>
        <button type="button" className="workbench-save">
          {locale === "zh" ? "保存配方" : "Save"}
        </button>
      </div>
    </header>
  );
}

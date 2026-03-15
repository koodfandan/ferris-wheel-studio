import type { StudioSection } from "../../lib/studio-system";
import { SECTION_OPTIONS } from "../../lib/studio-system";
import { UI_TEXT, getLocalizedSection, type Locale } from "../../lib/ui-copy";

const SECTION_ICONS: Record<StudioSection, string> = {
  series: "W",
  build: "B",
  inspect: "I",
  shelf: "S",
  collection: "C",
};

type Props = {
  activeSection: StudioSection;
  onSectionChange: (section: StudioSection) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function StudioNav({ activeSection, onSectionChange, locale, onLocaleChange }: Props) {
  const copy = UI_TEXT[locale];

  return (
    <header className="studio-nav">
      <div className="studio-brand studio-brand-minimal" title={copy.brandTitle}>
        <div className="studio-brand-mark">BB</div>
      </div>

      <nav className="studio-nav-links" aria-label="Primary">
        {SECTION_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeSection === item.id ? "is-active" : ""}
            onClick={() => onSectionChange(item.id)}
            title={getLocalizedSection(item.id, locale)?.label.zh ?? item.label}
          >
            <span className="studio-nav-icon" aria-hidden="true">
              {SECTION_ICONS[item.id]}
            </span>
            <span className="studio-nav-text">
              {getLocalizedSection(item.id, locale)?.label.zh ?? item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="studio-nav-tools">
        <button
          type="button"
          className="studio-badge"
          onClick={() => onLocaleChange(locale === "zh" ? "en" : "zh")}
        >
          {locale === "zh" ? copy.enToggle : copy.zhToggle}
        </button>
        <button type="button" className="studio-ghost-button studio-ghost-button-compact" title={copy.saveRecipe}>
          SV
        </button>
      </div>
    </header>
  );
}

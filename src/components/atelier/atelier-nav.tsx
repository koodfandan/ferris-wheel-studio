type Section = "series" | "build" | "inspect" | "shelf" | "collection";

type Props = {
  active: Section;
  onChange: (section: Section) => void;
};

const ITEMS: { id: Section; label: string }[] = [
  { id: "series", label: "Series" },
  { id: "build", label: "Build" },
  { id: "inspect", label: "Inspect" },
  { id: "shelf", label: "Shelf" },
  { id: "collection", label: "Collection" },
];

export function AtelierNav({ active, onChange }: Props) {
  return (
    <header className="atelier-nav">
      <div className="atelier-brand">
        <div className="atelier-brand-mark">BB</div>
        <div className="atelier-brand-copy">
          <strong>Blindbox Atelier</strong>
          <span>Modular Character Studio</span>
        </div>
      </div>

      <nav className="atelier-nav-links" aria-label="Primary">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={active === item.id ? "is-active" : ""}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="atelier-nav-tools">
        <span className="atelier-pill">Blind Box Build</span>
        <button type="button" className="atelier-ghost">
          Save Recipe
        </button>
      </div>
    </header>
  );
}

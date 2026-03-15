type Props = {
  activeItem: "Series" | "Build" | "Inspect" | "Shelf" | "Collection";
};

const ITEMS: Props["activeItem"][] = ["Series", "Build", "Inspect", "Shelf", "Collection"];

export function BuildTopNav({ activeItem }: Props) {
  return (
    <header className="build-top-nav">
      <div className="brand-lockup">
        <div className="brand-mark">BS</div>
        <div>
          <strong>Blindbox Studio</strong>
          <span>Collector Character Workshop</span>
        </div>
      </div>

      <nav className="top-nav-links" aria-label="Primary">
        {ITEMS.map((item) => (
          <button
            key={item}
            type="button"
            className={item === activeItem ? "is-active" : ""}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="top-nav-actions">
        <span className="top-pill">Blind Box Builder</span>
        <button type="button" className="ghost-pill">
          Save Collection
        </button>
      </div>
    </header>
  );
}

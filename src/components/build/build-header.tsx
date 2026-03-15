type Props = {
  title: string;
  subtitle: string;
  series: string;
  species: string;
  onRandomize: () => void;
};

export function BuildHeader({ title, subtitle, series, species, onRandomize }: Props) {
  return (
    <section className="build-header">
      <div className="build-header-copy">
        <div className="header-badges">
          <span>{series}</span>
          <span>{species}</span>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="build-header-actions">
        <button type="button" className="cta-button" onClick={onRandomize}>
          Open Random Box
        </button>
        <button type="button" className="secondary-button">
          Save Recipe
        </button>
      </div>
    </section>
  );
}

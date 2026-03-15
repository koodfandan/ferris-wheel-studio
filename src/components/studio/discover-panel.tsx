import type { Species } from "../../lib/collector-studio";
import { SPECIES_OPTIONS } from "../../lib/collector-studio";

type Props = {
  species: Species;
  onSpeciesChange: (species: Species) => void;
  onRandomize: () => void;
};

export function DiscoverPanel({ species, onSpeciesChange, onRandomize }: Props) {
  return (
    <>
      <section className="panel card">
        <div className="section-heading">
          <h2>Base Species</h2>
          <span>blind-box families</span>
        </div>
        <div className="species-grid">
          {SPECIES_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`species-card ${species === item.id ? "is-active" : ""}`}
              onClick={() => onSpeciesChange(item.id)}
            >
              <b>{item.label}</b>
              <span>{item.blurb}</span>
              <em>{item.badge}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="panel card">
        <div className="section-heading">
          <h2>Blind Box</h2>
          <span>smart mix</span>
        </div>
        <p>
          Pick a species first, then let the system generate a valid combination that still feels
          like one coherent toy line instead of random parts glued together.
        </p>
        <div className="inline-actions">
          <button type="button" className="action-button" onClick={onRandomize}>
            Open a random box
          </button>
        </div>
      </section>
    </>
  );
}

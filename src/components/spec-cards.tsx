import type { FigureConfig } from "../lib/config";
import { specLightLabel } from "../lib/config";

type Props = {
  config: FigureConfig;
};

export function SpecCards({ config }: Props) {
  return (
    <>
      <section className="panel card">
        <h2>Live Spec</h2>
        <div className="list">
          <div className="item">
            <b>Height</b>
            <span>24 cm</span>
          </div>
          <div className="item">
            <b>Build</b>
            <span>{`Hero + Ring + ${config.cabinCount} Cabins + Box`}</span>
          </div>
          <div className="item">
            <b>Material</b>
            <span>PVC / ABS / Clear PC</span>
          </div>
          <div className="item">
            <b>Lighting</b>
            <span>{specLightLabel(config.lightMode)}</span>
          </div>
        </div>
      </section>

      <section className="panel card">
        <h2>Display Rules</h2>
        <div className="list">
          <div className="item">
            <b>Head Ratio</b>
            <span>Exaggerated and soft</span>
          </div>
          <div className="item">
            <b>Face</b>
            <span>Big eyes, blush, tiny mouth</span>
          </div>
          <div className="item">
            <b>Base</b>
            <span>Showcase box, not a stand</span>
          </div>
          <div className="item">
            <b>Goal</b>
            <span>Launch-page beauty first</span>
          </div>
        </div>
      </section>
    </>
  );
}

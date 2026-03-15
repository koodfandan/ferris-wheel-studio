import type { FigureConfig } from "../../lib/config";
import { lightLabel } from "../../lib/config";
import { ViewerCanvas } from "./viewer-canvas";

type Props = {
  config: FigureConfig;
  assetUrl?: string | null;
  assetName?: string | null;
  headline: string;
  description: string;
  badges: string[];
  ticketLines: string[];
};

export function FigureViewer({
  config,
  assetUrl,
  assetName,
  headline,
  description,
  badges,
  ticketLines,
}: Props) {
  return (
    <section className="center">
      <div className="header">
        <div>
          <h3>{headline}</h3>
          <p>{description}</p>
        </div>
        <div className="badges">
          <span className="badge">GLB Viewer Ready</span>
          <span className="badge">{assetName ? "Local Asset Loaded" : "Waiting For Final Asset"}</span>
          <span className="badge">{lightLabel(config.lightMode)}</span>
          {badges.map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="scene">
        <ViewerCanvas config={config} assetUrl={assetUrl} assetName={assetName} />
      </div>

      <div className="ticket">
        <b>VIEWER STATUS</b>
        <span>{assetName ? `Previewing ${assetName}` : "Viewer logic is separated from model assets."}</span>
        {ticketLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </section>
  );
}

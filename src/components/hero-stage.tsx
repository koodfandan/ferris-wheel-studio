import type { FigureConfig } from "../lib/config";
import { FigureViewer } from "./viewer/figure-viewer";

type Props = {
  config: FigureConfig;
  assetUrl?: string | null;
  assetName?: string | null;
  headline: string;
  description: string;
  badges: string[];
  ticketLines: string[];
};

export function HeroStage({
  config,
  assetUrl,
  assetName,
  headline,
  description,
  badges,
  ticketLines,
}: Props) {
  return (
    <FigureViewer
      config={config}
      assetUrl={assetUrl}
      assetName={assetName}
      headline={headline}
      description={description}
      badges={badges}
      ticketLines={ticketLines}
    />
  );
}

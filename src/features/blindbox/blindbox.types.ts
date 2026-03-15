export type BlindboxLocale = "zh" | "en";
export type BlindboxRarity = "basic" | "rare" | "secret";

export type BlindboxTimedPhase =
  | "pop-box"
  | "snap-open"
  | "handoff"
  | "reveal"
  | "settle-on-base";

export type BlindboxPhase = "idle" | BlindboxTimedPhase | "viewer-ready";

export type BlindboxContext = {
  token: number;
  selectedBoxIndex: number;
  rarity: BlindboxRarity | null;
};

export type BlindboxEvent =
  | { type: "DRAW" }
  | { type: "RESET" };

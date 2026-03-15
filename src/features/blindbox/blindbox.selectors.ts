import {
  BLINDBOX_PHASE_COPY,
  BLINDBOX_PHASE_MS,
  BLINDBOX_PHASE_ORDER,
  BLINDBOX_RARITY_COPY,
  BLINDBOX_RARITY_REVEAL_PROFILE,
} from "./blindbox.constants";
import type { BlindboxLocale, BlindboxPhase, BlindboxRarity, BlindboxTimedPhase } from "./blindbox.types";

export function isBlindboxPackagingActive(phase: BlindboxPhase) {
  return phase !== "idle" && phase !== "viewer-ready";
}

type BlindboxFigureMotion = {
  visibility: number;
  scale: number;
  y: number;
  x: number;
  pitch: number;
};

export function shouldBlindboxShowFigure(phase: BlindboxPhase) {
  return phase === "idle" || phase === "reveal" || phase === "settle-on-base" || phase === "viewer-ready";
}

export function shouldBlindboxPlayCelebration(phase: BlindboxPhase) {
  return phase === "reveal" || phase === "settle-on-base" || phase === "viewer-ready";
}

export function getBlindboxFigureMotion(phase: BlindboxPhase): BlindboxFigureMotion {
  switch (phase) {
    case "handoff":
      return {
        visibility: 0,
        scale: 0.52,
        y: -0.12,
        x: 0.018,
        pitch: 0.05,
      };
    case "reveal":
    case "settle-on-base":
    case "viewer-ready":
      return {
        visibility: 1,
        scale: 1,
        y: 0,
        x: 0,
        pitch: 0,
      };
    case "idle":
      return {
        visibility: 1,
        scale: 0.84,
        y: -0.14,
        x: 0,
        pitch: 0.02,
      };
    default:
      return {
        visibility: 0,
        scale: 0.58,
        y: -0.18,
        x: 0.024,
        pitch: 0.08,
      };
  }
}

export function getBlindboxPhaseCopy(phase: BlindboxPhase, locale: BlindboxLocale) {
  return BLINDBOX_PHASE_COPY[locale][phase];
}

export function getBlindboxRarityLabel(rarity: BlindboxRarity | null, locale: BlindboxLocale) {
  if (!rarity) {
    return locale === "zh" ? "未揭晓" : "Hidden";
  }

  return BLINDBOX_RARITY_COPY[locale][rarity];
}

export function getBlindboxRarityProfile(rarity: BlindboxRarity | null) {
  return BLINDBOX_RARITY_REVEAL_PROFILE[rarity ?? "basic"];
}

export function getBlindboxPhaseDuration(phase: BlindboxTimedPhase, rarity: BlindboxRarity | null) {
  if (phase === "reveal") {
    return getBlindboxRarityProfile(rarity).revealMs;
  }

  if (phase === "settle-on-base") {
    return getBlindboxRarityProfile(rarity).settleMs;
  }

  return BLINDBOX_PHASE_MS[phase];
}

export function getBlindboxPhaseOffsetMs(targetPhase: BlindboxTimedPhase, rarity: BlindboxRarity | null = null) {
  let elapsed = 0;

  for (const phase of BLINDBOX_PHASE_ORDER) {
    if (phase === targetPhase) {
      return elapsed;
    }

    elapsed += getBlindboxPhaseDuration(phase, rarity);
  }

  return elapsed;
}


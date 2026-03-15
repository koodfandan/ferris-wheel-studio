import type { BlindboxLocale, BlindboxPhase, BlindboxRarity, BlindboxTimedPhase } from "./blindbox.types";

export const BLINDBOX_BOX_COUNT = 12;

export const BLINDBOX_PHASE_ORDER: BlindboxTimedPhase[] = [
  "pop-box",
  "snap-open",
  "handoff",
  "reveal",
  "settle-on-base",
];

export const BLINDBOX_PHASE_MS: Record<BlindboxTimedPhase, number> = {
  "pop-box": 560,
  "snap-open": 580,
  handoff: 380,
  reveal: 430,
  "settle-on-base": 300,
};

export const BLINDBOX_RARITY_REVEAL_PROFILE: Record<
  BlindboxRarity,
  {
    revealMs: number;
    settleMs: number;
    flashScale: number;
    confettiBurst: number;
  }
> = {
  basic: {
    revealMs: 940,
    settleMs: 760,
    flashScale: 0.62,
    confettiBurst: 0.24,
  },
  rare: {
    revealMs: 1020,
    settleMs: 840,
    flashScale: 0.72,
    confettiBurst: 0.42,
  },
  secret: {
    revealMs: 1100,
    settleMs: 920,
    flashScale: 0.8,
    confettiBurst: 0.58,
  },
};

export const BLINDBOX_PHASE_COPY: Record<BlindboxLocale, Record<BlindboxPhase, { title: string; detail: string }>> = {
  zh: {
    idle: {
      title: "等待抽盒",
      detail: "点击再抽一次，开始新一轮盲盒揭晓。",
    },
    "pop-box": {
      title: "盲盒弹出",
      detail: "盲盒会先从旁边弹到舞台中央。",
    },
    "snap-open": {
      title: "摇动两下",
      detail: "盒子会轻轻摇两下，马上揭晓模型。",
    },
    handoff: {
      title: "盒子退场",
      detail: "盲盒会先退到后面，把舞台让给模型揭晓。",
    },
    reveal: {
      title: "模型揭晓",
      detail: "盒子退下后，模型会在主舞台上完整出现。",
    },
    "settle-on-base": {
      title: "角色落稳",
      detail: "角色落回展示位，准备进入自由查看。",
    },
    "viewer-ready": {
      title: "可自由查看",
      detail: "现在可以继续 360 查看和后续拼装。",
    },
  },
  en: {
    idle: {
      title: "Draw Ready",
      detail: "Draw again to begin the next blind-box reveal.",
    },
    "pop-box": {
      title: "Box Pop",
      detail: "The blind box springs in from the side.",
    },
    "snap-open": {
      title: "Double Shake",
      detail: "The box shakes twice right before the reveal.",
    },
    handoff: {
      title: "Box Handoff",
      detail: "The box drops back and clears the stage for the model.",
    },
    reveal: {
      title: "Stage Reveal",
      detail: "Once the box clears, the full model takes the main stage.",
    },
    "settle-on-base": {
      title: "Hero Settle",
      detail: "Land the figure and prepare the 360 viewer.",
    },
    "viewer-ready": {
      title: "Viewer Ready",
      detail: "The figure is ready for 360 view and assembly.",
    },
  },
};

export const BLINDBOX_RARITY_WEIGHTS: Array<{ rarity: BlindboxRarity; weight: number }> = [
  { rarity: "basic", weight: 72 },
  { rarity: "rare", weight: 23 },
  { rarity: "secret", weight: 5 },
];

export const BLINDBOX_RARITY_COPY: Record<BlindboxLocale, Record<BlindboxRarity, string>> = {
  zh: {
    basic: "基础款",
    rare: "稀有款",
    secret: "隐藏款",
  },
  en: {
    basic: "Basic",
    rare: "Rare",
    secret: "Secret",
  },
};


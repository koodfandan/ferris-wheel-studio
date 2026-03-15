import { assign, setup } from "xstate";

export type BlindboxPhase = "idle" | "tearing" | "lid-open" | "bag-out" | "reveal" | "done";
export type BlindboxLocale = "zh" | "en";

type ActiveBlindboxPhase = Exclude<BlindboxPhase, "idle">;

type BlindboxContext = {
  token: number;
};

type BlindboxEvent = {
  type: "DRAW";
};

export const BLINDBOX_PHASE_ORDER: ActiveBlindboxPhase[] = [
  "tearing",
  "lid-open",
  "bag-out",
  "reveal",
  "done",
];

export const BLINDBOX_PHASE_MS: Record<ActiveBlindboxPhase, number> = {
  tearing: 260,
  "lid-open": 420,
  "bag-out": 460,
  reveal: 520,
  done: 480,
};

const BLINDBOX_PHASE_COPY: Record<BlindboxLocale, Record<BlindboxPhase, { title: string; detail: string }>> = {
  zh: {
    idle: {
      title: "待机中",
      detail: "准备下一次抽盒揭晓",
    },
    tearing: {
      title: "封条撕开",
      detail: "先拉起情绪，再给出第一层动作反馈",
    },
    "lid-open": {
      title: "盒盖弹开",
      detail: "让注意力集中到舞台正中",
    },
    "bag-out": {
      title: "内袋升起",
      detail: "遮挡模型本体，保留悬念",
    },
    reveal: {
      title: "角色揭晓",
      detail: "模型、光晕、粒子同时释放",
    },
    done: {
      title: "惊喜定格",
      detail: "短暂停留，方便用户观察和截图",
    },
  },
  en: {
    idle: {
      title: "Standby",
      detail: "Ready for the next blind-box reveal",
    },
    tearing: {
      title: "Seal Break",
      detail: "Start with a quick emotional lift",
    },
    "lid-open": {
      title: "Lid Pop",
      detail: "Pull attention into the center stage",
    },
    "bag-out": {
      title: "Inner Bag Rise",
      detail: "Hold the silhouette before the reveal",
    },
    reveal: {
      title: "Figure Reveal",
      detail: "Release model, glow, and particles together",
    },
    done: {
      title: "Hero Hold",
      detail: "Leave a short beat for inspection and screenshots",
    },
  },
};

export const blindboxMachine = setup({
  types: {
    context: {} as BlindboxContext,
    events: {} as BlindboxEvent,
  },
}).createMachine({
  id: "blindbox-show",
  initial: "idle",
  context: {
    token: 0,
  },
  states: {
    idle: {
      on: {
        DRAW: {
          target: "tearing",
          actions: assign({
            token: ({ context }) => context.token + 1,
          }),
        },
      },
    },
    tearing: {
      tags: ["active"],
      after: {
        [BLINDBOX_PHASE_MS.tearing]: "lid-open",
      },
    },
    "lid-open": {
      tags: ["active"],
      after: {
        [BLINDBOX_PHASE_MS["lid-open"]]: "bag-out",
      },
    },
    "bag-out": {
      tags: ["active"],
      after: {
        [BLINDBOX_PHASE_MS["bag-out"]]: "reveal",
      },
    },
    reveal: {
      tags: ["active"],
      after: {
        [BLINDBOX_PHASE_MS.reveal]: "done",
      },
    },
    done: {
      tags: ["active"],
      after: {
        [BLINDBOX_PHASE_MS.done]: "idle",
      },
    },
  },
});

export function isBlindboxActive(phase: BlindboxPhase) {
  return phase !== "idle";
}

export function getBlindboxPhaseOffsetMs(targetPhase: ActiveBlindboxPhase) {
  let elapsed = 0;

  for (const phase of BLINDBOX_PHASE_ORDER) {
    if (phase === targetPhase) {
      return elapsed;
    }
    elapsed += BLINDBOX_PHASE_MS[phase];
  }

  return elapsed;
}

export function getBlindboxPhaseCopy(phase: BlindboxPhase, locale: BlindboxLocale) {
  return BLINDBOX_PHASE_COPY[locale][phase];
}

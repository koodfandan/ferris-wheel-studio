import { assign, setup } from "xstate";
import { BLINDBOX_BOX_COUNT, BLINDBOX_RARITY_WEIGHTS } from "./blindbox.constants";
import { getBlindboxPhaseDuration } from "./blindbox.selectors";
import type { BlindboxContext, BlindboxEvent, BlindboxRarity, BlindboxTimedPhase } from "./blindbox.types";

function pickRandomBoxIndex() {
  return Math.floor(Math.random() * BLINDBOX_BOX_COUNT);
}

function pickRandomRarity(): BlindboxRarity {
  const total = BLINDBOX_RARITY_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;

  for (const item of BLINDBOX_RARITY_WEIGHTS) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.rarity;
    }
  }

  return BLINDBOX_RARITY_WEIGHTS[0].rarity;
}

function phaseDelay(phase: BlindboxTimedPhase) {
  return ({ context }: { context: BlindboxContext }) => getBlindboxPhaseDuration(phase, context.rarity);
}

export const blindboxMachine = setup({
  types: {
    context: {} as BlindboxContext,
    events: {} as BlindboxEvent,
  },
  actions: {
    startDraw: assign({
      token: ({ context }) => context.token + 1,
      selectedBoxIndex: () => pickRandomBoxIndex(),
      rarity: () => pickRandomRarity(),
    }),
    resetDraw: assign({
      selectedBoxIndex: 0,
      rarity: null,
    }),
  },
  delays: {
    POP_BOX_DELAY: phaseDelay("pop-box"),
    SNAP_OPEN_DELAY: phaseDelay("snap-open"),
    HANDOFF_DELAY: phaseDelay("handoff"),
    REVEAL_DELAY: phaseDelay("reveal"),
    SETTLE_ON_BASE_DELAY: phaseDelay("settle-on-base"),
  },
}).createMachine({
  id: "blindbox-flow",
  initial: "idle",
  context: {
    token: 0,
    selectedBoxIndex: 0,
    rarity: null,
  },
  states: {
    idle: {
      on: {
        DRAW: {
          target: "pop-box",
          actions: "startDraw",
        },
      },
    },
    "pop-box": {
      tags: ["active"],
      after: {
        POP_BOX_DELAY: "snap-open",
      },
    },
    "snap-open": {
      tags: ["active"],
      after: {
        SNAP_OPEN_DELAY: "handoff",
      },
    },
    handoff: {
      tags: ["active"],
      after: {
        HANDOFF_DELAY: "reveal",
      },
    },
    reveal: {
      tags: ["active"],
      after: {
        REVEAL_DELAY: "settle-on-base",
      },
    },
    "settle-on-base": {
      tags: ["active"],
      after: {
        SETTLE_ON_BASE_DELAY: "viewer-ready",
      },
    },
    "viewer-ready": {
      on: {
        DRAW: {
          target: "pop-box",
          actions: "startDraw",
        },
        RESET: {
          target: "idle",
          actions: "resetDraw",
        },
      },
    },
  },
});


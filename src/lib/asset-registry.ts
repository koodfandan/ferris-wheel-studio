import type { SpatialAssetDefinition } from "./spatial-types";
import {
  createSpatialRegistryEntries,
  type SpatialBundleManifest,
} from "./spatial-manifest";

const DEFAULT_BASE: Omit<SpatialAssetDefinition, "id" | "metrics"> = {
  role: "base",
  anchors: {
    frame_mount: [0, 0.82, -1.02],
    support_left: [-1.3, 0.14, -1.02],
    support_right: [1.3, 0.14, -1.02],
    backdrop_mount: [0, 0.82, -2.18],
  },
  proxies: [
    {
      id: "base-body",
      type: "box",
      size: [4.1, 0.92, 3.46],
      offset: [0, 0.3, 0],
    },
  ],
  clearance: {
    top: 0.18,
    bottom: 0,
    front: 0.08,
    back: 0.08,
    side: 0.1,
  },
  solveAxes: [],
  fallbacks: [],
};

export const BASE_ASSET_REGISTRY: Record<string, SpatialAssetDefinition> = {
  "base-cloud": {
    ...DEFAULT_BASE,
    id: "base-cloud",
    fallbacks: ["base-dock", "base-ticket"],
    anchors: {
      frame_mount: [0, 0.46, -1.02],
      support_left: [-1.3, 0.12, -1.02],
      support_right: [1.3, 0.12, -1.02],
      backdrop_mount: [0, 0.46, -2.18],
    },
    proxies: [
      {
        id: "base-cloud-body",
        type: "box",
        size: [3.9, 0.56, 3.46],
        offset: [0, 0.2, 0],
      },
    ],
    metrics: {
      topY: 0.48,
      supportSpanHalf: 1.3,
    },
  },
  "base-ticket": {
    ...DEFAULT_BASE,
    id: "base-ticket",
    fallbacks: ["base-dock", "base-cloud"],
    metrics: {
      topY: 0.85,
      supportSpanHalf: 1.3,
    },
  },
  "base-dock": {
    ...DEFAULT_BASE,
    id: "base-dock",
    fallbacks: ["base-cloud", "base-ticket"],
    anchors: {
      frame_mount: [0, 0.45, -1.02],
      support_left: [-1.3, 0.12, -1.02],
      support_right: [1.3, 0.12, -1.02],
      backdrop_mount: [0, 0.45, -2.18],
    },
    proxies: [
      {
        id: "base-dock-body",
        type: "box",
        size: [4.16, 0.56, 3.46],
        offset: [0, 0.21, 0],
      },
    ],
    metrics: {
      topY: 0.47,
      supportSpanHalf: 1.3,
    },
  },
};

const DEFAULT_FRAME: Omit<SpatialAssetDefinition, "id" | "metrics"> = {
  role: "frame",
  anchors: {
    center: [0, 0, 0],
  },
  proxies: [
    {
      id: "frame-ring",
      type: "sphere",
      radius: 2.34,
      offset: [0, 0, 0],
    },
  ],
  clearance: {
    top: 0.18,
    bottom: 0.28,
    front: 0.06,
    back: 0.2,
    side: 0.14,
  },
  solveAxes: ["y", "z"],
  fallbacks: [],
};

export const FRAME_ASSET_REGISTRY: Record<string, SpatialAssetDefinition> = {
  "frame-classic": {
    ...DEFAULT_FRAME,
    id: "frame-classic",
    fallbacks: ["frame-pearl", "frame-bulb", "frame-candy"],
    metrics: {
      outerRadius: 2.29,
      depth: 0.12,
      supportDrop: 1.02,
    },
  },
  "frame-candy": {
    ...DEFAULT_FRAME,
    id: "frame-candy",
    fallbacks: ["frame-classic", "frame-pearl", "frame-bulb"],
    metrics: {
      outerRadius: 2.46,
      depth: 0.18,
      supportDrop: 1.02,
    },
  },
  "frame-pearl": {
    ...DEFAULT_FRAME,
    id: "frame-pearl",
    fallbacks: ["frame-classic", "frame-bulb", "frame-candy"],
    metrics: {
      outerRadius: 2.3,
      depth: 0.12,
      supportDrop: 1.02,
    },
  },
  "frame-bulb": {
    ...DEFAULT_FRAME,
    id: "frame-bulb",
    fallbacks: ["frame-classic", "frame-pearl", "frame-candy"],
    metrics: {
      outerRadius: 2.34,
      depth: 0.16,
      supportDrop: 1.02,
    },
  },
};

export const BACKDROP_ASSET_REGISTRY: Record<string, SpatialAssetDefinition> = {
  "backdrop-none": {
    id: "backdrop-none",
    role: "backdrop",
    anchors: {
      center: [0, 0, 0],
    },
    proxies: [],
    clearance: {
      top: 0,
      bottom: 0,
      front: 0,
      back: 0,
      side: 0,
    },
    solveAxes: [],
    fallbacks: [],
    metrics: {
      thickness: 0,
      width: 0,
    },
  },
  "backdrop-showcase": {
    id: "backdrop-showcase",
    role: "backdrop",
    anchors: {
      center: [0, 0, 0],
    },
    proxies: [
      {
        id: "backdrop-panel",
        type: "box",
        size: [5.6, 5.2, 0.12],
        offset: [0, 0, 0],
      },
    ],
    clearance: {
      top: 0.42,
      bottom: 0.4,
      front: 1.18,
      back: 0.04,
      side: 0.44,
    },
    solveAxes: ["z"],
    fallbacks: [],
    metrics: {
      thickness: 0.12,
      width: 5.6,
    },
  },
};

export const CHARACTER_ASSET_REGISTRY: Record<string, SpatialAssetDefinition> = {
  "character-human": {
    id: "character-human",
    role: "character",
    anchors: {
      root: [0, 0, 0],
      head: [0, 1.66, 0],
      left_hand: [0.82, 0.78, 0.44],
    },
    proxies: [
      { id: "character-body", type: "box", size: [1.48, 2.92, 1.26], offset: [0, 1.42, 0.18] },
      { id: "character-head", type: "sphere", radius: 1.08, offset: [0, 1.74, 0] },
    ],
    clearance: { top: 0.08, bottom: 0.08, front: 0.06, back: 0.1, side: 0.08 },
    solveAxes: ["x", "y", "z"],
    fallbacks: [],
    metrics: {
      preferredZ: 0.38,
      preferredY: 0.08,
    },
  },
  "character-animal": {
    id: "character-animal",
    role: "character",
    anchors: {
      root: [0, 0, 0],
      head: [0, 1.54, 0],
      left_hand: [0.76, 0.72, 0.4],
    },
    proxies: [
      { id: "character-body", type: "box", size: [1.62, 2.8, 1.42], offset: [0, 1.34, 0.16] },
      { id: "character-head", type: "sphere", radius: 1.12, offset: [0, 1.62, 0] },
    ],
    clearance: { top: 0.08, bottom: 0.08, front: 0.08, back: 0.1, side: 0.08 },
    solveAxes: ["x", "y", "z"],
    fallbacks: [],
    metrics: {
      preferredZ: 0.42,
      preferredY: 0.06,
    },
  },
  "character-creature": {
    id: "character-creature",
    role: "character",
    anchors: {
      root: [0, 0, 0],
      head: [0, 1.68, 0],
      left_hand: [0.84, 0.76, 0.42],
    },
    proxies: [
      { id: "character-body", type: "box", size: [1.54, 3.02, 1.34], offset: [0, 1.46, 0.14] },
      { id: "character-head", type: "sphere", radius: 1.1, offset: [0, 1.78, 0] },
    ],
    clearance: { top: 0.08, bottom: 0.08, front: 0.06, back: 0.12, side: 0.08 },
    solveAxes: ["x", "y", "z"],
    fallbacks: [],
    metrics: {
      preferredZ: 0.34,
      preferredY: 0.08,
    },
  },
  "character-robot": {
    id: "character-robot",
    role: "character",
    anchors: {
      root: [0, 0, 0],
      head: [0, 1.58, 0],
      left_hand: [0.82, 0.72, 0.44],
    },
    proxies: [
      { id: "character-body", type: "box", size: [1.68, 2.92, 1.44], offset: [0, 1.4, 0.2] },
      { id: "character-head", type: "sphere", radius: 1.06, offset: [0, 1.66, 0] },
    ],
    clearance: { top: 0.08, bottom: 0.08, front: 0.08, back: 0.14, side: 0.08 },
    solveAxes: ["x", "y", "z"],
    fallbacks: [],
    metrics: {
      preferredZ: 0.36,
      preferredY: 0.06,
    },
  },
};

export const PROP_ASSET_REGISTRY: Record<string, SpatialAssetDefinition> = {
  "prop-ticket": {
    id: "prop-ticket",
    role: "prop",
    anchors: { root: [0, 0, 0] },
    proxies: [{ id: "prop-body", type: "box", size: [0.24, 0.6, 0.12], offset: [0, 0, 0] }],
    clearance: { top: 0.04, bottom: 0.04, front: 0.04, back: 0.08, side: 0.04 },
    solveAxes: ["z"],
    fallbacks: ["prop-wand", "prop-battery", "prop-lantern"],
    metrics: { hand: 0 },
  },
  "prop-wand": {
    id: "prop-wand",
    role: "prop",
    anchors: { root: [0, 0, 0] },
    proxies: [
      { id: "prop-stick", type: "box", size: [0.08, 0.72, 0.08], offset: [0, 0, 0] },
      { id: "prop-head", type: "sphere", radius: 0.12, offset: [0, 0.42, 0] },
    ],
    clearance: { top: 0.04, bottom: 0.04, front: 0.04, back: 0.08, side: 0.04 },
    solveAxes: ["z"],
    fallbacks: ["prop-ticket", "prop-battery", "prop-lantern"],
    metrics: { hand: 0 },
  },
  "prop-lantern": {
    id: "prop-lantern",
    role: "prop",
    anchors: { root: [0, 0, 0] },
    proxies: [{ id: "prop-body", type: "box", size: [0.32, 0.54, 0.24], offset: [0, 0.06, 0] }],
    clearance: { top: 0.04, bottom: 0.04, front: 0.04, back: 0.08, side: 0.04 },
    solveAxes: ["z"],
    fallbacks: ["prop-ticket", "prop-wand", "prop-battery"],
    metrics: { hand: 0 },
  },
  "prop-battery": {
    id: "prop-battery",
    role: "prop",
    anchors: { root: [0, 0, 0] },
    proxies: [{ id: "prop-body", type: "box", size: [0.34, 0.5, 0.24], offset: [0, 0, 0] }],
    clearance: { top: 0.04, bottom: 0.04, front: 0.04, back: 0.1, side: 0.04 },
    solveAxes: ["z"],
    fallbacks: ["prop-ticket", "prop-wand", "prop-lantern"],
    metrics: { hand: 0 },
  },
};

export function createSpatialRegistry(bundle?: SpatialBundleManifest) {
  if (!bundle) {
    return {
      base: { ...BASE_ASSET_REGISTRY },
      frame: { ...FRAME_ASSET_REGISTRY },
      backdrop: { ...BACKDROP_ASSET_REGISTRY },
      character: { ...CHARACTER_ASSET_REGISTRY },
      prop: { ...PROP_ASSET_REGISTRY },
    };
  }

  const entries = createSpatialRegistryEntries(bundle);

  return {
    base: { ...BASE_ASSET_REGISTRY, ...entries.base },
    frame: { ...FRAME_ASSET_REGISTRY, ...entries.frame },
    backdrop: { ...BACKDROP_ASSET_REGISTRY, ...entries.backdrop },
    character: { ...CHARACTER_ASSET_REGISTRY, ...entries.character },
    prop: { ...PROP_ASSET_REGISTRY, ...entries.prop },
  };
}

export type SpatialRegistry = ReturnType<typeof createSpatialRegistry>;

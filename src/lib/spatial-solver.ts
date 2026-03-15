import {
  BACKDROP_ASSET_REGISTRY,
  BASE_ASSET_REGISTRY,
  CHARACTER_ASSET_REGISTRY,
  FRAME_ASSET_REGISTRY,
  PROP_ASSET_REGISTRY,
  createSpatialRegistry,
  type SpatialRegistry,
} from "./asset-registry";
import type { StageSpatialSolution, SpatialWarning } from "./spatial-types";
import { validateStageSpatialSolution } from "./spatial-validate";

type SolveStageInput = {
  baseId: string;
  frameId: string;
  backdropId?: string;
  characterId?: string;
  propId?: string;
  registry?: SpatialRegistry;
};

export function solveStageSpatialLayout({
  baseId,
  frameId,
  backdropId = "backdrop-showcase",
  characterId = "character-human",
  propId = "prop-ticket",
  registry = createSpatialRegistry(),
}: SolveStageInput): StageSpatialSolution {
  const base = registry.base[baseId] ?? BASE_ASSET_REGISTRY["base-cloud"];
  const frame = registry.frame[frameId] ?? FRAME_ASSET_REGISTRY["frame-classic"];
  const backdrop = registry.backdrop[backdropId] ?? BACKDROP_ASSET_REGISTRY["backdrop-showcase"];
  const character = registry.character[characterId] ?? CHARACTER_ASSET_REGISTRY["character-human"];
  const prop = registry.prop[propId] ?? PROP_ASSET_REGISTRY["prop-ticket"];
  const warnings: SpatialWarning[] = [];

  const baseTopY = base.metrics.topY;
  const ringOuterRadius = frame.metrics.outerRadius;
  const ringDepth = frame.metrics.depth;
  const ringZ = base.anchors.frame_mount?.[2] ?? -1.02;
  const ringCenterY = Math.max(
    base.anchors.frame_mount?.[1] ?? baseTopY,
    baseTopY + ringOuterRadius + frame.clearance.bottom,
  );
  const supportBaseY = Math.max(baseTopY + 0.08, base.anchors.support_left?.[1] ?? baseTopY + 0.08);
  const supportTopY = ringCenterY - frame.metrics.supportDrop;
  const supportHeight = Math.max(0.96, supportTopY - supportBaseY);
  const supportMidY = supportBaseY + supportHeight / 2;
  const backdropHeight =
    ringOuterRadius * 2 + backdrop.clearance.top + backdrop.clearance.bottom;
  const backdropY = ringCenterY + (backdrop.clearance.top - backdrop.clearance.bottom) * 0.08;
  const backdropZ =
    ringZ - ringDepth / 2 - frame.clearance.back - backdrop.metrics.thickness / 2;
  const frameFrontZ = ringZ + ringDepth / 2;

  const characterBounds = getLocalProxyBounds(character);
  const characterPreferredZ = character.metrics.preferredZ ?? 0.36;
  const characterPreferredY = character.metrics.preferredY ?? 0.08;
  const characterY = Math.max(
    baseTopY + character.clearance.bottom - characterBounds.minY,
    characterPreferredY,
  );
  const characterZ = Math.max(
    characterPreferredZ,
    frameFrontZ + character.clearance.back - characterBounds.minZ,
  );

  const handAnchor = character.anchors.left_hand ?? [0.82, 0.78, 0.44];
  const propBounds = getLocalProxyBounds(prop);
  const initialProp = {
    x: handAnchor[0],
    y: characterY + handAnchor[1],
    z: characterZ + handAnchor[2],
  };
  const propZ = Math.max(
    initialProp.z,
    frameFrontZ + prop.clearance.back - propBounds.minZ,
  );
  const propX = initialProp.x;
  const propY = initialProp.y;

  const solution: StageSpatialSolution = {
    placements: {
      base: {
        id: base.id,
        position: [0, 0, 0],
      },
      frame: {
        id: frame.id,
        position: [0, ringCenterY, ringZ],
      },
      backdrop: {
        id: backdrop.id,
        position: [0, backdropY, backdropZ],
      },
      supportLeft: {
        id: `${frame.id}-support-left`,
        position: [-(base.metrics.supportSpanHalf ?? 1.3), supportMidY, ringZ],
      },
      supportRight: {
        id: `${frame.id}-support-right`,
        position: [base.metrics.supportSpanHalf ?? 1.3, supportMidY, ringZ],
      },
      supportBar: {
        id: `${frame.id}-support-bar`,
        position: [0, supportTopY, ringZ - 0.02],
      },
      character: {
        id: character.id,
        position: [0, characterY, characterZ],
      },
      prop: {
        id: prop.id,
        position: [propX, propY, propZ],
      },
    },
    warnings,
    metrics: {
      baseTopY,
      ringOuterRadius,
      ringDepth,
      ringCenterY,
      ringZ,
      supportTopY,
      supportMidY,
      supportHeight,
      backdropY,
      backdropZ,
      backdropHeight,
      characterY,
      characterZ,
      propX,
      propY,
      propZ,
    },
  };

  solution.warnings = validateStageSpatialSolution({
    solution,
    base,
    frame,
    backdrop,
    character,
    prop,
  });

  return solution;
}

export function getStageSpatialAssets(
  baseId: string,
  frameId: string,
  backdropId = "backdrop-showcase",
  characterId = "character-human",
  propId = "prop-ticket",
  registry = createSpatialRegistry(),
) {
  return {
    base: registry.base[baseId] ?? BASE_ASSET_REGISTRY["base-cloud"],
    frame: registry.frame[frameId] ?? FRAME_ASSET_REGISTRY["frame-classic"],
    backdrop: registry.backdrop[backdropId] ?? BACKDROP_ASSET_REGISTRY["backdrop-showcase"],
    character: registry.character[characterId] ?? CHARACTER_ASSET_REGISTRY["character-human"],
    prop: registry.prop[propId] ?? PROP_ASSET_REGISTRY["prop-ticket"],
  };
}

function getLocalProxyBounds(asset: { proxies: Array<any> }) {
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity,
  };

  asset.proxies.forEach((proxy) => {
    if (proxy.type === "sphere") {
      bounds.minX = Math.min(bounds.minX, proxy.offset[0] - proxy.radius);
      bounds.maxX = Math.max(bounds.maxX, proxy.offset[0] + proxy.radius);
      bounds.minY = Math.min(bounds.minY, proxy.offset[1] - proxy.radius);
      bounds.maxY = Math.max(bounds.maxY, proxy.offset[1] + proxy.radius);
      bounds.minZ = Math.min(bounds.minZ, proxy.offset[2] - proxy.radius);
      bounds.maxZ = Math.max(bounds.maxZ, proxy.offset[2] + proxy.radius);
      return;
    }

    const halfX = proxy.size[0] / 2;
    const halfY = proxy.size[1] / 2;
    const halfZ = proxy.size[2] / 2;
    bounds.minX = Math.min(bounds.minX, proxy.offset[0] - halfX);
    bounds.maxX = Math.max(bounds.maxX, proxy.offset[0] + halfX);
    bounds.minY = Math.min(bounds.minY, proxy.offset[1] - halfY);
    bounds.maxY = Math.max(bounds.maxY, proxy.offset[1] + halfY);
    bounds.minZ = Math.min(bounds.minZ, proxy.offset[2] - halfZ);
    bounds.maxZ = Math.max(bounds.maxZ, proxy.offset[2] + halfZ);
  });

  return bounds;
}

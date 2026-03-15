import type {
  SolveAxis,
  SpatialAssetDefinition,
  SpatialClearance,
  SpatialProxy,
  StageRole,
  Vec3Tuple,
} from "./spatial-types";

export type SpatialAssetManifest = {
  id: string;
  role: StageRole;
  anchors: Record<string, Vec3Tuple>;
  proxies: SpatialProxy[];
  clearance?: Partial<SpatialClearance>;
  solveAxes?: SolveAxis[];
  metrics: Record<string, number>;
  fallbacks?: string[];
};

export type SpatialBundleManifest = {
  version: 1;
  bundleId: string;
  assets: SpatialAssetManifest[];
};

type SpatialBundleValidation =
  | {
      ok: true;
      bundle: SpatialBundleManifest;
    }
  | {
      ok: false;
      errors: string[];
    };

const DEFAULT_CLEARANCE: SpatialClearance = {
  top: 0,
  bottom: 0,
  front: 0,
  back: 0,
  side: 0,
};

const VALID_ROLES = new Set<StageRole>(["base", "frame", "backdrop", "character", "prop"]);
const VALID_SOLVE_AXES = new Set<SolveAxis>(["x", "y", "z"]);
const REQUIRED_ANCHORS: Record<StageRole, string[]> = {
  base: ["frame_mount", "support_left", "support_right", "backdrop_mount"],
  frame: ["center"],
  backdrop: ["center"],
  character: ["root", "head", "left_hand"],
  prop: ["root"],
};

export function createSpatialAssetDefinition(
  manifest: SpatialAssetManifest,
): SpatialAssetDefinition {
  return {
    id: manifest.id,
    role: manifest.role,
    anchors: manifest.anchors,
    proxies: manifest.proxies,
    clearance: { ...DEFAULT_CLEARANCE, ...manifest.clearance },
    solveAxes: manifest.solveAxes ?? [],
    metrics: manifest.metrics,
    fallbacks: manifest.fallbacks ?? [],
  };
}

export function createSpatialRegistryEntries(bundle: SpatialBundleManifest) {
  return bundle.assets.reduce(
    (accumulator, manifest) => {
      const definition = createSpatialAssetDefinition(manifest);

      if (definition.role === "base") {
        accumulator.base[definition.id] = definition;
      } else if (definition.role === "frame") {
        accumulator.frame[definition.id] = definition;
      } else if (definition.role === "backdrop") {
        accumulator.backdrop[definition.id] = definition;
      } else if (definition.role === "character") {
        accumulator.character[definition.id] = definition;
      } else {
        accumulator.prop[definition.id] = definition;
      }

      return accumulator;
    },
    {
      base: {} as Record<string, SpatialAssetDefinition>,
      frame: {} as Record<string, SpatialAssetDefinition>,
      backdrop: {} as Record<string, SpatialAssetDefinition>,
      character: {} as Record<string, SpatialAssetDefinition>,
      prop: {} as Record<string, SpatialAssetDefinition>,
    },
  );
}

export function isSpatialBundleManifest(value: unknown): value is SpatialBundleManifest {
  return validateSpatialBundleManifest(value).ok;
}

export function validateSpatialBundleManifest(value: unknown): SpatialBundleValidation {
  if (!value || typeof value !== "object") {
    return {
      ok: false,
      errors: ["Bundle must be an object."],
    };
  }

  const bundle = value as Partial<SpatialBundleManifest>;
  const errors: string[] = [];

  if (bundle.version !== 1) {
    errors.push("Bundle version must be 1.");
  }

  if (typeof bundle.bundleId !== "string" || bundle.bundleId.trim().length === 0) {
    errors.push("Bundle must include a non-empty bundleId.");
  }

  if (!Array.isArray(bundle.assets)) {
    errors.push("Bundle assets must be an array.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const assetIds = new Set<string>();
  const assets = bundle.assets as SpatialAssetManifest[];
  assets.forEach((asset, index) => {
    validateSpatialAssetManifest(asset, index, assetIds, errors);
  });

  return errors.length === 0
    ? { ok: true, bundle: { ...(bundle as Omit<SpatialBundleManifest, "assets">), assets } }
    : { ok: false, errors };
}

function validateSpatialAssetManifest(
  value: unknown,
  index: number,
  assetIds: Set<string>,
  errors: string[],
) {
  if (!value || typeof value !== "object") {
    errors.push(`Asset ${index + 1} must be an object.`);
    return;
  }

  const asset = value as Partial<SpatialAssetManifest>;
  const prefix = `Asset ${index + 1}`;

  if (typeof asset.id !== "string" || asset.id.trim().length === 0) {
    errors.push(`${prefix} must include a non-empty id.`);
  } else if (assetIds.has(asset.id)) {
    errors.push(`${prefix} uses duplicate id "${asset.id}".`);
  } else {
    assetIds.add(asset.id);
  }

  if (!asset.role || !VALID_ROLES.has(asset.role)) {
    errors.push(`${prefix} must use a valid role.`);
  }

  if (!isAnchorRecord(asset.anchors)) {
    errors.push(`${prefix} anchors must be a map of 3D tuples.`);
  } else if (asset.role) {
    const requiredAnchors = REQUIRED_ANCHORS[asset.role];
    requiredAnchors.forEach((anchorId) => {
      if (!(anchorId in asset.anchors!)) {
        errors.push(`${prefix} is missing required anchor "${anchorId}".`);
      }
    });
  }

  if (!Array.isArray(asset.proxies)) {
    errors.push(`${prefix} must include a spatial proxy array.`);
  } else if (asset.proxies.length === 0 && asset.role !== "backdrop") {
    errors.push(`${prefix} must include at least one spatial proxy.`);
  } else {
    asset.proxies.forEach((proxy, proxyIndex) => {
      if (!isSpatialProxyShape(proxy)) {
        errors.push(`${prefix} proxy ${proxyIndex + 1} is invalid.`);
      }
    });
  }

  if (!isMetricRecord(asset.metrics)) {
    errors.push(`${prefix} metrics must be a number map.`);
  }

  if (
    asset.clearance &&
    (!isRecord(asset.clearance) || Object.values(asset.clearance).some((item) => typeof item !== "number"))
  ) {
    errors.push(`${prefix} clearance values must be numeric.`);
  }

  if (
    asset.solveAxes &&
    (!Array.isArray(asset.solveAxes) || asset.solveAxes.some((axis) => !VALID_SOLVE_AXES.has(axis)))
  ) {
    errors.push(`${prefix} solveAxes must only contain x, y, or z.`);
  }

  if (
    asset.fallbacks &&
    (!Array.isArray(asset.fallbacks) || asset.fallbacks.some((item) => typeof item !== "string" || item.trim().length === 0))
  ) {
    errors.push(`${prefix} fallbacks must be a string array.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isVec3Tuple(value: unknown): value is Vec3Tuple {
  return Array.isArray(value) && value.length === 3 && value.every((item) => typeof item === "number");
}

function isAnchorRecord(value: unknown): value is Record<string, Vec3Tuple> {
  return isRecord(value) && Object.values(value).every((entry) => isVec3Tuple(entry));
}

function isMetricRecord(value: unknown): value is Record<string, number> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === "number");
}

function isSpatialProxyShape(value: unknown): value is SpatialProxy {
  if (!value || typeof value !== "object") return false;
  const proxy = value as Partial<SpatialProxy>;

  if (typeof proxy.id !== "string" || !isVec3Tuple(proxy.offset)) {
    return false;
  }

  if (proxy.type === "box") {
    return isVec3Tuple(proxy.size);
  }

  if (proxy.type === "sphere") {
    return typeof proxy.radius === "number";
  }

  return false;
}

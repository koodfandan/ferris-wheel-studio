export type Vec3Tuple = [number, number, number];
export type SolveAxis = "x" | "y" | "z";
export type StageRole = "base" | "frame" | "backdrop" | "character" | "prop";

export type SpatialProxy =
  | {
      id: string;
      type: "box";
      size: Vec3Tuple;
      offset: Vec3Tuple;
    }
  | {
      id: string;
      type: "sphere";
      radius: number;
      offset: Vec3Tuple;
    };

export type SpatialClearance = {
  top: number;
  bottom: number;
  front: number;
  back: number;
  side: number;
};

export type SpatialAssetDefinition = {
  id: string;
  role: StageRole;
  anchors: Record<string, Vec3Tuple>;
  proxies: SpatialProxy[];
  clearance: SpatialClearance;
  solveAxes: SolveAxis[];
  metrics: Record<string, number>;
  fallbacks: string[];
};

export type SpatialPlacement = {
  id: string;
  position: Vec3Tuple;
};

export type SpatialWarning = {
  code:
    | "missing-anchor"
    | "base-frame-clearance"
    | "frame-backdrop-clearance"
    | "support-underflow"
    | "character-frame-clearance"
    | "prop-frame-clearance";
  message: string;
};

export type StageSpatialSolution = {
  placements: Record<string, SpatialPlacement>;
  warnings: SpatialWarning[];
  metrics: {
    baseTopY: number;
    ringOuterRadius: number;
    ringDepth: number;
    ringCenterY: number;
    ringZ: number;
    supportTopY: number;
    supportMidY: number;
    supportHeight: number;
    backdropY: number;
    backdropZ: number;
    backdropHeight: number;
    characterY: number;
    characterZ: number;
    propX: number;
    propY: number;
    propZ: number;
  };
};

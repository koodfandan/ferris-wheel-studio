import type { StageSpatialSolution, SpatialAssetDefinition, SpatialWarning } from "./spatial-types";

type ValidateArgs = {
  solution: StageSpatialSolution;
  base: SpatialAssetDefinition;
  frame: SpatialAssetDefinition;
  backdrop: SpatialAssetDefinition;
  character: SpatialAssetDefinition;
  prop: SpatialAssetDefinition;
};

export function validateStageSpatialSolution({
  solution,
  base,
  frame,
  backdrop,
  character,
  prop,
}: ValidateArgs): SpatialWarning[] {
  const warnings: SpatialWarning[] = [...solution.warnings];
  const { metrics } = solution;
  const frameBottomY = metrics.ringCenterY - metrics.ringOuterRadius;
  const frameBackZ = metrics.ringZ - metrics.ringDepth / 2;
  const backdropFrontZ = metrics.backdropZ + backdrop.metrics.thickness / 2;
  const baseGap = frameBottomY - metrics.baseTopY;
  const backdropGap = frameBackZ - backdropFrontZ;

  if (baseGap < frame.clearance.bottom) {
    warnings.push({
      code: "base-frame-clearance",
      message: `Frame bottom gap ${baseGap.toFixed(3)} is below required ${frame.clearance.bottom.toFixed(3)}.`,
    });
  }

  if (backdrop.metrics.thickness > 0 && backdropGap < frame.clearance.back) {
    warnings.push({
      code: "frame-backdrop-clearance",
      message: `Frame/backdrop gap ${backdropGap.toFixed(3)} is below required ${frame.clearance.back.toFixed(3)}.`,
    });
  }

  if (metrics.supportHeight <= 0.9) {
    warnings.push({
      code: "support-underflow",
      message: `Support height ${metrics.supportHeight.toFixed(3)} is too small for a stable frame mount.`,
    });
  }

  if (!base.anchors.frame_mount || !base.anchors.backdrop_mount) {
    warnings.push({
      code: "missing-anchor",
      message: "Base asset is missing required anchors for frame/backdrop mounting.",
    });
  }

  const frameFrontZ = metrics.ringZ + metrics.ringDepth / 2;
  const characterGap = metrics.characterZ - frameFrontZ;
  if (characterGap < character.clearance.back) {
    warnings.push({
      code: "character-frame-clearance",
      message: `Character/frame gap ${characterGap.toFixed(3)} is below required ${character.clearance.back.toFixed(3)}.`,
    });
  }

  const propGap = metrics.propZ - frameFrontZ;
  if (propGap < prop.clearance.back) {
    warnings.push({
      code: "prop-frame-clearance",
      message: `Prop/frame gap ${propGap.toFixed(3)} is below required ${prop.clearance.back.toFixed(3)}.`,
    });
  }

  return warnings;
}

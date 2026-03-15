import type { Material, Object3D } from "three";
import { MeshPhysicalMaterial, MeshStandardMaterial } from "three";

const SOFT_SURFACE = /skin|face|body|costume|cloth/i;
const GLOW_SURFACE = /emit|glow|light/i;
const CLEAR_SURFACE = /clear|glass|candy|trans/i;

export const GLB_NODE_GUIDE = [
  "Turntable",
  "Figure",
  "Wheel",
  "Cabins",
  "Base",
] as const;

export const GLB_MATERIAL_GUIDE = [
  "MAT_Skin",
  "MAT_Costume",
  "MAT_GlossTrim",
  "MAT_ClearCandy",
  "MAT_MetalGold",
  "MAT_EmitWarm",
] as const;

export function prepareGlbScene(scene: Object3D) {
  scene.traverse((object: any) => {
    if (!object?.isMesh) return;

    object.castShadow = true;
    object.receiveShadow = true;

    if (Array.isArray(object.material)) {
      object.material = object.material.map((material: Material) => tuneMaterial(material));
      return;
    }

    object.material = tuneMaterial(object.material);
  });

  return scene;
}

function tuneMaterial(material: Material | null | undefined) {
  if (!material) return material;

  const cloned = material.clone();
  const name = cloned.name ?? "";

  if (!(cloned instanceof MeshStandardMaterial || cloned instanceof MeshPhysicalMaterial)) {
    return cloned;
  }

  cloned.envMapIntensity = CLEAR_SURFACE.test(name) ? 0.32 : 0.48;
  cloned.emissiveIntensity = GLOW_SURFACE.test(name)
    ? Math.min(cloned.emissiveIntensity || 0.8, 0.9)
    : Math.min(cloned.emissiveIntensity || 0, 0.08);

  if (SOFT_SURFACE.test(name)) {
    cloned.metalness = 0.02;
    cloned.roughness = Math.max(cloned.roughness ?? 0.48, 0.54);
    if (cloned instanceof MeshPhysicalMaterial) {
      cloned.clearcoat = Math.min(cloned.clearcoat ?? 0, 0.1);
      cloned.transmission = 0;
    }
  }

  if (CLEAR_SURFACE.test(name) && cloned instanceof MeshPhysicalMaterial) {
    cloned.transmission = Math.min(cloned.transmission || 0.84, 0.88);
    cloned.roughness = Math.max(cloned.roughness ?? 0.06, 0.08);
    cloned.clearcoat = Math.min(Math.max(cloned.clearcoat ?? 0.28, 0.28), 0.48);
  }

  cloned.needsUpdate = true;
  return cloned;
}

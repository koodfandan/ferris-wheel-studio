import { Box, Cylinder, RoundedBox, Sphere, Torus } from "@react-three/drei";
import type { CharacterPrototypeId } from "../../lib/character-prototypes";
import type { StageMode, StudioRecipe, StudioSlot } from "../../lib/studio-system";
import { getPaletteOption } from "../../lib/studio-system";
import type { StageLayout } from "./stage-layout";

type Props = {
  recipe: StudioRecipe;
  focusSlot: StudioSlot;
  stageMode: StageMode;
  layout: StageLayout;
  activePrototype: CharacterPrototypeId;
};

type PaletteColors = ReturnType<typeof getPaletteOption>["colors"];

type PrototypeRigProfile = {
  headScale: number;
  bodyScale: [number, number, number];
  bodyLift: number;
  headLift: number;
  propOffset: [number, number, number];
};

const PROTOTYPE_RIG: Record<CharacterPrototypeId, PrototypeRigProfile> = {
  "human-luna": { headScale: 1.16, bodyScale: [0.94, 0.9, 0.94], bodyLift: 0.24, headLift: 1.74, propOffset: [0, 0, 0] },
  "human-coco": { headScale: 1.2, bodyScale: [0.98, 0.84, 0.98], bodyLift: 0.22, headLift: 1.7, propOffset: [0.02, -0.02, 0.04] },
  "human-aria": { headScale: 1.08, bodyScale: [0.9, 0.98, 0.9], bodyLift: 0.28, headLift: 1.78, propOffset: [0, 0.04, 0] },
  "animal-bunny": { headScale: 1.18, bodyScale: [0.94, 0.88, 0.94], bodyLift: 0.2, headLift: 1.72, propOffset: [0, 0, 0.02] },
  "animal-bear": { headScale: 1.14, bodyScale: [1, 0.9, 1], bodyLift: 0.2, headLift: 1.66, propOffset: [0.02, -0.04, 0.04] },
  "animal-fox": { headScale: 1.1, bodyScale: [0.88, 0.9, 0.88], bodyLift: 0.24, headLift: 1.68, propOffset: [-0.02, 0, 0.06] },
  "creature-axolotl": { headScale: 1.16, bodyScale: [0.94, 0.92, 0.94], bodyLift: 0.24, headLift: 1.74, propOffset: [0, -0.02, 0.02] },
  "creature-cloudling": { headScale: 1.22, bodyScale: [0.96, 0.82, 0.96], bodyLift: 0.2, headLift: 1.68, propOffset: [0, 0, 0.04] },
  "creature-starmoth": { headScale: 1.1, bodyScale: [0.88, 0.96, 0.88], bodyLift: 0.28, headLift: 1.76, propOffset: [0.02, 0.02, 0.04] },
  "robot-botu": { headScale: 1.08, bodyScale: [0.98, 0.94, 0.98], bodyLift: 0.2, headLift: 1.66, propOffset: [0, 0, 0] },
  "robot-capsule": { headScale: 1.02, bodyScale: [1.04, 1.02, 1.04], bodyLift: 0.18, headLift: 1.62, propOffset: [0, -0.02, 0.04] },
  "robot-dronecat": { headScale: 1.12, bodyScale: [0.94, 0.94, 0.94], bodyLift: 0.2, headLift: 1.7, propOffset: [0.02, 0.04, 0.02] },
};

function matchesPart(id: string, token: string) {
  if (id === token || id.startsWith(`${token}-`)) return true;

  const tokenParts = token.split("-");
  const variant = tokenParts[tokenParts.length - 1] ?? token;
  if (id.endsWith(`-${variant}`) || id.includes(`-${variant}-`)) return true;

  if (variant === "sleepy") {
    return id.endsWith("-dream") || id.includes("-dream-");
  }

  return false;
}

export function StageFigure({ recipe, focusSlot, stageMode, layout, activePrototype }: Props) {
  const palette = getPaletteOption(recipe.palette);
  const colors = palette.colors;
  const characterPlacement = layout.placements.character?.position ?? [0, 0.08, 0.38];
  const propPlacement = layout.placements.prop?.position ?? [0.82, 0.86, 0.82];
  const localPropOffset: [number, number, number] = [
    propPlacement[0] - characterPlacement[0],
    propPlacement[1] - characterPlacement[1],
    propPlacement[2] - characterPlacement[2],
  ];

  return (
    <group position={[0, -1.24, 0.04]} scale={0.96}>
      <StageSupports colors={colors} layout={layout} />

      <group position={layout.placements.frame?.position ?? [0, layout.metrics.ringCenterY, layout.metrics.ringZ]}>
        <StageFrame
          variant={recipe.frame}
          colors={colors}
          emphasized={focusSlot === "frame"}
          stageMode={stageMode}
        />
        <StagePods variant={recipe.pods} colors={colors} emphasized={focusSlot === "pods"} />
      </group>

      <CollectorCharacter
        recipe={recipe}
        activePrototype={activePrototype}
        colors={colors}
        focusSlot={focusSlot}
        position={characterPlacement}
        propOffset={localPropOffset}
      />
    </group>
  );
}

function CollectorCharacter({
  recipe,
  activePrototype,
  colors,
  focusSlot,
  position,
  propOffset,
}: {
  recipe: StudioRecipe;
  activePrototype: CharacterPrototypeId;
  colors: PaletteColors;
  focusSlot: StudioSlot;
  position: [number, number, number];
  propOffset: [number, number, number];
}) {
  const rig = PROTOTYPE_RIG[activePrototype];
  const adjustedPropOffset: [number, number, number] = [
    propOffset[0] + rig.propOffset[0],
    propOffset[1] + rig.propOffset[1],
    propOffset[2] + rig.propOffset[2],
  ];

  return (
    <group position={position}>
      <group position={[0, rig.bodyLift, 0]} scale={rig.bodyScale}>
        <CharacterBody outfit={recipe.outfit} colors={colors} emphasized={focusSlot === "outfit"} />
      </group>
      <PrototypeBodyAccent prototypeId={activePrototype} colors={colors} emphasized={focusSlot === "outfit"} />
      <CharacterProp
        propId={recipe.prop}
        colors={colors}
        emphasized={focusSlot === "prop"}
        offset={adjustedPropOffset}
      />

      <group position={[0, rig.headLift, 0.02]} scale={rig.headScale}>
        <SpeciesSilhouette
          species={recipe.species}
          silhouette={recipe.silhouette}
          colors={colors}
          emphasized={focusSlot === "silhouette"}
        />
        <PrototypeHeadAccent prototypeId={activePrototype} colors={colors} emphasized={focusSlot === "silhouette"} />

        <Sphere args={[0.96, 40, 40]} position={[0, 0, 0]}>
          <meshStandardMaterial color={colors.skin} roughness={0.82} metalness={0} />
        </Sphere>

        <FacePrint expression={recipe.expression} colors={colors} emphasized={focusSlot === "expression"} />
        <Headpiece pieceId={recipe.headpiece} colors={colors} emphasized={focusSlot === "headpiece"} />
      </group>
    </group>
  );
}

function StageSupports({
  colors,
  layout,
}: {
  colors: PaletteColors;
  layout: StageLayout;
}) {
  return (
    <group>
      <Cylinder
        args={[0.08, 0.1, layout.metrics.supportHeight, 16]}
        position={layout.placements.supportLeft?.position ?? [-1.3, layout.metrics.supportMidY, layout.metrics.ringZ]}
        rotation={[0, 0, 0.36]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.22} />
      </Cylinder>
      <Cylinder
        args={[0.08, 0.1, layout.metrics.supportHeight, 16]}
        position={layout.placements.supportRight?.position ?? [1.3, layout.metrics.supportMidY, layout.metrics.ringZ]}
        rotation={[0, 0, -0.36]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.22} />
      </Cylinder>
      <RoundedBox
        args={[2.46, 0.12, 0.14]}
        radius={0.06}
        smoothness={4}
        position={layout.placements.supportBar?.position ?? [0, layout.metrics.supportTopY, layout.metrics.ringZ - 0.02]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.22} />
      </RoundedBox>
    </group>
  );
}

function CharacterBody({
  outfit,
  colors,
  emphasized,
}: {
  outfit: string;
  colors: PaletteColors;
  emphasized: boolean;
}) {
  const lift = emphasized ? 0.05 : 0;
  const ribbonGlow = emphasized ? 0.08 : 0;

  if (matchesPart(outfit, "outfit-fairdress")) {
    return (
      <group position={[0, 0.26 + lift, 0]}>
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.86, 1.18, 36]} />
          <meshStandardMaterial color={colors.body} roughness={0.66} />
        </mesh>
        <RoundedBox args={[1.18, 0.52, 0.92]} radius={0.22} smoothness={6} position={[0, 0.74, 0.02]}>
          <meshStandardMaterial color={colors.body} roughness={0.68} />
        </RoundedBox>
        <Torus args={[0.32, 0.08, 12, 24]} position={[0, 0.66, 0.44]}>
          <meshStandardMaterial color={colors.accent} roughness={0.44} emissive={colors.accentSoft} emissiveIntensity={ribbonGlow} />
        </Torus>
      </group>
    );
  }

  if (matchesPart(outfit, "outfit-plush")) {
    return (
      <group position={[0, 0.18 + lift, 0]}>
        <Sphere args={[0.88, 36, 36]} position={[0, 0.44, 0]}>
          <meshStandardMaterial color={colors.body} roughness={0.88} />
        </Sphere>
        <Sphere args={[0.24, 20, 20]} position={[-0.58, 0.46, 0.28]}>
          <meshStandardMaterial color={colors.shell} roughness={0.92} />
        </Sphere>
        <Sphere args={[0.24, 20, 20]} position={[0.58, 0.46, 0.28]}>
          <meshStandardMaterial color={colors.shell} roughness={0.92} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(outfit, "outfit-cape")) {
    return (
      <group position={[0, 0.28 + lift, 0]}>
        <RoundedBox args={[1.08, 1.18, 0.86]} radius={0.28} smoothness={6} position={[0, 0.6, 0]}>
          <meshStandardMaterial color={colors.body} roughness={0.74} />
        </RoundedBox>
        <mesh position={[0, 0.28, -0.2]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.96, 1.1, 40]} />
          <meshStandardMaterial color={colors.hair} roughness={0.8} />
        </mesh>
        <Sphere args={[0.16, 18, 18]} position={[0, 0.96, 0.46]}>
          <meshStandardMaterial color={colors.metal} roughness={0.38} metalness={0.28} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(outfit, "outfit-pod")) {
    return (
      <group position={[0, 0.2 + lift, 0]}>
        <RoundedBox args={[1.32, 1.28, 1]} radius={0.34} smoothness={8} position={[0, 0.58, 0]}>
          <meshStandardMaterial color={colors.body} roughness={0.58} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.84, 0.54, 0.14]} radius={0.12} smoothness={4} position={[0, 0.8, 0.48]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.2} metalness={0.18} />
        </RoundedBox>
        <Cylinder args={[0.1, 0.1, 0.3, 18]} position={[-0.6, 0.18, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.3} />
        </Cylinder>
        <Cylinder args={[0.1, 0.1, 0.3, 18]} position={[0.6, 0.18, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.3} />
        </Cylinder>
      </group>
    );
  }

  return (
    <group position={[0, 0.22 + lift, 0]}>
      <RoundedBox args={[1.18, 1.18, 0.9]} radius={0.28} smoothness={6} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[0.52, 0.16, 0.12]} radius={0.06} smoothness={4} position={[0, 0.72, 0.44]}>
        <meshStandardMaterial color={colors.accent} roughness={0.44} emissive={colors.accentSoft} emissiveIntensity={ribbonGlow} />
      </RoundedBox>
    </group>
  );
}

function PrototypeBodyAccent({
  prototypeId,
  colors,
  emphasized,
}: {
  prototypeId: CharacterPrototypeId;
  colors: PaletteColors;
  emphasized: boolean;
}) {
  const glow = emphasized ? 0.22 : 0.08;

  if (prototypeId === "human-luna") {
    return (
      <Torus args={[0.68, 0.06, 14, 32]} position={[0, 1.0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={colors.glowSoft} emissive={colors.glow} emissiveIntensity={glow} roughness={0.22} />
      </Torus>
    );
  }

  if (prototypeId === "human-coco") {
    return (
      <group position={[0, 0.74, 0]}>
        <Sphere args={[0.16, 16, 16]} position={[-0.64, 0.12, 0.22]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.42} />
        </Sphere>
        <Sphere args={[0.16, 16, 16]} position={[0.64, 0.12, 0.22]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.42} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "human-aria") {
    return (
      <group position={[0, 0.62, -0.08]}>
        {Array.from({ length: 6 }, (_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          return (
            <Sphere key={index} args={[0.1, 14, 14]} position={[Math.cos(angle) * 0.44, -0.1, Math.sin(angle) * 0.44]}>
              <meshStandardMaterial color={colors.glowSoft} emissive={colors.glow} emissiveIntensity={glow * 0.6} />
            </Sphere>
          );
        })}
      </group>
    );
  }

  if (prototypeId === "animal-bunny") {
    return (
      <group position={[0, 0.5, 0.36]}>
        <Sphere args={[0.14, 14, 14]} position={[-0.4, -0.1, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.78} />
        </Sphere>
        <Sphere args={[0.14, 14, 14]} position={[0.4, -0.1, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.78} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "animal-bear") {
    return (
      <Sphere args={[0.2, 16, 16]} position={[0, 0.58, 0.42]}>
        <meshStandardMaterial color={colors.shell} roughness={0.8} />
      </Sphere>
    );
  }

  if (prototypeId === "animal-fox") {
    return (
      <group position={[0.6, 0.48, -0.28]} rotation={[0, -0.26, 0.2]}>
        <Sphere args={[0.22, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color={colors.hair} roughness={0.62} />
        </Sphere>
        <Sphere args={[0.18, 16, 16]} position={[0.2, -0.12, -0.08]}>
          <meshStandardMaterial color={colors.shell} roughness={0.72} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "creature-axolotl") {
    return (
      <group position={[0, 0.68, -0.18]}>
        <RoundedBox args={[1.16, 0.24, 0.12]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.44} emissive={colors.glowSoft} emissiveIntensity={glow * 0.5} />
        </RoundedBox>
      </group>
    );
  }

  if (prototypeId === "creature-cloudling") {
    return (
      <group position={[0, 0.56, -0.14]}>
        <Sphere args={[0.2, 16, 16]} position={[-0.36, 0, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.22, 16, 16]} position={[0, 0.08, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.2, 16, 16]} position={[0.36, 0, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.8} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "creature-starmoth") {
    return (
      <group position={[0, 0.72, -0.34]}>
        <RoundedBox args={[0.72, 0.36, 0.08]} radius={0.12} smoothness={4} position={[-0.4, 0, 0]} rotation={[0, 0.28, 0]}>
          <meshStandardMaterial color={colors.glowSoft} emissive={colors.glow} emissiveIntensity={glow * 0.7} roughness={0.24} />
        </RoundedBox>
        <RoundedBox args={[0.72, 0.36, 0.08]} radius={0.12} smoothness={4} position={[0.4, 0, 0]} rotation={[0, -0.28, 0]}>
          <meshStandardMaterial color={colors.glowSoft} emissive={colors.glow} emissiveIntensity={glow * 0.7} roughness={0.24} />
        </RoundedBox>
      </group>
    );
  }

  if (prototypeId === "robot-botu") {
    return (
      <RoundedBox args={[0.76, 0.34, 0.14]} radius={0.12} smoothness={4} position={[0, 0.72, 0.48]}>
        <meshStandardMaterial color={colors.glass} roughness={0.16} metalness={0.2} emissive={colors.glowSoft} emissiveIntensity={glow * 0.45} />
      </RoundedBox>
    );
  }

  if (prototypeId === "robot-capsule") {
    return (
      <Torus args={[0.52, 0.08, 10, 24]} position={[0, 0.62, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.22} metalness={0.3} />
      </Torus>
    );
  }

  if (prototypeId === "robot-dronecat") {
    return (
      <group position={[0, 0.92, 0]}>
        <Cylinder args={[0.08, 0.08, 0.42, 12]} position={[-0.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.32} />
        </Cylinder>
        <Cylinder args={[0.08, 0.08, 0.42, 12]} position={[0.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.32} />
        </Cylinder>
      </group>
    );
  }

  return null;
}

function PrototypeHeadAccent({
  prototypeId,
  colors,
  emphasized,
}: {
  prototypeId: CharacterPrototypeId;
  colors: PaletteColors;
  emphasized: boolean;
}) {
  const glow = emphasized ? 0.24 : 0.1;

  if (prototypeId === "human-luna") {
    return (
      <Torus args={[0.92, 0.05, 10, 36, Math.PI * 1.5]} position={[0, 0.44, -0.38]} rotation={[0.2, 0.2, 0.02]}>
        <meshStandardMaterial color={colors.glowSoft} emissive={colors.glow} emissiveIntensity={glow} roughness={0.2} />
      </Torus>
    );
  }

  if (prototypeId === "human-coco") {
    return (
      <group>
        <Sphere args={[0.26, 16, 16]} position={[-0.74, 0.52, -0.08]}>
          <meshStandardMaterial color={colors.hair} roughness={0.66} />
        </Sphere>
        <Sphere args={[0.26, 16, 16]} position={[0.74, 0.52, -0.08]}>
          <meshStandardMaterial color={colors.hair} roughness={0.66} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "human-aria") {
    return (
      <group position={[0, 0.88, 0.12]}>
        {Array.from({ length: 5 }, (_, index) => {
          const angle = (-Math.PI / 2) + (index / 4) * Math.PI;
          return (
            <Sphere key={index} args={[0.09, 12, 12]} position={[Math.cos(angle) * 0.36, Math.sin(angle) * 0.16, 0]}>
              <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={glow} />
            </Sphere>
          );
        })}
      </group>
    );
  }

  if (prototypeId === "animal-bunny") {
    return (
      <group>
        <Cylinder args={[0.12, 0.16, 1.34, 14]} position={[-0.34, 1.14, -0.08]} rotation={[0, 0, -0.16]}>
          <meshStandardMaterial color={colors.body} roughness={0.88} />
        </Cylinder>
        <Cylinder args={[0.12, 0.16, 1.34, 14]} position={[0.34, 1.14, -0.08]} rotation={[0, 0, 0.16]}>
          <meshStandardMaterial color={colors.body} roughness={0.88} />
        </Cylinder>
      </group>
    );
  }

  if (prototypeId === "animal-bear") {
    return (
      <group>
        <Sphere args={[0.28, 16, 16]} position={[-0.64, 0.72, -0.12]}>
          <meshStandardMaterial color={colors.hair} roughness={0.86} />
        </Sphere>
        <Sphere args={[0.28, 16, 16]} position={[0.64, 0.72, -0.12]}>
          <meshStandardMaterial color={colors.hair} roughness={0.86} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "animal-fox") {
    return (
      <group>
        <mesh position={[-0.58, 0.84, -0.08]} rotation={[0, 0, -0.32]}>
          <coneGeometry args={[0.22, 0.52, 14]} />
          <meshStandardMaterial color={colors.hair} roughness={0.62} />
        </mesh>
        <mesh position={[0.58, 0.84, -0.08]} rotation={[0, 0, 0.32]}>
          <coneGeometry args={[0.22, 0.52, 14]} />
          <meshStandardMaterial color={colors.hair} roughness={0.62} />
        </mesh>
      </group>
    );
  }

  if (prototypeId === "creature-axolotl") {
    return (
      <group>
        <RoundedBox args={[0.68, 0.12, 0.1]} radius={0.05} smoothness={4} position={[-0.82, 0.2, -0.18]} rotation={[0, 0, 0.48]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.34} emissive={colors.glowSoft} emissiveIntensity={glow * 0.5} />
        </RoundedBox>
        <RoundedBox args={[0.68, 0.12, 0.1]} radius={0.05} smoothness={4} position={[0.82, 0.2, -0.18]} rotation={[0, 0, -0.48]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.34} emissive={colors.glowSoft} emissiveIntensity={glow * 0.5} />
        </RoundedBox>
      </group>
    );
  }

  if (prototypeId === "creature-cloudling") {
    return (
      <group position={[0, 0.86, 0]}>
        <Sphere args={[0.16, 14, 14]} position={[-0.28, 0, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.19, 14, 14]} position={[0, 0.08, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.16, 14, 14]} position={[0.28, 0, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.8} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "creature-starmoth") {
    return (
      <group position={[0, 0.88, -0.12]}>
        <Cylinder args={[0.02, 0.02, 0.32, 10]} position={[-0.24, 0.16, 0]} rotation={[0, 0, -0.24]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.26} />
        </Cylinder>
        <Cylinder args={[0.02, 0.02, 0.32, 10]} position={[0.24, 0.16, 0]} rotation={[0, 0, 0.24]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.26} />
        </Cylinder>
        <Sphere args={[0.08, 12, 12]} position={[-0.3, 0.34, 0]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={glow} />
        </Sphere>
        <Sphere args={[0.08, 12, 12]} position={[0.3, 0.34, 0]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={glow} />
        </Sphere>
      </group>
    );
  }

  if (prototypeId === "robot-botu") {
    return (
      <RoundedBox args={[1.34, 0.38, 0.1]} radius={0.14} smoothness={4} position={[0, 0.1, 0.76]}>
        <meshStandardMaterial color={colors.glass} roughness={0.14} metalness={0.18} />
      </RoundedBox>
    );
  }

  if (prototypeId === "robot-capsule") {
    return (
      <Torus args={[0.9, 0.06, 10, 28]} position={[0, 0.06, -0.28]}>
        <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.32} />
      </Torus>
    );
  }

  if (prototypeId === "robot-dronecat") {
    return (
      <group position={[0, 0.9, 0]}>
        <Cylinder args={[0.04, 0.04, 0.46, 12]} position={[-0.28, 0.22, 0]} rotation={[0, 0, -0.18]}>
          <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.32} />
        </Cylinder>
        <Cylinder args={[0.04, 0.04, 0.46, 12]} position={[0.28, 0.22, 0]} rotation={[0, 0, 0.18]}>
          <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.32} />
        </Cylinder>
        <Sphere args={[0.1, 12, 12]} position={[-0.34, 0.46, 0]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={glow * 0.8} />
        </Sphere>
        <Sphere args={[0.1, 12, 12]} position={[0.34, 0.46, 0]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={glow * 0.8} />
        </Sphere>
      </group>
    );
  }

  return null;
}

function SpeciesSilhouette({
  species,
  silhouette,
  colors,
  emphasized,
}: {
  species: string;
  silhouette: string;
  colors: PaletteColors;
  emphasized: boolean;
}) {
  const zOffset = emphasized ? -0.06 : -0.1;
  const glow = emphasized ? 0.1 : 0;

  if (matchesPart(silhouette, "silhouette-curl")) {
    return (
      <group>
        <Sphere args={[1.02, 34, 34]} position={[0, 0.1, zOffset]}>
          <meshStandardMaterial color={colors.hair} roughness={0.76} />
        </Sphere>
        <Sphere args={[0.42, 22, 22]} position={[-0.92, -0.18, 0.1]}>
          <meshStandardMaterial color={colors.hair} roughness={0.72} emissive={colors.accentSoft} emissiveIntensity={glow} />
        </Sphere>
        <Sphere args={[0.42, 22, 22]} position={[0.92, -0.18, 0.1]}>
          <meshStandardMaterial color={colors.hair} roughness={0.72} emissive={colors.accentSoft} emissiveIntensity={glow} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(silhouette, "silhouette-bunny")) {
    return (
      <group>
        <Sphere args={[1.02, 34, 34]} position={[0, 0.02, zOffset]}>
          <meshStandardMaterial color={colors.body} roughness={0.86} />
        </Sphere>
        <Cylinder args={[0.18, 0.22, 1.28, 18]} position={[-0.42, 1.08, -0.04]} rotation={[0, 0, -0.18]}>
          <meshStandardMaterial color={colors.body} roughness={0.9} />
        </Cylinder>
        <Cylinder args={[0.18, 0.22, 1.28, 18]} position={[0.42, 1.08, -0.04]} rotation={[0, 0, 0.18]}>
          <meshStandardMaterial color={colors.body} roughness={0.9} />
        </Cylinder>
      </group>
    );
  }

  if (matchesPart(silhouette, "silhouette-bear")) {
    return (
      <group>
        <Sphere args={[1.02, 34, 34]} position={[0, 0.06, zOffset]}>
          <meshStandardMaterial color={colors.hair} roughness={0.88} />
        </Sphere>
        <Sphere args={[0.34, 22, 22]} position={[-0.76, 0.76, -0.1]}>
          <meshStandardMaterial color={colors.hair} roughness={0.92} />
        </Sphere>
        <Sphere args={[0.34, 22, 22]} position={[0.76, 0.76, -0.1]}>
          <meshStandardMaterial color={colors.hair} roughness={0.92} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(silhouette, "silhouette-foam")) {
    return (
      <group>
        <Sphere args={[1.02, 34, 34]} position={[0, 0.06, zOffset]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.78} />
        </Sphere>
        <Sphere args={[0.28, 18, 18]} position={[-0.62, 1.0, -0.08]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.3, 18, 18]} position={[0, 1.16, -0.12]}>
          <meshStandardMaterial color={colors.shell} roughness={0.84} />
        </Sphere>
        <Sphere args={[0.28, 18, 18]} position={[0.62, 1.0, -0.08]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.8} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(silhouette, "silhouette-shell")) {
    return (
      <group>
        <RoundedBox args={[2.0, 1.76, 1.46]} radius={0.58} smoothness={8} position={[0, 0.04, -0.18]}>
          <meshStandardMaterial color={colors.hair} roughness={0.44} metalness={0.12} />
        </RoundedBox>
        <RoundedBox args={[1.62, 0.82, 0.14]} radius={0.2} smoothness={4} position={[0, 0.12, 0.62]}>
          <meshStandardMaterial color={colors.glass} roughness={0.12} metalness={0.16} />
        </RoundedBox>
      </group>
    );
  }

  return (
    <group>
      <Sphere args={[1.02, 34, 34]} position={[0, 0.06, zOffset]}>
        <meshStandardMaterial color={species === "human" ? colors.hair : colors.body} roughness={0.78} />
      </Sphere>
      <Sphere args={[0.36, 20, 20]} position={[-0.72, 0.28, -0.06]}>
        <meshStandardMaterial color={species === "human" ? colors.hair : colors.body} roughness={0.8} />
      </Sphere>
      <Sphere args={[0.36, 20, 20]} position={[0.72, 0.28, -0.06]}>
        <meshStandardMaterial color={species === "human" ? colors.hair : colors.body} roughness={0.8} />
      </Sphere>
    </group>
  );
}

function FacePrint({
  expression,
  colors,
  emphasized,
}: {
  expression: string;
  colors: PaletteColors;
  emphasized: boolean;
}) {
  const ink = colors.ink;
  const blushOpacity = emphasized ? 0.78 : 0.64;

  if (matchesPart(expression, "expression-led")) {
    return (
      <group position={[0, 0, 0.82]}>
        <RoundedBox args={[1.18, 0.66, 0.08]} radius={0.14} smoothness={4} position={[0, 0.02, 0]}>
          <meshStandardMaterial color={colors.glass} roughness={0.12} metalness={0.18} />
        </RoundedBox>
        <RoundedBox args={[0.26, 0.08, 0.08]} radius={0.04} smoothness={4} position={[-0.24, 0.04, 0.05]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.65} />
        </RoundedBox>
        <RoundedBox args={[0.26, 0.08, 0.08]} radius={0.04} smoothness={4} position={[0.24, 0.04, 0.05]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.65} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.04, 0.04]} radius={0.02} smoothness={4} position={[0, -0.14, 0.05]}>
          <meshStandardMaterial color={colors.accentSoft} />
        </RoundedBox>
      </group>
    );
  }

  return (
    <group position={[0, 0.04, 0.92]}>
      {matchesPart(expression, "expression-sleepy") ? (
        <>
          <mesh position={[-0.28, 0.08, 0]} rotation={[0.04, 0, 0]}>
            <torusGeometry args={[0.12, 0.02, 10, 18, Math.PI]} />
            <meshStandardMaterial color={ink} roughness={0.5} />
          </mesh>
          <mesh position={[0.28, 0.08, 0]} rotation={[0.04, 0, 0]}>
            <torusGeometry args={[0.12, 0.02, 10, 18, Math.PI]} />
            <meshStandardMaterial color={ink} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.12, 0]} rotation={[0.18, 0, 0]}>
            <torusGeometry args={[0.06, 0.012, 8, 18, Math.PI]} />
            <meshStandardMaterial color={ink} />
          </mesh>
        </>
      ) : matchesPart(expression, "expression-wink") ? (
        <>
          <FaceOpenEye x={-0.28} ink={ink} />
          <mesh position={[0.3, 0.08, 0]} rotation={[0.04, 0, 0]}>
            <torusGeometry args={[0.12, 0.02, 10, 18, Math.PI]} />
            <meshStandardMaterial color={ink} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.16, 0]} rotation={[0.18, 0, 0]}>
            <torusGeometry args={[0.1, 0.016, 8, 18, Math.PI]} />
            <meshStandardMaterial color={ink} />
          </mesh>
        </>
      ) : (
        <>
          <FaceOpenEye x={-0.28} ink={ink} />
          <FaceOpenEye x={0.28} ink={ink} />
          <mesh position={[0, -0.16, 0]} rotation={[0.18, 0, 0]}>
            <torusGeometry args={[0.12, 0.018, 8, 18, Math.PI]} />
            <meshStandardMaterial color={ink} />
          </mesh>
        </>
      )}

      <Sphere args={[0.14, 18, 18]} position={[-0.48, -0.12, -0.02]} scale={[1.2, 0.8, 0.26]}>
        <meshStandardMaterial color={colors.blush} transparent opacity={blushOpacity} />
      </Sphere>
      <Sphere args={[0.14, 18, 18]} position={[0.48, -0.12, -0.02]} scale={[1.2, 0.8, 0.26]}>
        <meshStandardMaterial color={colors.blush} transparent opacity={blushOpacity} />
      </Sphere>
    </group>
  );
}

function FaceOpenEye({ x, ink }: { x: number; ink: string }) {
  return (
    <>
      <Sphere args={[0.12, 16, 16]} position={[x, 0.02, 0]} scale={[1, 1.18, 0.28]}>
        <meshStandardMaterial color={ink} roughness={0.36} />
      </Sphere>
      <Sphere args={[0.04, 12, 12]} position={[x + 0.04, 0.08, 0.04]} scale={[1, 1, 0.4]}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </Sphere>
    </>
  );
}

function Headpiece({
  pieceId,
  colors,
  emphasized,
}: {
  pieceId: string;
  colors: PaletteColors;
  emphasized: boolean;
}) {
  const glow = emphasized ? 0.24 : 0.12;

  if (matchesPart(pieceId, "headpiece-cloud")) {
    return (
      <group position={[0, 0.96, 0.08]}>
        <Sphere args={[0.18, 18, 18]} position={[-0.34, 0, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.86} />
        </Sphere>
        <Sphere args={[0.22, 18, 18]} position={[0, 0.06, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.86} />
        </Sphere>
        <Sphere args={[0.18, 18, 18]} position={[0.34, 0, 0]}>
          <meshStandardMaterial color={colors.shell} roughness={0.86} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(pieceId, "headpiece-bow")) {
    return (
      <group position={[0, 0.9, 0.24]}>
        <Box args={[0.34, 0.22, 0.1]} position={[-0.14, 0, 0]} rotation={[0, 0, 0.46]}>
          <meshStandardMaterial color={colors.accent} roughness={0.4} />
        </Box>
        <Box args={[0.34, 0.22, 0.1]} position={[0.14, 0, 0]} rotation={[0, 0, -0.46]}>
          <meshStandardMaterial color={colors.accent} roughness={0.4} />
        </Box>
        <Sphere args={[0.09, 14, 14]} position={[0, 0, 0.06]}>
          <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.22} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(pieceId, "headpiece-halo")) {
    return (
      <Torus args={[0.86, 0.06, 12, 36, Math.PI * 1.45]} position={[0, 0.54, -0.4]} rotation={[0.2, 0.2, 0]}>
        <meshStandardMaterial color={colors.glowSoft} emissive={colors.glow} emissiveIntensity={glow} roughness={0.2} metalness={0.14} />
      </Torus>
    );
  }

  if (matchesPart(pieceId, "headpiece-antenna")) {
    return (
      <group position={[0, 0.88, 0.08]}>
        <Cylinder args={[0.03, 0.03, 0.48, 10]} position={[-0.26, 0.18, 0]} rotation={[0, 0, -0.18]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.28} />
        </Cylinder>
        <Cylinder args={[0.03, 0.03, 0.48, 10]} position={[0.26, 0.18, 0]} rotation={[0, 0, 0.18]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.28} />
        </Cylinder>
        <Sphere args={[0.08, 12, 12]} position={[-0.32, 0.42, 0]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.7} />
        </Sphere>
        <Sphere args={[0.08, 12, 12]} position={[0.32, 0.42, 0]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.7} />
        </Sphere>
      </group>
    );
  }

  return null;
}

function CharacterProp({
  propId,
  colors,
  emphasized,
  offset,
}: {
  propId: string;
  colors: PaletteColors;
  emphasized: boolean;
  offset: [number, number, number];
}) {
  const glow = emphasized ? 0.24 : 0.12;

  if (matchesPart(propId, "prop-ticket")) {
    return (
      <group position={offset} rotation={[0.2, -0.2, 0.28]}>
        <RoundedBox args={[0.18, 0.56, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color={colors.prop} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.56, 0.09]} radius={0.04} smoothness={4} position={[-0.04, 0, 0.02]}>
          <meshStandardMaterial color={colors.shell} roughness={0.62} />
        </RoundedBox>
      </group>
    );
  }

  if (matchesPart(propId, "prop-wand")) {
    return (
      <group position={offset} rotation={[0.1, -0.1, 0.3]}>
        <Cylinder args={[0.03, 0.03, 0.72, 12]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.28} />
        </Cylinder>
        <Sphere args={[0.12, 14, 14]} position={[0, 0.42, 0]}>
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.7 + glow} />
        </Sphere>
      </group>
    );
  }

  if (matchesPart(propId, "prop-lantern")) {
    return (
      <group position={offset}>
        <Cylinder args={[0.03, 0.03, 0.32, 12]} position={[0, 0.18, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.28} />
        </Cylinder>
        <RoundedBox args={[0.28, 0.32, 0.2]} radius={0.08} smoothness={4} position={[0, -0.04, 0]}>
          <meshStandardMaterial color={colors.glass} emissive={colors.glowSoft} emissiveIntensity={0.28 + glow} roughness={0.16} />
        </RoundedBox>
      </group>
    );
  }

  if (matchesPart(propId, "prop-battery")) {
    return (
      <group position={offset}>
        <RoundedBox args={[0.28, 0.44, 0.18]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={colors.prop} roughness={0.28} metalness={0.16} />
        </RoundedBox>
        <Cylinder args={[0.04, 0.04, 0.08, 10]} position={[-0.06, 0.24, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.3} />
        </Cylinder>
        <Cylinder args={[0.04, 0.04, 0.08, 10]} position={[0.06, 0.24, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.3} />
        </Cylinder>
      </group>
    );
  }

  return null;
}

function StageFrame({
  variant,
  colors,
  emphasized,
  stageMode,
}: {
  variant: string;
  colors: PaletteColors;
  emphasized: boolean;
  stageMode: StageMode;
}) {
  const shelfBoost = stageMode === "shelf" ? 0.08 : 0;
  const glow = (emphasized ? 0.2 : 0.06) + shelfBoost;

  if (variant === "frame-candy") {
    return (
      <group>
        <Torus args={[2.28, 0.18, 24, 120]}>
          <meshStandardMaterial color={colors.accent} roughness={0.34} emissive={colors.accentSoft} emissiveIntensity={glow} />
        </Torus>
        <Torus args={[1.96, 0.1, 20, 120]}>
          <meshStandardMaterial color={colors.shell} roughness={0.26} />
        </Torus>
        {Array.from({ length: 10 }, (_, index) => {
          const angle = (index / 10) * Math.PI * 2;
          return (
            <Sphere key={index} args={[0.1, 14, 14]} position={[Math.cos(angle) * 2.28, Math.sin(angle) * 2.28, 0]}>
              <meshStandardMaterial color={index % 2 === 0 ? colors.glow : colors.accentSoft} roughness={0.26} />
            </Sphere>
          );
        })}
      </group>
    );
  }

  if (variant === "frame-pearl") {
    return (
      <group rotation={[0, 0, -0.16]}>
        <mesh>
          <torusGeometry args={[2.18, 0.1, 18, 90, Math.PI * 1.55]} />
          <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.24} />
        </mesh>
        {Array.from({ length: 9 }, (_, index) => {
          const angle = -0.76 + (index / 8) * Math.PI * 1.45;
          return (
            <Sphere key={index} args={[0.12, 14, 14]} position={[Math.cos(angle) * 2.18, Math.sin(angle) * 2.18, 0.08]}>
              <meshStandardMaterial color={colors.shell} roughness={0.46} emissive={colors.glowSoft} emissiveIntensity={glow * 0.6} />
            </Sphere>
          );
        })}
      </group>
    );
  }

  if (variant === "frame-bulb") {
    return (
      <group>
        <Torus args={[2.18, 0.16, 16, 96]}>
          <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.24} />
        </Torus>
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return (
            <group key={index} position={[Math.cos(angle) * 2.18, Math.sin(angle) * 2.18, 0]}>
              <Sphere args={[0.12, 12, 12]}>
                <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.52 + glow} />
              </Sphere>
            </group>
          );
        })}
      </group>
    );
  }

  return (
    <group>
      <Torus args={[2.14, 0.15, 18, 120]}>
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.22} />
      </Torus>
      <Torus args={[1.92, 0.07, 18, 120]}>
        <meshStandardMaterial color={colors.glowSoft} roughness={0.12} emissive={colors.glow} emissiveIntensity={glow} />
      </Torus>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <Box key={index} args={[0.06, 2.0, 0.04]} rotation={[0, 0, angle]} position={[0, 0, -0.02]}>
            <meshStandardMaterial color={colors.accentSoft} roughness={0.38} />
          </Box>
        );
      })}
    </group>
  );
}

function StagePods({
  variant,
  colors,
  emphasized,
}: {
  variant: string;
  colors: PaletteColors;
  emphasized: boolean;
}) {
  const glow = emphasized ? 0.22 : 0.08;
  const radius = 2.14;
  const count = 6;

  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <group key={index} position={[x, y, 0.22]}>
            <Cylinder args={[0.02, 0.02, 0.38, 10]} position={[0, 0.24, 0]} rotation={[0, 0, angle]} />
            {variant === "pods-candy" ? (
              <Sphere args={[0.24, 20, 20]} position={[0, -0.08, 0]}>
                <meshStandardMaterial color={index % 2 === 0 ? colors.accent : colors.prop} roughness={0.18} />
              </Sphere>
            ) : variant === "pods-plush" ? (
              <RoundedBox args={[0.42, 0.34, 0.28]} radius={0.14} smoothness={6} position={[0, -0.08, 0]}>
                <meshStandardMaterial color={colors.shell} roughness={0.9} />
              </RoundedBox>
            ) : variant === "pods-pixel" ? (
              <RoundedBox args={[0.4, 0.36, 0.3]} radius={0.06} smoothness={4} position={[0, -0.08, 0]}>
                <meshStandardMaterial
                  color={colors.glass}
                  roughness={0.16}
                  metalness={0.18}
                  emissive={colors.glow}
                  emissiveIntensity={glow}
                />
              </RoundedBox>
            ) : (
              <RoundedBox args={[0.46, 0.36, 0.3]} radius={0.16} smoothness={6} position={[0, -0.08, 0]}>
                <meshStandardMaterial
                  color={colors.shell}
                  roughness={0.24}
                  emissive={colors.glowSoft}
                  emissiveIntensity={glow * 0.4}
                />
              </RoundedBox>
            )}
          </group>
        );
      })}
    </>
  );
}

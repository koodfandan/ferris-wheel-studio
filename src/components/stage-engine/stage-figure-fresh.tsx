import { Box, Cylinder, Dodecahedron, Icosahedron, Octahedron, RoundedBox, Sphere, Torus } from "@react-three/drei";
import type { CharacterPrototypeId } from "../../lib/character-prototypes";
import { getPaletteOption, type StageMode, type StudioRecipe, type StudioSlot } from "../../lib/studio-system";
import type { StageLayout } from "./stage-layout";

type Props = {
  recipe: StudioRecipe;
  focusSlot: StudioSlot;
  stageMode: StageMode;
  layout: StageLayout;
  activePrototype: CharacterPrototypeId;
};

type PaletteColors = ReturnType<typeof getPaletteOption>["colors"];

type PrototypeRig = {
  bodyScale: [number, number, number];
  bodyLift: number;
  headLift: number;
  headScale: number;
  limbSpan: number;
  propBias: [number, number, number];
};

const PROTOTYPE_RIGS: Record<CharacterPrototypeId, PrototypeRig> = {
  "human-luna": { bodyScale: [0.9, 0.95, 0.9], bodyLift: 0.26, headLift: 1.78, headScale: 1.12, limbSpan: 0.46, propBias: [0, 0, 0.03] },
  "human-coco": { bodyScale: [1, 0.84, 0.98], bodyLift: 0.22, headLift: 1.7, headScale: 1.2, limbSpan: 0.5, propBias: [0.04, -0.02, 0.02] },
  "human-aria": { bodyScale: [0.86, 1.04, 0.86], bodyLift: 0.3, headLift: 1.84, headScale: 1.08, limbSpan: 0.42, propBias: [-0.02, 0.02, 0.05] },
  "animal-bunny": { bodyScale: [0.95, 0.9, 0.95], bodyLift: 0.2, headLift: 1.72, headScale: 1.18, limbSpan: 0.48, propBias: [0, 0, 0.04] },
  "animal-bear": { bodyScale: [1.02, 0.9, 1.02], bodyLift: 0.2, headLift: 1.68, headScale: 1.14, limbSpan: 0.52, propBias: [0.03, -0.03, 0.04] },
  "animal-fox": { bodyScale: [0.86, 0.92, 0.88], bodyLift: 0.24, headLift: 1.72, headScale: 1.1, limbSpan: 0.5, propBias: [-0.05, 0, 0.06] },
  "creature-axolotl": { bodyScale: [0.96, 0.92, 0.96], bodyLift: 0.24, headLift: 1.76, headScale: 1.16, limbSpan: 0.44, propBias: [0, -0.02, 0.04] },
  "creature-cloudling": { bodyScale: [1, 0.8, 1], bodyLift: 0.2, headLift: 1.7, headScale: 1.24, limbSpan: 0.4, propBias: [0, 0, 0.02] },
  "creature-starmoth": { bodyScale: [0.86, 0.98, 0.86], bodyLift: 0.28, headLift: 1.8, headScale: 1.08, limbSpan: 0.44, propBias: [0.03, 0.02, 0.03] },
  "robot-botu": { bodyScale: [1, 0.96, 1], bodyLift: 0.22, headLift: 1.66, headScale: 1.05, limbSpan: 0.56, propBias: [0.01, 0, 0.02] },
  "robot-capsule": { bodyScale: [1.05, 1.02, 1.05], bodyLift: 0.2, headLift: 1.64, headScale: 1.02, limbSpan: 0.58, propBias: [0.02, -0.02, 0.04] },
  "robot-dronecat": { bodyScale: [0.94, 0.96, 0.94], bodyLift: 0.22, headLift: 1.7, headScale: 1.12, limbSpan: 0.54, propBias: [0.03, 0.02, 0.02] },
};

function partMatch(id: string, token: string) {
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
  const characterPos = layout.placements.character?.position ?? [0, 0.1, 0.36];
  const propPos = layout.placements.prop?.position ?? [0.82, 0.9, 0.78];
  const relProp: [number, number, number] = [
    propPos[0] - characterPos[0],
    propPos[1] - characterPos[1],
    propPos[2] - characterPos[2],
  ];

  return (
    <group position={[0, -1.22, 0.06]} scale={0.98}>
      <FerrisSupports colors={colors} layout={layout} />
      <group position={layout.placements.frame?.position ?? [0, layout.metrics.ringCenterY, layout.metrics.ringZ]}>
        <FerrisRing variant={recipe.frame} colors={colors} highlighted={focusSlot === "frame"} />
        <FerrisCabins variant={recipe.pods} colors={colors} highlighted={focusSlot === "pods"} />
      </group>

      <RebuiltCharacter
        recipe={recipe}
        colors={colors}
        activePrototype={activePrototype}
        focusSlot={focusSlot}
        stageMode={stageMode}
        position={characterPos}
        propOffset={relProp}
      />
    </group>
  );
}

function FerrisSupports({ colors, layout }: { colors: PaletteColors; layout: StageLayout }) {
  const z = layout.metrics.ringZ;
  return (
    <group>
      <Cylinder
        args={[0.09, 0.1, layout.metrics.supportHeight, 18]}
        position={layout.placements.supportLeft?.position ?? [-1.28, layout.metrics.supportMidY, z]}
        rotation={[0, 0, 0.35]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.4} metalness={0.22} />
      </Cylinder>
      <Cylinder
        args={[0.09, 0.1, layout.metrics.supportHeight, 18]}
        position={layout.placements.supportRight?.position ?? [1.28, layout.metrics.supportMidY, z]}
        rotation={[0, 0, -0.35]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.4} metalness={0.22} />
      </Cylinder>
      <RoundedBox
        args={[2.56, 0.14, 0.16]}
        radius={0.06}
        smoothness={4}
        position={layout.placements.supportBar?.position ?? [0, layout.metrics.supportTopY, z - 0.02]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.26} />
      </RoundedBox>
    </group>
  );
}

function FerrisRing({
  variant,
  colors,
  highlighted,
}: {
  variant: string;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const lift = highlighted ? 0.05 : 0;
  const glow = highlighted ? 0.12 : 0.04;

  if (partMatch(variant, "frame-candy")) {
    return (
      <group position={[0, lift, 0]}>
        <Torus args={[1.18, 0.16, 20, 72]} rotation={[0.06, 0.1, 0]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.4} />
        </Torus>
        <Torus args={[1.18, 0.08, 14, 48]} rotation={[0.06, 0.1, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.28} metalness={0.08} />
        </Torus>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <Sphere key={`candy-bead-${i}`} args={[0.07, 16, 16]} position={[Math.cos(angle) * 1.18, Math.sin(angle) * 1.18, 0]}>
              <meshStandardMaterial color={i % 2 === 0 ? colors.accent : colors.glowSoft} roughness={0.18} metalness={0.04} />
            </Sphere>
          );
        })}
      </group>
    );
  }

  if (partMatch(variant, "frame-pearl")) {
    return (
      <group position={[0, lift, 0]}>
        <Torus args={[1.2, 0.12, 22, 92]}>
          <meshStandardMaterial color={colors.shell} roughness={0.62} metalness={0.03} />
        </Torus>
        <Torus args={[1.03, 0.06, 18, 56]}>
          <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.24} />
        </Torus>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <Sphere key={`pearl-${i}`} args={[0.085, 16, 16]} position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}>
              <meshStandardMaterial color={colors.glowSoft} roughness={0.2} emissive={colors.accentSoft} emissiveIntensity={glow * 0.5} />
            </Sphere>
          );
        })}
      </group>
    );
  }

  if (partMatch(variant, "frame-bulb")) {
    return (
      <group position={[0, lift, 0]}>
        <Torus args={[1.16, 0.13, 18, 72]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.28} />
        </Torus>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <Sphere key={`bulb-${i}`} args={[0.05, 14, 14]} position={[Math.cos(angle) * 1.16, Math.sin(angle) * 1.16, 0]}>
              <meshStandardMaterial color={colors.glow} roughness={0.18} emissive={colors.glow} emissiveIntensity={glow} />
            </Sphere>
          );
        })}
      </group>
    );
  }

  return (
    <group position={[0, lift, 0]}>
      <Torus args={[1.14, 0.14, 18, 72]}>
        <meshStandardMaterial color={colors.metal} roughness={0.38} metalness={0.26} />
      </Torus>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <Cylinder key={`spoke-${i}`} args={[0.03, 0.03, 2.18, 10]} position={[0, 0, -0.01]} rotation={[0, 0, angle]}>
            <meshStandardMaterial color={colors.metal} roughness={0.38} metalness={0.22} />
          </Cylinder>
        );
      })}
    </group>
  );
}

function FerrisCabins({
  variant,
  colors,
  highlighted,
}: {
  variant: string;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const wobble = highlighted ? 0.03 : 0;

  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.18;
        const y = Math.sin(angle) * 1.18;
        return (
          <group key={`pod-${i}`} position={[x, y, 0.08]} rotation={[0, 0, -angle * 0.1]}>
            {partMatch(variant, "pods-candy") ? <CandyCabin colors={colors} wobble={wobble} /> : null}
            {partMatch(variant, "pods-plush") ? <PlushCabin colors={colors} wobble={wobble} /> : null}
            {partMatch(variant, "pods-pixel") ? <PixelCabin colors={colors} wobble={wobble} /> : null}
            {partMatch(variant, "pods-moon") ? <MoonCabin colors={colors} wobble={wobble} /> : null}
          </group>
        );
      })}
    </group>
  );
}

function MoonCabin({ colors, wobble }: { colors: PaletteColors; wobble: number }) {
  return (
    <group position={[0, -0.2 + wobble, 0]}>
      <Sphere args={[0.18, 18, 18]}>
        <meshStandardMaterial color={colors.shell} roughness={0.56} />
      </Sphere>
      <Box args={[0.14, 0.1, 0.1]} position={[0, -0.18, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.36} metalness={0.22} />
      </Box>
    </group>
  );
}

function CandyCabin({ colors, wobble }: { colors: PaletteColors; wobble: number }) {
  return (
    <RoundedBox args={[0.3, 0.26, 0.2]} radius={0.08} smoothness={4} position={[0, -0.2 + wobble, 0]}>
      <meshStandardMaterial color={colors.accentSoft} roughness={0.32} metalness={0.06} />
    </RoundedBox>
  );
}

function PlushCabin({ colors, wobble }: { colors: PaletteColors; wobble: number }) {
  return (
    <group position={[0, -0.2 + wobble, 0]}>
      <Sphere args={[0.16, 16, 16]}>
        <meshStandardMaterial color={colors.body} roughness={0.86} />
      </Sphere>
      <Sphere args={[0.08, 12, 12]} position={[0.1, 0.1, 0]}>
        <meshStandardMaterial color={colors.accentSoft} roughness={0.84} />
      </Sphere>
    </group>
  );
}

function PixelCabin({ colors, wobble }: { colors: PaletteColors; wobble: number }) {
  return (
    <group position={[0, -0.2 + wobble, 0]}>
      <Box args={[0.24, 0.24, 0.24]}>
        <meshStandardMaterial color={colors.glass} roughness={0.2} metalness={0.24} />
      </Box>
      <Box args={[0.28, 0.04, 0.28]} position={[0, -0.16, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.3} />
      </Box>
    </group>
  );
}

function RebuiltCharacter({
  recipe,
  colors,
  activePrototype,
  focusSlot,
  stageMode,
  position,
  propOffset,
}: {
  recipe: StudioRecipe;
  colors: PaletteColors;
  activePrototype: CharacterPrototypeId;
  focusSlot: StudioSlot;
  stageMode: StageMode;
  position: [number, number, number];
  propOffset: [number, number, number];
}) {
  const rig = PROTOTYPE_RIGS[activePrototype];
  const propNudge: [number, number, number] = [
    propOffset[0] + rig.propBias[0],
    propOffset[1] + rig.propBias[1],
    propOffset[2] + rig.propBias[2],
  ];
  const stageLean = stageMode === "shelf" ? 0.02 : stageMode === "inspect" ? 0 : -0.015;

  return (
    <group position={position}>
      <group position={[0, rig.bodyLift, 0]} scale={rig.bodyScale} rotation={[stageLean, 0, 0]}>
        <BodyShell outfit={recipe.outfit} colors={colors} highlighted={focusSlot === "outfit"} />
        <LimbSet colors={colors} span={rig.limbSpan} />
        <PrototypeBodyFlavor id={activePrototype} colors={colors} highlighted={focusSlot === "outfit"} />
      </group>

      <AccessoryProp propId={recipe.prop} colors={colors} highlighted={focusSlot === "prop"} offset={propNudge} />

      <group position={[0, rig.headLift, 0.03]} scale={rig.headScale}>
        <HeadShell species={recipe.species} silhouette={recipe.silhouette} colors={colors} highlighted={focusSlot === "silhouette"} />
        <PrototypeHeadFlavor id={activePrototype} colors={colors} highlighted={focusSlot === "silhouette"} />
        <FaceStyle expression={recipe.expression} colors={colors} highlighted={focusSlot === "expression"} />
        <HeadAccessory headpiece={recipe.headpiece} colors={colors} highlighted={focusSlot === "headpiece"} />
      </group>
    </group>
  );
}

function BodyShell({
  outfit,
  colors,
  highlighted,
}: {
  outfit: string;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const lift = highlighted ? 0.04 : 0;
  const bright = highlighted ? 0.08 : 0.02;

  if (partMatch(outfit, "outfit-fairdress")) {
    return (
      <group position={[0, 0.24 + lift, 0]}>
        <RoundedBox args={[1.08, 0.68, 0.86]} radius={0.2} smoothness={5} position={[0, 0.72, 0]}>
          <meshStandardMaterial color={colors.body} roughness={0.68} />
        </RoundedBox>
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.84, 1.18, 36]} />
          <meshStandardMaterial color={colors.accentSoft} roughness={0.54} />
        </mesh>
        <Torus args={[0.36, 0.07, 12, 24]} position={[0, 0.72, 0.4]}>
          <meshStandardMaterial color={colors.accent} roughness={0.34} emissive={colors.accentSoft} emissiveIntensity={bright} />
        </Torus>
      </group>
    );
  }

  if (partMatch(outfit, "outfit-plush")) {
    return (
      <group position={[0, 0.18 + lift, 0]}>
        <Sphere args={[0.88, 36, 36]} position={[0, 0.46, 0]}>
          <meshStandardMaterial color={colors.body} roughness={0.9} />
        </Sphere>
        <Sphere args={[0.22, 20, 20]} position={[-0.52, 0.45, 0.2]}>
          <meshStandardMaterial color={colors.shell} roughness={0.92} />
        </Sphere>
        <Sphere args={[0.22, 20, 20]} position={[0.52, 0.45, 0.2]}>
          <meshStandardMaterial color={colors.shell} roughness={0.92} />
        </Sphere>
      </group>
    );
  }

  if (partMatch(outfit, "outfit-cape")) {
    return (
      <group position={[0, 0.24 + lift, 0]}>
        <RoundedBox args={[1.0, 1.04, 0.8]} radius={0.26} smoothness={6} position={[0, 0.62, 0]}>
          <meshStandardMaterial color={colors.body} roughness={0.74} />
        </RoundedBox>
        <mesh position={[0, 0.32, -0.22]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.94, 1.06, 36]} />
          <meshStandardMaterial color={colors.hair} roughness={0.82} />
        </mesh>
      </group>
    );
  }

  if (partMatch(outfit, "outfit-pod")) {
    return (
      <group position={[0, 0.2 + lift, 0]}>
        <RoundedBox args={[1.24, 1.22, 0.96]} radius={0.3} smoothness={8} position={[0, 0.58, 0]}>
          <meshStandardMaterial color={colors.body} roughness={0.52} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.74, 0.44, 0.12]} radius={0.1} smoothness={4} position={[0, 0.78, 0.46]}>
          <meshStandardMaterial color={colors.glass} roughness={0.18} metalness={0.18} />
        </RoundedBox>
      </group>
    );
  }

  return (
    <group position={[0, 0.24 + lift, 0]}>
      <RoundedBox args={[1, 1.02, 0.84]} radius={0.24} smoothness={6} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.74} />
      </RoundedBox>
      <RoundedBox args={[0.88, 0.42, 0.6]} radius={0.16} smoothness={4} position={[0, 0.06, 0.14]}>
        <meshStandardMaterial color={colors.shell} roughness={0.66} />
      </RoundedBox>
    </group>
  );
}

function LimbSet({ colors, span }: { colors: PaletteColors; span: number }) {
  return (
    <group>
      <RoundedBox args={[0.22, 0.52, 0.24]} radius={0.09} smoothness={4} position={[-span, 0.36, 0.12]}>
        <meshStandardMaterial color={colors.skin} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.22, 0.52, 0.24]} radius={0.09} smoothness={4} position={[span, 0.36, 0.12]}>
        <meshStandardMaterial color={colors.skin} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.46, 0.32]} radius={0.1} smoothness={4} position={[-0.24, -0.02, 0]}>
        <meshStandardMaterial color={colors.skin} roughness={0.84} />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.46, 0.32]} radius={0.1} smoothness={4} position={[0.24, -0.02, 0]}>
        <meshStandardMaterial color={colors.skin} roughness={0.84} />
      </RoundedBox>
    </group>
  );
}

function HeadShell({
  species,
  silhouette,
  colors,
  highlighted,
}: {
  species: StudioRecipe["species"];
  silhouette: string;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const lift = highlighted ? 0.05 : 0;

  return (
    <group position={[0, lift, 0]}>
      <Sphere args={[0.94, 40, 40]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      {partMatch(silhouette, "silhouette-bob") ? (
        <RoundedBox args={[1.54, 0.72, 1.28]} radius={0.3} smoothness={8} position={[0, 0.34, -0.04]}>
          <meshStandardMaterial color={colors.hair} roughness={0.72} />
        </RoundedBox>
      ) : null}
      {partMatch(silhouette, "silhouette-curl") ? (
        <group>
          <Sphere args={[0.24, 16, 16]} position={[-0.62, 0.3, 0.06]}>
            <meshStandardMaterial color={colors.hair} roughness={0.74} />
          </Sphere>
          <Sphere args={[0.24, 16, 16]} position={[0.62, 0.3, 0.06]}>
            <meshStandardMaterial color={colors.hair} roughness={0.74} />
          </Sphere>
          <Sphere args={[0.18, 14, 14]} position={[-0.52, 0.02, 0.28]}>
            <meshStandardMaterial color={colors.hair} roughness={0.76} />
          </Sphere>
          <Sphere args={[0.18, 14, 14]} position={[0.52, 0.02, 0.28]}>
            <meshStandardMaterial color={colors.hair} roughness={0.76} />
          </Sphere>
        </group>
      ) : null}
      {partMatch(silhouette, "silhouette-bunny") ? (
        <group>
          <RoundedBox args={[0.24, 1.0, 0.28]} radius={0.12} smoothness={4} position={[-0.26, 1.0, 0]}>
            <meshStandardMaterial color={colors.shell} roughness={0.76} />
          </RoundedBox>
          <RoundedBox args={[0.24, 1.0, 0.28]} radius={0.12} smoothness={4} position={[0.26, 1.0, 0]}>
            <meshStandardMaterial color={colors.shell} roughness={0.76} />
          </RoundedBox>
        </group>
      ) : null}
      {partMatch(silhouette, "silhouette-bear") ? (
        <group>
          <Sphere args={[0.2, 14, 14]} position={[-0.5, 0.66, -0.02]}>
            <meshStandardMaterial color={colors.shell} roughness={0.8} />
          </Sphere>
          <Sphere args={[0.2, 14, 14]} position={[0.5, 0.66, -0.02]}>
            <meshStandardMaterial color={colors.shell} roughness={0.8} />
          </Sphere>
        </group>
      ) : null}
      {partMatch(silhouette, "silhouette-foam") ? (
        <group>
          <Torus args={[0.76, 0.08, 12, 26]} rotation={[0.28, 0, 0]}>
            <meshStandardMaterial color={colors.accentSoft} roughness={0.46} />
          </Torus>
          <Sphere args={[0.16, 14, 14]} position={[0, 0.9, 0]}>
            <meshStandardMaterial color={colors.accentSoft} roughness={0.54} />
          </Sphere>
        </group>
      ) : null}
      {partMatch(silhouette, "silhouette-shell") ? (
        <RoundedBox args={[1.66, 1.14, 1.26]} radius={0.38} smoothness={8} position={[0, 0.16, -0.08]}>
          <meshStandardMaterial color={colors.metal} roughness={0.32} metalness={0.24} />
        </RoundedBox>
      ) : null}
      {species === "robot" ? (
        <RoundedBox args={[0.84, 0.26, 0.06]} radius={0.08} smoothness={4} position={[0, 0.12, 0.84]}>
          <meshStandardMaterial color={colors.glass} roughness={0.14} metalness={0.25} />
        </RoundedBox>
      ) : null}
    </group>
  );
}

function PrototypeBodyFlavor({
  id,
  colors,
  highlighted,
}: {
  id: CharacterPrototypeId;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const glow = highlighted ? 0.08 : 0.03;

  switch (id) {
    case "human-luna":
      return (
        <Torus args={[0.36, 0.05, 12, 24]} position={[0, 1, 0.36]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.46} emissive={colors.accentSoft} emissiveIntensity={glow} />
        </Torus>
      );
    case "human-coco":
      return (
        <group>
          <Dodecahedron args={[0.12, 0]} position={[-0.44, 0.82, 0.26]}>
            <meshStandardMaterial color={colors.prop} roughness={0.36} />
          </Dodecahedron>
          <Dodecahedron args={[0.12, 0]} position={[0.44, 0.82, 0.26]}>
            <meshStandardMaterial color={colors.prop} roughness={0.36} />
          </Dodecahedron>
        </group>
      );
    case "human-aria":
      return (
        <RoundedBox args={[0.16, 1.04, 0.16]} radius={0.07} smoothness={4} position={[0, 0.84, -0.44]}>
          <meshStandardMaterial color={colors.glowSoft} roughness={0.32} metalness={0.18} />
        </RoundedBox>
      );
    case "animal-bunny":
      return (
        <Sphere args={[0.24, 18, 18]} position={[0, 0.42, -0.38]}>
          <meshStandardMaterial color={colors.shell} roughness={0.86} />
        </Sphere>
      );
    case "animal-bear":
      return (
        <RoundedBox args={[0.62, 0.2, 0.3]} radius={0.08} smoothness={4} position={[0, 0.78, 0.42]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.5} />
        </RoundedBox>
      );
    case "animal-fox":
      return (
        <group>
          <mesh position={[0.6, 0.46, -0.32]} rotation={[0.1, 0.4, -0.16]}>
            <coneGeometry args={[0.22, 0.78, 16]} />
            <meshStandardMaterial color={colors.body} roughness={0.78} />
          </mesh>
        </group>
      );
    case "creature-axolotl":
      return (
        <group>
          <Octahedron args={[0.14, 0]} position={[-0.46, 0.74, 0.24]}>
            <meshStandardMaterial color={colors.glowSoft} roughness={0.28} emissive={colors.glowSoft} emissiveIntensity={glow * 0.8} />
          </Octahedron>
          <Octahedron args={[0.14, 0]} position={[0.46, 0.74, 0.24]}>
            <meshStandardMaterial color={colors.glowSoft} roughness={0.28} emissive={colors.glowSoft} emissiveIntensity={glow * 0.8} />
          </Octahedron>
        </group>
      );
    case "creature-cloudling":
      return (
        <group>
          <Sphere args={[0.16, 16, 16]} position={[-0.42, 0.86, 0.22]}>
            <meshStandardMaterial color={colors.shell} roughness={0.84} />
          </Sphere>
          <Sphere args={[0.2, 16, 16]} position={[0.02, 0.96, 0.3]}>
            <meshStandardMaterial color={colors.shell} roughness={0.84} />
          </Sphere>
          <Sphere args={[0.16, 16, 16]} position={[0.38, 0.86, 0.18]}>
            <meshStandardMaterial color={colors.shell} roughness={0.84} />
          </Sphere>
        </group>
      );
    case "creature-starmoth":
      return (
        <group>
          <mesh position={[-0.58, 0.72, 0]} rotation={[0, 0, 0.2]}>
            <coneGeometry args={[0.28, 0.72, 4]} />
            <meshStandardMaterial color={colors.accentSoft} roughness={0.54} />
          </mesh>
          <mesh position={[0.58, 0.72, 0]} rotation={[0, 0, -0.2]}>
            <coneGeometry args={[0.28, 0.72, 4]} />
            <meshStandardMaterial color={colors.accentSoft} roughness={0.54} />
          </mesh>
        </group>
      );
    case "robot-botu":
      return (
        <RoundedBox args={[0.8, 0.42, 0.18]} radius={0.1} smoothness={4} position={[0, 0.84, 0.45]}>
          <meshStandardMaterial color={colors.glass} roughness={0.16} metalness={0.28} />
        </RoundedBox>
      );
    case "robot-capsule":
      return (
        <group>
          <Cylinder args={[0.16, 0.16, 0.42, 16]} position={[-0.48, 0.38, -0.08]}>
            <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.28} />
          </Cylinder>
          <Cylinder args={[0.16, 0.16, 0.42, 16]} position={[0.48, 0.38, -0.08]}>
            <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.28} />
          </Cylinder>
        </group>
      );
    case "robot-dronecat":
      return (
        <Torus args={[0.68, 0.06, 12, 28]} position={[0, 0.74, 0.06]} rotation={[Math.PI / 2, 0.1, 0]}>
          <meshStandardMaterial color={colors.glow} roughness={0.22} emissive={colors.glow} emissiveIntensity={glow * 0.7} />
        </Torus>
      );
    default:
      return null;
  }
}

function PrototypeHeadFlavor({
  id,
  colors,
  highlighted,
}: {
  id: CharacterPrototypeId;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const emissive = highlighted ? 0.12 : 0.04;
  switch (id) {
    case "human-luna":
      return (
        <RoundedBox args={[0.46, 0.22, 0.24]} radius={0.08} smoothness={4} position={[0, -0.62, 0.72]}>
          <meshStandardMaterial color={colors.blush} roughness={0.44} />
        </RoundedBox>
      );
    case "human-coco":
      return (
        <Torus args={[0.5, 0.06, 12, 24]} position={[0, -0.1, 0.7]}>
          <meshStandardMaterial color={colors.prop} roughness={0.3} emissive={colors.prop} emissiveIntensity={emissive * 0.4} />
        </Torus>
      );
    case "human-aria":
      return (
        <Icosahedron args={[0.16, 0]} position={[0, 0.96, 0]}>
          <meshStandardMaterial color={colors.glow} roughness={0.24} emissive={colors.glow} emissiveIntensity={emissive} />
        </Icosahedron>
      );
    case "animal-bunny":
      return (
        <Sphere args={[0.1, 14, 14]} position={[0.3, -0.16, 0.84]}>
          <meshStandardMaterial color={colors.blush} roughness={0.56} />
        </Sphere>
      );
    case "animal-bear":
      return (
        <Sphere args={[0.12, 14, 14]} position={[-0.3, -0.14, 0.84]}>
          <meshStandardMaterial color={colors.blush} roughness={0.56} />
        </Sphere>
      );
    case "animal-fox":
      return (
        <group>
          <mesh position={[-0.34, 0.88, 0.04]} rotation={[0.04, 0, 0.1]}>
            <coneGeometry args={[0.17, 0.44, 4]} />
            <meshStandardMaterial color={colors.hair} roughness={0.66} />
          </mesh>
          <mesh position={[0.34, 0.88, 0.04]} rotation={[0.04, 0, -0.1]}>
            <coneGeometry args={[0.17, 0.44, 4]} />
            <meshStandardMaterial color={colors.hair} roughness={0.66} />
          </mesh>
        </group>
      );
    case "creature-axolotl":
      return (
        <group>
          <RoundedBox args={[0.14, 0.5, 0.08]} radius={0.04} smoothness={3} position={[-0.62, 0.3, 0]}>
            <meshStandardMaterial color={colors.accent} roughness={0.52} />
          </RoundedBox>
          <RoundedBox args={[0.14, 0.5, 0.08]} radius={0.04} smoothness={3} position={[0.62, 0.3, 0]}>
            <meshStandardMaterial color={colors.accent} roughness={0.52} />
          </RoundedBox>
        </group>
      );
    case "creature-cloudling":
      return (
        <Sphere args={[0.24, 18, 18]} position={[0, 0.92, 0.06]}>
          <meshStandardMaterial color={colors.glowSoft} roughness={0.42} />
        </Sphere>
      );
    case "creature-starmoth":
      return (
        <Octahedron args={[0.16, 0]} position={[0, 0.88, 0.12]}>
          <meshStandardMaterial color={colors.glowSoft} roughness={0.28} emissive={colors.accentSoft} emissiveIntensity={emissive * 0.8} />
        </Octahedron>
      );
    case "robot-botu":
      return (
        <RoundedBox args={[0.3, 0.08, 0.08]} radius={0.03} smoothness={3} position={[0, 1, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.32} />
        </RoundedBox>
      );
    case "robot-capsule":
      return (
        <RoundedBox args={[0.22, 0.34, 0.16]} radius={0.06} smoothness={3} position={[0, 1.02, -0.12]}>
          <meshStandardMaterial color={colors.accent} roughness={0.24} metalness={0.24} />
        </RoundedBox>
      );
    case "robot-dronecat":
      return (
        <group>
          <mesh position={[-0.42, 0.84, -0.04]} rotation={[0, 0, 0.12]}>
            <coneGeometry args={[0.16, 0.42, 4]} />
            <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.34} />
          </mesh>
          <mesh position={[0.42, 0.84, -0.04]} rotation={[0, 0, -0.12]}>
            <coneGeometry args={[0.16, 0.42, 4]} />
            <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.34} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function FaceStyle({
  expression,
  colors,
  highlighted,
}: {
  expression: string;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const z = 0.9;
  const lift = highlighted ? 0.03 : 0;

  if (partMatch(expression, "expression-led")) {
    return (
      <group position={[0, 0.06 + lift, z - 0.04]}>
        <RoundedBox args={[0.74, 0.24, 0.06]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={colors.glass} roughness={0.1} metalness={0.32} />
        </RoundedBox>
        <RoundedBox args={[0.42, 0.04, 0.03]} radius={0.02} smoothness={2} position={[0, -0.12, 0.03]}>
          <meshStandardMaterial color={colors.accent} roughness={0.2} emissive={colors.accent} emissiveIntensity={0.08} />
        </RoundedBox>
      </group>
    );
  }

  return (
    <group position={[0, 0.04 + lift, z]}>
      {partMatch(expression, "expression-wink") ? (
        <group>
          <Box args={[0.1, 0.08, 0.02]} position={[-0.24, 0.06, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.36} />
          </Box>
          <Box args={[0.16, 0.04, 0.02]} position={[0.24, 0.06, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.36} />
          </Box>
        </group>
      ) : partMatch(expression, "expression-sleepy") ? (
        <group>
          <Box args={[0.16, 0.04, 0.02]} position={[-0.24, 0.06, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.36} />
          </Box>
          <Box args={[0.16, 0.04, 0.02]} position={[0.24, 0.06, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.36} />
          </Box>
        </group>
      ) : (
        <group>
          <Sphere args={[0.08, 12, 12]} position={[-0.24, 0.06, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.24} />
          </Sphere>
          <Sphere args={[0.08, 12, 12]} position={[0.24, 0.06, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.24} />
          </Sphere>
        </group>
      )}
      <RoundedBox args={[0.26, 0.08, 0.03]} radius={0.03} smoothness={3} position={[0, -0.16, 0]}>
        <meshStandardMaterial color={colors.blush} roughness={0.4} />
      </RoundedBox>
      <Sphere args={[0.1, 12, 12]} position={[-0.44, -0.06, -0.02]}>
        <meshStandardMaterial color={colors.blush} roughness={0.46} />
      </Sphere>
      <Sphere args={[0.1, 12, 12]} position={[0.44, -0.06, -0.02]}>
        <meshStandardMaterial color={colors.blush} roughness={0.46} />
      </Sphere>
    </group>
  );
}

function HeadAccessory({
  headpiece,
  colors,
  highlighted,
}: {
  headpiece: string;
  colors: PaletteColors;
  highlighted: boolean;
}) {
  const glow = highlighted ? 0.12 : 0.04;

  if (partMatch(headpiece, "headpiece-bow")) {
    return (
      <group position={[0, 0.9, 0.06]}>
        <RoundedBox args={[0.22, 0.14, 0.1]} radius={0.05} smoothness={3} position={[-0.15, 0, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.34} />
        </RoundedBox>
        <RoundedBox args={[0.22, 0.14, 0.1]} radius={0.05} smoothness={3} position={[0.15, 0, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.34} />
        </RoundedBox>
        <Sphere args={[0.08, 12, 12]}>
          <meshStandardMaterial color={colors.glowSoft} roughness={0.26} />
        </Sphere>
      </group>
    );
  }

  if (partMatch(headpiece, "headpiece-halo")) {
    return (
      <Torus args={[0.68, 0.06, 12, 28]} position={[0, 0.92, -0.16]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color={colors.glow} roughness={0.22} emissive={colors.glow} emissiveIntensity={glow} />
      </Torus>
    );
  }

  if (partMatch(headpiece, "headpiece-antenna")) {
    return (
      <group>
        <RoundedBox args={[0.08, 0.62, 0.08]} radius={0.03} smoothness={2} position={[0, 1.02, -0.14]}>
          <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.3} />
        </RoundedBox>
        <Sphere args={[0.11, 14, 14]} position={[0, 1.36, -0.14]}>
          <meshStandardMaterial color={colors.accent} roughness={0.24} emissive={colors.accent} emissiveIntensity={glow * 0.7} />
        </Sphere>
      </group>
    );
  }

  return (
    <group position={[0, 0.96, 0.04]}>
      <Sphere args={[0.14, 14, 14]} position={[-0.16, 0, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.72} />
      </Sphere>
      <Sphere args={[0.2, 14, 14]} position={[0.02, 0.06, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.72} />
      </Sphere>
      <Sphere args={[0.14, 14, 14]} position={[0.22, 0, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.72} />
      </Sphere>
    </group>
  );
}

function AccessoryProp({
  propId,
  colors,
  highlighted,
  offset,
}: {
  propId: string;
  colors: PaletteColors;
  highlighted: boolean;
  offset: [number, number, number];
}) {
  const glow = highlighted ? 0.08 : 0.02;
  if (partMatch(propId, "prop-wand")) {
    return (
      <group position={offset}>
        <RoundedBox args={[0.08, 0.9, 0.08]} radius={0.03} smoothness={2} rotation={[0.2, 0.28, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.28} />
        </RoundedBox>
        <Icosahedron args={[0.14, 0]} position={[0.08, 0.46, 0.04]}>
          <meshStandardMaterial color={colors.glow} roughness={0.2} emissive={colors.glow} emissiveIntensity={glow} />
        </Icosahedron>
      </group>
    );
  }

  if (partMatch(propId, "prop-lantern")) {
    return (
      <group position={offset}>
        <RoundedBox args={[0.26, 0.34, 0.24]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={colors.glass} roughness={0.2} metalness={0.16} />
        </RoundedBox>
        <Torus args={[0.12, 0.02, 8, 16]} position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.22} />
        </Torus>
      </group>
    );
  }

  if (partMatch(propId, "prop-battery")) {
    return (
      <group position={offset}>
        <RoundedBox args={[0.22, 0.46, 0.2]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.14, 0.06, 0.12]} radius={0.02} smoothness={2} position={[0, 0.26, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.24} emissive={colors.accent} emissiveIntensity={glow * 0.6} />
        </RoundedBox>
      </group>
    );
  }

  return (
    <group position={offset}>
      <RoundedBox args={[0.36, 0.24, 0.08]} radius={0.04} smoothness={3} rotation={[-0.14, 0.22, 0]}>
        <meshStandardMaterial color={colors.prop} roughness={0.34} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.12, 0.02]} radius={0.02} smoothness={2} position={[0.08, 0.04, 0.05]}>
        <meshStandardMaterial color={colors.glowSoft} roughness={0.24} />
      </RoundedBox>
    </group>
  );
}

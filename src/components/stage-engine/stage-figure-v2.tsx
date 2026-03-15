import { Box, Cylinder, Dodecahedron, Icosahedron, RoundedBox, Sphere, Torus } from "@react-three/drei";
import type { CharacterPrototypeId } from "../../lib/character-prototypes-v2";
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

type PrototypeScale = {
  y: number;
  scale: number;
  propBias: [number, number, number];
};

const PROTOTYPE_SCALE: Record<CharacterPrototypeId, PrototypeScale> = {
  "human-luna": { y: 0.16, scale: 0.98, propBias: [0.04, 0.3, 0.22] },
  "human-coco": { y: 0.14, scale: 1, propBias: [0.08, 0.22, 0.22] },
  "human-aria": { y: 0.12, scale: 1, propBias: [0.02, 0.44, 0.2] },
  "animal-bunny": { y: 0.14, scale: 1.02, propBias: [0.1, 0.18, 0.28] },
  "animal-bear": { y: 0.12, scale: 1.04, propBias: [0.12, 0.16, 0.26] },
  "animal-fox": { y: 0.12, scale: 1, propBias: [0.22, 0.18, 0.16] },
  "creature-axolotl": { y: 0.18, scale: 1, propBias: [0.04, 0.28, 0.22] },
  "creature-cloudling": { y: 0.16, scale: 1.02, propBias: [0.06, 0.22, 0.22] },
  "creature-starmoth": { y: 0.12, scale: 1, propBias: [0.08, 0.3, 0.18] },
  "robot-botu": { y: 0.1, scale: 1, propBias: [0.16, 0.18, 0.12] },
  "robot-capsule": { y: 0.12, scale: 0.98, propBias: [0.2, 0.18, 0.14] },
  "robot-dronecat": { y: 0.1, scale: 1, propBias: [0.16, 0.22, 0.18] },
};

function partMatch(id: string, token: string) {
  if (id === token || id.startsWith(`${token}-`)) return true;
  const last = token.split("-").pop() ?? token;
  if (id.endsWith(`-${last}`) || id.includes(`-${last}-`)) return true;
  if (last === "sleepy") return id.endsWith("-dream") || id.includes("-dream-");
  return false;
}

export function StageFigure({ recipe, focusSlot, layout, activePrototype }: Props) {
  const palette = getPaletteOption(recipe.palette);
  const colors = palette.colors;
  const characterPos = layout.placements.character?.position ?? [0, 0.12, 0.34];
  const baseProp = layout.placements.prop?.position ?? [0.8, 0.84, 0.78];
  const prototypeScale = PROTOTYPE_SCALE[activePrototype];
  const propOffset: [number, number, number] = [
    baseProp[0] - characterPos[0] + prototypeScale.propBias[0],
    baseProp[1] - characterPos[1] + prototypeScale.propBias[1],
    baseProp[2] - characterPos[2] + prototypeScale.propBias[2],
  ];

  return (
    <group position={[0, -1.24, 0.06]}>
      <StageSupports colors={colors} layout={layout} />
      <FerrisFrame
        frameId={recipe.frame}
        podsId={recipe.pods}
        colors={colors}
        focusSlot={focusSlot}
        position={layout.placements.frame?.position ?? [0, layout.metrics.ringCenterY, layout.metrics.ringZ]}
      />

      <group position={characterPos} scale={prototypeScale.scale}>
        <CharacterSwitch
          recipe={recipe}
          activePrototype={activePrototype}
          colors={colors}
          focusSlot={focusSlot}
        />
        <AccessoryProp propId={recipe.prop} colors={colors} highlighted={focusSlot === "prop"} offset={propOffset} />
      </group>
    </group>
  );
}

function StageSupports({ colors, layout }: { colors: PaletteColors; layout: StageLayout }) {
  const z = layout.metrics.ringZ;
  return (
    <group>
      <Cylinder
        args={[0.08, 0.1, layout.metrics.supportHeight, 16]}
        position={layout.placements.supportLeft?.position ?? [-1.28, layout.metrics.supportMidY, z]}
        rotation={[0, 0, 0.36]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.4} metalness={0.24} />
      </Cylinder>
      <Cylinder
        args={[0.08, 0.1, layout.metrics.supportHeight, 16]}
        position={layout.placements.supportRight?.position ?? [1.28, layout.metrics.supportMidY, z]}
        rotation={[0, 0, -0.36]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.4} metalness={0.24} />
      </Cylinder>
      <RoundedBox
        args={[2.5, 0.12, 0.14]}
        radius={0.05}
        smoothness={4}
        position={layout.placements.supportBar?.position ?? [0, layout.metrics.supportTopY, z - 0.02]}
      >
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.26} />
      </RoundedBox>
    </group>
  );
}

function FerrisFrame({
  frameId,
  podsId,
  colors,
  focusSlot,
  position,
}: {
  frameId: string;
  podsId: string;
  colors: PaletteColors;
  focusSlot: StudioSlot;
  position: [number, number, number];
}) {
  const frameLift = focusSlot === "frame" ? 0.04 : 0;
  const podLift = focusSlot === "pods" ? 0.03 : 0;
  const ringGlow = focusSlot === "frame" ? 0.12 : 0.04;

  return (
    <group position={position}>
      {partMatch(frameId, "frame-candy") ? (
        <group position={[0, frameLift, 0]}>
          <Torus args={[1.16, 0.15, 18, 72]}>
            <meshStandardMaterial color={colors.accentSoft} roughness={0.34} />
          </Torus>
          <Torus args={[1.16, 0.07, 12, 48]}>
            <meshStandardMaterial color={colors.accent} roughness={0.24} metalness={0.08} />
          </Torus>
          {Array.from({ length: 10 }).map((_, index) => {
            const angle = (index / 10) * Math.PI * 2;
            return (
              <Sphere key={`candy-ring-${index}`} args={[0.08, 12, 12]} position={[Math.cos(angle) * 1.16, Math.sin(angle) * 1.16, 0]}>
                <meshStandardMaterial color={index % 2 === 0 ? colors.glowSoft : colors.accent} roughness={0.22} />
              </Sphere>
            );
          })}
        </group>
      ) : partMatch(frameId, "frame-pearl") ? (
        <group position={[0, frameLift, 0]}>
          <Torus args={[1.18, 0.12, 18, 84]}>
            <meshStandardMaterial color={colors.shell} roughness={0.62} />
          </Torus>
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            return (
              <Sphere key={`pearl-ring-${index}`} args={[0.08, 14, 14]} position={[Math.cos(angle) * 1.18, Math.sin(angle) * 1.18, 0]}>
                <meshStandardMaterial color={colors.glowSoft} roughness={0.24} emissive={colors.glowSoft} emissiveIntensity={ringGlow * 0.5} />
              </Sphere>
            );
          })}
        </group>
      ) : partMatch(frameId, "frame-bulb") ? (
        <group position={[0, frameLift, 0]}>
          <Torus args={[1.15, 0.13, 18, 72]}>
            <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.3} />
          </Torus>
          {Array.from({ length: 14 }).map((_, index) => {
            const angle = (index / 14) * Math.PI * 2;
            return (
              <Sphere key={`bulb-ring-${index}`} args={[0.05, 12, 12]} position={[Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0]}>
                <meshStandardMaterial color={colors.glow} roughness={0.18} emissive={colors.glow} emissiveIntensity={ringGlow} />
              </Sphere>
            );
          })}
        </group>
      ) : (
        <group position={[0, frameLift, 0]}>
          <Torus args={[1.14, 0.14, 18, 72]}>
            <meshStandardMaterial color={colors.metal} roughness={0.38} metalness={0.24} />
          </Torus>
          {Array.from({ length: 6 }).map((_, index) => {
            const angle = (index / 6) * Math.PI * 2;
            return (
              <Cylinder key={`spoke-${index}`} args={[0.03, 0.03, 2.08, 10]} rotation={[0, 0, angle]}>
                <meshStandardMaterial color={colors.metal} roughness={0.38} metalness={0.22} />
              </Cylinder>
            );
          })}
        </group>
      )}

      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.16;
        const y = Math.sin(angle) * 1.16;
        return (
          <group key={`cabin-${index}`} position={[x, y - 0.2 + podLift, 0.08]}>
            {partMatch(podsId, "pods-candy") ? <CandyPod colors={colors} /> : null}
            {partMatch(podsId, "pods-plush") ? <PlushPod colors={colors} /> : null}
            {partMatch(podsId, "pods-pixel") ? <PixelPod colors={colors} /> : null}
            {partMatch(podsId, "pods-moon") ? <MoonPod colors={colors} /> : null}
          </group>
        );
      })}
    </group>
  );
}

function MoonPod({ colors }: { colors: PaletteColors }) {
  return (
    <group>
      <Sphere args={[0.18, 16, 16]}>
        <meshStandardMaterial color={colors.shell} roughness={0.58} />
      </Sphere>
      <Box args={[0.14, 0.08, 0.1]} position={[0, -0.18, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.24} />
      </Box>
    </group>
  );
}

function CandyPod({ colors }: { colors: PaletteColors }) {
  return (
    <RoundedBox args={[0.3, 0.24, 0.18]} radius={0.08} smoothness={4}>
      <meshStandardMaterial color={colors.accentSoft} roughness={0.3} metalness={0.08} />
    </RoundedBox>
  );
}

function PlushPod({ colors }: { colors: PaletteColors }) {
  return (
    <group>
      <Sphere args={[0.16, 16, 16]}>
        <meshStandardMaterial color={colors.body} roughness={0.9} />
      </Sphere>
      <Sphere args={[0.06, 10, 10]} position={[0.1, 0.1, 0]}>
        <meshStandardMaterial color={colors.accentSoft} roughness={0.88} />
      </Sphere>
    </group>
  );
}

function PixelPod({ colors }: { colors: PaletteColors }) {
  return (
    <group>
      <Box args={[0.22, 0.22, 0.22]}>
        <meshStandardMaterial color={colors.glass} roughness={0.16} metalness={0.24} />
      </Box>
      <Box args={[0.26, 0.04, 0.26]} position={[0, -0.16, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.34} metalness={0.3} />
      </Box>
    </group>
  );
}

function CharacterSwitch({
  recipe,
  activePrototype,
  colors,
  focusSlot,
}: {
  recipe: StudioRecipe;
  activePrototype: CharacterPrototypeId;
  colors: PaletteColors;
  focusSlot: StudioSlot;
}) {
  switch (activePrototype) {
    case "human-luna":
      return <MasklingFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "human-coco":
      return <BloomWitchFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "human-aria":
      return <CandleKidFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "animal-bunny":
      return <TriEyeRabbitFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "animal-bear":
      return <MushroomBearFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "animal-fox":
      return <DoubletailHoundFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "creature-axolotl":
      return <LongEarFishFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "creature-cloudling":
      return <RagbugFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "creature-starmoth":
      return <ShellDragonFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "robot-botu":
      return <OwlDeerFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    case "robot-capsule":
      return <NightFoxFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
    default:
      return <CloudHedgehogFigure recipe={recipe} colors={colors} focusSlot={focusSlot} />;
  }
}

function EyeDots({
  colors,
  sleepy = false,
  wink = false,
  thirdEye = false,
  centerY = 0.22,
}: {
  colors: PaletteColors;
  sleepy?: boolean;
  wink?: boolean;
  thirdEye?: boolean;
  centerY?: number;
}) {
  return (
    <group position={[0, centerY, 0.92]}>
      {sleepy ? (
        <>
          <Box args={[0.16, 0.04, 0.02]} position={[-0.22, 0, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.32} />
          </Box>
          <Box args={[0.16, 0.04, 0.02]} position={[0.22, 0, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.32} />
          </Box>
        </>
      ) : wink ? (
        <>
          <Sphere args={[0.07, 10, 10]} position={[-0.22, 0, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.22} />
          </Sphere>
          <Box args={[0.16, 0.04, 0.02]} position={[0.22, 0, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.32} />
          </Box>
        </>
      ) : (
        <>
          <Sphere args={[0.07, 10, 10]} position={[-0.22, 0, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.22} />
          </Sphere>
          <Sphere args={[0.07, 10, 10]} position={[0.22, 0, 0]}>
            <meshStandardMaterial color={colors.ink} roughness={0.22} />
          </Sphere>
        </>
      )}
      {thirdEye ? (
        <Sphere args={[0.06, 10, 10]} position={[0, 0.24, 0]}>
          <meshStandardMaterial color={colors.ink} roughness={0.22} />
        </Sphere>
      ) : null}
    </group>
  );
}

function BlushMouth({ colors, y = 0 }: { colors: PaletteColors; y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={[0.22, 0.06, 0.02]} radius={0.02} smoothness={2} position={[0, -0.04, 0.94]}>
        <meshStandardMaterial color={colors.blush} roughness={0.4} />
      </RoundedBox>
      <Sphere args={[0.08, 10, 10]} position={[-0.4, -0.02, 0.88]}>
        <meshStandardMaterial color={colors.blush} roughness={0.5} />
      </Sphere>
      <Sphere args={[0.08, 10, 10]} position={[0.4, -0.02, 0.88]}>
        <meshStandardMaterial color={colors.blush} roughness={0.5} />
      </Sphere>
    </group>
  );
}

function VisorFace({
  colors,
  dream = false,
  width = 0.82,
}: {
  colors: PaletteColors;
  dream?: boolean;
  width?: number;
}) {
  return (
    <group position={[0, 0.18, 0.86]}>
      <RoundedBox args={[width, 0.26, 0.08]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={colors.glass} roughness={0.1} metalness={0.28} />
      </RoundedBox>
      {dream ? (
        <RoundedBox args={[0.42, 0.04, 0.02]} radius={0.02} smoothness={2} position={[0, 0.02, 0.05]}>
          <meshStandardMaterial color={colors.accentSoft} roughness={0.24} emissive={colors.accentSoft} emissiveIntensity={0.08} />
        </RoundedBox>
      ) : (
        <>
          <RoundedBox args={[0.18, 0.04, 0.02]} radius={0.02} smoothness={2} position={[-0.18, 0.02, 0.05]}>
            <meshStandardMaterial color={colors.accent} roughness={0.2} emissive={colors.accent} emissiveIntensity={0.1} />
          </RoundedBox>
          <RoundedBox args={[0.18, 0.04, 0.02]} radius={0.02} smoothness={2} position={[0.18, 0.02, 0.05]}>
            <meshStandardMaterial color={colors.accent} roughness={0.2} emissive={colors.accent} emissiveIntensity={0.1} />
          </RoundedBox>
        </>
      )}
    </group>
  );
}

function HeadTopper({
  recipe,
  colors,
  lift = 1.02,
  robot = false,
}: {
  recipe: StudioRecipe;
  colors: PaletteColors;
  lift?: number;
  robot?: boolean;
}) {
  if (partMatch(recipe.headpiece, "headpiece-antenna")) {
    return (
      <group position={[0, lift, -0.04]}>
        <RoundedBox args={[0.08, 0.56, 0.08]} radius={0.03} smoothness={2}>
          <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.32} />
        </RoundedBox>
        <Sphere args={[0.1, 10, 10]} position={[0, 0.32, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.22} emissive={colors.accent} emissiveIntensity={0.12} />
        </Sphere>
      </group>
    );
  }

  if (partMatch(recipe.headpiece, "headpiece-halo")) {
    return (
      <Torus args={[0.68, 0.05, 12, 26]} position={[0, lift, -0.16]} rotation={[0.42, 0, 0]}>
        <meshStandardMaterial color={colors.glowSoft} roughness={0.2} emissive={colors.glowSoft} emissiveIntensity={0.12} />
      </Torus>
    );
  }

  if (partMatch(recipe.headpiece, "headpiece-bow")) {
    return (
      <group position={[0, lift - 0.02, 0.06]}>
        <RoundedBox args={[0.22, 0.14, 0.08]} radius={0.04} smoothness={3} position={[-0.14, 0, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.34} />
        </RoundedBox>
        <RoundedBox args={[0.22, 0.14, 0.08]} radius={0.04} smoothness={3} position={[0.14, 0, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.34} />
        </RoundedBox>
        <Sphere args={[0.08, 10, 10]}>
          <meshStandardMaterial color={colors.glowSoft} roughness={0.26} />
        </Sphere>
      </group>
    );
  }

  return (
    <group position={[0, lift, 0]}>
      <Sphere args={[0.12, 10, 10]} position={[-0.14, 0, 0]}>
        <meshStandardMaterial color={robot ? colors.metal : colors.shell} roughness={robot ? 0.26 : 0.74} />
      </Sphere>
      <Sphere args={[0.16, 10, 10]} position={[0.02, 0.06, 0]}>
        <meshStandardMaterial color={robot ? colors.metal : colors.shell} roughness={robot ? 0.26 : 0.74} />
      </Sphere>
      <Sphere args={[0.12, 10, 10]} position={[0.2, 0, 0]}>
        <meshStandardMaterial color={robot ? colors.metal : colors.shell} roughness={robot ? 0.26 : 0.74} />
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
  const glow = highlighted ? 0.1 : 0.04;

  if (partMatch(propId, "prop-wand")) {
    return (
      <group position={offset}>
        <RoundedBox args={[0.08, 0.86, 0.08]} radius={0.03} smoothness={2} rotation={[0.18, 0.24, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.28} />
        </RoundedBox>
        <Icosahedron args={[0.14, 0]} position={[0.08, 0.42, 0.02]}>
          <meshStandardMaterial color={colors.glow} roughness={0.2} emissive={colors.glow} emissiveIntensity={glow} />
        </Icosahedron>
      </group>
    );
  }

  if (partMatch(propId, "prop-lantern")) {
    return (
      <group position={offset}>
        <RoundedBox args={[0.24, 0.3, 0.2]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={colors.glass} roughness={0.18} metalness={0.18} />
        </RoundedBox>
        <Torus args={[0.12, 0.02, 8, 16]} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.22} />
        </Torus>
      </group>
    );
  }

  if (partMatch(propId, "prop-battery")) {
    return (
      <group position={offset}>
        <RoundedBox args={[0.22, 0.44, 0.18]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.14, 0.06, 0.1]} radius={0.02} smoothness={2} position={[0, 0.24, 0]}>
          <meshStandardMaterial color={colors.accent} roughness={0.22} emissive={colors.accent} emissiveIntensity={glow} />
        </RoundedBox>
      </group>
    );
  }

  return (
    <group position={offset}>
      <RoundedBox args={[0.34, 0.22, 0.06]} radius={0.04} smoothness={3} rotation={[-0.1, 0.18, 0]}>
        <meshStandardMaterial color={colors.prop} roughness={0.34} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.12, 0.02]} radius={0.02} smoothness={2} position={[0.08, 0.04, 0.04]}>
        <meshStandardMaterial color={colors.glowSoft} roughness={0.26} />
      </RoundedBox>
    </group>
  );
}

function MasklingFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const outfitGlow = focusSlot === "outfit" ? 0.08 : 0.02;
  return (
    <group position={[0, 0.14, 0]}>
      <RoundedBox args={[0.9, 1.12, 0.72]} radius={0.24} smoothness={6} position={[0, 0.62, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.76} />
      </RoundedBox>
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.64, partMatch(recipe.outfit, "outfit-fairdress") ? 1.16 : 0.92, 26]} />
        <meshStandardMaterial color={partMatch(recipe.outfit, "outfit-fairdress") ? colors.accentSoft : colors.body} roughness={0.66} />
      </mesh>
      <Torus args={[0.34, 0.05, 12, 24]} position={[0, 0.94, 0.32]}>
        <meshStandardMaterial color={colors.accent} roughness={0.34} emissive={colors.accentSoft} emissiveIntensity={outfitGlow} />
      </Torus>
      <Sphere args={[0.92, 32, 32]} position={[0, 1.78, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      <RoundedBox args={[0.92, 0.84, 0.16]} radius={0.12} smoothness={4} position={[0.04, 1.84, 0.72]}>
        <meshStandardMaterial color={colors.shell} roughness={0.38} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.52, 0.08]} radius={0.03} smoothness={2} position={[0.22, 1.84, 0.8]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={colors.hair} roughness={0.44} />
      </RoundedBox>
      {partMatch(recipe.silhouette, "silhouette-bob") ? (
        <RoundedBox args={[1.46, 0.72, 1.18]} radius={0.28} smoothness={8} position={[0, 2.08, -0.08]}>
          <meshStandardMaterial color={colors.hair} roughness={0.72} />
        </RoundedBox>
      ) : null}
      <EyeDots colors={colors} sleepy={partMatch(recipe.expression, "sleepy")} />
      <BlushMouth colors={colors} />
      <HeadTopper recipe={recipe} colors={colors} />
      <RoundedBox args={[0.18, 0.56, 0.2]} radius={0.08} smoothness={4} position={[-0.48, 0.44, 0.12]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.56, 0.2]} radius={0.08} smoothness={4} position={[0.48, 0.44, 0.12]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </RoundedBox>
    </group>
  );
}

function BloomWitchFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const outfitGlow = focusSlot === "outfit" ? 0.08 : 0.03;
  return (
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.82, 1.18, 28]} />
        <meshStandardMaterial color={colors.body} roughness={0.66} />
      </mesh>
      <RoundedBox args={[0.82, 0.7, 0.72]} radius={0.2} smoothness={4} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={colors.accentSoft} roughness={0.54} />
      </RoundedBox>
      <Sphere args={[0.24, 18, 18]} position={[-0.56, 0.82, 0.18]}>
        <meshStandardMaterial color={colors.prop} roughness={0.36} emissive={colors.prop} emissiveIntensity={outfitGlow} />
      </Sphere>
      <Sphere args={[0.96, 32, 32]} position={[0, 1.78, 0.04]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      <Sphere args={[0.26, 16, 16]} position={[-0.62, 2.08, 0.08]}>
        <meshStandardMaterial color={colors.hair} roughness={0.7} />
      </Sphere>
      <Sphere args={[0.26, 16, 16]} position={[0.62, 2.08, 0.08]}>
        <meshStandardMaterial color={colors.hair} roughness={0.7} />
      </Sphere>
      <mesh position={[0, 2.42, 0.02]}>
        <coneGeometry args={[0.8, 0.64, 24]} />
        <meshStandardMaterial color={partMatch(recipe.headpiece, "headpiece-cloud") ? colors.shell : colors.hair} roughness={0.64} />
      </mesh>
      {partMatch(recipe.silhouette, "silhouette-curl") ? (
        <>
          <Sphere args={[0.18, 14, 14]} position={[-0.52, 1.62, 0.3]}>
            <meshStandardMaterial color={colors.hair} roughness={0.76} />
          </Sphere>
          <Sphere args={[0.18, 14, 14]} position={[0.52, 1.62, 0.3]}>
            <meshStandardMaterial color={colors.hair} roughness={0.76} />
          </Sphere>
        </>
      ) : null}
      <EyeDots colors={colors} wink={partMatch(recipe.expression, "expression-wink")} />
      <BlushMouth colors={colors} y={-0.02} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.56} />
    </group>
  );
}

function CandleKidFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const glow = focusSlot === "headpiece" ? 0.14 : 0.08;
  return (
    <group position={[0, 0.1, 0]}>
      <RoundedBox args={[0.7, 1.34, 0.64]} radius={0.18} smoothness={5} position={[0, 0.74, 0]}>
        <meshStandardMaterial color={partMatch(recipe.outfit, "outfit-pajama") ? colors.body : colors.accentSoft} roughness={0.72} />
      </RoundedBox>
      <Sphere args={[0.78, 28, 28]} position={[0, 1.96, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.8} />
      </Sphere>
      <Cylinder args={[0.22, 0.24, 0.62, 18]} position={[0, 2.78, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.46} />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.28, 10]} position={[0, 3.16, 0]}>
        <meshStandardMaterial color={colors.hair} roughness={0.3} />
      </Cylinder>
      <Sphere args={[0.08, 10, 10]} position={[0, 3.34, 0]}>
        <meshStandardMaterial color={colors.glow} roughness={0.2} emissive={colors.glow} emissiveIntensity={glow} />
      </Sphere>
      <EyeDots colors={colors} sleepy={partMatch(recipe.expression, "sleepy")} centerY={1.98} />
      <BlushMouth colors={colors} y={1.74} />
      <HeadTopper recipe={recipe} colors={colors} lift={3.42} />
    </group>
  );
}

function TriEyeRabbitFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const furGlow = focusSlot === "silhouette" ? 0.08 : 0.02;
  return (
    <group position={[0, 0.12, 0]}>
      <Sphere args={[0.82, 30, 30]} position={[0, 0.56, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.88} />
      </Sphere>
      <Sphere args={[0.94, 30, 30]} position={[0, 1.72, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      <RoundedBox args={[0.22, 1.14, 0.24]} radius={0.1} smoothness={4} position={[-0.24, 2.64, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.78} emissive={colors.accentSoft} emissiveIntensity={furGlow * 0.4} />
      </RoundedBox>
      <RoundedBox args={[0.22, 1.14, 0.24]} radius={0.1} smoothness={4} position={[0.24, 2.64, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.78} emissive={colors.accentSoft} emissiveIntensity={furGlow * 0.4} />
      </RoundedBox>
      <EyeDots colors={colors} thirdEye wink={partMatch(recipe.expression, "expression-wink")} />
      <BlushMouth colors={colors} y={-0.04} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.92} />
      <Sphere args={[0.14, 14, 14]} position={[-0.48, 0.02, 0.18]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      <Sphere args={[0.14, 14, 14]} position={[0.48, 0.02, 0.18]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
    </group>
  );
}

function MushroomBearFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const capGlow = focusSlot === "headpiece" ? 0.08 : 0.02;
  return (
    <group position={[0, 0.08, 0]}>
      <Sphere args={[0.92, 30, 30]} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.9} />
      </Sphere>
      <Sphere args={[0.92, 30, 30]} position={[0, 1.72, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      <Sphere args={[0.2, 14, 14]} position={[-0.46, 2.16, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.82} />
      </Sphere>
      <Sphere args={[0.2, 14, 14]} position={[0.46, 2.16, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.82} />
      </Sphere>
      <mesh position={[0, 2.46, 0]} rotation={[0.06, 0, 0]}>
        <coneGeometry args={[0.9, 0.54, 28]} />
        <meshStandardMaterial color={colors.prop} roughness={0.56} emissive={colors.prop} emissiveIntensity={capGlow * 0.6} />
      </mesh>
      <Cylinder args={[0.2, 0.24, 0.24, 16]} position={[0, 2.2, 0]}>
        <meshStandardMaterial color={colors.shell} roughness={0.76} />
      </Cylinder>
      <EyeDots colors={colors} sleepy={partMatch(recipe.expression, "sleepy")} />
      <BlushMouth colors={colors} y={-0.02} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.68} />
    </group>
  );
}

function DoubletailHoundFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const tailGlow = focusSlot === "outfit" ? 0.08 : 0.02;
  return (
    <group position={[0, 0.1, 0]}>
      <RoundedBox args={[1.02, 0.82, 0.66]} radius={0.22} smoothness={6} position={[0, 0.56, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.82} />
      </RoundedBox>
      <mesh position={[0.56, 1.54, 0.18]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.26, 0.86, 18]} />
        <meshStandardMaterial color={colors.skin} roughness={0.8} />
      </mesh>
      <Sphere args={[0.88, 30, 30]} position={[0, 1.66, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      <RoundedBox args={[0.24, 0.78, 0.18]} radius={0.08} smoothness={4} position={[-0.5, 2.3, 0]} rotation={[0, 0, 0.18]}>
        <meshStandardMaterial color={colors.hair} roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[0.24, 0.78, 0.18]} radius={0.08} smoothness={4} position={[0.28, 2.18, 0]} rotation={[0, 0, -0.42]}>
        <meshStandardMaterial color={colors.hair} roughness={0.72} />
      </RoundedBox>
      <mesh position={[-0.52, 0.54, -0.24]} rotation={[0.12, -0.5, -0.2]}>
        <coneGeometry args={[0.16, 0.72, 16]} />
        <meshStandardMaterial color={colors.body} roughness={0.8} emissive={colors.accentSoft} emissiveIntensity={tailGlow * 0.4} />
      </mesh>
      <mesh position={[-0.36, 0.4, -0.36]} rotation={[0.12, -0.82, -0.04]}>
        <coneGeometry args={[0.16, 0.72, 16]} />
        <meshStandardMaterial color={colors.body} roughness={0.8} emissive={colors.accentSoft} emissiveIntensity={tailGlow * 0.4} />
      </mesh>
      <EyeDots colors={colors} wink={partMatch(recipe.expression, "expression-wink")} />
      <BlushMouth colors={colors} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.5} />
    </group>
  );
}

function LongEarFishFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const finGlow = focusSlot === "silhouette" ? 0.1 : 0.03;
  return (
    <group position={[0, 0.12, 0]}>
      <Sphere args={[0.78, 28, 28]} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.7} />
      </Sphere>
      <Sphere args={[0.88, 28, 28]} position={[0, 1.74, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.76} />
      </Sphere>
      <mesh position={[-0.42, 2.04, 0]} rotation={[0, 0, 0.26]}>
        <coneGeometry args={[0.2, 1.02, 18]} />
        <meshStandardMaterial color={colors.glass} roughness={0.3} emissive={colors.glowSoft} emissiveIntensity={finGlow} />
      </mesh>
      <mesh position={[0.42, 2.04, 0]} rotation={[0, 0, -0.26]}>
        <coneGeometry args={[0.2, 1.02, 18]} />
        <meshStandardMaterial color={colors.glass} roughness={0.3} emissive={colors.glowSoft} emissiveIntensity={finGlow} />
      </mesh>
      <mesh position={[-0.54, 0.42, -0.18]} rotation={[0.2, -0.4, 0]}>
        <coneGeometry args={[0.16, 0.72, 18]} />
        <meshStandardMaterial color={colors.accentSoft} roughness={0.52} />
      </mesh>
      <EyeDots colors={colors} sleepy={partMatch(recipe.expression, "sleepy")} />
      <BlushMouth colors={colors} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.66} />
      <Sphere args={[0.08, 10, 10]} position={[0.68, 2.16, 0.18]}>
        <meshStandardMaterial color={colors.glowSoft} roughness={0.24} emissive={colors.glowSoft} emissiveIntensity={0.08} />
      </Sphere>
      <Sphere args={[0.06, 10, 10]} position={[0.82, 1.98, 0.16]}>
        <meshStandardMaterial color={colors.glowSoft} roughness={0.24} emissive={colors.glowSoft} emissiveIntensity={0.08} />
      </Sphere>
    </group>
  );
}

function RagbugFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const stitchGlow = focusSlot === "outfit" ? 0.08 : 0.02;
  return (
    <group position={[0, 0.1, 0]}>
      <RoundedBox args={[0.92, 0.72, 0.68]} radius={0.22} smoothness={6} position={[0, 0.56, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.68, 0.64]} radius={0.18} smoothness={5} position={[0, 1.34, 0]}>
        <meshStandardMaterial color={partMatch(recipe.outfit, "outfit-cape") ? colors.shell : colors.body} roughness={0.86} />
      </RoundedBox>
      <Sphere args={[0.82, 28, 28]} position={[0, 2.08, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.82} />
      </Sphere>
      <RoundedBox args={[0.54, 0.12, 0.06]} radius={0.03} smoothness={2} position={[0.12, 2.18, 0.82]} rotation={[0, 0, -0.36]}>
        <meshStandardMaterial color={colors.hair} roughness={0.34} emissive={colors.accentSoft} emissiveIntensity={stitchGlow * 0.4} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.68, 0.08]} radius={0.03} smoothness={2} position={[-0.62, 2.14, 0]} rotation={[0, 0, 0.22]}>
        <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.24} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.68, 0.08]} radius={0.03} smoothness={2} position={[0.62, 1.98, 0]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.24} />
      </RoundedBox>
      <EyeDots colors={colors} sleepy={partMatch(recipe.expression, "sleepy")} />
      <BlushMouth colors={colors} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.8} />
    </group>
  );
}

function ShellDragonFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const shellGlow = focusSlot === "silhouette" ? 0.08 : 0.02;
  return (
    <group position={[0, 0.08, 0]}>
      <RoundedBox args={[0.96, 0.82, 0.7]} radius={0.22} smoothness={6} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={colors.body} roughness={0.74} />
      </RoundedBox>
      <Sphere args={[0.9, 28, 28]} position={[0, 1.74, 0.02]}>
        <meshStandardMaterial color={colors.skin} roughness={0.78} />
      </Sphere>
      <mesh position={[-0.4, 2.34, 0]} rotation={[0, 0, 0.24]}>
        <coneGeometry args={[0.18, 0.6, 4]} />
        <meshStandardMaterial color={colors.shell} roughness={0.56} emissive={colors.glowSoft} emissiveIntensity={shellGlow * 0.4} />
      </mesh>
      <mesh position={[0.4, 2.34, 0]} rotation={[0, 0, -0.24]}>
        <coneGeometry args={[0.18, 0.6, 4]} />
        <meshStandardMaterial color={colors.shell} roughness={0.56} emissive={colors.glowSoft} emissiveIntensity={shellGlow * 0.4} />
      </mesh>
      <Dodecahedron args={[0.16, 0]} position={[0, 2.54, 0.08]}>
        <meshStandardMaterial color={colors.glowSoft} roughness={0.24} emissive={colors.glowSoft} emissiveIntensity={0.08} />
      </Dodecahedron>
      <mesh position={[-0.48, 0.42, -0.32]} rotation={[0.14, -0.52, 0]}>
        <coneGeometry args={[0.18, 0.86, 18]} />
        <meshStandardMaterial color={colors.body} roughness={0.76} />
      </mesh>
      <EyeDots colors={colors} sleepy={partMatch(recipe.expression, "sleepy")} />
      <BlushMouth colors={colors} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.82} />
    </group>
  );
}

function OwlDeerFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const shellGlow = focusSlot === "outfit" ? 0.1 : 0.04;
  return (
    <group position={[0, 0.06, 0]}>
      <RoundedBox args={[1.02, 0.86, 0.84]} radius={0.26} smoothness={8} position={[0, 0.56, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.26} />
      </RoundedBox>
      <RoundedBox args={[0.92, 0.52, 0.14]} radius={0.08} smoothness={4} position={[0, 0.74, 0.46]}>
        <meshStandardMaterial color={colors.glass} roughness={0.12} metalness={0.26} />
      </RoundedBox>
      <Sphere args={[0.84, 26, 26]} position={[0, 1.74, 0.02]}>
        <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.28} />
      </Sphere>
      <VisorFace colors={colors} dream={partMatch(recipe.expression, "sleepy")} />
      <RoundedBox args={[0.1, 0.78, 0.08]} radius={0.03} smoothness={2} position={[-0.34, 2.58, -0.08]} rotation={[0, 0, 0.32]}>
        <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.32} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.78, 0.08]} radius={0.03} smoothness={2} position={[0.34, 2.58, -0.08]} rotation={[0, 0, -0.32]}>
        <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.32} />
      </RoundedBox>
      <Sphere args={[0.08, 10, 10]} position={[-0.34, 2.96, -0.08]}>
        <meshStandardMaterial color={colors.glow} roughness={0.18} emissive={colors.glow} emissiveIntensity={shellGlow} />
      </Sphere>
      <Sphere args={[0.08, 10, 10]} position={[0.34, 2.96, -0.08]}>
        <meshStandardMaterial color={colors.glow} roughness={0.18} emissive={colors.glow} emissiveIntensity={shellGlow} />
      </Sphere>
      <HeadTopper recipe={recipe} colors={colors} lift={3.08} robot />
    </group>
  );
}

function NightFoxFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const visorWide = partMatch(recipe.outfit, "outfit-pod") ? 0.72 : 0.62;
  const shellGlow = focusSlot === "silhouette" ? 0.1 : 0.04;
  return (
    <group position={[0, 0.06, 0]}>
      <RoundedBox args={[0.98, 0.8, 0.78]} radius={0.24} smoothness={8} position={[0, 0.56, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.26} metalness={0.28} />
      </RoundedBox>
      <Sphere args={[0.78, 26, 26]} position={[0, 1.7, 0.02]}>
        <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.3} />
      </Sphere>
      <VisorFace colors={colors} width={visorWide} dream={partMatch(recipe.expression, "sleepy")} />
      <mesh position={[-0.36, 2.36, -0.02]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.18, 0.62, 4]} />
        <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.32} emissive={colors.accentSoft} emissiveIntensity={shellGlow * 0.3} />
      </mesh>
      <mesh position={[0.36, 2.36, -0.02]} rotation={[0, 0, -0.1]}>
        <coneGeometry args={[0.18, 0.62, 4]} />
        <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.32} emissive={colors.accentSoft} emissiveIntensity={shellGlow * 0.3} />
      </mesh>
      <HeadTopper recipe={recipe} colors={colors} lift={2.88} robot />
    </group>
  );
}

function CloudHedgehogFigure({ recipe, colors, focusSlot }: { recipe: StudioRecipe; colors: PaletteColors; focusSlot: StudioSlot }) {
  const ringGlow = focusSlot === "headpiece" ? 0.12 : 0.05;
  return (
    <group position={[0, 0.08, 0]}>
      <Sphere args={[0.96, 30, 30]} position={[0, 0.72, 0]}>
        <meshStandardMaterial color={colors.metal} roughness={0.28} metalness={0.26} />
      </Sphere>
      <Torus args={[0.88, 0.04, 12, 28]} position={[0, 0.8, 0.04]} rotation={[Math.PI / 2, 0.1, 0]}>
        <meshStandardMaterial color={colors.glow} roughness={0.18} emissive={colors.glow} emissiveIntensity={ringGlow} />
      </Torus>
      {Array.from({ length: 10 }).map((_, index) => {
        const angle = (index / 10) * Math.PI * 2;
        return (
          <mesh key={`quill-${index}`} position={[Math.cos(angle) * 0.74, 1.3, Math.sin(angle) * 0.14]} rotation={[0, 0, angle]}>
            <coneGeometry args={[0.08, 0.48, 6]} />
            <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.3} />
          </mesh>
        );
      })}
      <Sphere args={[0.8, 26, 26]} position={[0, 1.86, 0.02]}>
        <meshStandardMaterial color={colors.metal} roughness={0.24} metalness={0.3} />
      </Sphere>
      <VisorFace colors={colors} width={0.68} dream={partMatch(recipe.expression, "sleepy")} />
      <HeadTopper recipe={recipe} colors={colors} lift={2.9} robot />
    </group>
  );
}

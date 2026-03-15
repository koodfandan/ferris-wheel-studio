import { RoundedBox, Sphere, Torus } from "@react-three/drei";
import { type FigureDefinition, type FigureRecipe, type FinishPreset } from "./catalog-v2";

type FigureProps = {
  character: FigureDefinition;
  recipe: FigureRecipe;
  finish: FinishPreset;
  detailLevel?: "low" | "standard" | "high";
};

type PartProps = Omit<FigureProps, "character">;

type BasicMaterialProps = {
  color: string;
  roughness?: number;
  metalness?: number;
  opacity?: number;
  transparent?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
};

const MATERIAL_PROFILES = {
  vinyl: { roughness: 0.66, metalness: 0.01, clearcoat: 0.04, clearcoatRoughness: 0.56 },
  plush: { roughness: 0.9, clearcoat: 0.01, clearcoatRoughness: 0.94, sheen: 0.1, sheenRoughness: 0.94 },
  metal: { roughness: 0.5, metalness: 0.08, clearcoat: 0.06, clearcoatRoughness: 0.46 },
  glass: { roughness: 0.34, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.52, transmission: 0.05, thickness: 0.28 },
} as const;

function seg(detailLevel: "low" | "standard" | "high" | undefined, low: number, standard: number, high: number) {
  if (detailLevel === "high") return high;
  if (detailLevel === "low") return low;
  return standard;
}

function VinylMaterial({
  color,
  roughness = MATERIAL_PROFILES.vinyl.roughness,
  metalness = MATERIAL_PROFILES.vinyl.metalness,
  opacity,
  transparent,
  emissive,
  emissiveIntensity,
}: BasicMaterialProps) {
  const needsBlend = transparent === true || (opacity !== undefined && opacity < 1);
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      clearcoat={MATERIAL_PROFILES.vinyl.clearcoat}
      clearcoatRoughness={MATERIAL_PROFILES.vinyl.clearcoatRoughness}
      envMapIntensity={0.22}
      specularIntensity={0.08}
      opacity={opacity}
      transparent={transparent}
      depthWrite={!needsBlend}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function PlushMaterial({ color, roughness = MATERIAL_PROFILES.plush.roughness, opacity, transparent }: BasicMaterialProps) {
  const needsBlend = transparent === true || (opacity !== undefined && opacity < 1);
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      opacity={opacity}
      transparent={transparent}
      depthWrite={!needsBlend}
      clearcoat={MATERIAL_PROFILES.plush.clearcoat}
      clearcoatRoughness={MATERIAL_PROFILES.plush.clearcoatRoughness}
      sheen={MATERIAL_PROFILES.plush.sheen}
      sheenColor={color}
      sheenRoughness={MATERIAL_PROFILES.plush.sheenRoughness}
      envMapIntensity={0.14}
      specularIntensity={0.04}
    />
  );
}

function MetalToyMaterial({
  color,
  roughness = MATERIAL_PROFILES.metal.roughness,
  metalness = MATERIAL_PROFILES.metal.metalness,
  emissive,
  emissiveIntensity,
}: BasicMaterialProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      clearcoat={MATERIAL_PROFILES.metal.clearcoat}
      clearcoatRoughness={MATERIAL_PROFILES.metal.clearcoatRoughness}
      envMapIntensity={0.3}
      specularIntensity={0.1}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function GlassMaterial({
  color,
  opacity = 0.88,
  emissive,
  emissiveIntensity,
  detailLevel,
}: BasicMaterialProps & { detailLevel?: "low" | "standard" | "high" }) {
  const transmission = detailLevel === "low" ? 0.12 : MATERIAL_PROFILES.glass.transmission;
  const thickness = detailLevel === "low" ? 0.28 : MATERIAL_PROFILES.glass.thickness;
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={MATERIAL_PROFILES.glass.roughness}
      metalness={MATERIAL_PROFILES.glass.metalness}
      clearcoat={MATERIAL_PROFILES.glass.clearcoat}
      clearcoatRoughness={MATERIAL_PROFILES.glass.clearcoatRoughness}
      transmission={transmission}
      thickness={thickness}
      transparent
      opacity={opacity}
      depthWrite={false}
      envMapIntensity={0.24}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function blushPair(
  finish: FinishPreset,
  y: number,
  z: number,
  wide: number,
  scale = 0.07,
  detailLevel?: "low" | "standard" | "high",
  centerX = 0,
) {
  const segments = seg(detailLevel, 8, 10, 14);
  return (
    <group position={[centerX, y, z]}>
      {[-wide, wide].map((x, index) => (
        <Sphere key={`blush-${index}`} args={[scale, segments, segments]} scale={[1.25, 0.7, 0.28]} position={[x, 0, 0]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.22} opacity={0.84} transparent />
        </Sphere>
      ))}
    </group>
  );
}

function buttonNose(
  color: string,
  position: [number, number, number],
  scale = 0.06,
  detailLevel?: "low" | "standard" | "high",
) {
  const segments = seg(detailLevel, 10, 12, 16);
  return (
    <Sphere args={[scale, segments, segments]} position={position} scale={[1, 0.84, 0.72]}>
      <VinylMaterial color={color} roughness={0.18} />
    </Sphere>
  );
}

function rivetBand(
  color: string,
  points: [number, number, number][],
  radius = 0.026,
  roughness = 0.16,
  metalness = 0.2,
  detailLevel?: "low" | "standard" | "high",
) {
  const segments = seg(detailLevel, 6, 8, 10);
  return (
    <>
      {points.map((position, index) => (
        <Sphere key={`rivet-${index}-${position.join("-")}`} args={[radius, segments, segments]} position={position}>
          <MetalToyMaterial color={color} roughness={roughness} metalness={metalness} />
        </Sphere>
      ))}
    </>
  );
}

export function FigureDisplayV2({ character, recipe, finish, detailLevel = "standard" }: FigureProps) {
  switch (character.id) {
    case "veil-nun":
      return <VeilNun recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "bubble-diver":
      return <BubbleDiver recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "post-dog":
      return <PostDog recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "tin-wolf":
      return <TinWolf recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "dune-tortle":
      return <DuneTortle recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "mirror-snake":
      return <MirrorSnake recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "frost-penguin":
      return <FrostPenguin recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "cloud-jelly":
      return <CloudJelly recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "spore-bear":
      return <SporeBear recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "scrap-crow":
      return <ScrapCrow recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    case "sugar-lamb":
      return <SugarLamb recipe={recipe} finish={finish} detailLevel={detailLevel} />;
    default:
      return <PorcelainDeer recipe={recipe} finish={finish} detailLevel={detailLevel} />;
  }
}

function roundEyes(
  finish: FinishPreset,
  y: number,
  z = 0.94,
  wide = 0.24,
  radius = 0.07,
  detailLevel?: "low" | "standard" | "high",
  centerX = 0,
) {
  const segments = seg(detailLevel, 12, 16, 20);
  return (
    <group position={[centerX, y, z]}>
      {[-wide, wide].map((x, index) => (
        <group key={`eye-${index}`} position={[x, 0, 0]}>
          <Sphere args={[radius * 1.18, segments, segments]} scale={[1.06, 1, 0.38]}>
            <VinylMaterial color={finish.shell} roughness={0.22} />
          </Sphere>
          <Sphere args={[radius * 0.76, segments, segments]} position={[0, 0, radius * 0.14]} scale={[1, 1, 0.46]}>
            <VinylMaterial color={finish.ink} roughness={0.16} />
          </Sphere>
          <Sphere args={[radius * 0.2, seg(detailLevel, 8, 10, 12), seg(detailLevel, 8, 10, 12)]} position={[radius * 0.18, radius * 0.18, radius * 0.34]}>
            <GlassMaterial color="#fffef8" opacity={0.96} detailLevel={detailLevel} />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

function slitEyes(finish: FinishPreset, y: number, z = 0.94, wide = 0.22, width = 0.16, centerX = 0) {
  return (
    <group position={[centerX, y, z]}>
      {[-wide, wide].map((x, index) => (
        <group key={`slit-eye-${index}`} position={[x, 0, 0]}>
          <RoundedBox args={[width * 1.04, 0.065, 0.02]} radius={0.02} smoothness={2}>
            <VinylMaterial color={finish.shell} roughness={0.26} />
          </RoundedBox>
          <RoundedBox args={[width, 0.028, 0.024]} radius={0.014} smoothness={2} position={[0, 0.002, 0.012]}>
            <VinylMaterial color={finish.ink} roughness={0.18} />
          </RoundedBox>
          <RoundedBox args={[width * 0.72, 0.01, 0.01]} radius={0.006} smoothness={2} position={[0, 0.026, 0.018]}>
            <GlassMaterial color="#fffef8" opacity={0.72} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

function tinyMouth(finish: FinishPreset, y: number, z = 0.95, width = 0.14, centerX = 0) {
  return (
    <group position={[centerX, y, z]}>
      <RoundedBox args={[width, 0.058, 0.028]} radius={0.024} smoothness={2} position={[0, 0, 0.008]}>
        <VinylMaterial color={finish.accentSoft} roughness={0.26} />
      </RoundedBox>
      <RoundedBox args={[width * 0.54, 0.012, 0.012]} radius={0.005} smoothness={2} position={[0, -0.002, 0.026]}>
        <VinylMaterial color={finish.ink} roughness={0.14} />
      </RoundedBox>
    </group>
  );
}

function glowOrb(
  finish: FinishPreset,
  position: [number, number, number],
  radius = 0.12,
  detailLevel?: "low" | "standard" | "high",
) {
  const segments = seg(detailLevel, 10, 14, 18);
  return (
    <Sphere args={[radius, segments, segments]} position={position}>
      <GlassMaterial color={finish.glow} emissive={finish.glow} emissiveIntensity={0.18} detailLevel={detailLevel} />
    </Sphere>
  );
}

function VeilNun({ recipe, finish }: PartProps) {
  const bowed = recipe.variant === "veil-nun-bow";
  const split = recipe.variant === "veil-nun-split";
  const hood = recipe.head === "veil-nun-hood";
  const halo = recipe.head === "veil-nun-halo";

  return (
    <group position={[0, 0.06, 0]} rotation={[0, bowed ? -0.08 : 0, 0]}>
      <mesh position={[0, 0.48, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[split ? 0.82 : 0.72, split ? 1.88 : 1.72, 28]} />
        <VinylMaterial color={finish.body} roughness={0.56} />
      </mesh>
      {recipe.body === "veil-nun-layer" ? (
        <mesh position={[0, 0.72, 0.02]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.88, 1.26, 28]} />
          <VinylMaterial color={finish.accentSoft} roughness={0.5} />
        </mesh>
      ) : null}
      <RoundedBox args={[0.48, 0.64, 0.36]} radius={0.14} smoothness={4} position={[0, 1.24, 0]}>
        <VinylMaterial color={recipe.body === "veil-nun-ribbon" ? finish.accentSoft : finish.body} roughness={0.54} />
      </RoundedBox>
      <RoundedBox args={[0.54, 0.06, 0.3]} radius={0.02} smoothness={2} position={[0, 1.08, 0.14]}>
        <MetalToyMaterial color={finish.prop} roughness={0.18} metalness={0.14} />
      </RoundedBox>
      <Sphere args={[0.05, 10, 10]} position={[0, 1.06, 0.24]}>
        <GlassMaterial color={finish.glowSoft} opacity={0.92} emissive={finish.glowSoft} emissiveIntensity={0.08} />
      </Sphere>
      <RoundedBox args={[0.22, 0.08, 0.04]} radius={0.03} smoothness={2} position={[0, 1.44, 0.24]}>
        <MetalToyMaterial color={finish.prop} roughness={0.18} metalness={0.16} />
      </RoundedBox>
      {[-0.08, 0.08].map((x, index) => (
        <Sphere key={`nun-brooch-${index}`} args={[0.05, 10, 10]} position={[x, 1.28 - Math.abs(x) * 0.6, 0.2]}>
          <GlassMaterial color={index === 0 ? finish.glowSoft : finish.accentSoft} opacity={0.92} />
        </Sphere>
      ))}
      <Sphere args={[0.46, 26, 26]} position={[0, 1.98, 0.02]}>
        <VinylMaterial color={finish.skin} roughness={0.58} />
      </Sphere>
      <RoundedBox args={[0.58, 0.74, 0.12]} radius={0.06} smoothness={3} position={[0, 1.98, 0.42]}>
        <VinylMaterial color={finish.shell} roughness={0.26} />
      </RoundedBox>
      <Sphere args={[0.05, 10, 10]} position={[0, 2.18, 0.5]}>
        <GlassMaterial color={finish.glowSoft} opacity={0.9} />
      </Sphere>
      {recipe.face === "veil-nun-plain" ? roundEyes(finish, 1.98, 0.49, 0.16, 0.05) : slitEyes(finish, 1.98, 0.49, 0.16, 0.12)}
      {tinyMouth(finish, 1.8, 0.49, 0.11)}
      {recipe.face === "veil-nun-crack" ? (
        <RoundedBox args={[0.05, 0.86, 0.02]} radius={0.02} smoothness={2} position={[0.08, 2, 0.5]} rotation={[0, 0, 0.22]}>
          <meshStandardMaterial color={finish.ink} roughness={0.24} />
        </RoundedBox>
      ) : null}
      {recipe.face === "veil-nun-weep" ? (
        <>
          {glowOrb(finish, [-0.14, 1.74, 0.54], 0.06)}
          {glowOrb(finish, [0.14, 1.7, 0.54], 0.06)}
        </>
      ) : null}
      {hood ? (
        <mesh position={[0, 2.14, -0.06]} rotation={[0.16, 0, 0]}>
          <coneGeometry args={[0.58, 0.92, 28]} />
          <VinylMaterial color={finish.body} roughness={0.5} />
        </mesh>
      ) : null}
      {recipe.head === "veil-nun-veil" ? (
        <>
          <RoundedBox args={[0.14, 1.2, 0.04]} radius={0.02} smoothness={2} position={[-0.34, 1.94, -0.02]} rotation={[0.06, 0, 0.08]}>
            <VinylMaterial color={finish.shell} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[0.14, 1.18, 0.04]} radius={0.02} smoothness={2} position={[0.34, 1.92, -0.02]} rotation={[0.06, 0, -0.08]}>
            <VinylMaterial color={finish.shell} roughness={0.3} />
          </RoundedBox>
        </>
      ) : null}
      {halo ? (
        <Torus args={[0.42, 0.04, 10, 28]} position={[0, 2.3, -0.18]} rotation={[0.36, 0, 0]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.86} emissive={finish.glowSoft} emissiveIntensity={0.08} />
        </Torus>
      ) : null}
      {recipe.arms === "veil-nun-fold" ? (
        <>
          <RoundedBox args={[0.14, 0.82, 0.12]} radius={0.06} smoothness={2} position={[-0.18, 1.02, 0.22]} rotation={[0, 0, 0.22]}>
            <meshStandardMaterial color={finish.body} roughness={0.74} />
          </RoundedBox>
          <RoundedBox args={[0.14, 0.82, 0.12]} radius={0.06} smoothness={2} position={[0.18, 1.02, 0.22]} rotation={[0, 0, -0.22]}>
            <meshStandardMaterial color={finish.body} roughness={0.74} />
          </RoundedBox>
        </>
      ) : recipe.arms === "veil-nun-open" ? (
        <>
          <RoundedBox args={[0.18, 0.92, 0.14]} radius={0.06} smoothness={2} position={[-0.52, 1.04, 0.12]} rotation={[0, 0, 0.48]}>
            <meshStandardMaterial color={finish.body} roughness={0.74} />
          </RoundedBox>
          <RoundedBox args={[0.18, 0.92, 0.14]} radius={0.06} smoothness={2} position={[0.52, 1.04, 0.12]} rotation={[0, 0, -0.48]}>
            <meshStandardMaterial color={finish.body} roughness={0.74} />
          </RoundedBox>
        </>
      ) : (
        <>
          <RoundedBox args={[0.14, 0.84, 0.12]} radius={0.06} smoothness={2} position={[-0.4, 1.1, 0.16]} rotation={[0, 0, 0.24]}>
            <meshStandardMaterial color={finish.body} roughness={0.74} />
          </RoundedBox>
          <RoundedBox args={[0.14, 0.92, 0.12]} radius={0.06} smoothness={2} position={[0.42, 1.34, 0.16]} rotation={[0, 0, -0.54]}>
            <meshStandardMaterial color={finish.body} roughness={0.74} />
          </RoundedBox>
        </>
      )}
      {recipe.back === "veil-nun-trail" ? (
        <>
          <RoundedBox args={[0.08, 1.28, 0.04]} radius={0.02} smoothness={2} position={[-0.16, 0.86, -0.38]} rotation={[0.08, 0, 0.04]}>
            <meshStandardMaterial color={finish.shell} roughness={0.62} />
          </RoundedBox>
          <RoundedBox args={[0.08, 1.32, 0.04]} radius={0.02} smoothness={2} position={[0.16, 0.78, -0.4]} rotation={[0.08, 0, -0.04]}>
            <meshStandardMaterial color={finish.shell} roughness={0.62} />
          </RoundedBox>
        </>
      ) : recipe.back === "veil-nun-cross" ? (
        <>
          <RoundedBox args={[0.08, 0.82, 0.04]} radius={0.02} smoothness={2} position={[0, 1.1, -0.34]}>
            <MetalToyMaterial color={finish.metal} roughness={0.24} metalness={0.22} />
          </RoundedBox>
          <RoundedBox args={[0.52, 0.08, 0.04]} radius={0.02} smoothness={2} position={[0, 1.24, -0.34]}>
            <MetalToyMaterial color={finish.metal} roughness={0.24} metalness={0.22} />
          </RoundedBox>
        </>
      ) : null}
      {recipe.prop === "veil-nun-lantern" ? (
        <group position={[0.42, 0.62, 0.18]}>
          <RoundedBox args={[0.22, 0.28, 0.18]} radius={0.06} smoothness={3}>
            <GlassMaterial color={finish.glowSoft} opacity={0.9} emissive={finish.glowSoft} emissiveIntensity={0.1} />
          </RoundedBox>
        </group>
      ) : recipe.prop === "veil-nun-staff" ? (
        <mesh position={[0.42, 0.84, 0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 1.54, 14]} />
          <MetalToyMaterial color={finish.metal} roughness={0.24} metalness={0.24} />
        </mesh>
      ) : (
        <RoundedBox args={[0.3, 0.42, 0.08]} radius={0.04} smoothness={3} position={[0.44, 0.8, 0.14]} rotation={[0, 0, -0.16]}>
          <VinylMaterial color={finish.prop} roughness={0.28} />
        </RoundedBox>
      )}
    </group>
  );
}

function BubbleDiver({ recipe, finish }: PartProps) {
  const torpedo = recipe.variant === "bubble-diver-torpedo";
  const wide = recipe.variant === "bubble-diver-wide";

  return (
    <group position={[0, 0.02, 0]}>
      <mesh scale={[wide ? 1.18 : 1, wide ? 1.02 : 1, torpedo ? 1.18 : 1]} position={[0, 1.64, 0]}>
        <sphereGeometry args={[0.86, 28, 28]} />
        <GlassMaterial color={finish.shell} opacity={0.88} />
      </mesh>
      <Torus args={[0.44, 0.05, 12, 28]} position={[0, 1.64, 0.68]} rotation={[0.08, 0, 0]}>
        <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.22} />
      </Torus>
      <RoundedBox args={[torpedo ? 1.2 : 0.92, 0.86, 0.76]} radius={0.28} smoothness={6} position={[0, 0.62, 0]}>
        <VinylMaterial color={recipe.body === "bubble-diver-shell" ? finish.shell : finish.body} roughness={0.48} />
      </RoundedBox>
      <RoundedBox args={[torpedo ? 0.98 : 0.78, 0.12, 0.82]} radius={0.04} smoothness={2} position={[0, 0.76, 0]}>
        <MetalToyMaterial color={finish.accentSoft} roughness={0.2} metalness={0.16} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.48, 0.1]} radius={0.06} smoothness={3} position={[0, 1.64, 0.72]}>
        <GlassMaterial color={finish.accentSoft} opacity={0.92} />
      </RoundedBox>
      {rivetBand(
        finish.metal,
        [
          [-0.36, 2.02, 0.66],
          [-0.12, 1.98, 0.68],
          [0.12, 1.98, 0.68],
          [0.36, 2.02, 0.66],
          [-0.46, 1.54, 0.4],
          [0.46, 1.54, 0.4],
        ],
        0.04,
      )}
      <mesh position={[-0.42, 1.18, -0.18]} rotation={[0.24, 0, 0.34]}>
        <torusGeometry args={[0.24, 0.03, 8, 18, Math.PI]} />
        <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
      </mesh>
      <mesh position={[0.42, 1.18, -0.18]} rotation={[0.24, 0, -0.34]}>
        <torusGeometry args={[0.24, 0.03, 8, 18, Math.PI]} />
        <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
      </mesh>
      {recipe.face === "bubble-diver-scan" ? slitEyes(finish, 1.66, 0.8, 0.18, 0.14) : roundEyes(finish, 1.66, 0.8, 0.18, recipe.face === "bubble-diver-star" ? 0.08 : 0.06)}
      {recipe.face === "bubble-diver-star" ? glowOrb(finish, [0, 1.38, 0.82], 0.06) : tinyMouth(finish, 1.44, 0.8, 0.12)}
      {recipe.head === "bubble-diver-valve" ? (
        <mesh position={[0, 2.44, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.18, 16]} />
          <MetalToyMaterial color={finish.metal} roughness={0.2} metalness={0.2} />
        </mesh>
      ) : recipe.head === "bubble-diver-periscope" ? (
        <>
          <mesh position={[0, 2.52, -0.06]}>
            <cylinderGeometry args={[0.06, 0.06, 0.42, 12]} />
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.22} />
          </mesh>
          <RoundedBox args={[0.22, 0.1, 0.14]} radius={0.04} smoothness={2} position={[0.1, 2.72, 0.04]}>
            <MetalToyMaterial color={finish.accent} roughness={0.22} metalness={0.14} />
          </RoundedBox>
        </>
      ) : (
        <>
          {glowOrb(finish, [-0.16, 2.44, 0.1], 0.1)}
          {glowOrb(finish, [0.1, 2.54, -0.06], 0.08)}
        </>
      )}
      {recipe.arms === "bubble-diver-flip" ? (
        <>
          <RoundedBox args={[0.28, 0.12, 0.52]} radius={0.06} smoothness={3} position={[-0.36, -0.02, 0.08]} rotation={[0.18, 0, 0.28]}>
            <meshStandardMaterial color={finish.prop} roughness={0.54} />
          </RoundedBox>
          <RoundedBox args={[0.28, 0.12, 0.52]} radius={0.06} smoothness={3} position={[0.36, -0.02, 0.08]} rotation={[0.18, 0, -0.28]}>
            <meshStandardMaterial color={finish.prop} roughness={0.54} />
          </RoundedBox>
        </>
      ) : recipe.arms === "bubble-diver-tread" ? (
        <>
          <RoundedBox args={[0.22, 0.42, 0.16]} radius={0.06} smoothness={2} position={[-0.62, 0.82, 0.16]} rotation={[0, 0, 0.54]}>
            <meshStandardMaterial color={finish.body} roughness={0.66} />
          </RoundedBox>
          <RoundedBox args={[0.22, 0.42, 0.16]} radius={0.06} smoothness={2} position={[0.62, 0.82, 0.16]} rotation={[0, 0, -0.54]}>
            <meshStandardMaterial color={finish.body} roughness={0.66} />
          </RoundedBox>
        </>
      ) : (
        <>
          {glowOrb(finish, [-0.54, 0.78, 0.1], 0.08)}
          {glowOrb(finish, [0.54, 0.78, 0.1], 0.08)}
        </>
      )}
      {recipe.back === "bubble-diver-tanks" ? (
        <>
          <mesh position={[-0.22, 0.82, -0.42]}>
            <cylinderGeometry args={[0.12, 0.12, 0.82, 16]} />
            <MetalToyMaterial color={finish.metal} roughness={0.24} metalness={0.24} />
          </mesh>
          <mesh position={[0.22, 0.82, -0.42]}>
            <cylinderGeometry args={[0.12, 0.12, 0.82, 16]} />
            <MetalToyMaterial color={finish.metal} roughness={0.24} metalness={0.24} />
          </mesh>
        </>
      ) : recipe.back === "bubble-diver-propeller" ? (
        <Torus args={[0.2, 0.04, 8, 16]} position={[0, 0.8, -0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.22} />
        </Torus>
      ) : (
        <Sphere args={[0.24, 16, 16]} position={[0, 0.86, -0.46]}>
          <GlassMaterial color={finish.accentSoft} opacity={0.86} />
        </Sphere>
      )}
      <mesh position={[-0.24, 1.28, -0.3]} rotation={[0.18, 0.34, 0.32]}>
        <torusGeometry args={[0.22, 0.024, 8, 18, Math.PI * 0.8]} />
        <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
      </mesh>
      <mesh position={[0.24, 1.28, -0.3]} rotation={[0.18, -0.34, -0.32]}>
        <torusGeometry args={[0.22, 0.024, 8, 18, Math.PI * 0.8]} />
        <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
      </mesh>
      {recipe.prop === "bubble-diver-shell" ? (
        <RoundedBox args={[0.32, 0.2, 0.12]} radius={0.08} smoothness={3} position={[0.62, 0.52, 0.22]} rotation={[0, 0, -0.4]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.9} emissive={finish.glowSoft} emissiveIntensity={0.08} />
        </RoundedBox>
      ) : recipe.prop === "bubble-diver-hook" ? (
        <Torus args={[0.14, 0.03, 8, 16, Math.PI]} position={[0.64, 0.6, 0.18]} rotation={[0, 0, -0.2]}>
          <MetalToyMaterial color={finish.metal} roughness={0.24} metalness={0.22} />
        </Torus>
      ) : (
        <RoundedBox args={[0.3, 0.16, 0.06]} radius={0.03} smoothness={2} position={[0.64, 0.54, 0.18]}>
          <VinylMaterial color={finish.prop} roughness={0.22} metalness={0.08} />
        </RoundedBox>
      )}
    </group>
  );
}

function PostDog({ recipe, finish }: PartProps) {
  const run = recipe.variant === "post-dog-run";
  const loaf = recipe.variant === "post-dog-loaf";

  return (
    <group position={[0, 0.02, 0]} rotation={[0, run ? -0.1 : 0, 0]}>
      <RoundedBox args={[loaf ? 1.18 : 1.28, loaf ? 0.56 : 0.72, 0.68]} radius={0.24} smoothness={6} position={[0, 0.58, 0]}>
        <PlushMaterial color={recipe.body === "post-dog-coat" ? finish.accentSoft : finish.body} roughness={0.92} />
      </RoundedBox>
      {[-0.38, -0.18, 0.04, 0.26].map((x, index) => (
        <RoundedBox
          key={`dog-stitch-top-${index}`}
          args={[0.06, 0.018, 0.02]}
          radius={0.008}
          smoothness={2}
          position={[x, 0.92 - Math.abs(x) * 0.05, 0.34]}
          rotation={[0, 0, index % 2 === 0 ? 0.12 : -0.12]}
        >
          <VinylMaterial color={finish.shell} roughness={0.34} />
        </RoundedBox>
      ))}
      {recipe.body === "post-dog-patch" ? (
        <>
          <RoundedBox args={[0.26, 0.18, 0.04]} radius={0.03} smoothness={2} position={[0.1, 0.72, 0.36]} rotation={[0, 0, -0.2]}>
            <meshStandardMaterial color={finish.accent} roughness={0.74} />
          </RoundedBox>
          <RoundedBox args={[0.18, 0.16, 0.04]} radius={0.03} smoothness={2} position={[-0.34, 0.42, -0.34]} rotation={[0.2, 0.1, 0.12]}>
            <meshStandardMaterial color={finish.prop} roughness={0.74} />
          </RoundedBox>
        </>
      ) : null}
      <Sphere args={[0.54, 26, 26]} position={[0.74, 0.92, 0.02]}>
        <VinylMaterial color={finish.skin} roughness={0.64} />
      </Sphere>
      <RoundedBox args={[0.34, 0.22, 0.12]} radius={0.08} smoothness={2} position={[0.98, 0.82, 0.22]}>
        <VinylMaterial color={finish.shell} roughness={0.38} />
      </RoundedBox>
      <mesh position={[1.08, 0.84, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.16, 0.34, 18]} />
        <VinylMaterial color={finish.skin} roughness={0.62} />
      </mesh>
      <RoundedBox args={[0.42, 0.08, 0.28]} radius={0.03} smoothness={2} position={[0.76, 0.62, 0.18]}>
        <VinylMaterial color={finish.accentSoft} roughness={0.3} />
      </RoundedBox>
      <Sphere args={[0.06, 10, 10]} position={[0.92, 0.58, 0.34]}>
        <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.16} />
      </Sphere>
      {recipe.face === "post-dog-sniff"
        ? roundEyes(finish, 0.98, 0.56, 0.14, 0.05, undefined, 0.86)
        : slitEyes(finish, 0.98, 0.56, 0.14, recipe.face === "post-dog-dozy" ? 0.14 : 0.1, 0.86)}
      {blushPair(finish, 0.82, 0.52, 0.2, 0.05, undefined, 0.86)}
      {tinyMouth(finish, 0.68, 0.54, recipe.face === "post-dog-smile" ? 0.14 : 0.1, 1.02)}
      {buttonNose(finish.ink, [1.18, 0.78, 0.28], 0.08)}
      {recipe.head === "post-dog-flop" ? (
        <>
          <RoundedBox args={[0.14, 0.58, 0.12]} radius={0.06} smoothness={2} position={[0.54, 1.18, 0.18]} rotation={[0, 0, 0.4]}>
            <PlushMaterial color={finish.body} roughness={0.94} />
          </RoundedBox>
          <RoundedBox args={[0.14, 0.62, 0.12]} radius={0.06} smoothness={2} position={[0.94, 1.16, 0.18]} rotation={[0, 0, -0.4]}>
            <PlushMaterial color={finish.body} roughness={0.94} />
          </RoundedBox>
        </>
      ) : recipe.head === "post-dog-prick" ? (
        <>
          <mesh position={[0.56, 1.34, 0.08]} rotation={[0, 0, 0.2]}>
            <coneGeometry args={[0.12, 0.42, 12]} />
            <PlushMaterial color={finish.body} roughness={0.92} />
          </mesh>
          <mesh position={[0.92, 1.34, 0.08]} rotation={[0, 0, -0.2]}>
            <coneGeometry args={[0.12, 0.42, 12]} />
            <PlushMaterial color={finish.body} roughness={0.92} />
          </mesh>
        </>
      ) : (
        <RoundedBox args={[0.34, 0.16, 0.14]} radius={0.05} smoothness={2} position={[0.74, 1.38, 0.02]}>
          <meshStandardMaterial color={finish.prop} roughness={0.46} />
        </RoundedBox>
      )}
      {Array.from({ length: 4 }).map((_, index) => {
        const x = index < 2 ? 0.42 : -0.42;
        const z = index % 2 === 0 ? 0.2 : -0.2;
        const y = loaf ? 0.08 : run && index < 2 ? 0.2 : 0.14;
        return (
          <mesh key={`dog-leg-${index}`} position={[x, y, z]} rotation={[0, 0, run && index < 2 ? -0.16 : 0]}>
            <cylinderGeometry args={[0.08, 0.08, loaf ? 0.2 : 0.46, 14]} />
            <meshStandardMaterial color={finish.body} roughness={0.86} />
          </mesh>
        );
      })}
      <mesh position={[-0.78, 0.92, -0.04]} rotation={[0.1, 0, 0.82]}>
        <torusGeometry args={[0.18, 0.05, 8, 16, Math.PI]} />
        <PlushMaterial color={finish.body} roughness={0.94} />
      </mesh>
      {recipe.back === "post-dog-bag" ? (
        <RoundedBox args={[0.38, 0.34, 0.22]} radius={0.08} smoothness={3} position={[-0.2, 0.88, -0.34]}>
          <meshStandardMaterial color={finish.prop} roughness={0.54} />
        </RoundedBox>
      ) : recipe.back === "post-dog-doublebag" ? (
        <>
          <RoundedBox args={[0.28, 0.28, 0.18]} radius={0.08} smoothness={3} position={[-0.1, 0.84, -0.34]}>
            <meshStandardMaterial color={finish.prop} roughness={0.54} />
          </RoundedBox>
          <RoundedBox args={[0.28, 0.28, 0.18]} radius={0.08} smoothness={3} position={[-0.1, 0.84, 0.34]}>
            <meshStandardMaterial color={finish.prop} roughness={0.54} />
          </RoundedBox>
        </>
      ) : (
        <RoundedBox args={[0.62, 0.08, 0.42]} radius={0.03} smoothness={2} position={[-0.12, 0.96, 0]}>
          <meshStandardMaterial color={finish.accentSoft} roughness={0.62} />
        </RoundedBox>
      )}
      {rivetBand(
        finish.shell,
        [
          [-0.24, 0.9, -0.22],
          [-0.24, 0.9, 0.22],
        ],
        0.018,
        0.26,
        0.04,
      )}
      {recipe.prop === "post-dog-letter" ? (
        <RoundedBox args={[0.24, 0.16, 0.04]} radius={0.03} smoothness={2} position={[0.92, 0.42, 0.2]}>
          <meshStandardMaterial color={finish.shell} roughness={0.34} />
        </RoundedBox>
      ) : recipe.prop === "post-dog-bell" ? (
        <Sphere args={[0.1, 12, 12]} position={[0.7, 0.38, 0.24]}>
          <meshStandardMaterial color={finish.metal} roughness={0.22} metalness={0.22} />
        </Sphere>
      ) : (
        <RoundedBox args={[0.16, 0.22, 0.04]} radius={0.03} smoothness={2} position={[0.7, 0.38, 0.24]}>
          <meshStandardMaterial color={finish.shell} roughness={0.34} />
        </RoundedBox>
      )}
    </group>
  );
}

function TinWolf({ recipe, finish }: PartProps) {
  const sprint = recipe.variant === "tin-wolf-sprint";
  const yaw = sprint ? -0.7 : -0.58;

  return (
    <group position={[-0.18, 0.04, 0]} rotation={[0, yaw, 0]}>
      <RoundedBox args={[sprint ? 1.34 : 1.12, 0.48, 0.52]} radius={0.12} smoothness={2} position={[0, 0.74, 0]}>
        <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.28} />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.06, 0.34]} radius={0.02} smoothness={2} position={[-0.08, 0.96, 0]}>
        <MetalToyMaterial color={finish.accentSoft} roughness={0.18} metalness={0.18} />
      </RoundedBox>
      {[-0.26, 0, 0.26].map((x, index) => (
        <RoundedBox key={`wolf-spine-${index}`} args={[0.08, 0.08, 0.18]} radius={0.02} smoothness={2} position={[x, 1.08, 0]}>
          <MetalToyMaterial
            color={index === 1 ? finish.glowSoft : finish.accent}
            roughness={0.14}
            metalness={0.18}
            emissive={index === 1 ? finish.glowSoft : finish.accent}
            emissiveIntensity={index === 1 ? 0.12 : 0.05}
          />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.58, 0.34, 0.5]} radius={0.08} smoothness={2} position={[1, 1, 0]}>
        <MetalToyMaterial
          color={recipe.body === "tin-wolf-core" ? finish.glowSoft : finish.metal}
          roughness={recipe.body === "tin-wolf-core" ? 0.12 : 0.22}
          metalness={0.28}
          emissive={recipe.body === "tin-wolf-core" ? finish.glowSoft : undefined}
          emissiveIntensity={recipe.body === "tin-wolf-core" ? 0.08 : undefined}
        />
      </RoundedBox>
      <mesh position={[1.32, 0.96, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.3} />
      </mesh>
      <RoundedBox args={[0.18, 0.1, 0.18]} radius={0.03} smoothness={2} position={[1.28, 0.82, 0.18]}>
        <MetalToyMaterial color={finish.accentSoft} roughness={0.16} metalness={0.22} />
      </RoundedBox>
      {recipe.face === "tin-wolf-visor" ? (
        <>
          <RoundedBox args={[0.34, 0.08, 0.03]} radius={0.03} smoothness={2} position={[1.18, 1.02, 0.28]}>
            <meshStandardMaterial color={finish.accent} roughness={0.16} metalness={0.18} emissive={finish.accent} emissiveIntensity={0.12} />
          </RoundedBox>
          {slitEyes(finish, 1.0, 0.36, 0.09, 0.08, 1.18)}
        </>
      ) : recipe.face === "tin-wolf-dual" ? (
        roundEyes(finish, 1.02, 0.36, 0.1, 0.04, undefined, 1.18)
      ) : (
        <>
          {glowOrb(finish, [1.18, 1.02, 0.34], 0.08)}
          {slitEyes(finish, 1.0, 0.36, 0.082, 0.06, 1.18)}
        </>
      )}
      {buttonNose(finish.ink, [1.2, 0.94, 0.42], 0.04)}
      {tinyMouth(finish, 0.86, 0.44, recipe.face === "tin-wolf-visor" ? 0.12 : 0.1, 1.2)}
      {[-0.16, 0, 0.16].map((x) => (
        <Sphere key={`wolf-rivet-${x}`} args={[0.03, 8, 8]} position={[0.12 + x, 0.82, 0.28]}>
          <MetalToyMaterial color={finish.accentSoft} roughness={0.14} metalness={0.22} />
        </Sphere>
      ))}
      {recipe.head === "tin-wolf-ears" ? (
        <>
          <mesh position={[0.9, 1.42, 0.12]} rotation={[0, 0, 0.1]}>
            <coneGeometry args={[0.08, 0.34, 4]} />
            <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.3} />
          </mesh>
          <mesh position={[1.1, 1.44, -0.12]} rotation={[0, 0, -0.12]}>
            <coneGeometry args={[0.08, 0.34, 4]} />
            <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.3} />
          </mesh>
        </>
      ) : recipe.head === "tin-wolf-array" ? (
        <>
          {[-0.1, 0.1, 0.3].map((x) => (
            <mesh key={`wolf-array-${x}`} position={[0.98 + x, 1.44, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.34, 8]} />
              <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.3} />
            </mesh>
          ))}
        </>
      ) : (
        <mesh position={[1, 1.36, 0]} rotation={[0, 0, 0.1]}>
          <coneGeometry args={[0.16, 0.46, 4]} />
          <meshStandardMaterial color={finish.accent} roughness={0.2} metalness={0.18} />
        </mesh>
      )}
      {recipe.body === "tin-wolf-rib" ? (
        <RoundedBox args={[0.82, 0.12, 0.54]} radius={0.04} smoothness={2} position={[0, 0.84, 0]}>
          <MetalToyMaterial color={finish.accentSoft} roughness={0.18} metalness={0.16} />
        </RoundedBox>
      ) : null}
      {Array.from({ length: 4 }).map((_, index) => {
        const x = index < 2 ? 0.4 : -0.36;
        const z = index % 2 === 0 ? 0.18 : -0.18;
        const angle = recipe.arms === "tin-wolf-pounce" && index < 2 ? -0.24 : recipe.arms === "tin-wolf-step" && index === 0 ? -0.14 : 0;
        return (
          <group key={`wolf-leg-${index}`} position={[x, 0.28, z]} rotation={[0, 0, angle]}>
            <RoundedBox args={[0.12, 0.46, 0.1]} radius={0.03} smoothness={2} position={[0, 0.18, 0]}>
              <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.28} />
            </RoundedBox>
            <RoundedBox args={[0.16, 0.18, 0.12]} radius={0.04} smoothness={2} position={[0, -0.12, 0]}>
              <meshStandardMaterial color={finish.accentSoft} roughness={0.24} metalness={0.18} />
            </RoundedBox>
            <RoundedBox args={[0.05, 0.02, 0.1]} radius={0.008} smoothness={2} position={[0.06, -0.24, 0.02]}>
              <MetalToyMaterial color={finish.prop} roughness={0.16} metalness={0.22} />
            </RoundedBox>
            <RoundedBox args={[0.05, 0.02, 0.1]} radius={0.008} smoothness={2} position={[-0.06, -0.24, -0.02]}>
              <MetalToyMaterial color={finish.prop} roughness={0.16} metalness={0.22} />
            </RoundedBox>
          </group>
        );
      })}
      {recipe.back === "tin-wolf-pack" ? (
        <RoundedBox args={[0.34, 0.34, 0.44]} radius={0.06} smoothness={2} position={[-0.24, 1.02, -0.3]}>
          <meshStandardMaterial color={finish.metal} roughness={0.22} metalness={0.26} />
        </RoundedBox>
      ) : recipe.back === "tin-wolf-tailblade" ? (
        <mesh position={[-0.86, 0.92, -0.02]} rotation={[0, -0.56, 0]}>
          <coneGeometry args={[0.1, 0.96, 4]} />
          <meshStandardMaterial color={finish.accent} roughness={0.18} metalness={0.24} emissive={finish.accent} emissiveIntensity={0.06} />
        </mesh>
      ) : (
        <Torus args={[0.18, 0.03, 8, 16]} position={[-0.54, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={finish.metal} roughness={0.22} metalness={0.26} />
        </Torus>
      )}
      {recipe.prop === "tin-wolf-core" ? glowOrb(finish, [0.64, 0.46, 0.26], 0.1) : recipe.prop === "tin-wolf-dagger" ? (
        <RoundedBox args={[0.34, 0.06, 0.04]} radius={0.02} smoothness={2} position={[0.68, 0.44, 0.24]} rotation={[0, 0, -0.4]}>
          <meshStandardMaterial color={finish.metal} roughness={0.18} metalness={0.26} />
        </RoundedBox>
      ) : (
        <RoundedBox args={[0.28, 0.08, 0.08]} radius={0.02} smoothness={2} position={[0.68, 0.44, 0.24]}>
          <meshStandardMaterial color={finish.glowSoft} roughness={0.14} emissive={finish.glowSoft} emissiveIntensity={0.12} />
        </RoundedBox>
      )}
    </group>
  );
}

function DuneTortle({ recipe, finish }: PartProps) {
  const arch = recipe.variant === "dune-tortle-arch";
  const long = recipe.variant === "dune-tortle-long";
  const yaw = (long ? -0.12 : 0) - 0.58;

  return (
    <group position={[-0.42, 0.02, 0]} rotation={[0, yaw, 0]}>
      <mesh scale={[long ? 1.36 : 1.16, arch ? 0.78 : 0.62, 1]} position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.82, 26, 26]} />
        <VinylMaterial color={recipe.body === "dune-tortle-cloth" ? finish.body : finish.shell} roughness={0.62} />
      </mesh>
      {[-0.28, 0, 0.28].map((x, index) => (
        <Sphere key={`tortle-shell-${index}`} args={[0.16, 12, 12]} position={[x, 0.98 - Math.abs(x) * 0.18, 0.18]}>
          <VinylMaterial color={index === 1 ? finish.accentSoft : finish.body} roughness={0.5} />
        </Sphere>
      ))}
      {recipe.body === "dune-tortle-ridge" ? (
        <mesh position={[0, 1.18, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.14, 0.74, 5]} />
          <VinylMaterial color={finish.accent} roughness={0.34} />
        </mesh>
      ) : null}
      <Sphere args={[0.34, 18, 18]} position={[1.16, 0.62, 0]}>
        <VinylMaterial color={finish.skin} roughness={0.6} />
      </Sphere>
      <mesh position={[1.38, 0.58, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.34, 16]} />
        <VinylMaterial color={finish.skin} roughness={0.6} />
      </mesh>
      {recipe.face === "dune-tortle-grin"
        ? roundEyes(finish, 0.68, 0.42, 0.1, 0.04, undefined, 1.16)
        : slitEyes(finish, 0.68, 0.42, 0.1, recipe.face === "dune-tortle-sleep" ? 0.12 : 0.08, 1.16)}
      {tinyMouth(finish, 0.52, 0.42, recipe.face === "dune-tortle-grin" ? 0.12 : 0.09, 1.2)}
      {buttonNose(finish.ink, [1.28, 0.56, 0.28], 0.06)}
      {recipe.head === "dune-tortle-horn" ? (
        <mesh position={[1.08, 0.96, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.08, 0.28, 6]} />
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.16} />
        </mesh>
      ) : recipe.head === "dune-tortle-crown" ? (
        <>
          {[-0.08, 0.08, 0.22].map((x) => (
            <mesh key={`tortle-crown-${x}`} position={[1.06 + x, 0.94 - Math.abs(x) * 0.2, 0]}>
              <coneGeometry args={[0.06, 0.22, 5]} />
              <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.16} />
            </mesh>
          ))}
        </>
      ) : (
        <Torus args={[0.22, 0.03, 8, 16]} position={[1.06, 0.88, -0.06]} rotation={[0.4, 0, 0]}>
          <VinylMaterial color={finish.shell} roughness={0.26} />
        </Torus>
      )}
      {Array.from({ length: 4 }).map((_, index) => {
        const x = index < 2 ? 0.42 : -0.42;
        const z = index % 2 === 0 ? 0.22 : -0.22;
        const rotate = recipe.arms === "dune-tortle-step" && index === 0 ? -0.16 : recipe.arms === "dune-tortle-dig" && index < 2 ? -0.28 : 0;
        return (
          <mesh key={`tortle-leg-${index}`} position={[x, 0.18, z]} rotation={[0, 0, rotate]}>
            <cylinderGeometry args={[0.1, 0.1, 0.34, 14]} />
            <VinylMaterial color={finish.body} roughness={0.66} />
          </mesh>
        );
      })}
      {recipe.back === "dune-tortle-spikes" ? (
        <>
          {[-0.26, 0, 0.26].map((x) => (
            <mesh key={`tortle-spike-${x}`} position={[x, 1.22, 0]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.08, 0.26, 5]} />
              <VinylMaterial color={finish.accent} roughness={0.34} />
            </mesh>
          ))}
        </>
      ) : recipe.back === "dune-tortle-fin" ? (
        <mesh position={[-0.1, 1.22, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.12, 0.7, 4]} />
          <VinylMaterial color={finish.accentSoft} roughness={0.38} />
        </mesh>
      ) : null}
      {recipe.prop === "dune-tortle-pearl" ? glowOrb(finish, [0.38, 0.28, 0.26], 0.1) : recipe.prop === "dune-tortle-tablet" ? (
        <RoundedBox args={[0.28, 0.22, 0.08]} radius={0.04} smoothness={2} position={[0.36, 0.26, 0.24]} rotation={[0, 0, -0.26]}>
          <VinylMaterial color={finish.prop} roughness={0.38} />
        </RoundedBox>
      ) : (
        <RoundedBox args={[0.2, 0.24, 0.16]} radius={0.06} smoothness={2} position={[0.36, 0.26, 0.24]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.9} emissive={finish.glowSoft} emissiveIntensity={0.1} />
        </RoundedBox>
      )}
    </group>
  );
}

function MirrorSnake({ recipe, finish }: PartProps) {
  const tower = recipe.variant === "mirror-snake-tower";
  const sway = recipe.variant === "mirror-snake-sway";
  const mirrored = recipe.body === "mirror-snake-mirror";
  const pearled = recipe.body === "mirror-snake-pearl";
  const bodyColor = mirrored ? finish.shell : pearled ? finish.body : finish.accentSoft;

  return (
    <group position={[0, 0.04, 0]} rotation={[0, sway ? 0.16 : 0, 0]}>
      <Torus args={[0.64, 0.14, 12, 28]} position={[0, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {mirrored ? (
          <MetalToyMaterial color={bodyColor} roughness={0.18} metalness={0.18} />
        ) : (
          <VinylMaterial color={bodyColor} roughness={pearled ? 0.28 : 0.42} />
        )}
      </Torus>
      <Torus args={[0.46, 0.13, 12, 28]} position={[0, tower ? 0.96 : 0.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {mirrored ? (
          <MetalToyMaterial color={bodyColor} roughness={0.18} metalness={0.18} />
        ) : (
          <VinylMaterial color={bodyColor} roughness={pearled ? 0.28 : 0.42} />
        )}
      </Torus>
      <mesh position={[0, tower ? 1.68 : 1.54, 0]}>
        <cylinderGeometry args={[0.14, 0.18, tower ? 1.08 : 0.86, 18]} />
        {mirrored ? (
          <MetalToyMaterial color={bodyColor} roughness={0.18} metalness={0.18} />
        ) : (
          <VinylMaterial color={bodyColor} roughness={pearled ? 0.28 : 0.42} />
        )}
      </mesh>
      {[0.24, 0.56, 0.9].map((y, index) => (
        <Sphere key={`snake-scale-${index}`} args={[0.05, 10, 10]} position={[0, y, 0.14]}>
          {mirrored ? (
            <MetalToyMaterial color={finish.accentSoft} roughness={0.16} metalness={0.14} />
          ) : (
            <GlassMaterial color={finish.glowSoft} opacity={0.9} />
          )}
        </Sphere>
      ))}
      <Sphere args={[0.34, 18, 18]} position={[0, tower ? 2.28 : 2.02, 0.08]}>
        <VinylMaterial color={finish.skin} roughness={0.58} />
      </Sphere>
      <mesh position={[0.18, tower ? 2.18 : 1.94, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.26, 10]} />
        <VinylMaterial color={finish.skin} roughness={0.58} />
      </mesh>
      {recipe.face === "mirror-snake-slit" ? slitEyes(finish, tower ? 2.12 : 1.9, 0.28, 0.1, 0.1) : roundEyes(finish, tower ? 2.12 : 1.9, 0.28, 0.1, 0.04)}
      {tinyMouth(finish, tower ? 1.9 : 1.72, 0.3, recipe.face === "mirror-snake-grin" ? 0.16 : 0.1)}
      <Sphere args={[0.07, 12, 12]} position={[0, tower ? 2.4 : 2.14, 0.28]}>
        <GlassMaterial color={finish.glowSoft} opacity={0.92} />
      </Sphere>
      {recipe.head === "mirror-snake-crown" ? (
        <Torus args={[0.22, 0.03, 8, 18]} position={[0, tower ? 2.52 : 2.26, -0.08]} rotation={[0.5, 0, 0]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.84} emissive={finish.glowSoft} emissiveIntensity={0.08} />
        </Torus>
      ) : recipe.head === "mirror-snake-horns" ? (
        <>
          <mesh position={[-0.12, tower ? 2.48 : 2.22, 0]} rotation={[0, 0, 0.36]}>
            <coneGeometry args={[0.06, 0.24, 6]} />
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.18} />
          </mesh>
          <mesh position={[0.12, tower ? 2.48 : 2.22, 0]} rotation={[0, 0, -0.36]}>
            <coneGeometry args={[0.06, 0.24, 6]} />
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.18} />
          </mesh>
        </>
      ) : (
        <Torus args={[0.26, 0.03, 8, 18, Math.PI]} position={[0, tower ? 2.36 : 2.12, -0.12]} rotation={[0.46, 0, 0]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.24} />
        </Torus>
      )}
      {recipe.back === "mirror-snake-tailpearl" ? glowOrb(finish, [0.42, 0.24, -0.28], 0.1) : recipe.back === "mirror-snake-rattle" ? (
        <>
          <Sphere args={[0.08, 10, 10]} position={[0.44, 0.22, -0.24]}>
            <meshStandardMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
          </Sphere>
          <Sphere args={[0.06, 10, 10]} position={[0.56, 0.16, -0.3]}>
            <meshStandardMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
          </Sphere>
        </>
      ) : (
        <RoundedBox args={[0.18, 0.22, 0.08]} radius={0.06} smoothness={2} position={[0.5, 0.18, -0.28]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.88} emissive={finish.glowSoft} emissiveIntensity={0.1} />
        </RoundedBox>
      )}
      {recipe.prop === "mirror-snake-orb" ? glowOrb(finish, [0.36, 1.48, 0.36], 0.09) : recipe.prop === "mirror-snake-lamp" ? (
        <RoundedBox args={[0.16, 0.22, 0.12]} radius={0.05} smoothness={2} position={[0.36, 1.44, 0.34]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.86} emissive={finish.glowSoft} emissiveIntensity={0.1} />
        </RoundedBox>
      ) : (
        <mesh position={[0.34, 1.46, 0.34]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.42, 10]} />
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.22} />
        </mesh>
      )}
    </group>
  );
}

function FrostPenguin({ recipe, finish }: PartProps) {
  const tall = recipe.variant === "frost-penguin-tall";
  const wobble = recipe.variant === "frost-penguin-wobble";
  const glazed = recipe.body === "frost-penguin-glaze";

  return (
    <group position={[0, 0.02, 0]} rotation={[0, wobble ? 0.16 : 0, 0]}>
      <mesh scale={[0.92, tall ? 1.34 : 1.14, 0.9]} position={[0, 1, 0]}>
        <sphereGeometry args={[0.78, 28, 28]} />
        <VinylMaterial color={glazed ? finish.body : recipe.body === "frost-penguin-wafer" ? finish.prop : finish.accentSoft} roughness={glazed ? 0.2 : 0.4} />
      </mesh>
      <RoundedBox args={[0.64, 1.02, 0.14]} radius={0.08} smoothness={4} position={[0, 0.92, 0.54]}>
        <VinylMaterial color={finish.shell} roughness={0.3} />
      </RoundedBox>
      {recipe.body === "frost-penguin-syrup" ? (
        <>
          <RoundedBox args={[0.12, 0.32, 0.04]} radius={0.02} smoothness={2} position={[-0.24, 0.34, 0.44]}>
            <GlassMaterial color={finish.accent} opacity={0.94} />
          </RoundedBox>
          <RoundedBox args={[0.1, 0.26, 0.04]} radius={0.02} smoothness={2} position={[0.18, 0.22, 0.44]}>
            <GlassMaterial color={finish.accent} opacity={0.94} />
          </RoundedBox>
        </>
      ) : null}
      {[-0.26, -0.08, 0.1, 0.28].map((x, index) => (
        <Sphere key={`penguin-sprinkle-${index}`} args={[0.04, 10, 10]} position={[x, 0.2 + Math.abs(x) * 0.22, 0.5]}>
          <VinylMaterial color={index % 2 === 0 ? finish.glowSoft : finish.accentSoft} roughness={0.18} />
        </Sphere>
      ))}
      <Sphere args={[0.48, 20, 20]} position={[0, 1.84, 0.04]}>
        <VinylMaterial color={finish.skin} roughness={0.58} />
      </Sphere>
      <mesh position={[0, 1.72, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.24, 12]} />
        <VinylMaterial color={finish.prop} roughness={0.28} />
      </mesh>
      {recipe.face === "frost-penguin-sleep" ? slitEyes(finish, 1.88, 0.42, 0.14, 0.12) : roundEyes(finish, 1.88, 0.42, 0.14, 0.05)}
      {blushPair(finish, 1.66, 0.42, 0.22, 0.05)}
      {tinyMouth(finish, 1.64, 0.44, recipe.face === "frost-penguin-smile" ? 0.16 : 0.1)}
      {recipe.head === "frost-penguin-icing" ? (
        <>
          <Sphere args={[0.12, 12, 12]} position={[-0.12, 2.24, 0.02]}>
            <GlassMaterial color={finish.shell} opacity={0.92} />
          </Sphere>
          <Sphere args={[0.16, 12, 12]} position={[0.02, 2.36, 0.02]}>
            <GlassMaterial color={finish.shell} opacity={0.92} />
          </Sphere>
          <Sphere args={[0.12, 12, 12]} position={[0.16, 2.2, 0.02]}>
            <GlassMaterial color={finish.shell} opacity={0.92} />
          </Sphere>
        </>
      ) : recipe.head === "frost-penguin-cherry" ? (
        <>
          {glowOrb(finish, [0, 2.28, 0], 0.1)}
          <mesh position={[0, 2.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
            <meshStandardMaterial color={finish.prop} roughness={0.34} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 2.22, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.18, 0.42, 16]} />
          <meshStandardMaterial color={finish.prop} roughness={0.34} />
        </mesh>
      )}
      {recipe.arms === "frost-penguin-rest" ? (
        <>
          <RoundedBox args={[0.18, 0.48, 0.1]} radius={0.06} smoothness={2} position={[-0.46, 0.98, 0.1]} rotation={[0, 0, 0.18]}>
            <meshStandardMaterial color={finish.body} roughness={0.68} />
          </RoundedBox>
          <RoundedBox args={[0.18, 0.48, 0.1]} radius={0.06} smoothness={2} position={[0.46, 0.98, 0.1]} rotation={[0, 0, -0.18]}>
            <meshStandardMaterial color={finish.body} roughness={0.68} />
          </RoundedBox>
        </>
      ) : recipe.arms === "frost-penguin-wave" ? (
        <>
          <RoundedBox args={[0.18, 0.48, 0.1]} radius={0.06} smoothness={2} position={[-0.46, 0.98, 0.1]} rotation={[0, 0, 0.18]}>
            <meshStandardMaterial color={finish.body} roughness={0.68} />
          </RoundedBox>
          <RoundedBox args={[0.18, 0.54, 0.1]} radius={0.06} smoothness={2} position={[0.46, 1.26, 0.1]} rotation={[0, 0, -0.54]}>
            <meshStandardMaterial color={finish.body} roughness={0.68} />
          </RoundedBox>
        </>
      ) : (
        <RoundedBox args={[0.82, 0.08, 0.22]} radius={0.03} smoothness={2} position={[0, 0.92, 0.18]}>
          <meshStandardMaterial color={finish.prop} roughness={0.36} />
        </RoundedBox>
      )}
      {recipe.back === "frost-penguin-tray" ? (
        <RoundedBox args={[0.76, 0.08, 0.52]} radius={0.03} smoothness={2} position={[0, 0.8, -0.32]}>
          <meshStandardMaterial color={finish.prop} roughness={0.34} />
        </RoundedBox>
      ) : recipe.back === "frost-penguin-ribbon" ? (
        <Torus args={[0.22, 0.04, 8, 16]} position={[0, 1.1, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={finish.accent} roughness={0.22} />
        </Torus>
      ) : null}
      {recipe.prop === "frost-penguin-cupcake" ? (
        <>
          <RoundedBox args={[0.18, 0.16, 0.18]} radius={0.04} smoothness={2} position={[0.54, 0.46, 0.18]}>
            <meshStandardMaterial color={finish.prop} roughness={0.4} />
          </RoundedBox>
          <Sphere args={[0.12, 12, 12]} position={[0.54, 0.62, 0.18]}>
            <meshStandardMaterial color={finish.shell} roughness={0.18} />
          </Sphere>
        </>
      ) : recipe.prop === "frost-penguin-spoon" ? (
        <mesh position={[0.56, 0.48, 0.18]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 10]} />
          <meshStandardMaterial color={finish.metal} roughness={0.22} metalness={0.22} />
        </mesh>
      ) : (
        <RoundedBox args={[0.18, 0.24, 0.12]} radius={0.05} smoothness={2} position={[0.56, 0.5, 0.18]}>
          <meshStandardMaterial color={finish.glowSoft} roughness={0.16} emissive={finish.glowSoft} emissiveIntensity={0.1} />
        </RoundedBox>
      )}
    </group>
  );
}

function CloudJelly({ recipe, finish }: PartProps) {
  const star = recipe.variant === "cloud-jelly-star";
  const bell = recipe.variant === "cloud-jelly-bell";
  const clear = recipe.body === "cloud-jelly-clear";

  return (
    <group position={[0, 0.18, 0]}>
      <mesh scale={[star ? 1.2 : 1.08, bell ? 0.62 : 0.76, star ? 1.2 : 1.08]} position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.92, 28, 28]} />
        <GlassMaterial color={clear ? finish.shell : finish.body} opacity={clear ? 0.6 : 0.82} />
      </mesh>
      <Torus args={[0.46, 0.03, 12, 28]} position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0.12, 0]}>
        <GlassMaterial color={finish.glowSoft} opacity={0.68} emissive={finish.glowSoft} emissiveIntensity={0.08} />
      </Torus>
      <Sphere args={[0.42, 18, 18]} position={[0, 1.56, 0]}>
        <GlassMaterial color={finish.glowSoft} opacity={0.9} emissive={finish.glowSoft} emissiveIntensity={0.14} />
      </Sphere>
      {recipe.face === "cloud-jelly-dream" ? slitEyes(finish, 1.58, 0.38, 0.12, 0.12) : roundEyes(finish, 1.58, 0.38, 0.12, recipe.face === "cloud-jelly-pulse" ? 0.06 : 0.05)}
      {recipe.face === "cloud-jelly-pulse" ? glowOrb(finish, [0, 1.34, 0.4], 0.06) : tinyMouth(finish, 1.34, 0.4, 0.1)}
      {[
        [-0.44, 1.86, 0.18],
        [0.48, 1.94, -0.12],
        [0.18, 2.1, 0.14],
      ].map((position, index) => (
        <Sphere key={`jelly-bubble-${index}`} args={[index === 1 ? 0.08 : 0.06, 10, 10]} position={position as [number, number, number]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.82} />
        </Sphere>
      ))}
      {[-0.48, -0.22, 0.06, 0.32, 0.54].map((x, index) => (
        <Sphere key={`jelly-rim-drop-${index}`} args={[0.045, 10, 10]} position={[x, 1.18 - Math.abs(x) * 0.08, index % 2 === 0 ? 0.12 : -0.08]}>
          <GlassMaterial color={finish.shell} opacity={0.74} />
        </Sphere>
      ))}
      {recipe.head === "cloud-jelly-ring" ? (
        <Torus args={[0.48, 0.04, 10, 24]} position={[0, 2.36, 0]} rotation={[0.38, 0, 0]}>
          <meshStandardMaterial color={finish.glow} roughness={0.12} emissive={finish.glow} emissiveIntensity={0.08} />
        </Torus>
      ) : recipe.head === "cloud-jelly-crown" ? (
        Array.from({ length: 6 }).map((_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          return (
            <mesh key={`jelly-crown-${index}`} position={[Math.cos(angle) * 0.34, 2.24, Math.sin(angle) * 0.18]} rotation={[0, 0, angle]}>
              <coneGeometry args={[0.05, 0.22, 4]} />
              <meshStandardMaterial color={finish.accentSoft} roughness={0.24} />
            </mesh>
          );
        })
      ) : (
        <Torus args={[0.54, 0.03, 8, 20]} position={[0, 2.18, 0]} rotation={[Math.PI / 2, 0.2, 0]}>
          <meshStandardMaterial color={finish.glowSoft} roughness={0.12} emissive={finish.glowSoft} emissiveIntensity={0.08} />
        </Torus>
      )}
      {Array.from({ length: recipe.arms === "cloud-jelly-short" ? 5 : recipe.arms === "cloud-jelly-long" ? 8 : 6 }).map((_, index) => {
        const angle = (index / (recipe.arms === "cloud-jelly-short" ? 5 : recipe.arms === "cloud-jelly-long" ? 8 : 6)) * Math.PI * 2;
        const x = Math.cos(angle) * 0.34;
        const z = Math.sin(angle) * 0.18;
        if (recipe.arms === "cloud-jelly-bead") {
          return (
            <group key={`jelly-tentacle-${index}`} position={[x, 0.94, z]}>
              <Sphere args={[0.08, 10, 10]} position={[0, 0.32, 0]}>
                <GlassMaterial color={finish.glowSoft} opacity={0.88} />
              </Sphere>
              <Sphere args={[0.06, 10, 10]} position={[0, 0.06, 0]}>
                <GlassMaterial color={finish.glowSoft} opacity={0.84} />
              </Sphere>
              <Sphere args={[0.05, 10, 10]} position={[0, -0.18, 0]}>
                <GlassMaterial color={finish.glowSoft} opacity={0.82} />
              </Sphere>
            </group>
          );
        }
        return (
          <group key={`jelly-tentacle-${index}`} position={[x, recipe.arms === "cloud-jelly-long" ? 0.78 : 0.92, z]}>
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.05, recipe.arms === "cloud-jelly-long" ? 1.12 : 0.76, 10]} />
              <GlassMaterial color={finish.body} opacity={0.76} />
            </mesh>
            <Sphere args={[0.045, 10, 10]} position={[0, -(recipe.arms === "cloud-jelly-long" ? 0.58 : 0.38), 0]}>
              <GlassMaterial color={finish.glowSoft} opacity={0.82} />
            </Sphere>
          </group>
        );
      })}
      {recipe.back === "cloud-jelly-fog" ? (
        <>
          {glowOrb(finish, [-0.82, 1.62, -0.18], 0.16)}
          {glowOrb(finish, [0.78, 1.74, 0.12], 0.14)}
        </>
      ) : recipe.back === "cloud-jelly-bubble" ? (
        <>
          {glowOrb(finish, [-0.66, 1.34, 0.18], 0.08)}
          {glowOrb(finish, [-0.8, 1.68, 0.08], 0.06)}
          {glowOrb(finish, [0.82, 1.52, 0.12], 0.1)}
        </>
      ) : null}
      {recipe.prop === "cloud-jelly-orb" ? glowOrb(finish, [0.72, 1.28, 0.22], 0.12) : recipe.prop === "cloud-jelly-lamp" ? (
        <RoundedBox args={[0.16, 0.24, 0.14]} radius={0.06} smoothness={2} position={[0.72, 1.28, 0.22]}>
          <meshStandardMaterial color={finish.glowSoft} roughness={0.16} emissive={finish.glowSoft} emissiveIntensity={0.12} />
        </RoundedBox>
      ) : (
        <>
          <RoundedBox args={[0.14, 0.04, 0.18]} radius={0.02} smoothness={2} position={[0.68, 1.32, 0.18]} rotation={[0.4, 0.2, 0]}>
            <meshStandardMaterial color={finish.prop} roughness={0.28} metalness={0.08} />
          </RoundedBox>
          <RoundedBox args={[0.14, 0.04, 0.18]} radius={0.02} smoothness={2} position={[0.8, 1.22, 0.24]} rotation={[-0.2, -0.2, 0]}>
            <meshStandardMaterial color={finish.prop} roughness={0.28} metalness={0.08} />
          </RoundedBox>
        </>
      )}
    </group>
  );
}

function SporeBear({ recipe, finish }: PartProps) {
  const stump = recipe.variant === "spore-bear-stump";
  const tall = recipe.variant === "spore-bear-tall";

  return (
    <group position={[0, 0.04, 0]}>
      <Sphere args={[stump ? 0.92 : 0.82, 26, 26]} position={[0, 0.68, 0]}>
        <PlushMaterial color={recipe.body === "spore-bear-bark" ? finish.body : finish.shell} roughness={0.94} />
      </Sphere>
      <Sphere args={[0.62, 24, 24]} position={[0, tall ? 1.94 : 1.76, 0.04]}>
        <VinylMaterial color={finish.skin} roughness={0.62} />
      </Sphere>
      <Sphere args={[0.16, 12, 12]} position={[-0.3, tall ? 2.26 : 2.08, 0]}>
        <PlushMaterial color={finish.shell} roughness={0.94} />
      </Sphere>
      <Sphere args={[0.16, 12, 12]} position={[0.3, tall ? 2.26 : 2.08, 0]}>
        <PlushMaterial color={finish.shell} roughness={0.94} />
      </Sphere>
      <mesh scale={[recipe.head === "spore-bear-canopy" ? 1.38 : 1.12, 0.44, recipe.head === "spore-bear-bloom" ? 1.22 : 1.1]} position={[0, tall ? 2.42 : 2.24, 0]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <PlushMaterial color={recipe.head === "spore-bear-moss" ? finish.accent : finish.prop} roughness={0.9} />
      </mesh>
      {[-0.24, 0, 0.24].map((x, index) => (
        <RoundedBox
          key={`bear-gill-${index}`}
          args={[0.22, 0.02, 0.08]}
          radius={0.008}
          smoothness={2}
          position={[x, tall ? 2.08 : 1.9, 0.18]}
          rotation={[0.3, 0, index === 1 ? 0 : index === 0 ? 0.12 : -0.12]}
        >
          <VinylMaterial color={finish.accentSoft} roughness={0.28} />
        </RoundedBox>
      ))}
      {[-0.24, 0, 0.22].map((x, index) => (
        <Sphere key={`bear-cap-dot-${index}`} args={[0.07, 10, 10]} position={[x, tall ? 2.44 : 2.26, 0.24 - Math.abs(x) * 0.14]}>
          <VinylMaterial color={index === 1 ? finish.glowSoft : finish.accentSoft} roughness={0.26} />
        </Sphere>
      ))}
      {recipe.head === "spore-bear-bloom" ? (
        <>
          {glowOrb(finish, [-0.36, tall ? 2.42 : 2.24, 0.18], 0.08)}
          {glowOrb(finish, [0.22, tall ? 2.52 : 2.34, -0.1], 0.06)}
        </>
      ) : null}
      {recipe.face === "spore-bear-button" ? roundEyes(finish, tall ? 1.82 : 1.64, 0.62, 0.14, 0.06) : recipe.face === "spore-bear-sleep" ? slitEyes(finish, tall ? 1.82 : 1.64, 0.62, 0.14, 0.12) : roundEyes(finish, tall ? 1.82 : 1.64, 0.62, 0.14, 0.05)}
      {blushPair(finish, tall ? 1.48 : 1.3, 0.56, 0.2, 0.05)}
      {tinyMouth(finish, tall ? 1.42 : 1.24, 0.62, recipe.face === "spore-bear-smile" ? 0.14 : 0.1)}
      {buttonNose(finish.ink, [0, tall ? 1.6 : 1.42, 0.62], 0.08)}
      {recipe.body === "spore-bear-vest" ? (
        <RoundedBox args={[0.72, 0.74, 0.14]} radius={0.08} smoothness={3} position={[0, 0.84, 0.5]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.46} />
        </RoundedBox>
      ) : null}
      {recipe.arms === "spore-bear-rest" ? (
        <>
          <RoundedBox args={[0.2, 0.46, 0.16]} radius={0.08} smoothness={2} position={[-0.56, 0.74, 0.12]} rotation={[0, 0, 0.12]}>
            <PlushMaterial color={finish.shell} roughness={0.96} />
          </RoundedBox>
          <RoundedBox args={[0.2, 0.46, 0.16]} radius={0.08} smoothness={2} position={[0.56, 0.74, 0.12]} rotation={[0, 0, -0.12]}>
            <PlushMaterial color={finish.shell} roughness={0.96} />
          </RoundedBox>
        </>
      ) : recipe.arms === "spore-bear-carry" ? (
        <RoundedBox args={[0.78, 0.12, 0.2]} radius={0.04} smoothness={2} position={[0, 0.62, 0.22]}>
          <PlushMaterial color={finish.shell} roughness={0.96} />
        </RoundedBox>
      ) : (
        <>
          <RoundedBox args={[0.2, 0.46, 0.16]} radius={0.08} smoothness={2} position={[-0.56, 0.74, 0.12]} rotation={[0, 0, 0.12]}>
            <PlushMaterial color={finish.shell} roughness={0.96} />
          </RoundedBox>
          <RoundedBox args={[0.2, 0.52, 0.16]} radius={0.08} smoothness={2} position={[0.58, 0.98, 0.12]} rotation={[0, 0, -0.42]}>
            <PlushMaterial color={finish.shell} roughness={0.96} />
          </RoundedBox>
        </>
      )}
      {recipe.back === "spore-bear-basket" ? (
        <>
          <RoundedBox args={[0.32, 0.28, 0.24]} radius={0.06} smoothness={2} position={[-0.22, 1.04, -0.36]}>
            <VinylMaterial color={finish.prop} roughness={0.32} />
          </RoundedBox>
          <RoundedBox args={[0.04, 0.26, 0.02]} radius={0.01} smoothness={2} position={[-0.34, 1.08, -0.22]} rotation={[0.2, 0, 0.18]}>
            <MetalToyMaterial color={finish.metal} roughness={0.2} metalness={0.16} />
          </RoundedBox>
          <RoundedBox args={[0.04, 0.26, 0.02]} radius={0.01} smoothness={2} position={[-0.08, 1.08, -0.22]} rotation={[0.2, 0, -0.18]}>
            <MetalToyMaterial color={finish.metal} roughness={0.2} metalness={0.16} />
          </RoundedBox>
        </>
      ) : recipe.back === "spore-bear-spores" ? (
        <>
          {glowOrb(finish, [-0.42, 1.18, -0.28], 0.08)}
          {glowOrb(finish, [-0.18, 1.28, -0.36], 0.06)}
        </>
      ) : (
        <RoundedBox args={[0.46, 0.14, 0.26]} radius={0.04} smoothness={2} position={[0, 1.04, -0.34]} rotation={[0.16, 0, 0]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.42} />
        </RoundedBox>
      )}
      {recipe.prop === "spore-bear-basketprop" ? (
        <RoundedBox args={[0.24, 0.18, 0.18]} radius={0.05} smoothness={2} position={[0.52, 0.36, 0.24]}>
          <VinylMaterial color={finish.prop} roughness={0.34} />
        </RoundedBox>
      ) : recipe.prop === "spore-bear-shovel" ? (
        <mesh position={[0.54, 0.42, 0.18]} rotation={[0, 0, -0.34]}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 10]} />
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.22} />
        </mesh>
      ) : (
        <RoundedBox args={[0.18, 0.24, 0.16]} radius={0.05} smoothness={2} position={[0.54, 0.42, 0.18]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.88} emissive={finish.glowSoft} emissiveIntensity={0.1} />
        </RoundedBox>
      )}
    </group>
  );
}

function ScrapCrow({ recipe, finish }: PartProps) {
  const lean = recipe.variant === "scrap-crow-lean";

  return (
    <group position={[0, 0.04, 0]} rotation={[0, lean ? -0.16 : 0, 0]}>
      <RoundedBox args={[0.54, 0.94, 0.44]} radius={0.16} smoothness={4} position={[0, 1.26, 0]}>
        {recipe.body === "scrap-crow-plate" ? (
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.24} />
        ) : (
          <VinylMaterial color={finish.body} roughness={0.5} />
        )}
      </RoundedBox>
      <RoundedBox args={[0.36, 0.06, 0.18]} radius={0.02} smoothness={2} position={[0, 1.46, 0.22]} rotation={[0, 0, -0.06]}>
        <MetalToyMaterial color={finish.prop} roughness={0.18} metalness={0.16} />
      </RoundedBox>
      {[-0.16, 0.16].map((x, index) => (
        <Sphere key={`crow-rivet-${index}`} args={[0.03, 8, 8]} position={[x, 1.18, 0.26]}>
          <MetalToyMaterial color={finish.prop} roughness={0.16} metalness={0.18} />
        </Sphere>
      ))}
      <Sphere args={[0.34, 18, 18]} position={[0, 2.08, 0.1]}>
        <VinylMaterial color={finish.skin} roughness={0.58} />
      </Sphere>
      <mesh position={[0, 2.02, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.42, 4]} />
        <VinylMaterial color={finish.prop} roughness={0.28} />
      </mesh>
      {recipe.face === "scrap-crow-mask" ? (
        <RoundedBox args={[0.42, 0.18, 0.04]} radius={0.05} smoothness={2} position={[0, 2.12, 0.42]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.2} />
        </RoundedBox>
      ) : null}
      {recipe.face === "scrap-crow-soft" ? roundEyes(finish, 2.12, 0.44, 0.12, 0.05) : slitEyes(finish, 2.12, 0.44, 0.12, 0.1)}
      {buttonNose(finish.ink, [0, 2, 0.42], 0.05)}
      {recipe.head === "scrap-crow-crest" ? (
        <mesh position={[0, 2.52, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.12, 0.38, 4]} />
          <VinylMaterial color={finish.body} roughness={0.42} />
        </mesh>
      ) : recipe.head === "scrap-crow-hat" ? (
        <RoundedBox args={[0.42, 0.16, 0.32]} radius={0.04} smoothness={2} position={[0, 2.44, 0.02]} rotation={[0.08, 0, -0.1]}>
          <VinylMaterial color={finish.prop} roughness={0.28} />
        </RoundedBox>
      ) : (
        <Torus args={[0.24, 0.03, 8, 16, Math.PI]} position={[0.06, 2.4, -0.14]} rotation={[0.5, 0, 0.2]}>
          <MetalToyMaterial color={finish.metal} roughness={0.24} metalness={0.2} />
        </Torus>
      )}
      {recipe.arms === "scrap-crow-fold" ? (
        <>
          <RoundedBox args={[0.2, 0.78, 0.14]} radius={0.06} smoothness={2} position={[-0.34, 1.24, 0.06]} rotation={[0, 0, 0.3]}>
            <VinylMaterial color={finish.body} roughness={0.48} />
          </RoundedBox>
          <RoundedBox args={[0.2, 0.78, 0.14]} radius={0.06} smoothness={2} position={[0.34, 1.24, 0.06]} rotation={[0, 0, -0.3]}>
            <VinylMaterial color={finish.body} roughness={0.48} />
          </RoundedBox>
        </>
      ) : recipe.arms === "scrap-crow-open" ? (
        <>
          <RoundedBox args={[0.2, 0.94, 0.14]} radius={0.06} smoothness={2} position={[-0.72, 1.26, 0]} rotation={[0, 0, 0.72]}>
            <VinylMaterial color={finish.body} roughness={0.48} />
          </RoundedBox>
          <RoundedBox args={[0.2, 0.94, 0.14]} radius={0.06} smoothness={2} position={[0.72, 1.26, 0]} rotation={[0, 0, -0.72]}>
            <VinylMaterial color={finish.body} roughness={0.48} />
          </RoundedBox>
        </>
      ) : (
        <RoundedBox args={[0.24, 0.8, 0.14]} radius={0.06} smoothness={2} position={[0.68, 1.22, 0.02]} rotation={[0, 0, -0.48]}>
          <VinylMaterial color={finish.body} roughness={0.48} />
        </RoundedBox>
      )}
      <mesh position={[-0.12, 0.46, 0.08]}>
        <cylinderGeometry args={[0.05, 0.05, 0.94, 12]} />
        <MetalToyMaterial color={finish.metal} roughness={0.26} metalness={0.22} />
      </mesh>
      <mesh position={[0.12, 0.44, -0.08]}>
        <cylinderGeometry args={[0.05, 0.05, 0.98, 12]} />
        <MetalToyMaterial color={finish.metal} roughness={0.26} metalness={0.22} />
      </mesh>
      {recipe.back === "scrap-crow-pack" ? (
        <RoundedBox args={[0.28, 0.34, 0.22]} radius={0.06} smoothness={2} position={[0, 1.28, -0.34]}>
          <VinylMaterial color={finish.prop} roughness={0.3} />
        </RoundedBox>
      ) : recipe.back === "scrap-crow-cage" ? (
        <Torus args={[0.18, 0.03, 8, 16]} position={[0, 1.3, -0.34]} rotation={[Math.PI / 2, 0, 0]}>
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
        </Torus>
      ) : null}
      <mesh position={[-0.24, 1.18, -0.18]} rotation={[0, 0, -0.26]}>
        <cylinderGeometry args={[0.014, 0.014, 0.42, 8]} />
        <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.18} />
      </mesh>
      <Sphere args={[0.028, 8, 8]} position={[-0.32, 1.34, -0.18]}>
        <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.2} />
      </Sphere>
      {recipe.prop === "scrap-crow-key" ? (
        <mesh position={[0.46, 0.7, 0.18]} rotation={[0, 0, -0.42]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 10]} />
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
        </mesh>
      ) : recipe.prop === "scrap-crow-lamp" ? (
        <RoundedBox args={[0.16, 0.24, 0.12]} radius={0.05} smoothness={2} position={[0.46, 0.68, 0.18]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.88} emissive={finish.glowSoft} emissiveIntensity={0.1} />
        </RoundedBox>
      ) : (
        <RoundedBox args={[0.18, 0.12, 0.04]} radius={0.02} smoothness={2} position={[0.46, 0.68, 0.18]} rotation={[0.1, 0.2, -0.2]}>
          <VinylMaterial color={finish.prop} roughness={0.28} />
        </RoundedBox>
      )}
    </group>
  );
}

function SugarLamb({ recipe, finish }: PartProps) {
  const prance = recipe.variant === "sugar-lamb-prance";

  return (
    <group position={[0, 0.02, 0]} rotation={[0, prance ? -0.08 : 0, 0]}>
      {[-0.34, 0, 0.34].map((x) => (
        <Sphere key={`lamb-body-${x}`} args={[0.34, 18, 18]} position={[x, 0.86, 0]}>
          <PlushMaterial color={recipe.body === "sugar-lamb-shell" ? finish.shell : finish.body} roughness={0.96} />
        </Sphere>
      ))}
      {[-0.48, -0.18, 0.18, 0.48].map((x, index) => (
        <Sphere key={`lamb-fluff-${index}`} args={[0.12, 12, 12]} position={[x, 1.06 - Math.abs(x) * 0.1, 0.16]}>
          <PlushMaterial color={finish.shell} roughness={0.98} />
        </Sphere>
      ))}
      {recipe.variant === "sugar-lamb-curl" ? (
        <>
          <Sphere args={[0.18, 12, 12]} position={[-0.16, 1.18, 0.18]}>
            <PlushMaterial color={finish.shell} roughness={0.98} />
          </Sphere>
          <Sphere args={[0.16, 12, 12]} position={[0.18, 1.2, -0.16]}>
            <PlushMaterial color={finish.shell} roughness={0.98} />
          </Sphere>
        </>
      ) : null}
      <Sphere args={[0.52, 22, 22]} position={[0.62, 1.46, 0.02]}>
        <VinylMaterial color={finish.skin} roughness={0.62} />
      </Sphere>
      <RoundedBox args={[0.34, 0.08, 0.18]} radius={0.03} smoothness={2} position={[0.44, 1.1, 0.18]}>
        <VinylMaterial color={finish.accentSoft} roughness={0.32} />
      </RoundedBox>
      <Sphere args={[0.05, 10, 10]} position={[0.44, 1.08, 0.28]}>
        <MetalToyMaterial color={finish.metal} roughness={0.2} metalness={0.16} />
      </Sphere>
      {recipe.face === "sugar-lamb-sleep"
        ? slitEyes(finish, 1.52, 0.54, 0.14, 0.12, 0.62)
        : roundEyes(finish, 1.52, 0.54, 0.14, 0.05, undefined, 0.62)}
      {blushPair(finish, 1.34, 0.52, 0.22, 0.05, undefined, 0.62)}
      {buttonNose(finish.ink, [0.62, 1.4, 0.54], 0.05)}
      {tinyMouth(finish, 1.28, 0.54, recipe.face === "sugar-lamb-smile" ? 0.16 : 0.1, 0.62)}
      {recipe.head === "sugar-lamb-horns" ? (
        <>
          <Torus args={[0.16, 0.04, 8, 16, Math.PI * 1.4]} position={[0.34, 1.82, 0]} rotation={[0, 0, 1.1]}>
            <VinylMaterial color={finish.prop} roughness={0.28} />
          </Torus>
          <Torus args={[0.16, 0.04, 8, 16, Math.PI * 1.4]} position={[0.9, 1.82, 0]} rotation={[0, 0, -1.1]}>
            <VinylMaterial color={finish.prop} roughness={0.28} />
          </Torus>
        </>
      ) : recipe.head === "sugar-lamb-crown" ? (
        <>
          <Sphere args={[0.12, 12, 12]} position={[0.5, 1.96, 0]}>
            <GlassMaterial color={finish.shell} opacity={0.92} />
          </Sphere>
          <Sphere args={[0.12, 12, 12]} position={[0.74, 1.96, 0]}>
            <GlassMaterial color={finish.shell} opacity={0.92} />
          </Sphere>
        </>
      ) : (
        <>
          <Torus args={[0.14, 0.03, 8, 14, Math.PI]} position={[0.34, 1.82, 0]} rotation={[0, 0, 1.1]}>
            <VinylMaterial color={finish.prop} roughness={0.28} />
          </Torus>
          <Torus args={[0.14, 0.03, 8, 14, Math.PI]} position={[0.9, 1.82, 0]} rotation={[0, 0, -1.1]}>
            <VinylMaterial color={finish.accent} roughness={0.2} />
          </Torus>
        </>
      )}
      {Array.from({ length: 4 }).map((_, index) => {
        const x = index < 2 ? 0.34 : -0.18;
        const z = index % 2 === 0 ? 0.18 : -0.18;
        const rotate = prance && index === 0 ? -0.22 : recipe.arms === "sugar-lamb-bow" && index < 2 ? -0.16 : 0;
        return (
          <mesh key={`lamb-leg-${index}`} position={[x, 0.22, z]} rotation={[0, 0, rotate]}>
            <cylinderGeometry args={[0.08, 0.08, 0.42, 12]} />
            <PlushMaterial color={finish.body} roughness={0.96} />
          </mesh>
        );
      })}
      {recipe.back === "sugar-lamb-capeback" ? (
        <RoundedBox args={[0.48, 0.16, 0.28]} radius={0.05} smoothness={2} position={[-0.22, 1.08, -0.26]} rotation={[0.16, 0, 0]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.44} />
        </RoundedBox>
      ) : recipe.back === "sugar-lamb-bellback" ? (
        <>
          <Sphere args={[0.08, 10, 10]} position={[-0.18, 1.1, -0.28]}>
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
          </Sphere>
          <Sphere args={[0.08, 10, 10]} position={[0.02, 1.14, -0.28]}>
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
          </Sphere>
        </>
      ) : null}
      {recipe.prop === "sugar-lamb-bell" ? (
        <Sphere args={[0.12, 12, 12]} position={[0.36, 0.5, 0.24]}>
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
        </Sphere>
      ) : recipe.prop === "sugar-lamb-stick" ? (
        <mesh position={[0.36, 0.54, 0.24]} rotation={[0, 0, -0.36]}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 10]} />
          <VinylMaterial color={finish.prop} roughness={0.26} />
        </mesh>
      ) : (
        <RoundedBox args={[0.16, 0.2, 0.16]} radius={0.05} smoothness={2} position={[0.36, 0.54, 0.24]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.88} emissive={finish.glowSoft} emissiveIntensity={0.1} />
        </RoundedBox>
      )}
    </group>
  );
}

function PorcelainDeer({ recipe, finish }: PartProps) {
  const cross = recipe.variant === "porcelain-deer-cross";
  const bend = recipe.variant === "porcelain-deer-bend";
  const armored = recipe.body === "porcelain-deer-armor";

  return (
    <group position={[0, 0.02, 0]} rotation={[0, cross ? 0.08 : 0, 0]}>
      <mesh position={[-0.12, 0.42, 0.08]} rotation={[0, 0, bend ? 0.14 : 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.34, 12]} />
        <VinylMaterial color={finish.body} roughness={0.52} />
      </mesh>
      <mesh position={[0.14, 0.46, -0.08]} rotation={[0, 0, cross ? -0.18 : 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.42, 12]} />
        <VinylMaterial color={finish.body} roughness={0.52} />
      </mesh>
      <RoundedBox args={[0.56, 0.86, 0.42]} radius={0.16} smoothness={4} position={[0, 1.48, 0]}>
        <VinylMaterial color={armored ? finish.shell : finish.body} roughness={armored ? 0.28 : 0.48} />
      </RoundedBox>
      {[-0.12, 0.12].map((x, index) => (
        <RoundedBox key={`deer-goldline-${index}`} args={[0.05, 0.56, 0.02]} radius={0.02} smoothness={2} position={[x, 1.5, 0.22]} rotation={[0, 0, index === 0 ? 0.08 : -0.08]}>
          <MetalToyMaterial color={finish.prop} roughness={0.18} metalness={0.18} />
        </RoundedBox>
      ))}
      <Torus args={[0.14, 0.02, 8, 18]} position={[0, 1.78, 0.24]} rotation={[0.28, 0, 0]}>
        <MetalToyMaterial color={finish.prop} roughness={0.16} metalness={0.2} />
      </Torus>
      <Sphere args={[0.06, 10, 10]} position={[0, 1.78, 0.32]}>
        <GlassMaterial color={finish.glowSoft} opacity={0.9} emissive={finish.glowSoft} emissiveIntensity={0.08} />
      </Sphere>
      {recipe.body === "porcelain-deer-cloak" ? (
        <RoundedBox args={[0.26, 1.18, 0.08]} radius={0.03} smoothness={2} position={[0, 1.02, -0.32]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.46} />
        </RoundedBox>
      ) : null}
      <Sphere args={[0.34, 18, 18]} position={[0, 2.32, 0.04]}>
        <VinylMaterial color={finish.skin} roughness={0.54} />
      </Sphere>
      <RoundedBox args={[0.44, 0.52, 0.1]} radius={0.05} smoothness={2} position={[0, 2.28, 0.36]}>
        <VinylMaterial color={recipe.face === "porcelain-deer-mask" ? finish.shell : finish.skin} roughness={0.24} />
      </RoundedBox>
      {recipe.face === "porcelain-deer-calm" ? slitEyes(finish, 2.32, 0.42, 0.12, 0.12) : roundEyes(finish, 2.32, 0.42, 0.12, 0.05)}
      {recipe.face === "porcelain-deer-crack" ? (
        <RoundedBox args={[0.04, 0.58, 0.02]} radius={0.02} smoothness={2} position={[0.08, 2.32, 0.44]} rotation={[0, 0, 0.18]}>
          <MetalToyMaterial color={finish.prop} roughness={0.18} metalness={0.14} />
        </RoundedBox>
      ) : tinyMouth(finish, 2.08, 0.42, 0.1)}
      <Sphere args={[0.06, 10, 10]} position={[0, 2.46, 0.24]}>
        <GlassMaterial color={finish.glowSoft} opacity={0.9} />
      </Sphere>
      {recipe.head === "porcelain-deer-antler" ? (
        <>
          <mesh position={[-0.18, 2.74, 0]} rotation={[0, 0, 0.26]}>
            <cylinderGeometry args={[0.03, 0.03, 0.72, 10]} />
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.18} />
          </mesh>
          <mesh position={[0.18, 2.74, 0]} rotation={[0, 0, -0.26]}>
            <cylinderGeometry args={[0.03, 0.03, 0.72, 10]} />
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.18} />
          </mesh>
        </>
      ) : recipe.head === "porcelain-deer-crown" ? (
        <Torus args={[0.32, 0.03, 8, 16]} position={[0, 2.76, -0.08]} rotation={[0.4, 0, 0]}>
          <GlassMaterial color={finish.glowSoft} opacity={0.86} emissive={finish.glowSoft} emissiveIntensity={0.08} />
        </Torus>
      ) : (
        <>
          <mesh position={[-0.18, 2.74, 0]} rotation={[0, 0, 0.36]}>
            <coneGeometry args={[0.04, 0.62, 4]} />
            <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.22} />
          </mesh>
          <mesh position={[0.18, 2.74, 0]} rotation={[0, 0, -0.36]}>
            <coneGeometry args={[0.04, 0.62, 4]} />
            <MetalToyMaterial color={finish.metal} roughness={0.18} metalness={0.22} />
          </mesh>
        </>
      )}
      {recipe.arms === "porcelain-deer-rest" ? (
        <>
          <mesh position={[-0.34, 1.42, 0.12]} rotation={[0, 0, 0.08]}>
            <cylinderGeometry args={[0.05, 0.05, 0.86, 10]} />
            <VinylMaterial color={finish.body} roughness={0.52} />
          </mesh>
          <mesh position={[0.34, 1.42, 0.12]} rotation={[0, 0, -0.08]}>
            <cylinderGeometry args={[0.05, 0.05, 0.86, 10]} />
            <VinylMaterial color={finish.body} roughness={0.52} />
          </mesh>
        </>
      ) : recipe.arms === "porcelain-deer-open" ? (
        <>
          <mesh position={[-0.56, 1.52, 0.12]} rotation={[0, 0, 0.56]}>
            <cylinderGeometry args={[0.05, 0.05, 0.94, 10]} />
            <VinylMaterial color={finish.body} roughness={0.52} />
          </mesh>
          <mesh position={[0.56, 1.52, 0.12]} rotation={[0, 0, -0.56]}>
            <cylinderGeometry args={[0.05, 0.05, 0.94, 10]} />
            <VinylMaterial color={finish.body} roughness={0.52} />
          </mesh>
        </>
      ) : (
        <mesh position={[0.34, 1.34, 0.12]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.05, 0.05, 0.98, 10]} />
          <VinylMaterial color={finish.body} roughness={0.52} />
        </mesh>
      )}
      {recipe.back === "porcelain-deer-tailcloth" ? (
        <RoundedBox args={[0.18, 1.12, 0.06]} radius={0.03} smoothness={2} position={[0, 1.2, -0.3]}>
          <VinylMaterial color={finish.accentSoft} roughness={0.42} />
        </RoundedBox>
      ) : recipe.back === "porcelain-deer-rings" ? (
        <>
          <Torus args={[0.12, 0.02, 8, 12]} position={[0, 1.5, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
          </Torus>
          <Torus args={[0.16, 0.02, 8, 12]} position={[0, 1.22, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
            <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
          </Torus>
        </>
      ) : null}
      {recipe.prop === "porcelain-deer-staff" ? (
        <mesh position={[0.46, 0.86, 0.14]}>
          <cylinderGeometry args={[0.03, 0.03, 1.92, 10]} />
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
        </mesh>
      ) : recipe.prop === "porcelain-deer-orb" ? (
        glowOrb(finish, [0.48, 1.04, 0.18], 0.1)
      ) : (
        <Torus args={[0.18, 0.03, 8, 14]} position={[0.5, 1.02, 0.18]} rotation={[0.4, 0.2, 0]}>
          <MetalToyMaterial color={finish.metal} roughness={0.22} metalness={0.2} />
        </Torus>
      )}
      {[-0.12, 0.14].map((x, index) => (
        <Torus key={`deer-anklet-${index}`} args={[0.09, 0.015, 8, 14]} position={[x, 0.02 + index * 0.08, index === 0 ? 0.08 : -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <MetalToyMaterial color={finish.prop} roughness={0.2} metalness={0.18} />
        </Torus>
      ))}
    </group>
  );
}

import { Box, Dodecahedron, RoundedBox, Sphere, Torus } from "@react-three/drei";
import { type CharacterDefinition, type CharacterRecipe, type FinishPreset, type StudioSlotId } from "./studio-data";

type FigureProps = {
  character: CharacterDefinition;
  recipe: CharacterRecipe;
  activeSlot: StudioSlotId;
  finish: FinishPreset;
};

export function FigureDisplay({ character, recipe, activeSlot, finish }: FigureProps) {
  switch (character.id) {
    case "maskling":
      return <Maskling recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "bloom-witch":
      return <BloomWitch recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "candle-kid":
      return <CandleKid recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "tri-eye-rabbit":
      return <TriEyeRabbit recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "mushroom-bear":
      return <MushroomBear recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "doubletail-hound":
      return <DoubletailHound recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "long-ear-fish":
      return <LongEarFish recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "ragbug":
      return <Ragbug recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "shell-dragon":
      return <ShellDragon recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "owl-deer":
      return <OwlDeer recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    case "night-fox":
      return <NightFox recipe={recipe} activeSlot={activeSlot} finish={finish} />;
    default:
      return <CloudHedgehog recipe={recipe} activeSlot={activeSlot} finish={finish} />;
  }
}

function isActive(slot: StudioSlotId, activeSlot: StudioSlotId, self: StudioSlotId) {
  return slot === activeSlot || self === activeSlot;
}

function eyeSet({
  finish,
  y = 0.2,
  sleepy = false,
  wink = false,
  third = false,
}: {
  finish: FinishPreset;
  y?: number;
  sleepy?: boolean;
  wink?: boolean;
  third?: boolean;
}) {
  return (
    <group position={[0, y, 0.94]}>
      {sleepy ? (
        <>
          <Box args={[0.16, 0.04, 0.02]} position={[-0.22, 0, 0]}>
            <meshStandardMaterial color={finish.ink} roughness={0.3} />
          </Box>
          <Box args={[0.16, 0.04, 0.02]} position={[0.22, 0, 0]}>
            <meshStandardMaterial color={finish.ink} roughness={0.3} />
          </Box>
        </>
      ) : wink ? (
        <>
          <Sphere args={[0.07, 10, 10]} position={[-0.22, 0, 0]}>
            <meshStandardMaterial color={finish.ink} roughness={0.22} />
          </Sphere>
          <Box args={[0.16, 0.04, 0.02]} position={[0.22, 0, 0]}>
            <meshStandardMaterial color={finish.ink} roughness={0.3} />
          </Box>
        </>
      ) : (
        <>
          <Sphere args={[0.07, 10, 10]} position={[-0.22, 0, 0]}>
            <meshStandardMaterial color={finish.ink} roughness={0.22} />
          </Sphere>
          <Sphere args={[0.07, 10, 10]} position={[0.22, 0, 0]}>
            <meshStandardMaterial color={finish.ink} roughness={0.22} />
          </Sphere>
        </>
      )}
      {third ? (
        <Sphere args={[0.06, 10, 10]} position={[0, 0.22, 0]}>
          <meshStandardMaterial color={finish.ink} roughness={0.22} />
        </Sphere>
      ) : null}
    </group>
  );
}

function blushMouth({ finish, y = 0 }: { finish: FinishPreset; y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <RoundedBox args={[0.22, 0.06, 0.02]} radius={0.02} smoothness={2} position={[0, -0.04, 0.94]}>
        <meshStandardMaterial color={finish.accentSoft} roughness={0.4} />
      </RoundedBox>
      <Sphere args={[0.08, 10, 10]} position={[-0.38, -0.02, 0.88]}>
        <meshStandardMaterial color={finish.accentSoft} roughness={0.48} />
      </Sphere>
      <Sphere args={[0.08, 10, 10]} position={[0.38, -0.02, 0.88]}>
        <meshStandardMaterial color={finish.accentSoft} roughness={0.48} />
      </Sphere>
    </group>
  );
}

function handProp({
  type,
  finish,
  position,
}: {
  type: string;
  finish: FinishPreset;
  position: [number, number, number];
}) {
  if (type.includes("lamp") || type.includes("lantern")) {
    return (
      <group position={position}>
        <RoundedBox args={[0.24, 0.3, 0.2]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={finish.glowSoft} roughness={0.18} metalness={0.1} />
        </RoundedBox>
      </group>
    );
  }

  if (type.includes("core") || type.includes("pearl") || type.includes("seed")) {
    return (
      <group position={position}>
        <Sphere args={[0.14, 16, 16]}>
          <meshStandardMaterial color={finish.glow} roughness={0.2} emissive={finish.glow} emissiveIntensity={0.1} />
        </Sphere>
      </group>
    );
  }

  return (
    <group position={position}>
      <RoundedBox args={[0.32, 0.18, 0.06]} radius={0.03} smoothness={3} rotation={[-0.18, 0.22, 0]}>
        <meshStandardMaterial color={finish.prop} roughness={0.34} />
      </RoundedBox>
    </group>
  );
}

function Maskling({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const tall = recipe.variant === "maskling-tall";
  const split = recipe.variant === "maskling-split" || recipe.face === "maskling-crack";
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.12 : 0.04;
  return (
    <group position={[0, 0.1, 0]}>
      <RoundedBox args={[0.9, tall ? 1.26 : 1.06, 0.74]} radius={0.24} smoothness={6} position={[0, 0.62, 0]}>
        <meshStandardMaterial color={finish.body} roughness={0.78} />
      </RoundedBox>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.62, tall ? 1.18 : 0.88, 28]} />
        <meshStandardMaterial color={recipe.body === "maskling-tunic" ? finish.accentSoft : finish.body} roughness={0.66} />
      </mesh>
      <Sphere args={[0.92, 32, 32]} position={[0, tall ? 1.92 : 1.78, 0.04]}>
        <meshStandardMaterial color={finish.skin} roughness={0.82} />
      </Sphere>
      <RoundedBox args={[0.94, 0.82, 0.16]} radius={0.1} smoothness={4} position={[0.02, tall ? 1.98 : 1.86, 0.72]}>
        <meshStandardMaterial color={finish.shell} roughness={0.36} />
      </RoundedBox>
      {split ? (
        <RoundedBox args={[0.08, 0.92, 0.02]} radius={0.02} smoothness={2} position={[0.12, tall ? 1.98 : 1.86, 0.8]} rotation={[0, 0, 0.22]}>
          <meshStandardMaterial color={finish.ink} roughness={0.24} />
        </RoundedBox>
      ) : null}
      {eyeSet({ finish, sleepy: recipe.face === "maskling-drowse", y: tall ? 1.9 : 1.78 })}
      {blushMouth({ finish, y: tall ? 1.7 : 1.58 })}
      {recipe.head === "maskling-halo" ? (
        <Torus args={[0.68, 0.05, 12, 28]} position={[0, tall ? 2.98 : 2.84, -0.18]} rotation={[0.4, 0, 0]}>
          <meshStandardMaterial color={finish.glowSoft} roughness={0.2} emissive={finish.glowSoft} emissiveIntensity={glow} />
        </Torus>
      ) : recipe.head === "maskling-pin" ? (
        <>
          <RoundedBox args={[0.06, 0.56, 0.04]} radius={0.02} smoothness={2} position={[-0.18, tall ? 2.88 : 2.74, 0.1]} rotation={[0, 0, 0.36]}>
            <meshStandardMaterial color={finish.metal} roughness={0.28} metalness={0.24} />
          </RoundedBox>
          <RoundedBox args={[0.06, 0.56, 0.04]} radius={0.02} smoothness={2} position={[0.2, tall ? 2.94 : 2.78, 0.02]} rotation={[0, 0, -0.28]}>
            <meshStandardMaterial color={finish.metal} roughness={0.28} metalness={0.24} />
          </RoundedBox>
        </>
      ) : (
        <>
          <Sphere args={[0.12, 12, 12]} position={[-0.12, tall ? 2.82 : 2.68, 0]}>
            <meshStandardMaterial color={finish.shell} roughness={0.74} />
          </Sphere>
          <Sphere args={[0.14, 12, 12]} position={[0.06, tall ? 2.88 : 2.74, 0]}>
            <meshStandardMaterial color={finish.shell} roughness={0.74} />
          </Sphere>
          <Sphere args={[0.08, 12, 12]} position={[0.06, tall ? 2.64 : 2.52, 0.12]}>
            <meshStandardMaterial color={finish.glow} roughness={0.22} emissive={finish.glow} emissiveIntensity={0.08} />
          </Sphere>
        </>
      )}
      {recipe.back === "maskling-ribbon" ? (
        <>
          <RoundedBox args={[0.12, 0.94, 0.04]} radius={0.02} smoothness={2} position={[-0.18, 0.82, -0.38]} rotation={[0.1, 0, 0.08]}>
            <meshStandardMaterial color={finish.accentSoft} roughness={0.64} />
          </RoundedBox>
          <RoundedBox args={[0.12, 1.02, 0.04]} radius={0.02} smoothness={2} position={[0.16, 0.78, -0.42]} rotation={[0.12, 0, -0.06]}>
            <meshStandardMaterial color={finish.accentSoft} roughness={0.64} />
          </RoundedBox>
        </>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.74, 0.36, 0.3] })}
    </group>
  );
}

function BloomWitch({ recipe, finish }: Omit<FigureProps, "character">) {
  const narrow = recipe.variant === "bloom-witch-narrow";
  return (
    <group position={[0, 0.06, 0]}>
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[narrow ? 0.64 : 0.82, 1.18, 28]} />
        <meshStandardMaterial color={finish.body} roughness={0.64} />
      </mesh>
      <RoundedBox args={[narrow ? 0.68 : 0.84, 0.72, 0.72]} radius={0.22} smoothness={5} position={[0, 0.86, 0]}>
        <meshStandardMaterial color={recipe.body === "bloom-witch-cloak" ? finish.accentSoft : finish.body} roughness={0.54} />
      </RoundedBox>
      <Sphere args={[0.96, 30, 30]} position={[0, 1.82, 0.04]}>
        <meshStandardMaterial color={finish.skin} roughness={0.82} />
      </Sphere>
      <Sphere args={[0.26, 16, 16]} position={[-0.62, 2.06, 0.1]}>
        <meshStandardMaterial color={finish.accent} roughness={0.64} />
      </Sphere>
      <Sphere args={[0.26, 16, 16]} position={[0.62, 2.06, 0.1]}>
        <meshStandardMaterial color={finish.accent} roughness={0.64} />
      </Sphere>
      <mesh position={[0, recipe.head === "bloom-witch-crown" ? 2.54 : 2.44, 0.02]}>
        <coneGeometry args={[recipe.head === "bloom-witch-cap" ? 0.82 : 0.68, 0.66, 28]} />
        <meshStandardMaterial color={finish.shell} roughness={0.6} />
      </mesh>
      {eyeSet({ finish, wink: recipe.face === "bloom-witch-wink", y: 1.8 })}
      {blushMouth({ finish, y: 1.56 })}
      {recipe.back === "bloom-witch-petalback" ? (
        <>
          <mesh position={[-0.56, 0.78, -0.2]} rotation={[0, 0, 0.16]}>
            <coneGeometry args={[0.24, 0.78, 4]} />
            <meshStandardMaterial color={finish.accentSoft} roughness={0.62} />
          </mesh>
          <mesh position={[0.56, 0.78, -0.2]} rotation={[0, 0, -0.16]}>
            <coneGeometry args={[0.24, 0.78, 4]} />
            <meshStandardMaterial color={finish.accentSoft} roughness={0.62} />
          </mesh>
        </>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.76, 0.42, 0.28] })}
    </group>
  );
}

function CandleKid({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const slim = recipe.variant === "candle-kid-slim";
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.14 : 0.08;
  return (
    <group position={[0, 0.04, 0]}>
      <RoundedBox args={[slim ? 0.62 : 0.72, 1.34, 0.62]} radius={0.18} smoothness={5} position={[0, 0.76, 0]}>
        <meshStandardMaterial color={recipe.body === "candle-kid-shell" ? finish.accentSoft : finish.body} roughness={0.72} />
      </RoundedBox>
      <Sphere args={[0.78, 28, 28]} position={[0, 2, 0.02]}>
        <meshStandardMaterial color={finish.skin} roughness={0.8} />
      </Sphere>
      <Box args={[0.16, 1.1, 0.02]} position={[0.14, 0.9, 0.34]}>
        <meshStandardMaterial color={finish.accentSoft} roughness={0.4} />
      </Box>
      <RoundedBox args={[0.14, 0.7, 0.08]} radius={0.03} smoothness={2} position={[0, 3.04, 0]}>
        <meshStandardMaterial color={finish.shell} roughness={0.36} />
      </RoundedBox>
      <RoundedBox args={[0.04, 0.24, 0.04]} radius={0.02} smoothness={2} position={[0, 3.42, 0]}>
        <meshStandardMaterial color={finish.ink} roughness={0.24} />
      </RoundedBox>
      <Sphere args={[0.08, 10, 10]} position={[0, 3.58, 0]}>
        <meshStandardMaterial color={finish.glow} roughness={0.18} emissive={finish.glow} emissiveIntensity={glow} />
      </Sphere>
      {eyeSet({ finish, sleepy: recipe.face === "candle-kid-sleep", y: 2 })}
      {blushMouth({ finish, y: 1.76 })}
      {handProp({ type: recipe.prop, finish, position: [0.5, 0.46, 0.22] })}
    </group>
  );
}

function TriEyeRabbit({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const tall = recipe.variant === "tri-eye-rabbit-tall";
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.12 : 0.04;
  return (
    <group position={[0, 0.08, 0]}>
      <Sphere args={[0.82, 30, 30]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={recipe.body === "tri-eye-rabbit-shell" ? finish.shell : finish.body} roughness={0.9} />
      </Sphere>
      <Sphere args={[0.94, 30, 30]} position={[0, 1.76, 0.02]}>
        <meshStandardMaterial color={finish.skin} roughness={0.82} />
      </Sphere>
      <RoundedBox args={[0.22, tall ? 1.28 : 0.96, 0.24]} radius={0.1} smoothness={4} position={[-0.24, tall ? 2.74 : 2.54, 0]}>
        <meshStandardMaterial color={finish.shell} roughness={0.78} emissive={finish.accentSoft} emissiveIntensity={glow * 0.3} />
      </RoundedBox>
      <RoundedBox args={[0.22, tall ? 1.28 : 0.96, 0.24]} radius={0.1} smoothness={4} position={[0.24, tall ? 2.74 : 2.54, 0]}>
        <meshStandardMaterial color={finish.shell} roughness={0.78} emissive={finish.accentSoft} emissiveIntensity={glow * 0.3} />
      </RoundedBox>
      {eyeSet({ finish, wink: recipe.face === "tri-eye-rabbit-wink", third: true, y: 1.8 })}
      {blushMouth({ finish, y: 1.56 })}
      {recipe.back === "tri-eye-rabbit-tail" ? (
        <Sphere args={[0.18, 14, 14]} position={[-0.42, 0.22, -0.36]}>
          <meshStandardMaterial color={finish.shell} roughness={0.84} />
        </Sphere>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.72, 0.24, 0.24] })}
    </group>
  );
}

function MushroomBear({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const heavy = recipe.variant === "mushroom-bear-log";
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.12 : 0.04;
  return (
    <group position={[0, 0.06, 0]}>
      <Sphere args={[heavy ? 0.96 : 0.88, 30, 30]} position={[0, 0.62, 0]}>
        <meshStandardMaterial color={recipe.body === "mushroom-bear-bark" ? finish.body : finish.shell} roughness={0.9} />
      </Sphere>
      <Sphere args={[0.92, 30, 30]} position={[0, 1.76, 0.02]}>
        <meshStandardMaterial color={finish.skin} roughness={0.82} />
      </Sphere>
      <mesh position={[0, 2.48, 0]} rotation={[0.06, 0, 0]}>
        <coneGeometry args={[recipe.head === "mushroom-bear-caphead" ? 0.9 : 0.74, 0.56, 28]} />
        <meshStandardMaterial color={finish.prop} roughness={0.58} emissive={finish.glowSoft} emissiveIntensity={glow * 0.3} />
      </mesh>
      {eyeSet({ finish, sleepy: recipe.face === "mushroom-bear-sleep", y: 1.78 })}
      {blushMouth({ finish, y: 1.54 })}
      {recipe.back === "mushroom-bear-spores" ? (
        <>
          <Sphere args={[0.18, 14, 14]} position={[-0.48, 0.82, -0.34]}>
            <meshStandardMaterial color={finish.accentSoft} roughness={0.78} />
          </Sphere>
          <Sphere args={[0.18, 14, 14]} position={[0.44, 0.72, -0.34]}>
            <meshStandardMaterial color={finish.accentSoft} roughness={0.78} />
          </Sphere>
        </>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.76, 0.3, 0.28] })}
    </group>
  );
}

function DoubletailHound({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const sprint = recipe.variant === "doubletail-hound-sprint";
  const bodyLength = recipe.variant === "doubletail-hound-tall" ? 1.16 : 0.98;
  const tailGlow = isActive(activeSlot, activeSlot, "back") ? 0.12 : 0.04;
  return (
    <group position={[0.06, 0.02, 0]} rotation={[0, sprint ? -0.14 : 0, 0]}>
      <RoundedBox args={[bodyLength, 0.78, 0.62]} radius={0.22} smoothness={6} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={finish.body} roughness={0.82} />
      </RoundedBox>
      <Sphere args={[0.88, 30, 30]} position={[0.44, 1.66, 0.02]}>
        <meshStandardMaterial color={finish.skin} roughness={0.82} />
      </Sphere>
      <RoundedBox args={[0.22, recipe.head === "doubletail-hound-prick" ? 0.72 : 0.94, 0.18]} radius={0.08} smoothness={4} position={[0.06, 2.38, 0]} rotation={[0, 0, 0.12]}>
        <meshStandardMaterial color={finish.shell} roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[0.22, recipe.head === "doubletail-hound-prick" ? 0.72 : 0.94, 0.18]} radius={0.08} smoothness={4} position={[0.72, 2.18, 0]} rotation={[0, 0, -0.28]}>
        <meshStandardMaterial color={finish.shell} roughness={0.72} />
      </RoundedBox>
      {eyeSet({ finish, wink: recipe.face === "doubletail-hound-wink", y: 1.68 })}
      {blushMouth({ finish, y: 1.44 })}
      {recipe.back === "doubletail-hound-doubletail" ? (
        <>
          <mesh position={[-0.66, 0.5, -0.26]} rotation={[0.1, -0.5, -0.16]}>
            <coneGeometry args={[0.16, 0.76, 16]} />
            <meshStandardMaterial color={finish.body} roughness={0.78} emissive={finish.accentSoft} emissiveIntensity={tailGlow * 0.4} />
          </mesh>
          <mesh position={[-0.52, 0.36, -0.38]} rotation={[0.1, -0.82, 0]}>
            <coneGeometry args={[0.16, 0.76, 16]} />
            <meshStandardMaterial color={finish.body} roughness={0.78} emissive={finish.accentSoft} emissiveIntensity={tailGlow * 0.4} />
          </mesh>
        </>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.9, 0.34, 0.22] })}
    </group>
  );
}

function LongEarFish({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const slim = recipe.variant === "long-ear-fish-stream";
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.12 : 0.04;
  return (
    <group position={[0, 0.06, 0]}>
      <Sphere args={[slim ? 0.72 : 0.84, 28, 28]} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={recipe.body === "long-ear-fish-shell" ? finish.shell : finish.body} roughness={0.7} />
      </Sphere>
      <Sphere args={[0.88, 28, 28]} position={[0, 1.76, 0.02]}>
        <meshStandardMaterial color={finish.skin} roughness={0.76} />
      </Sphere>
      <mesh position={[-0.4, 2.08, 0]} rotation={[0, 0, 0.26]}>
        <coneGeometry args={[0.22, 1.02, 18]} />
        <meshStandardMaterial color={finish.glowSoft} roughness={0.28} emissive={finish.glowSoft} emissiveIntensity={glow} />
      </mesh>
      <mesh position={[0.4, 2.08, 0]} rotation={[0, 0, -0.26]}>
        <coneGeometry args={[0.22, 1.02, 18]} />
        <meshStandardMaterial color={finish.glowSoft} roughness={0.28} emissive={finish.glowSoft} emissiveIntensity={glow} />
      </mesh>
      {recipe.head === "long-ear-fish-halo" ? (
        <Torus args={[0.66, 0.05, 12, 26]} position={[0, 2.44, -0.18]} rotation={[0.36, 0, 0]}>
          <meshStandardMaterial color={finish.glow} roughness={0.18} emissive={finish.glow} emissiveIntensity={0.1} />
        </Torus>
      ) : null}
      {eyeSet({ finish, sleepy: recipe.face === "long-ear-fish-drowse", y: 1.78 })}
      {blushMouth({ finish, y: 1.56 })}
      {recipe.back === "long-ear-fish-bubbles" ? (
        <>
          <Sphere args={[0.08, 10, 10]} position={[0.72, 2.08, 0.18]}>
            <meshStandardMaterial color={finish.glowSoft} roughness={0.2} emissive={finish.glowSoft} emissiveIntensity={0.06} />
          </Sphere>
          <Sphere args={[0.06, 10, 10]} position={[0.84, 1.86, 0.18]}>
            <meshStandardMaterial color={finish.glowSoft} roughness={0.2} emissive={finish.glowSoft} emissiveIntensity={0.06} />
          </Sphere>
        </>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.72, 0.42, 0.22] })}
    </group>
  );
}

function Ragbug({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const needle = recipe.variant === "ragbug-needle";
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.1 : 0.03;
  return (
    <group position={[0, 0.04, 0]}>
      <RoundedBox args={[0.92, 0.72, 0.68]} radius={0.22} smoothness={6} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={finish.body} roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.7, 0.64]} radius={0.18} smoothness={5} position={[0, 1.32, 0]}>
        <meshStandardMaterial color={recipe.body === "ragbug-cloak" ? finish.shell : finish.body} roughness={0.88} />
      </RoundedBox>
      <Sphere args={[0.82, 28, 28]} position={[0, 2.08, 0.02]}>
        <meshStandardMaterial color={finish.skin} roughness={0.84} />
      </Sphere>
      <RoundedBox args={[0.52, 0.12, 0.06]} radius={0.03} smoothness={2} position={[0.12, 2.18, 0.82]} rotation={[0, 0, -0.34]}>
        <meshStandardMaterial color={finish.ink} roughness={0.3} />
      </RoundedBox>
      {needle ? (
        <>
          <RoundedBox args={[0.08, 0.68, 0.06]} radius={0.02} smoothness={2} position={[-0.58, 2.12, 0.02]} rotation={[0, 0, 0.2]}>
            <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.24} emissive={finish.glowSoft} emissiveIntensity={glow * 0.3} />
          </RoundedBox>
          <RoundedBox args={[0.08, 0.64, 0.06]} radius={0.02} smoothness={2} position={[0.58, 1.96, 0.02]} rotation={[0, 0, -0.18]}>
            <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.24} emissive={finish.glowSoft} emissiveIntensity={glow * 0.3} />
          </RoundedBox>
        </>
      ) : null}
      {eyeSet({ finish, sleepy: recipe.face === "ragbug-sleep", y: 2.08 })}
      {blushMouth({ finish, y: 1.86 })}
      {recipe.back === "ragbug-thread" ? (
        <Torus args={[0.26, 0.04, 10, 18]} position={[-0.42, 0.68, -0.28]} rotation={[0.3, 0.2, 0]}>
          <meshStandardMaterial color={finish.accentSoft} roughness={0.52} />
        </Torus>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.7, 0.46, 0.22] })}
    </group>
  );
}

function ShellDragon({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const proud = recipe.variant === "shell-dragon-proud";
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.12 : 0.04;
  return (
    <group position={[0, 0.04, 0]} rotation={[0, proud ? 0.14 : 0, 0]}>
      <RoundedBox args={[0.98, 0.78, 0.74]} radius={0.22} smoothness={6} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={recipe.body === "shell-dragon-shell" ? finish.body : finish.shell} roughness={0.76} />
      </RoundedBox>
      <Sphere args={[0.88, 28, 28]} position={[0.26, 1.72, 0.02]}>
        <meshStandardMaterial color={finish.skin} roughness={0.8} />
      </Sphere>
      <Dodecahedron args={[0.16, 0]} position={[0.26, 2.36, 0.14]}>
        <meshStandardMaterial color={finish.glowSoft} roughness={0.2} emissive={finish.glowSoft} emissiveIntensity={glow * 0.4} />
      </Dodecahedron>
      {recipe.head === "shell-dragon-spine" ? (
        <>
          <mesh position={[0.02, 2.18, 0]} rotation={[0, 0, 0.22]}>
            <coneGeometry args={[0.14, 0.42, 4]} />
            <meshStandardMaterial color={finish.shell} roughness={0.56} />
          </mesh>
          <mesh position={[0.54, 2.1, 0]} rotation={[0, 0, -0.18]}>
            <coneGeometry args={[0.14, 0.42, 4]} />
            <meshStandardMaterial color={finish.shell} roughness={0.56} />
          </mesh>
        </>
      ) : null}
      {eyeSet({ finish, sleepy: recipe.face === "shell-dragon-sleep", y: 1.72 })}
      {blushMouth({ finish, y: 1.48 })}
      {recipe.back === "shell-dragon-tail" ? (
        <mesh position={[-0.66, 0.48, -0.24]} rotation={[0.12, -0.48, -0.1]}>
          <coneGeometry args={[0.18, 0.92, 18]} />
          <meshStandardMaterial color={finish.body} roughness={0.78} />
        </mesh>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.98, 0.28, 0.2] })}
    </group>
  );
}

function OwlDeer({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.14 : 0.06;
  return (
    <group position={[0, 0.02, 0]}>
      <RoundedBox args={[1.02, 0.86, 0.82]} radius={0.26} smoothness={8} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={finish.metal} roughness={0.28} metalness={0.28} />
      </RoundedBox>
      <RoundedBox args={[0.92, 0.5, 0.14]} radius={0.08} smoothness={4} position={[0, 0.78, 0.44]}>
        <meshStandardMaterial color={finish.glowSoft} roughness={0.12} metalness={0.2} />
      </RoundedBox>
      <Sphere args={[0.84, 26, 26]} position={[0, 1.74, 0.02]}>
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.28} />
      </Sphere>
      <RoundedBox args={[0.78, 0.26, 0.08]} radius={0.08} smoothness={4} position={[0, 1.92, 0.86]}>
        <meshStandardMaterial color={finish.glowSoft} roughness={0.1} metalness={0.26} />
      </RoundedBox>
      <Box args={[0.18, 0.04, 0.02]} position={[-0.18, 1.94, 0.92]}>
        <meshStandardMaterial color={finish.accent} roughness={0.2} emissive={finish.accent} emissiveIntensity={0.12} />
      </Box>
      <Box args={[0.18, 0.04, 0.02]} position={[0.18, 1.94, 0.92]}>
        <meshStandardMaterial color={finish.accent} roughness={0.2} emissive={finish.accent} emissiveIntensity={0.12} />
      </Box>
      <RoundedBox args={[0.1, 0.82, 0.06]} radius={0.03} smoothness={2} position={[-0.34, 2.6, -0.04]} rotation={[0, 0, 0.34]}>
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.82, 0.06]} radius={0.03} smoothness={2} position={[0.34, 2.6, -0.04]} rotation={[0, 0, -0.34]}>
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.3} />
      </RoundedBox>
      <Sphere args={[0.08, 10, 10]} position={[-0.34, 3, -0.04]}>
        <meshStandardMaterial color={finish.glow} roughness={0.18} emissive={finish.glow} emissiveIntensity={glow} />
      </Sphere>
      <Sphere args={[0.08, 10, 10]} position={[0.34, 3, -0.04]}>
        <meshStandardMaterial color={finish.glow} roughness={0.18} emissive={finish.glow} emissiveIntensity={glow} />
      </Sphere>
      {handProp({ type: recipe.prop, finish, position: [0.78, 0.34, 0.16] })}
    </group>
  );
}

function NightFox({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const glow = isActive(activeSlot, activeSlot, "head") ? 0.14 : 0.06;
  return (
    <group position={[0.04, 0.02, 0]} rotation={[0, -0.08, 0]}>
      <RoundedBox args={[1.04, 0.76, 0.74]} radius={0.24} smoothness={8} position={[0, 0.58, 0]}>
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.32} />
      </RoundedBox>
      <Sphere args={[0.78, 26, 26]} position={[0.32, 1.68, 0.02]}>
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.32} />
      </Sphere>
      <RoundedBox args={[0.64, 0.22, 0.08]} radius={0.06} smoothness={4} position={[0.34, 1.84, 0.84]}>
        <meshStandardMaterial color={finish.glowSoft} roughness={0.1} metalness={0.26} />
      </RoundedBox>
      <Box args={[0.16, 0.04, 0.02]} position={[0.18, 1.86, 0.9]}>
        <meshStandardMaterial color={finish.accent} roughness={0.2} emissive={finish.accent} emissiveIntensity={0.12} />
      </Box>
      <Box args={[0.16, 0.04, 0.02]} position={[0.5, 1.86, 0.9]}>
        <meshStandardMaterial color={finish.accent} roughness={0.2} emissive={finish.accent} emissiveIntensity={0.12} />
      </Box>
      <mesh position={[0.02, 2.34, 0]} rotation={[0, 0, 0.12]}>
        <coneGeometry args={[0.18, 0.62, 4]} />
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.34} emissive={finish.glowSoft} emissiveIntensity={glow * 0.2} />
      </mesh>
      <mesh position={[0.6, 2.24, 0]} rotation={[0, 0, -0.1]}>
        <coneGeometry args={[0.18, 0.62, 4]} />
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.34} emissive={finish.glowSoft} emissiveIntensity={glow * 0.2} />
      </mesh>
      {recipe.back === "night-fox-tail" ? (
        <mesh position={[-0.7, 0.46, -0.18]} rotation={[0.12, -0.4, -0.08]}>
          <coneGeometry args={[0.12, 0.94, 16]} />
          <meshStandardMaterial color={finish.glow} roughness={0.18} emissive={finish.glow} emissiveIntensity={0.08} />
        </mesh>
      ) : null}
      {handProp({ type: recipe.prop, finish, position: [0.86, 0.28, 0.16] })}
    </group>
  );
}

function CloudHedgehog({ recipe, activeSlot, finish }: Omit<FigureProps, "character">) {
  const spread = recipe.variant === "cloud-hedgehog-spread";
  const glow = isActive(activeSlot, activeSlot, "back") ? 0.14 : 0.06;
  return (
    <group position={[0, 0, 0]}>
      <Sphere args={[0.94, 30, 30]} position={[0, 0.72, 0]}>
        <meshStandardMaterial color={recipe.body === "cloud-hedgehog-puff" ? finish.shell : finish.metal} roughness={0.28} metalness={0.28} />
      </Sphere>
      <Torus args={[0.86, 0.04, 12, 28]} position={[0, 0.82, 0.04]} rotation={[Math.PI / 2, 0.1, 0]}>
        <meshStandardMaterial color={finish.glow} roughness={0.18} emissive={finish.glow} emissiveIntensity={glow} />
      </Torus>
      {Array.from({ length: spread ? 12 : 8 }).map((_, index) => {
        const angle = (index / (spread ? 12 : 8)) * Math.PI * 2;
        return (
          <mesh key={`quill-${index}`} position={[Math.cos(angle) * 0.78, 1.34, Math.sin(angle) * 0.16]} rotation={[0, 0, angle]}>
            <coneGeometry args={[0.08, spread ? 0.62 : 0.46, 6]} />
            <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.3} />
          </mesh>
        );
      })}
      <Sphere args={[0.8, 26, 26]} position={[0, 1.88, 0.02]}>
        <meshStandardMaterial color={finish.metal} roughness={0.24} metalness={0.3} />
      </Sphere>
      <RoundedBox args={[0.7, 0.24, 0.08]} radius={0.06} smoothness={4} position={[0, 2.04, 0.84]}>
        <meshStandardMaterial color={finish.glowSoft} roughness={0.1} metalness={0.26} />
      </RoundedBox>
      <Box args={[0.18, 0.04, 0.02]} position={[-0.18, 2.06, 0.9]}>
        <meshStandardMaterial color={finish.accent} roughness={0.2} emissive={finish.accent} emissiveIntensity={0.12} />
      </Box>
      <Box args={[0.18, 0.04, 0.02]} position={[0.18, 2.06, 0.9]}>
        <meshStandardMaterial color={finish.accent} roughness={0.2} emissive={finish.accent} emissiveIntensity={0.12} />
      </Box>
      {handProp({ type: recipe.prop, finish, position: [0.78, 0.38, 0.16] })}
    </group>
  );
}

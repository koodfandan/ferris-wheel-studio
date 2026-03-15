import { ContactShadows, Sparkles } from "@react-three/drei";
import type { CameraControls as CameraControlsHandle } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  Box3,
  DoubleSide,
  Group,
  MathUtils,
  PerspectiveCamera,
  Sphere,
  Vector3,
} from "three";
import { getBlindboxFigureMotion } from "../../features/blindbox/blindbox.selectors";
import type { BlindboxPhase } from "../../features/blindbox/blindbox.types";
import { getDefaultPrototype, type CharacterPrototypeId } from "../../lib/character-prototypes-v2";
import { getPaletteOption, type StageMode, type StudioRecipe, type StudioSlot } from "../../lib/studio-system";
import type { StageLayout } from "./stage-layout";
import { StageFigure } from "./stage-figure-v2";

type Props = {
  recipe: StudioRecipe;
  focusSlot: StudioSlot;
  stageMode: StageMode;
  layout: StageLayout;
  activePrototype?: CharacterPrototypeId;
  controlsRef: MutableRefObject<CameraControlsHandle | null>;
  viewerArmed: boolean;
  blindboxActive: boolean;
  blindboxPhase: BlindboxPhase;
  onInitialFramingReady?: () => void;
};

type StageFraming = {
  target: Vector3;
  radius: number;
  distance: number;
  minDistance: number;
  maxDistance: number;
};

const CAMERA_PRESETS: Record<StageMode, { azimuth: number; polar: number; distanceMultiplier: number; focusLift: number }> = {
  assemble: { azimuth: 0.5, polar: 1.12, distanceMultiplier: 1.44, focusLift: 0.02 },
  inspect: { azimuth: 0.64, polar: 1.08, distanceMultiplier: 1.3, focusLift: 0.03 },
  shelf: { azimuth: 0.34, polar: 1.16, distanceMultiplier: 1.48, focusLift: 0.02 },
};

export function StageScene({
  recipe,
  focusSlot,
  stageMode,
  layout,
  activePrototype = getDefaultPrototype(recipe.species).id,
  controlsRef,
  viewerArmed,
  blindboxActive,
  blindboxPhase,
  onInitialFramingReady,
}: Props) {
  const palette = getPaletteOption(recipe.palette);
  const displayRootRef = useRef<Group>(null);
  const figureTurntableRef = useRef<Group>(null);
  const revealGroupRef = useRef<Group>(null);
  const hasPrimedCameraRef = useRef(false);
  const hasReportedInitialFramingRef = useRef(false);
  const hasRevealMotionPrimedRef = useRef(false);
  const previousBlindboxPhaseRef = useRef<BlindboxPhase>("idle");
  const revealVisibilityRef = useRef(1);
  const revealScaleRef = useRef(1);
  const revealOffsetXRef = useRef(0);
  const revealOffsetYRef = useRef(0);
  const revealPitchRef = useRef(0);
  const revealTargetVisibilityRef = useRef(1);
  const revealTargetScaleRef = useRef(1);
  const revealTargetOffsetXRef = useRef(0);
  const revealTargetOffsetYRef = useRef(0);
  const revealTargetPitchRef = useRef(0);
  const [framing, setFraming] = useState<StageFraming | null>(null);
  const { camera, size: viewportSize } = useThree();

  useLayoutEffect(() => {
    if (!revealGroupRef.current) {
      return;
    }

    const motion = getBlindboxFigureMotion(blindboxPhase);
    revealTargetVisibilityRef.current = motion.visibility;
    revealTargetScaleRef.current = motion.scale;
    revealTargetOffsetXRef.current = motion.x;
    revealTargetOffsetYRef.current = motion.y;
    revealTargetPitchRef.current = motion.pitch;

    previousBlindboxPhaseRef.current = blindboxPhase;

    if (!hasRevealMotionPrimedRef.current) {
      hasRevealMotionPrimedRef.current = true;
      revealVisibilityRef.current = motion.visibility;
      revealScaleRef.current = motion.scale;
      revealOffsetXRef.current = motion.x;
      revealOffsetYRef.current = motion.y;
      revealPitchRef.current = motion.pitch;
    } else {
      revealVisibilityRef.current = motion.visibility;
      revealScaleRef.current = motion.scale;
      revealOffsetXRef.current = motion.x;
      revealOffsetYRef.current = motion.y;
      revealPitchRef.current = motion.pitch;
    }

    revealGroupRef.current.visible = revealVisibilityRef.current > 0.02 || revealTargetVisibilityRef.current > 0.02;
    revealGroupRef.current.scale.setScalar(revealScaleRef.current);
    revealGroupRef.current.position.set(revealOffsetXRef.current, revealOffsetYRef.current, 0);
    revealGroupRef.current.rotation.set(revealPitchRef.current, 0, 0);
  }, [blindboxPhase]);

  useLayoutEffect(() => {
    if (!displayRootRef.current || !(camera instanceof PerspectiveCamera)) {
      return;
    }

    const box = new Box3().setFromObject(displayRootRef.current);
    if (box.isEmpty()) {
      return;
    }

    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const sphere = box.getBoundingSphere(new Sphere());
    const verticalFov = MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const safeRadius = Math.max(sphere.radius * 1.08, 2.46);
    const fitHeightDistance = safeRadius / Math.sin(verticalFov / 2);
    const fitWidthDistance = safeRadius / Math.sin(horizontalFov / 2);
    const preset = CAMERA_PRESETS[stageMode];
    const focusLift = MathUtils.clamp(size.y * preset.focusLift, 0.2, 0.56);
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * preset.distanceMultiplier;
    const minDistance = Math.max(safeRadius * 1.06, distance * 0.6);
    const maxDistance = Math.max(minDistance + 1.6, distance * 2.5);

    setFraming({
      target: new Vector3(center.x, center.y + focusLift, center.z),
      radius: safeRadius,
      distance,
      minDistance,
      maxDistance,
    });
  }, [camera, focusSlot, layout, recipe, stageMode, viewportSize.height, viewportSize.width]);

  useEffect(() => {
    if (!framing) {
      return;
    }

    let rafId = 0;
    let disposed = false;

    const applyFraming = () => {
      if (disposed) {
        return;
      }

      const controls = controlsRef.current;
      if (!controls) {
        rafId = requestAnimationFrame(applyFraming);
        return;
      }

      const preset = CAMERA_PRESETS[stageMode];
      const eye = getEyePosition(framing.target, framing.distance, preset.azimuth, preset.polar);

      controls.stop();
      controls.minDistance = framing.minDistance;
      controls.maxDistance = framing.maxDistance;
      const useTransition = hasPrimedCameraRef.current && !blindboxActive && blindboxPhase === "idle";
      hasPrimedCameraRef.current = true;

      void controls.setLookAt(
        eye.x,
        eye.y,
        eye.z,
        framing.target.x,
        framing.target.y,
        framing.target.z,
        useTransition,
      ).catch(() => undefined);

      if (!hasReportedInitialFramingRef.current) {
        hasReportedInitialFramingRef.current = true;
        requestAnimationFrame(() => {
          if (!disposed) {
            onInitialFramingReady?.();
          }
        });
      }
    };

    applyFraming();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      controlsRef.current?.stop();
    };
  }, [blindboxActive, blindboxPhase, controlsRef, framing, stageMode]);

  useFrame((_, delta) => {
    if (revealGroupRef.current) {
      const shouldBlendReveal = false;

      if (shouldBlendReveal) {
        revealVisibilityRef.current = MathUtils.damp(revealVisibilityRef.current, revealTargetVisibilityRef.current, 4, delta);
        revealScaleRef.current = MathUtils.damp(revealScaleRef.current, revealTargetScaleRef.current, 3.5, delta);
        revealOffsetXRef.current = MathUtils.damp(revealOffsetXRef.current, revealTargetOffsetXRef.current, 3.7, delta);
        revealOffsetYRef.current = MathUtils.damp(revealOffsetYRef.current, revealTargetOffsetYRef.current, 3.7, delta);
        revealPitchRef.current = MathUtils.damp(revealPitchRef.current, revealTargetPitchRef.current, 3.4, delta);
      } else {
        revealVisibilityRef.current = revealTargetVisibilityRef.current;
        revealScaleRef.current = revealTargetScaleRef.current;
        revealOffsetXRef.current = revealTargetOffsetXRef.current;
        revealOffsetYRef.current = revealTargetOffsetYRef.current;
        revealPitchRef.current = revealTargetPitchRef.current;
      }

      const shouldStayVisible = revealVisibilityRef.current > 0.02 || revealTargetVisibilityRef.current > 0.02;
      revealGroupRef.current.visible = shouldStayVisible;
      revealGroupRef.current.scale.setScalar(revealScaleRef.current);
      revealGroupRef.current.position.set(revealOffsetXRef.current, revealOffsetYRef.current, 0);
      revealGroupRef.current.rotation.x = revealPitchRef.current;
    }

    if (figureTurntableRef.current) {
      if (stageMode === "shelf" && !viewerArmed && !blindboxActive) {
        figureTurntableRef.current.rotation.y += delta * 0.18;
      } else {
        figureTurntableRef.current.rotation.y = MathUtils.damp(figureTurntableRef.current.rotation.y, 0, 6.2, delta);
      }
    }
  });

  return (
    <>
      <color attach="background" args={[palette.colors.pageTop]} />

      <ambientLight intensity={1.05} color="#fff8f2" />
      <hemisphereLight intensity={0.9} color="#fffef8" groundColor="#eadfdb" />
      <spotLight
        position={[4.6, 7.2, 5.2]}
        angle={0.42}
        intensity={10.5}
        penumbra={0.86}
        color="#fff6ee"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-4.8, 4.6, 4.4]}
        angle={0.56}
        intensity={3.8}
        penumbra={0.92}
        color={palette.colors.accentSoft}
      />
      <pointLight position={[0, 1.72, -3.4]} intensity={1.35} color={palette.colors.glowSoft} />

      <group ref={displayRootRef}>
        <StaticDisplayBase />

        <group ref={figureTurntableRef}>
          <group ref={revealGroupRef}>
            <StageFigure
              recipe={recipe}
              focusSlot={focusSlot}
              stageMode={stageMode}
              layout={layout}
              activePrototype={activePrototype}
            />
          </group>
        </group>
      </group>

      {!blindboxActive ? (
        <RevealAura
          active={blindboxPhase === "viewer-ready"}
          accent={palette.colors.accentSoft}
          glow={palette.colors.glow}
        />
      ) : null}

      <ContactShadows
        position={[0, -1.92, 0]}
        opacity={0.1}
        blur={3}
        scale={6.6}
        far={3.6}
        color="#d8c8bc"
      />

      {!blindboxActive ? (
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom intensity={0.34} luminanceThreshold={0.76} luminanceSmoothing={0.16} mipmapBlur />
          <Noise opacity={0.014} />
          <Vignette offset={0.18} darkness={0.24} eskil={false} />
        </EffectComposer>
      ) : null}
    </>
  );
}

function getEyePosition(target: Vector3, distance: number, azimuth: number, polar: number) {
  const horizontalRadius = distance * Math.sin(polar);
  return new Vector3(
    target.x + Math.sin(azimuth) * horizontalRadius,
    target.y + Math.cos(polar) * distance,
    target.z + Math.cos(azimuth) * horizontalRadius,
  );
}

function RevealAura({
  active,
  accent,
  glow,
}: {
  active: boolean;
  accent: string;
  glow: string;
}) {
  const groupRef = useRef<Group>(null);
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    pulseRef.current = MathUtils.damp(pulseRef.current, active ? 1 : 0, 5.4, delta);

    if (!groupRef.current) return;

    const floatOffset = Math.sin(state.clock.elapsedTime * 1.6) * 0.05;
    const scale = MathUtils.lerp(0.78, 1.08, pulseRef.current);

    groupRef.current.visible = pulseRef.current > 0.02;
    groupRef.current.position.y = -0.04 + floatOffset + pulseRef.current * 0.22;
    groupRef.current.rotation.y += delta * (active ? 0.48 : 0.12);
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={[0, 0.14, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.34, 1.86, 72]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.24}
          blending={AdditiveBlending}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.58, 28, 28]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Sparkles
        count={18}
        scale={[3.8, 3.2, 3.8]}
        size={4}
        speed={0.5}
        opacity={0.9}
        color={glow}
      />
    </group>
  );
}

function StaticDisplayBase() {
  return (
    <group position={[0, -1.44, 0.08]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.58, 1.7, 0.38, 64]} />
        <meshStandardMaterial color="#f8efe8" roughness={0.78} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.16, 1.24, 0.08, 64]} />
        <meshStandardMaterial color="#fff8f3" roughness={0.62} metalness={0.03} />
      </mesh>
      <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.22, 1.32, 64]} />
        <meshStandardMaterial color="#ffe0cf" roughness={0.4} emissive="#fff1e8" emissiveIntensity={0.06} />
      </mesh>
    </group>
  );
}




import { AccumulativeShadows, OrbitControls, RandomizedLight } from "@react-three/drei";
import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, lazy, type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  BoxGeometry,
  BufferAttribute,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
} from "three";
import { type FigureDefinition, type FigureRecipe, getFinishPreset } from "./catalog-v2";
import { buildCharacterFinish } from "./color-grade";
import { getThemeDisplay } from "./display-copy";
import { FigureDisplayV2 } from "./figures-v2";
import { getFigureTheme, type FigureTheme } from "./theme-v2";

// TODO: remove when legacy BOM import issue is fully cleaned.
void AccumulativeShadows;
void RandomizedLight;

type Props = {
  character: FigureDefinition;
  recipe: FigureRecipe;
  transitionToken?: number;
  qualityMode?: "low" | "standard" | "high";
  blindboxActive?: boolean;
};

const MODEL_BASE_SCALE = 0.74;
const ORBIT_TARGET_Y = 0.8;
const FIGURE_TARGET_HEIGHT = 2.68;
const FIGURE_AUTO_FIT_MIN = 0.78;
const FIGURE_AUTO_FIT_MAX = 1.2;
const _tmpVec = new Vector3();

const LazyStagePostFx = lazy(async () => {
  const module = await import("./stage-postfx");
  return { default: module.StagePostFx };
});

export function CharacterStageV2({
  character,
  recipe,
  transitionToken = 0,
  qualityMode = "standard",
  blindboxActive = false,
}: Props) {
  const finish = useMemo(
    () => buildCharacterFinish(getFinishPreset(recipe.finish), character.id),
    [character.id, recipe.finish],
  );
  const theme = useMemo(() => getFigureTheme(character.id), [character.id]);
  const themeDisplay = getThemeDisplay(character.id);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionEndTimerRef = useRef<number | null>(null);

  const dprRange: [number, number] =
    qualityMode === "high" ? [1, 1.6] : qualityMode === "low" ? [1, 1.15] : [1, 1.35];
  const detailLevel: "low" | "standard" | "high" =
    isInteracting ? "low" : qualityMode === "high" ? "high" : qualityMode === "low" ? "low" : "standard";
  const recipeKey = useMemo(() => JSON.stringify(recipe), [recipe]);
  const orbitTarget = useMemo<[number, number, number]>(
    () => [0, character.stageY + ORBIT_TARGET_Y, 0],
    [character.stageY],
  );

  function handleControlStart() {
    if (interactionEndTimerRef.current !== null) {
      window.clearTimeout(interactionEndTimerRef.current);
      interactionEndTimerRef.current = null;
    }
    setIsInteracting(true);
  }

  function handleControlEnd() {
    if (interactionEndTimerRef.current !== null) {
      window.clearTimeout(interactionEndTimerRef.current);
    }
    interactionEndTimerRef.current = window.setTimeout(() => {
      setIsInteracting(false);
      interactionEndTimerRef.current = null;
    }, 260);
  }

  useEffect(() => {
    return () => {
      if (interactionEndTimerRef.current !== null) {
        window.clearTimeout(interactionEndTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="reboot-stage-shell"
      style={
        {
          "--stage-top": finish.pageTop,
          "--stage-bottom": finish.pageBottom,
          "--stage-line": finish.line,
          "--stage-aura": theme.aura,
          "--stage-mist": theme.mist,
        } as CSSProperties
      }
    >
      <Canvas
        camera={{ position: [0, 1.76, 5.35], fov: 26.5, near: 0.08, far: 80 }}
        dpr={dprRange}
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <SceneLights
          top={finish.stageTop}
          bottom={finish.stageBottom}
          glow={finish.glow}
          aura={theme.aura}
          accent={finish.accent}
        />

        <Suspense fallback={null}>
          <ShowcaseRig transitionToken={transitionToken} effect={theme.effect}>
            <group
              position={[0, character.stageY, 0]}
              scale={character.stageScale * MODEL_BASE_SCALE}
            >
              <DisplayPedestal finishId={finish.id} pedestal={theme.pedestal} aura={theme.aura} />
              <AmbientSparkles effect={theme.effect} aura={theme.aura} glow={finish.glow} accent={finish.accent} />
              <ThemeFx effect={theme.effect} aura={theme.aura} glow={finish.glow} accent={finish.accent} />
              <SculptedFigure characterId={character.id} recipeKey={recipeKey}>
                <AutoFitFigure characterId={character.id} recipeKey={recipeKey}>
                  <FigureDisplayV2 character={character} recipe={recipe} finish={finish} detailLevel={detailLevel} />
                </AutoFitFigure>
              </SculptedFigure>
            </group>
          </ShowcaseRig>
        </Suspense>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.38}
          scale={6.8}
          blur={2.2}
          far={2.4}
          resolution={1024}
          color="#b7a698"
        />

        {qualityMode === "high" ? (
          <Suspense fallback={null}>
            <LazyStagePostFx isInteracting={isInteracting} />
          </Suspense>
        ) : null}

        <OrbitControls
          enabled={!blindboxActive}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          target={orbitTarget}
          minDistance={2.4}
          maxDistance={9.2}
          minPolarAngle={MathUtils.degToRad(18)}
          maxPolarAngle={MathUtils.degToRad(162)}
          rotateSpeed={0.9}
          zoomSpeed={1.45}
          onStart={handleControlStart}
          onEnd={handleControlEnd}
        />
      </Canvas>

      <div className="reboot-stage-overlay">
        <span>{themeDisplay.title}</span>
        <span>{themeDisplay.effectLabel}</span>
        <span>拖拽旋转 / 滚轮缩放</span>
      </div>
    </div>
  );
}

function SculptedFigure({
  characterId,
  recipeKey,
  children,
}: {
  characterId: string;
  recipeKey: string;
  children: ReactNode;
}) {
  const rootRef = useRef<Group>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const profile = getSculptProfile(characterId);
    let meshIndex = 0;

    root.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      const mesh = node as Mesh;
      const source = mesh.geometry;
      if (!source || source.userData.shapeStyled) return;

      const geometry = createDetailGeometry(source);
      const position = geometry.getAttribute("position");
      if (!(position instanceof BufferAttribute)) {
        if (geometry !== source) mesh.geometry = geometry;
        return;
      }

      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox ?? new Box3();
      const spanX = Math.max(0.0001, bbox.max.x - bbox.min.x);
      const spanY = Math.max(0.0001, bbox.max.y - bbox.min.y);
      const spanZ = Math.max(0.0001, bbox.max.z - bbox.min.z);
      const maxSpan = Math.max(spanX, spanY, spanZ);
      const minSpan = Math.min(spanX, spanY, spanZ);
      const count = position.count;

      // Keep tiny details and flat panels crisp; only sculpt major masses.
      if (maxSpan < 0.22 || minSpan < 0.025 || count < 40) {
        if (geometry !== source) mesh.geometry = geometry;
        return;
      }

      const cx = (bbox.min.x + bbox.max.x) * 0.5;
      const cy = (bbox.min.y + bbox.max.y) * 0.5;
      const cz = (bbox.min.z + bbox.max.z) * 0.5;
      const seed = meshIndex * 0.37 + characterId.length * 0.19;
      meshIndex += 1;

      for (let i = 0; i < count; i += 1) {
        let x = position.getX(i);
        let y = position.getY(i);
        let z = position.getZ(i);

        const nx = (x - cx) / spanX;
        const ny01 = (y - bbox.min.y) / spanY;
        const nz = (z - cz) / spanZ;

        const midSoft = 1 - Math.pow(Math.abs(ny01 - 0.5) * 2, 2.2);
        const twist = Math.sin((ny01 + seed) * Math.PI) * profile.twist;
        const sinWarp = Math.sin((ny01 * 1.08 + nx * 0.36 + seed * 0.8) * Math.PI);
        const cosWarp = Math.cos((ny01 * 1.02 + nz * 0.34 + seed * 0.76) * Math.PI);
        const taper = (ny01 - 0.5) * profile.taper * midSoft;
        const bulge = Math.sin((ny01 * 0.88 + 0.16 + seed) * Math.PI) * profile.bulge;
        const angular = profile.angular * midSoft;

        x += sinWarp * spanX * 0.032 * profile.warp * midSoft;
        z += cosWarp * spanZ * 0.032 * profile.warp * midSoft;
        x += Math.sign(nx || 1) * Math.pow(Math.abs(nx), 1.7) * spanX * 0.014 * angular;
        z += Math.sign(nz || 1) * Math.pow(Math.abs(nz), 1.7) * spanZ * 0.014 * angular;

        x += (x - cx) * taper * 0.09;
        z -= (z - cz) * taper * 0.06;
        y += Math.sin((nx * 1.2 + nz * 1.3 + seed) * Math.PI) * spanY * 0.022 * profile.lift * midSoft;

        const rx = x - cx;
        const rz = z - cz;
        const st = Math.sin(twist * 0.32);
        const ct = Math.cos(twist * 0.32);
        x = rx * ct - rz * st + cx;
        z = rx * st + rz * ct + cz;

        _tmpVec.set(x - cx, y - cy, z - cz).normalize();
        x += _tmpVec.x * spanX * bulge * 0.046;
        y += _tmpVec.y * spanY * bulge * 0.044;
        z += _tmpVec.z * spanZ * bulge * 0.046;

        position.setXYZ(i, x, y, z);
      }

      position.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      geometry.userData.shapeStyled = true;
      mesh.geometry = geometry;
    });
  }, [characterId, recipeKey]);

  return <group ref={rootRef}>{children}</group>;
}

function AutoFitFigure({
  characterId,
  recipeKey,
  children,
}: {
  characterId: string;
  recipeKey: string;
  children: ReactNode;
}) {
  const rootRef = useRef<Group>(null);
  const measureBox = useMemo(() => new Box3(), []);
  const measureSize = useMemo(() => new Vector3(), []);
  const currentScaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    currentScaleRef.current = 1;
    targetScaleRef.current = 1;
    root.scale.setScalar(1);

    let rafA = 0;
    let rafB = 0;

    const measure = () => {
      if (!rootRef.current) return;
      measureBox.setFromObject(rootRef.current);
      if (measureBox.isEmpty()) return;
      measureBox.getSize(measureSize);
      const height = Math.max(0.001, measureSize.y);
      targetScaleRef.current = MathUtils.clamp(
        FIGURE_TARGET_HEIGHT / height,
        FIGURE_AUTO_FIT_MIN,
        FIGURE_AUTO_FIT_MAX,
      );
    };

    // Wait for one frame so sculpt/part updates are already applied, then measure twice for stability.
    rafA = window.requestAnimationFrame(() => {
      measure();
      rafB = window.requestAnimationFrame(measure);
    });

    return () => {
      if (rafA) window.cancelAnimationFrame(rafA);
      if (rafB) window.cancelAnimationFrame(rafB);
    };
  }, [characterId, recipeKey, measureBox, measureSize]);

  useFrame((_state, delta) => {
    if (!rootRef.current) return;
    const next = MathUtils.damp(currentScaleRef.current, targetScaleRef.current, 10, delta);
    currentScaleRef.current = next;
    rootRef.current.scale.setScalar(next);
  });

  return <group ref={rootRef}>{children}</group>;
}

function createDetailGeometry(source: BufferGeometry): BufferGeometry {
  const p = (source as unknown as { parameters?: Record<string, number | undefined> }).parameters;
  if (!p) return source.clone();

  if (source.type === "BoxGeometry" && p.width && p.height && p.depth) {
    return new BoxGeometry(p.width, p.height, p.depth, 8, 8, 8);
  }

  if (source.type === "SphereGeometry" && p.radius) {
    const ws = Math.max(28, Number(p.widthSegments ?? 16));
    const hs = Math.max(20, Number(p.heightSegments ?? 12));
    return new SphereGeometry(
      p.radius,
      ws,
      hs,
      Number(p.phiStart ?? 0),
      Number(p.phiLength ?? Math.PI * 2),
      Number(p.thetaStart ?? 0),
      Number(p.thetaLength ?? Math.PI),
    );
  }

  if (source.type === "CylinderGeometry" && p.radiusTop !== undefined && p.radiusBottom !== undefined && p.height) {
    return new CylinderGeometry(
      p.radiusTop,
      p.radiusBottom,
      p.height,
      Math.max(28, Number(p.radialSegments ?? 8)),
      Math.max(8, Number(p.heightSegments ?? 1)),
      Boolean(p.openEnded ?? false),
      Number(p.thetaStart ?? 0),
      Number(p.thetaLength ?? Math.PI * 2),
    );
  }

  if (source.type === "ConeGeometry" && p.radius && p.height) {
    return new ConeGeometry(
      p.radius,
      p.height,
      Math.max(24, Number(p.radialSegments ?? 8)),
      Math.max(8, Number(p.heightSegments ?? 1)),
      Boolean(p.openEnded ?? false),
      Number(p.thetaStart ?? 0),
      Number(p.thetaLength ?? Math.PI * 2),
    );
  }

  if (source.type === "TorusGeometry" && p.radius && p.tube) {
    return new TorusGeometry(
      p.radius,
      p.tube,
      Math.max(16, Number(p.radialSegments ?? 8)),
      Math.max(44, Number(p.tubularSegments ?? 20)),
      Number(p.arc ?? Math.PI * 2),
    );
  }

  return source.clone();
}

function getSculptProfile(characterId: string) {
  if (characterId === "tin-wolf" || characterId === "scrap-crow") {
    return { warp: 0.16, taper: 0.04, twist: 0.02, lift: 0.05, bulge: 0.42, angular: 0.004 };
  }
  if (characterId === "dune-tortle" || characterId === "spore-bear") {
    return { warp: 0.18, taper: 0.05, twist: 0.02, lift: 0.06, bulge: 0.54, angular: 0.003 };
  }
  if (characterId === "cloud-jelly" || characterId === "mirror-snake") {
    return { warp: 0.2, taper: 0.045, twist: 0.04, lift: 0.06, bulge: 0.58, angular: 0.0025 };
  }
  if (characterId === "sugar-lamb" || characterId === "frost-penguin") {
    return { warp: 0.18, taper: 0.04, twist: 0.02, lift: 0.06, bulge: 0.62, angular: 0.002 };
  }
  return { warp: 0.18, taper: 0.05, twist: 0.03, lift: 0.06, bulge: 0.52, angular: 0.003 };
}

function ShowcaseRig({
  children,
  transitionToken,
  effect,
}: {
  children: ReactNode;
  transitionToken: number;
  effect: FigureTheme["effect"];
}) {
  const groupRef = useRef<Group>(null);
  const revealRef = useRef(0);

  useEffect(() => {
    revealRef.current = 0;
  }, [transitionToken, effect]);

  useFrame((state, delta) => {
    void state;
    const nextReveal = MathUtils.damp(revealRef.current, 1, 5.6, delta);
    if (nextReveal > 0.9995) {
      revealRef.current = 1;
    } else {
      revealRef.current = nextReveal;
    }

    const lift = (1 - revealRef.current) * -0.24;
    const settleScale = 0.84 + revealRef.current * 0.16;

    if (!groupRef.current) return;

    groupRef.current.position.y = lift;
    groupRef.current.rotation.y = (1 - revealRef.current) * 0.22;
    groupRef.current.scale.setScalar(settleScale);
  });

  return <group ref={groupRef}>{children}</group>;
}

function SceneLights({
  top,
  bottom,
  glow,
  aura,
  accent,
}: {
  top: string;
  bottom: string;
  glow: string;
  aura: string;
  accent: string;
}) {
  return (
    <>
      <color attach="background" args={[top]} />
      <fog attach="fog" args={[new Color(bottom), 12, 30]} />
      <ambientLight intensity={0.74} color="#fff9f4" />
      <hemisphereLight intensity={0.86} color="#fffdf9" groundColor="#ddcfc5" />
      <spotLight position={[4.6, 7.4, 5.2]} angle={0.46} intensity={1.75} penumbra={1} color="#fff6ed" castShadow />
      <spotLight position={[-4.8, 4.6, 2.8]} angle={0.6} intensity={0.54} penumbra={1} color={top} />
      <pointLight position={[0, 2.8, -2.6]} intensity={0.42} color={glow} />
      <pointLight position={[0.2, 2.1, 3.1]} intensity={0.34} color={aura} />
      <pointLight position={[-0.7, 1.5, 2.6]} intensity={0.24} color={accent} />
      <pointLight position={[0, -0.4, 1.8]} intensity={0.16} color="#fff3ea" />
      <directionalLight position={[0.8, 4.8, 4.4]} intensity={0.34} color="#fffefb" />
      <directionalLight position={[-2.8, 2.6, -1.8]} intensity={0.08} color={aura} />
    </>
  );
}

function AmbientSparkles({
  effect,
  aura,
  glow,
  accent,
}: {
  effect: FigureTheme["effect"];
  aura: string;
  glow: string;
  accent: string;
}) {
  const topRef = useRef<Group>(null);
  const lowRef = useRef<Group>(null);
  const speed = effect === "scan" || effect === "orbit" ? 0.06 : 0.04;

  useFrame((state, delta) => {
      const t = state.clock.elapsedTime;
      if (topRef.current) {
        topRef.current.rotation.y += delta * speed;
      topRef.current.position.y = 1.38 + Math.sin(t * 0.96) * 0.008;
      }
      if (lowRef.current) {
        lowRef.current.rotation.y -= delta * (speed * 0.84);
      lowRef.current.position.y = 0.78 + Math.sin(t * 1.06 + 1.2) * 0.006;
      }
  });

  return (
    <group>
      <group ref={topRef}>
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = (index / 6) * Math.PI * 2;
          const radius = 1 + (index % 2 === 0 ? 0.06 : -0.04);
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <mesh key={`spark-top-${index}`} position={[x, 0, z]}>
              <sphereGeometry args={[index % 2 === 0 ? 0.024 : 0.02, 10, 10]} />
              <meshStandardMaterial
                color={index % 3 === 0 ? glow : aura}
                roughness={0.44}
                metalness={0.03}
                emissive={index % 3 === 0 ? glow : aura}
                emissiveIntensity={0.03}
              />
            </mesh>
          );
        })}
      </group>
      <group ref={lowRef}>
        {[0, 1, 2, 3].map((index) => {
          const angle = (index / 4) * Math.PI * 2 + Math.PI / 4;
          const x = Math.cos(angle) * 0.88;
          const z = Math.sin(angle) * 0.88;
          return (
            <mesh key={`spark-low-${index}`} position={[x, 0, z]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color={accent} roughness={0.46} emissive={accent} emissiveIntensity={0.03} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function DisplayPedestal({
  finishId,
  pedestal,
  aura,
}: {
  finishId: string;
  pedestal: FigureTheme["pedestal"];
  aura: string;
}) {
  const isMech = finishId === "brass-core";
  const topColor = isMech ? "#edf8f7" : "#fff9f1";
  const edgeColor = isMech ? "#c8e2df" : "#f2dccc";
  const baseColor = isMech ? "#dceaea" : "#f3e7de";

  return (
    <group position={[0, -1.2, 0]}>
      {pedestal === "chapel" || pedestal === "cloud" ? (
        <>
          <mesh>
            <cylinderGeometry args={[1.36, 1.52, 0.4, 64]} />
            <meshStandardMaterial color={baseColor} roughness={0.8} metalness={0.04} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.02, 1.08, 0.08, 64]} />
            <meshStandardMaterial color={topColor} roughness={0.48} metalness={0.04} />
          </mesh>
        </>
      ) : pedestal === "bubble" ? (
        <>
          <mesh>
            <cylinderGeometry args={[1.28, 1.42, 0.28, 64]} />
            <meshStandardMaterial color={baseColor} roughness={0.58} metalness={0.04} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <torusGeometry args={[1.04, 0.06, 14, 40]} />
            <meshStandardMaterial color={aura} roughness={0.12} emissive={aura} emissiveIntensity={0.08} />
          </mesh>
        </>
      ) : pedestal === "mech" ? (
        <>
          <mesh>
            <cylinderGeometry args={[1.34, 1.48, 0.28, 8]} />
            <meshStandardMaterial color={baseColor} roughness={0.44} metalness={0.12} />
          </mesh>
          <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 8]}>
            <ringGeometry args={[0.94, 1.16, 8]} />
            <meshStandardMaterial color={edgeColor} roughness={0.22} emissive={aura} emissiveIntensity={0.05} />
          </mesh>
        </>
      ) : pedestal === "dune" ? (
        <>
          <mesh scale={[1.2, 0.34, 1.06]}>
            <sphereGeometry args={[1.24, 32, 18]} />
            <meshStandardMaterial color={baseColor} roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.92, 1.14, 48]} />
            <meshStandardMaterial color={edgeColor} roughness={0.58} />
          </mesh>
        </>
      ) : pedestal === "orbit" ? (
        <>
          <mesh>
            <cylinderGeometry args={[1.22, 1.34, 0.26, 48]} />
            <meshStandardMaterial color={baseColor} roughness={0.46} metalness={0.08} />
          </mesh>
          <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0.1, 0]}>
            <torusGeometry args={[1.02, 0.04, 10, 36]} />
            <meshStandardMaterial color={aura} roughness={0.12} emissive={aura} emissiveIntensity={0.08} />
          </mesh>
        </>
      ) : pedestal === "dessert" ? (
        <>
          <mesh>
            <cylinderGeometry args={[1.32, 1.42, 0.24, 64]} />
            <meshStandardMaterial color={baseColor} roughness={0.56} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[1.04, 1.1, 0.1, 64]} />
            <meshStandardMaterial color={topColor} roughness={0.26} />
          </mesh>
        </>
      ) : (
        <>
          <mesh>
            <cylinderGeometry args={[1.42, 1.52, 0.32, 64]} />
            <meshStandardMaterial color={baseColor} roughness={0.82} metalness={0.04} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[1.1, 1.16, 0.08, 64]} />
            <meshStandardMaterial color={topColor} roughness={0.52} metalness={0.04} />
          </mesh>
        </>
      )}
      <mesh position={[0, 0.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.12, 1.24, 64]} />
        <meshStandardMaterial
          color={edgeColor}
          roughness={0.28}
          emissive={topColor}
          emissiveIntensity={0.04}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </group>
  );
}

function ThemeFx({
  effect,
  aura,
  glow,
  accent,
}: {
  effect: FigureTheme["effect"];
  aura: string;
  glow: string;
  accent: string;
}) {
  const fxRef = useRef<Group>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    const node = fxRef.current;
    if (!node) return;
    const t = state.clock.elapsedTime + phaseRef.current;
    const spinSpeed =
      effect === "scan" || effect === "orbit" ? 0.14 : effect === "bells" || effect === "sprinkles" ? 0.1 : 0.06;
    node.rotation.y += delta * spinSpeed;
    node.position.y = Math.sin(t * 1.1) * 0.014;
    node.rotation.z = Math.sin(t * 0.5) * 0.006;
  });

  if (effect === "shards") {
    return (
      <group ref={fxRef}>
        {[-0.82, -0.42, 0.4, 0.82].map((x, index) => (
          <mesh key={`fx-shard-${index}`} position={[x, 1.9 + index * 0.18, -0.42]} rotation={[0, 0, index % 2 === 0 ? 0.2 : -0.2]}>
            <boxGeometry args={[0.08, 0.34, 0.02]} />
            <meshStandardMaterial color={aura} roughness={0.12} emissive={aura} emissiveIntensity={0.08} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "bubbles") {
    return (
      <group ref={fxRef}>
        {[
          [-0.94, 0.4, 0.2],
          [-0.74, 1.12, -0.1],
          [0.84, 0.7, 0.16],
          [0.98, 1.42, -0.18],
        ].map((position, index) => (
          <mesh key={`fx-bubble-${index}`} position={position as [number, number, number]}>
            <sphereGeometry args={[index % 2 === 0 ? 0.1 : 0.06, 14, 14]} />
            <meshStandardMaterial color={aura} transparent opacity={0.54} roughness={0.08} depthWrite={false} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "tags") {
    return (
      <group ref={fxRef}>
        {[-0.82, 0.82].map((x, index) => (
          <mesh key={`fx-tag-${index}`} position={[x, 1.34, -0.36]} rotation={[0.1, 0, index === 0 ? 0.2 : -0.2]}>
            <boxGeometry args={[0.18, 0.26, 0.02]} />
            <meshStandardMaterial color={aura} roughness={0.28} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "scan") {
    return (
      <group ref={fxRef}>
        <mesh position={[0, 1.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.18, 1.24, 48]} />
          <meshStandardMaterial color={aura} roughness={0.12} emissive={aura} emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[0, 1.78, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.72, 0.76, 48]} />
          <meshStandardMaterial color={accent} roughness={0.12} emissive={accent} emissiveIntensity={0.08} />
        </mesh>
      </group>
    );
  }

  if (effect === "sand") {
    return (
      <group ref={fxRef}>
        {[-0.82, -0.26, 0.3, 0.82].map((x, index) => (
          <mesh key={`fx-sand-${index}`} position={[x, 0.12 + index * 0.08, -0.12]}>
            <coneGeometry args={[0.08 + index * 0.02, 0.22 + index * 0.04, 5]} />
            <meshStandardMaterial color={aura} roughness={0.84} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "orbit") {
    return (
      <group ref={fxRef}>
        <mesh position={[0, 1.58, 0]} rotation={[Math.PI / 2, 0.26, 0]}>
          <torusGeometry args={[1.06, 0.03, 10, 36]} />
          <meshStandardMaterial color={aura} roughness={0.12} emissive={aura} emissiveIntensity={0.08} />
        </mesh>
        <mesh position={[0, 1.78, 0]} rotation={[0.36, 0, 0.28]}>
          <torusGeometry args={[0.84, 0.02, 8, 28]} />
          <meshStandardMaterial color={glow} roughness={0.12} emissive={glow} emissiveIntensity={0.08} />
        </mesh>
      </group>
    );
  }

  if (effect === "sprinkles") {
    return (
      <group ref={fxRef}>
        {[
          [-0.72, 1.82, 0.08],
          [-0.36, 2.18, -0.1],
          [0.42, 2.12, 0.1],
          [0.82, 1.76, -0.08],
        ].map((position, index) => (
          <mesh key={`fx-sprinkle-${index}`} position={position as [number, number, number]} rotation={[0, 0, index * 0.5]}>
            <boxGeometry args={[0.18, 0.04, 0.04]} />
            <meshStandardMaterial color={index % 2 === 0 ? aura : glow} roughness={0.18} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "fog") {
    return (
      <group ref={fxRef}>
        {[
          [-0.84, 1.24, -0.14],
          [-0.66, 1.82, 0.14],
          [0.76, 1.42, 0.12],
          [0.92, 1.98, -0.08],
        ].map((position, index) => (
          <mesh key={`fx-fog-${index}`} position={position as [number, number, number]}>
            <sphereGeometry args={[index % 2 === 0 ? 0.16 : 0.12, 16, 16]} />
            <meshStandardMaterial color={aura} transparent opacity={0.4} roughness={0.08} depthWrite={false} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "spores") {
    return (
      <group ref={fxRef}>
        {[
          [-0.82, 1.24, 0.12],
          [-0.62, 1.92, -0.16],
          [0.7, 1.54, 0.14],
          [0.92, 2, -0.08],
        ].map((position, index) => (
          <mesh key={`fx-spore-${index}`} position={position as [number, number, number]}>
            <sphereGeometry args={[index % 2 === 0 ? 0.08 : 0.06, 12, 12]} />
            <meshStandardMaterial color={glow} roughness={0.18} emissive={glow} emissiveIntensity={0.1} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "scraps") {
    return (
      <group ref={fxRef}>
        {[
          [-0.8, 1.08, -0.18],
          [-0.46, 1.86, 0.12],
          [0.52, 1.74, -0.12],
          [0.88, 1.16, 0.1],
        ].map((position, index) => (
          <mesh key={`fx-scrap-${index}`} position={position as [number, number, number]} rotation={[0.2, 0.2, index * 0.4]}>
            <boxGeometry args={[0.18, 0.06, 0.02]} />
            <meshStandardMaterial color={aura} roughness={0.24} metalness={0.12} />
          </mesh>
        ))}
      </group>
    );
  }

  if (effect === "bells") {
    return (
      <group ref={fxRef}>
        {[
          [-0.76, 1.44, 0.18],
          [-0.32, 2.02, -0.12],
          [0.46, 1.96, 0.14],
          [0.86, 1.38, -0.1],
        ].map((position, index) => (
          <mesh key={`fx-bell-${index}`} position={position as [number, number, number]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color={aura} roughness={0.18} metalness={0.14} emissive={aura} emissiveIntensity={0.06} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={fxRef}>
      <mesh position={[0, 1.88, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.94, 1.02, 40]} />
        <meshStandardMaterial color={aura} roughness={0.12} emissive={aura} emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 2.22, -0.1]} rotation={[0.36, 0, 0]}>
        <torusGeometry args={[0.52, 0.02, 8, 24]} />
        <meshStandardMaterial color={glow} roughness={0.12} emissive={glow} emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}





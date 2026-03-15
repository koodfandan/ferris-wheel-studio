import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
  RoundedBox,
  Sphere,
  Torus,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import type {
  Group,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Vector3Tuple,
} from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { FigureConfig } from "../../lib/config";

type Props = {
  config: FigureConfig;
};

type ViewPreset = "front" | "back" | "left" | "right" | "top";

const PRESET_POSITIONS: Record<ViewPreset, Vector3Tuple> = {
  front: [0, 1.25, 9.5],
  back: [0, 1.25, -9.5],
  left: [-9.5, 1.1, 0],
  right: [9.5, 1.1, 0],
  top: [0, 9.4, 0.1],
};

function lightColors(mode: FigureConfig["lightMode"]) {
  if (mode === "blue") {
    return {
      glow: "#7db5ff",
      accent: "#a9cdff",
      rim: "#eff6ff",
      bg: "#edf5ff",
    };
  }
  if (mode === "rose") {
    return {
      glow: "#ff9b94",
      accent: "#ffd1d1",
      rim: "#fff4f5",
      bg: "#fff1f0",
    };
  }
  return {
    glow: "#ffd97c",
    accent: "#ffe7af",
    rim: "#fffaf0",
    bg: "#fff7e8",
  };
}

function FigureModel({ config }: Props) {
  const wheelRef = useRef<Group>(null);
  const characterRef = useRef<Group>(null);
  const turntableRef = useRef<Group>(null);
  const baseMaterial = useRef<MeshPhysicalMaterial>(null);
  const colors = useMemo(() => lightColors(config.lightMode), [config.lightMode]);
  const cabinCount = config.cabinCount;
  const ringScale = config.ringSize / 100;
  const headScale = config.headScale / 100;
  const glowIntensity = config.glowStrength / 100;
  const dragState = useRef({
    down: false,
    x: 0,
    velocity: 0,
    angle: 0,
  });

  useFrame((state, delta) => {
    if (config.spinEnabled && wheelRef.current) {
      wheelRef.current.rotation.z += delta * 0.18;
    }

    if (!dragState.current.down) {
      dragState.current.angle += dragState.current.velocity;
      dragState.current.velocity *= 0.92;
      if (config.viewMode === "showcase") {
        dragState.current.angle += delta * 0.22;
      }
    }

    if (turntableRef.current) {
      turntableRef.current.rotation.y +=
        (dragState.current.angle - turntableRef.current.rotation.y) * 0.12;
    }

    if (characterRef.current) {
      characterRef.current.position.y = config.floatEnabled
        ? Math.sin(state.clock.elapsedTime * 1.4) * 0.05 + 0.48
        : 0.48;
    }

    if (baseMaterial.current) {
      baseMaterial.current.emissiveIntensity = glowIntensity * 0.18;
    }
  });

  return (
    <>
      <color attach="background" args={[colors.bg]} />
      <fog attach="fog" args={[colors.bg, 8, 18]} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[6.4, 7.2, 5.2]} intensity={2.3} color="#fff9f1" />
      <directionalLight position={[-4.6, 2.8, 4.6]} intensity={0.95} color={colors.accent} />
      <directionalLight position={[0, 2.4, -5]} intensity={1.25} color="#fff3ef" />
      <pointLight position={[0, 2.4, 2.1]} intensity={9.5 * glowIntensity} color={colors.glow} />
      <pointLight position={[0, -0.8, 1.5]} intensity={2.2} color="#fff8ef" />

      <group
        ref={turntableRef}
        position={[0, -1.2, 0]}
        onPointerDown={(event: ThreeEvent<PointerEvent>) => {
          dragState.current.down = true;
          dragState.current.x = event.clientX;
          dragState.current.velocity = 0;
        }}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          if (!dragState.current.down) return;
          const dx = event.clientX - dragState.current.x;
          dragState.current.x = event.clientX;
          dragState.current.angle += dx * 0.01;
          dragState.current.velocity = dx * 0.0018;
        }}
        onPointerUp={() => {
          dragState.current.down = false;
        }}
        onPointerOut={() => {
          dragState.current.down = false;
        }}
      >
        <RoundedBox args={[4.7, 1.2, 4.1]} radius={0.22} smoothness={6} position={[0, -1.55, 0]}>
          <meshPhysicalMaterial
            ref={baseMaterial}
            color="#f7efe5"
            emissive={colors.glow}
            metalness={0.05}
            roughness={0.28}
            clearcoat={0.45}
            clearcoatRoughness={0.22}
          />
        </RoundedBox>

        <mesh position={[0, -1.02, 0]}>
          <boxGeometry args={[3.6, 0.12, 2.6]} />
          <meshStandardMaterial color="#fffdf8" emissive={colors.glow} emissiveIntensity={0.18 * glowIntensity} />
        </mesh>
        <mesh position={[0, -1.15, 0]} rotation={[-0.03, 0, 0]}>
          <cylinderGeometry args={[1.84, 1.92, 0.18, 40]} />
          <meshPhysicalMaterial color="#e8d7c8" metalness={0.16} roughness={0.28} clearcoat={0.35} />
        </mesh>
        <mesh position={[0, -1.04, 0]}>
          <torusGeometry args={[1.5, 0.05, 14, 40]} />
          <meshStandardMaterial
            color={colors.glow}
            emissive={colors.glow}
            emissiveIntensity={0.45 * glowIntensity}
          />
        </mesh>

        <mesh position={[0, -1.05, -1.22]}>
          <boxGeometry args={[2.4, 0.26, 0.16]} />
          <meshStandardMaterial color="#ebddd0" metalness={0.08} roughness={0.4} />
        </mesh>
        <mesh position={[0, -1.02, 1.18]}>
          <boxGeometry args={[1.9, 0.18, 0.1]} />
          <meshStandardMaterial color="#f5ece3" roughness={0.38} metalness={0.08} />
        </mesh>
        <mesh position={[-1.06, -1.01, 0]}>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.4 * glowIntensity} />
        </mesh>
        <mesh position={[1.06, -1.01, 0]}>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.4 * glowIntensity} />
        </mesh>

        <mesh position={[-1.03, -0.18, 0]} rotation={[0, 0, -0.42]}>
          <cylinderGeometry args={[0.1, 0.12, 2.7, 24]} />
          <meshStandardMaterial color="#f3ece3" metalness={0.18} roughness={0.22} />
        </mesh>
        <mesh position={[1.03, -0.18, 0]} rotation={[0, 0, 0.42]}>
          <cylinderGeometry args={[0.1, 0.12, 2.7, 24]} />
          <meshStandardMaterial color="#f3ece3" metalness={0.18} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[1.9, 0.08, 0.2]} />
          <meshStandardMaterial color="#f4ede3" metalness={0.2} roughness={0.25} />
        </mesh>
      </group>

      <group ref={wheelRef} position={[0, 0.9, 0]} scale={ringScale}>
        <Torus args={[2.15, 0.28, 32, 180]} position={[0, 0, -0.16]}>
          <meshPhysicalMaterial color="#d9c5a8" metalness={0.4} roughness={0.16} clearcoat={0.5} />
        </Torus>
        <Torus args={[2.15, 0.22, 32, 180]}>
          <meshPhysicalMaterial color="#ead7bc" metalness={0.46} roughness={0.14} clearcoat={0.62} />
        </Torus>

        <Torus args={[2.15, 0.13, 24, 180]}>
          <meshPhysicalMaterial
            color={colors.rim}
            emissive={colors.glow}
            emissiveIntensity={0.5 * glowIntensity}
            metalness={0.14}
            roughness={0.08}
            clearcoat={0.9}
            clearcoatRoughness={0.08}
          />
        </Torus>
        <Torus args={[1.7, 0.03, 12, 120]}>
          <meshPhysicalMaterial color="#f6eee2" metalness={0.5} roughness={0.1} clearcoat={0.8} />
        </Torus>

        {Array.from({ length: 10 }, (_, index) => {
          const angle = (index / 10) * Math.PI * 2;
          return (
            <group key={`ornament-${index}`} rotation={[0, 0, angle]}>
              <mesh position={[0, 2.15, 0]}>
                <sphereGeometry args={[0.07, 20, 20]} />
                <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={1.4 * glowIntensity} />
              </mesh>
            </group>
          );
        })}

        {Array.from({ length: cabinCount }, (_, index) => {
          const angle = (index / cabinCount) * Math.PI * 2;
          return (
            <group key={`cabin-${index}`} rotation={[0, 0, angle]}>
              <mesh position={[0, 2.15, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.42, 12]} />
                <meshStandardMaterial color="#e6d6c0" />
              </mesh>
              <group position={[0, 2.55, 0]}>
                <RoundedBox args={[0.54, 0.68, 0.5]} radius={0.12} smoothness={6}>
                  <meshPhysicalMaterial color="#fff5e7" roughness={0.14} metalness={0.04} clearcoat={0.72} />
                </RoundedBox>
                <RoundedBox args={[0.48, 0.62, 0.08]} radius={0.08} smoothness={4} position={[0, 0.02, -0.24]}>
                  <meshPhysicalMaterial color="#e9d6bf" roughness={0.22} metalness={0.16} clearcoat={0.28} />
                </RoundedBox>
                <mesh position={[0, 0.12, -0.3]}>
                  <torusGeometry args={[0.08, 0.018, 8, 18]} />
                  <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.38 * glowIntensity} />
                </mesh>
                <RoundedBox args={[0.42, 0.46, 0.5]} radius={0.1} smoothness={4} position={[0, 0.02, 0.02]}>
                  <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.4}
                    roughness={0.08}
                    transmission={0.96}
                    chromaticAberration={0.02}
                    anisotropy={0.05}
                    color={colors.accent}
                  />
                </RoundedBox>
                <Sphere args={[0.11, 24, 24]} position={[0, 0.02, 0.28]}>
                  <meshPhysicalMaterial color="#fff8f0" roughness={0.52} sheen={0.4} sheenColor="#fff2ea" />
                </Sphere>
                <mesh position={[-0.04, 0.04, 0.39]}>
                  <sphereGeometry args={[0.012, 10, 10]} />
                  <meshStandardMaterial color="#2f2322" />
                </mesh>
                <mesh position={[0.04, 0.04, 0.39]}>
                  <sphereGeometry args={[0.012, 10, 10]} />
                  <meshStandardMaterial color="#2f2322" />
                </mesh>
              </group>
            </group>
          );
        })}

        <Sphere args={[0.42, 36, 36]}>
          <meshStandardMaterial
            color={colors.rim}
            emissive={colors.glow}
            emissiveIntensity={0.8 * glowIntensity}
            metalness={0.16}
            roughness={0.18}
          />
        </Sphere>
      </group>

      <group ref={characterRef} position={[0, 0.48, 0.42]} scale={headScale}>
        <group position={[0, 1.28, -0.08]}>
          <Sphere args={[0.38, 32, 32]} position={[-0.3, 0.1, 0]}>
            <meshPhysicalMaterial color="#ffffff" roughness={0.24} clearcoat={0.45} />
          </Sphere>
          <Sphere args={[0.52, 36, 36]} position={[0, 0.05, 0]}>
            <meshPhysicalMaterial color="#ffffff" roughness={0.24} clearcoat={0.45} />
          </Sphere>
          <Sphere args={[0.34, 32, 32]} position={[0.34, 0.06, 0]}>
            <meshPhysicalMaterial color="#ffffff" roughness={0.24} clearcoat={0.45} />
          </Sphere>
          <mesh position={[0, -0.06, 0.22]} rotation={[0.22, 0, 0]}>
            <torusGeometry args={[0.42, 0.04, 14, 28, Math.PI]} />
            <meshStandardMaterial color="#d8e6fb" roughness={0.3} />
          </mesh>
        </group>

        <Sphere args={[0.95, 48, 48]} position={[0, 0.72, 0]}>
          <meshPhysicalMaterial color="#fff7ef" roughness={0.56} clearcoat={0.18} sheen={0.55} sheenColor="#fff0ea" />
        </Sphere>
        <Sphere args={[0.22, 24, 24]} position={[-0.5, 1.28, -0.05]}>
          <meshPhysicalMaterial color="#fff7ef" roughness={0.58} sheen={0.4} sheenColor="#fff2ea" />
        </Sphere>
        <Sphere args={[0.22, 24, 24]} position={[0.5, 1.28, -0.05]}>
          <meshPhysicalMaterial color="#fff7ef" roughness={0.58} sheen={0.4} sheenColor="#fff2ea" />
        </Sphere>
        <mesh position={[0, 1.02, 0.48]} rotation={[0.16, 0, 0]}>
          <sphereGeometry args={[0.58, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshPhysicalMaterial color="#f4e0d2" roughness={0.42} clearcoat={0.24} sheen={0.5} sheenColor="#ffe8dd" />
        </mesh>
        <mesh position={[0, 0.92, 0.74]} rotation={[0.18, 0, 0]}>
          <torusGeometry args={[0.34, 0.035, 12, 32, Math.PI]} />
          <meshPhysicalMaterial color="#d8c1b1" roughness={0.24} metalness={0.12} clearcoat={0.28} />
        </mesh>

        <mesh position={[-0.26, 0.8, 0.8]}>
          <sphereGeometry args={[0.11, 18, 18]} />
          <meshStandardMaterial color="#231d1d" />
        </mesh>
        <mesh position={[0.26, 0.8, 0.8]}>
          <sphereGeometry args={[0.11, 18, 18]} />
          <meshStandardMaterial color="#231d1d" />
        </mesh>
        <mesh position={[-0.22, 0.85, 0.88]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.3, 0.85, 0.88]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.43, 0.48, 0.84]}>
          <sphereGeometry args={[0.09, 18, 18]} />
          <meshStandardMaterial color="#f5b8b7" transparent opacity={0.48} />
        </mesh>
        <mesh position={[0.43, 0.48, 0.84]}>
          <sphereGeometry args={[0.09, 18, 18]} />
          <meshStandardMaterial color="#f5b8b7" transparent opacity={0.48} />
        </mesh>
        <mesh position={[0, 0.56, 0.9]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color="#9b7f74" />
        </mesh>
        <mesh position={[-0.26, 0.98, 0.88]} rotation={[0, 0, -0.12]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#fff7ef" />
        </mesh>
        <mesh position={[0.26, 0.98, 0.88]} rotation={[0, 0, 0.12]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#fff7ef" />
        </mesh>
        <mesh position={[0, 0.34, 0.88]} rotation={[0.8, 0, 0]}>
          <torusGeometry args={[0.11, 0.015, 8, 30, Math.PI]} />
          <meshStandardMaterial color="#7f635a" />
        </mesh>
        <mesh position={[-0.38, 0.34, 0.86]} rotation={[0, 0, -0.3]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#f9c8c7" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.38, 0.34, 0.86]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#f9c8c7" transparent opacity={0.55} />
        </mesh>

        <RoundedBox args={[0.92, 0.92, 0.74]} radius={0.24} smoothness={6} position={[0, -0.2, 0]}>
          <meshPhysicalMaterial color="#f6e2d8" roughness={0.38} clearcoat={0.2} sheen={0.75} sheenColor="#ffe7df" />
        </RoundedBox>
        <mesh position={[-0.38, -0.12, 0.14]} rotation={[0, 0, -0.35]}>
          <sphereGeometry args={[0.16, 18, 18]} />
          <meshPhysicalMaterial color="#fff7ef" roughness={0.48} sheen={0.45} sheenColor="#fff2ea" />
        </mesh>
        <mesh position={[0.38, -0.12, 0.14]} rotation={[0, 0, 0.35]}>
          <sphereGeometry args={[0.16, 18, 18]} />
          <meshPhysicalMaterial color="#fff7ef" roughness={0.48} sheen={0.45} sheenColor="#fff2ea" />
        </mesh>
        <mesh position={[-0.18, -0.72, 0.18]}>
          <sphereGeometry args={[0.12, 18, 18]} />
          <meshPhysicalMaterial color="#f8efe6" roughness={0.34} clearcoat={0.16} />
        </mesh>
        <mesh position={[0.18, -0.72, 0.18]}>
          <sphereGeometry args={[0.12, 18, 18]} />
          <meshPhysicalMaterial color="#f8efe6" roughness={0.34} clearcoat={0.16} />
        </mesh>
        <RoundedBox args={[0.54, 0.2, 0.18]} radius={0.06} smoothness={4} position={[0, -0.28, -0.34]}>
          <meshPhysicalMaterial color="#fff1ea" roughness={0.22} clearcoat={0.42} />
        </RoundedBox>

        <mesh position={[0, -0.04, -0.48]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.14, 0.04, 12, 20]} />
          <meshPhysicalMaterial color="#ef8d85" roughness={0.18} clearcoat={0.55} />
        </mesh>
        <mesh position={[0, -0.22, -0.5]}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshPhysicalMaterial color="#ef6d63" roughness={0.16} clearcoat={0.6} />
        </mesh>
        <mesh position={[-0.12, -0.44, -0.42]} rotation={[0.4, 0.2, -0.08]}>
          <boxGeometry args={[0.06, 0.28, 0.02]} />
          <meshPhysicalMaterial color="#f39c94" roughness={0.22} clearcoat={0.52} />
        </mesh>
        <mesh position={[0.12, -0.44, -0.42]} rotation={[0.4, -0.2, 0.08]}>
          <boxGeometry args={[0.06, 0.28, 0.02]} />
          <meshPhysicalMaterial color="#f39c94" roughness={0.22} clearcoat={0.52} />
        </mesh>
        <mesh position={[0, -0.62, -0.44]}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshPhysicalMaterial
            color={colors.glow}
            emissive={colors.glow}
            emissiveIntensity={0.55 * glowIntensity}
            roughness={0.08}
            clearcoat={0.85}
          />
        </mesh>

        <mesh position={[-0.18, 0.08, 0.55]} rotation={[0, 0, -0.4]}>
          <sphereGeometry args={[0.16, 18, 18]} />
          <meshPhysicalMaterial color="#ff8f86" roughness={0.18} clearcoat={0.65} />
        </mesh>
        <mesh position={[0.18, 0.08, 0.55]} rotation={[0, 0, 0.4]}>
          <sphereGeometry args={[0.16, 18, 18]} />
          <meshPhysicalMaterial color="#ff8f86" roughness={0.18} clearcoat={0.65} />
        </mesh>
        <mesh position={[0, 0.06, 0.58]}>
          <sphereGeometry args={[0.09, 18, 18]} />
          <meshPhysicalMaterial color="#ef6d63" roughness={0.12} clearcoat={0.72} />
        </mesh>
      </group>

      <ContactShadows position={[0, -2.2, 0]} opacity={0.32} blur={2.2} scale={8} far={3.4} />
    </>
  );
}

function CameraRig({
  config,
  activeView,
  controlsRef,
}: {
  config: FigureConfig;
  activeView: ViewPreset;
  controlsRef: MutableRefObject<any>;
}) {
  const camera = useThree((state) => state.camera as PerspectiveCamera);

  useEffect(() => {
    const [x, y, z] = PRESET_POSITIONS[activeView];
    camera.position.set(x, y, z);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.update();
    }
  }, [activeView, camera, controlsRef]);

  useFrame((_, delta) => {
    if (config.viewMode !== "showcase") return;
    const radius = 9.5;
    const angle = Math.atan2(camera.position.z, camera.position.x) + delta * 0.22;
    const nextX = Math.cos(angle) * radius;
    const nextZ = Math.sin(angle) * radius;
    camera.position.x += (nextX - camera.position.x) * 0.06;
    camera.position.z += (nextZ - camera.position.z) * 0.06;
    camera.position.y += (1.3 - camera.position.y) * 0.08;
    camera.lookAt(0, 0.8, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.update();
    }
  });

  return null;
}

export function FigureCanvas({ config }: Props) {
  const controlsRef = useRef<any>(null);
  const [activeView, setActiveView] = useState<ViewPreset>("front");
  const isInspect = config.viewMode === "inspect";

  useEffect(() => {
    if (config.viewMode === "showcase") {
      setActiveView("front");
    }
  }, [config.viewMode]);

  return (
    <div className="canvas-shell">
      <div className="canvas-toolbar">
        <div className="canvas-mode">{isInspect ? "Free 360 Drag" : "Showcase 360"}</div>
        {!isInspect && (
          <div className="canvas-views">
            {(["front", "back", "left", "right", "top"] as ViewPreset[]).map((view) => (
              <button
                key={view}
                className={activeView === view ? "is-active" : ""}
                type="button"
                onClick={() => setActiveView(view)}
              >
                {view}
              </button>
            ))}
            <button type="button" onClick={() => setActiveView("front")}>
              reset
            </button>
          </div>
        )}
      </div>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.25, 9.5], fov: 32 }}>
        <group scale={0.76}>
          <FigureModel config={config} />
        </group>
        <CameraRig config={config} activeView={activeView} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={7.1}
          maxDistance={14}
          minPolarAngle={0.35}
          maxPolarAngle={2.55}
          enableRotate={config.viewMode === "inspect"}
          enableZoom
          enableDamping
          dampingFactor={0.12}
          rotateSpeed={0.42}
        />
        <Environment preset="sunset" />
        <EffectComposer multisampling={4}>
          <Bloom intensity={0.75} luminanceThreshold={0.72} luminanceSmoothing={0.18} />
          <Vignette eskil={false} offset={0.1} darkness={0.18} />
        </EffectComposer>
      </Canvas>
      <div className="canvas-hint">
        <span>{isInspect ? "Drag the figure to spin it in 360" : "Showcase runs like a product turntable"}</span>
        <span>{isInspect ? "Scroll to zoom into details" : "Switch to Inspect for manual spin"}</span>
      </div>
    </div>
  );
}

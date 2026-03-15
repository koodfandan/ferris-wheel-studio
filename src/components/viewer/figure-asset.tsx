import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Box,
  Cylinder,
  MeshTransmissionMaterial,
  RoundedBox,
  Sphere,
  Torus,
  useGLTF,
} from "@react-three/drei";
import { Box3, Vector3 } from "three";
import type { Group, MeshPhysicalMaterial, Object3D } from "three";
import type { FigureConfig } from "../../lib/config";
import { prepareGlbScene } from "../../lib/glb-scene";

const MODEL_URL = "/models/dream-fair-wheel.glb";

export type AssetAvailability = {
  kind: "placeholder" | "bundle" | "local";
  label: string;
};

function lightColors(mode: FigureConfig["lightMode"]) {
  if (mode === "blue") {
    return { glow: "#7db5ff", accent: "#a9cdff", rim: "#eff6ff" };
  }
  if (mode === "rose") {
    return { glow: "#ff9b94", accent: "#ffd1d1", rim: "#fff4f5" };
  }
  return { glow: "#ffd97c", accent: "#ffe7af", rim: "#fffaf0" };
}

function GlbFigureAsset({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const preparedScene = useMemo(() => normalizeGlbScene(scene.clone(true)), [scene]);
  return <primitive object={preparedScene} />;
}

function normalizeGlbScene(scene: Object3D) {
  const preparedScene = prepareGlbScene(scene);
  const box = new Box3().setFromObject(preparedScene);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  const targetHeight = 4.8;
  const scale = size.y > 0 ? targetHeight / size.y : 1;

  preparedScene.scale.setScalar(scale);
  preparedScene.position.set(-center.x * scale, -box.min.y * scale - 1.12, -center.z * scale);
  preparedScene.updateMatrixWorld(true);

  return preparedScene;
}

function PlaceholderFigureAsset({ config }: { config: FigureConfig }) {
  const wheelRef = useRef<Group>(null);
  const characterRef = useRef<Group>(null);
  const baseMaterial = useRef<MeshPhysicalMaterial>(null);
  const colors = useMemo(() => lightColors(config.lightMode), [config.lightMode]);
  const cabinCount = config.cabinCount;
  const ringScale = config.ringSize / 100;
  const headScale = config.headScale / 100;
  const glowIntensity = config.glowStrength / 100;

  useFrame((state, delta) => {
    if (config.spinEnabled && wheelRef.current) {
      wheelRef.current.rotation.z += delta * 0.18;
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
      <group position={[0, -1.12, 0]}>
        <RoundedBox args={[4.9, 1.12, 4.22]} radius={0.24} smoothness={6} position={[0, -1.58, 0]}>
          <meshPhysicalMaterial
            ref={baseMaterial}
            color="#fbf1e6"
            emissive={colors.glow}
            metalness={0.05}
            roughness={0.24}
            clearcoat={0.45}
            clearcoatRoughness={0.18}
          />
        </RoundedBox>
        <mesh position={[0, -1.04, 0]}>
          <cylinderGeometry args={[1.92, 2.04, 0.22, 40]} />
          <meshPhysicalMaterial color="#f0decb" metalness={0.12} roughness={0.24} clearcoat={0.44} />
        </mesh>
        <mesh position={[0, -0.93, 0]}>
          <cylinderGeometry args={[1.62, 1.62, 0.08, 40]} />
          <meshStandardMaterial color="#fffaf3" emissive={colors.glow} emissiveIntensity={0.22 * glowIntensity} />
        </mesh>
        <mesh position={[0, -0.98, 0]}>
          <torusGeometry args={[1.42, 0.05, 14, 40]} />
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.5 * glowIntensity} />
        </mesh>
        <RoundedBox args={[2.54, 0.3, 0.18]} radius={0.08} smoothness={4} position={[0, -1.04, -1.22]}>
          <meshStandardMaterial color="#eadacc" metalness={0.08} roughness={0.36} />
        </RoundedBox>
        <mesh position={[0, -0.92, -1.32]}>
          <torusGeometry args={[0.12, 0.02, 8, 20]} />
          <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.42 * glowIntensity} />
        </mesh>
      </group>

      <group position={[0, 0.08, -0.52]}>
        <group position={[-1.68, -0.52, 0]} rotation={[0, 0, 0.34]}>
          <Cylinder args={[0.08, 0.11, 2.56, 16]}>
            <meshPhysicalMaterial color="#ead7bf" metalness={0.24} roughness={0.2} clearcoat={0.55} />
          </Cylinder>
        </group>
        <group position={[1.68, -0.52, 0]} rotation={[0, 0, -0.34]}>
          <Cylinder args={[0.08, 0.11, 2.56, 16]}>
            <meshPhysicalMaterial color="#ead7bf" metalness={0.24} roughness={0.2} clearcoat={0.55} />
          </Cylinder>
        </group>
        <mesh position={[0, 0.62, -0.06]}>
          <boxGeometry args={[2.44, 0.12, 0.12]} />
          <meshPhysicalMaterial color="#f0dfca" metalness={0.2} roughness={0.24} clearcoat={0.48} />
        </mesh>
      </group>

      <group ref={wheelRef} position={[0, 0.55, -0.56]} scale={ringScale * 0.86}>
        <Torus args={[2.08, 0.26, 32, 180]} position={[0, 0, -0.18]}>
          <meshPhysicalMaterial color="#d8c09c" metalness={0.42} roughness={0.15} clearcoat={0.52} />
        </Torus>
        <Torus args={[2.08, 0.18, 32, 180]}>
          <meshPhysicalMaterial color="#f4e4cf" metalness={0.32} roughness={0.12} clearcoat={0.74} />
        </Torus>
        <Torus args={[2.08, 0.1, 24, 180]}>
          <meshPhysicalMaterial
            color={colors.rim}
            emissive={colors.glow}
            emissiveIntensity={0.42 * glowIntensity}
            metalness={0.12}
            roughness={0.06}
            clearcoat={0.95}
            clearcoatRoughness={0.05}
          />
        </Torus>
        {Array.from({ length: cabinCount }, (_, index) => {
          const angle = (index / cabinCount) * Math.PI * 2;
          return (
            <group key={index} rotation={[0, 0, angle]}>
              <mesh position={[0, 2.08, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.42, 12]} />
                <meshStandardMaterial color="#e6d6c0" />
              </mesh>
              <group position={[0, 2.42, 0]}>
                <RoundedBox args={[0.46, 0.58, 0.42]} radius={0.12} smoothness={6}>
                  <meshPhysicalMaterial color="#fff5ea" roughness={0.14} metalness={0.04} clearcoat={0.72} />
                </RoundedBox>
                <RoundedBox args={[0.4, 0.52, 0.08]} radius={0.08} smoothness={4} position={[0, 0.02, -0.2]}>
                  <meshPhysicalMaterial color="#e9d6bf" roughness={0.22} metalness={0.16} clearcoat={0.28} />
                </RoundedBox>
                <mesh position={[0, 0.1, -0.26]}>
                  <torusGeometry args={[0.08, 0.018, 8, 18]} />
                  <meshStandardMaterial color={colors.glow} emissive={colors.glow} emissiveIntensity={0.38 * glowIntensity} />
                </mesh>
                <RoundedBox args={[0.34, 0.38, 0.38]} radius={0.1} smoothness={4} position={[0, 0.02, 0.01]}>
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
              </group>
            </group>
          );
        })}
      </group>

      <group ref={characterRef} position={[0, 0.12, 0.58]} scale={headScale * 1.18}>
        <Sphere args={[1.04, 48, 48]} position={[0, 0.92, 0]}>
          <meshPhysicalMaterial color="#fff7ef" roughness={0.56} clearcoat={0.18} sheen={0.55} sheenColor="#fff0ea" />
        </Sphere>
        <Sphere args={[0.34, 32, 32]} position={[-0.68, 1.3, -0.1]}>
          <meshPhysicalMaterial color="#f8f3ee" roughness={0.48} clearcoat={0.16} />
        </Sphere>
        <Sphere args={[0.34, 32, 32]} position={[0.68, 1.3, -0.1]}>
          <meshPhysicalMaterial color="#f8f3ee" roughness={0.48} clearcoat={0.16} />
        </Sphere>
        <Sphere args={[0.66, 36, 36]} position={[0, 1.42, -0.2]}>
          <meshPhysicalMaterial color="#f5eadf" roughness={0.42} clearcoat={0.22} />
        </Sphere>
        <Sphere args={[0.22, 24, 24]} position={[-0.34, 1.1, 0.72]}>
          <meshStandardMaterial color="#2f2624" />
        </Sphere>
        <Sphere args={[0.22, 24, 24]} position={[0.34, 1.1, 0.72]}>
          <meshStandardMaterial color="#2f2624" />
        </Sphere>
        <Sphere args={[0.11, 18, 18]} position={[-0.3, 1.12, 0.88]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <Sphere args={[0.11, 18, 18]} position={[0.38, 1.12, 0.88]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <mesh position={[0, 0.74, 0.92]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.09, 0.018, 10, 20, Math.PI]} />
          <meshStandardMaterial color="#9b6660" />
        </mesh>
        <Sphere args={[0.14, 20, 20]} position={[-0.48, 0.8, 0.7]}>
          <meshStandardMaterial color="#ffc3be" transparent opacity={0.62} />
        </Sphere>
        <Sphere args={[0.14, 20, 20]} position={[0.48, 0.8, 0.7]}>
          <meshStandardMaterial color="#ffc3be" transparent opacity={0.62} />
        </Sphere>
        <RoundedBox args={[1.18, 1.16, 0.9]} radius={0.34} smoothness={6} position={[0, -0.26, 0.08]}>
          <meshPhysicalMaterial color="#f5ddd3" roughness={0.34} clearcoat={0.24} sheen={0.78} sheenColor="#ffe8df" />
        </RoundedBox>
        <Sphere args={[0.38, 26, 26]} position={[-0.56, -0.18, 0.22]}>
          <meshPhysicalMaterial color="#f5ddd3" roughness={0.34} clearcoat={0.24} />
        </Sphere>
        <Sphere args={[0.38, 26, 26]} position={[0.56, -0.18, 0.22]}>
          <meshPhysicalMaterial color="#f5ddd3" roughness={0.34} clearcoat={0.24} />
        </Sphere>
        <Sphere args={[0.17, 20, 20]} position={[-0.28, -1.0, 0.26]}>
          <meshPhysicalMaterial color="#fff7ef" roughness={0.48} clearcoat={0.12} />
        </Sphere>
        <Sphere args={[0.17, 20, 20]} position={[0.28, -1.0, 0.26]}>
          <meshPhysicalMaterial color="#fff7ef" roughness={0.48} clearcoat={0.12} />
        </Sphere>
        <group position={[0, 0.12, -0.36]} rotation={[0.2, 0, 0]}>
          <Box args={[0.58, 0.3, 0.08]}>
            <meshPhysicalMaterial color="#ef6d63" roughness={0.28} clearcoat={0.34} />
          </Box>
          <Box args={[0.22, 0.68, 0.08]}>
            <meshPhysicalMaterial color="#ef6d63" roughness={0.28} clearcoat={0.34} />
          </Box>
        </group>
      </group>
    </>
  );
}

export function FigureAsset({
  config,
  assetStatus,
  assetUrl,
}: {
  config: FigureConfig;
  assetStatus: AssetAvailability;
  assetUrl?: string | null;
}) {
  if (assetStatus.kind === "local" && assetUrl) {
    return <GlbFigureAsset key={assetUrl} url={assetUrl} />;
  }

  if (assetStatus.kind === "bundle") {
    return <GlbFigureAsset key={MODEL_URL} url={MODEL_URL} />;
  }

  return <PlaceholderFigureAsset config={config} />;
}

export function useAssetAvailability(assetUrl?: string | null, assetName?: string | null) {
  const [asset, setAsset] = useState<AssetAvailability>({
    kind: "placeholder",
    label: "Procedural placeholder",
  });

  useEffect(() => {
    let mounted = true;

    if (assetUrl) {
      setAsset({
        kind: "local",
        label: assetName ? `Local GLB: ${assetName}` : "Local GLB loaded",
      });
      return () => {
        mounted = false;
      };
    }

    fetch(MODEL_URL, { method: "HEAD" })
      .then((response) => {
        if (!mounted) return;
        setAsset(
          response.ok
            ? { kind: "bundle", label: "Bundled GLB ready" }
            : { kind: "placeholder", label: "Procedural placeholder" },
        );
      })
      .catch(() => {
        if (mounted) {
          setAsset({ kind: "placeholder", label: "Procedural placeholder" });
        }
      });
    return () => {
      mounted = false;
    };
  }, [assetName, assetUrl]);

  return asset;
}

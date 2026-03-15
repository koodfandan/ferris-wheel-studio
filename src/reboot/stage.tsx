import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, type CSSProperties } from "react";
import { Color, MathUtils } from "three";
import { FigureDisplay } from "./stage-figures";
import { type CharacterDefinition, type CharacterRecipe, getFinishPreset, type StudioSlotId } from "./studio-data";

type Props = {
  character: CharacterDefinition;
  recipe: CharacterRecipe;
  activeSlot: StudioSlotId;
};

export function CharacterStage({ character, recipe, activeSlot }: Props) {
  const finish = getFinishPreset(recipe.finish);

  return (
    <div
      className="reboot-stage-shell"
      style={
        {
          "--stage-top": finish.pageTop,
          "--stage-bottom": finish.pageBottom,
          "--stage-line": finish.line,
        } as CSSProperties
      }
    >
      <Canvas camera={{ position: [0, 1.74, 5.1], fov: 29 }} dpr={[1, 1.6]} shadows>
        <SceneLights top={finish.stageTop} bottom={finish.stageBottom} glow={finish.glow} />

        <Suspense fallback={null}>
          <group position={[0, character.stageY, 0]} scale={character.stageScale}>
            <DisplayPedestal finishId={finish.id} />
            <FigureDisplay character={character} recipe={recipe} activeSlot={activeSlot} finish={finish} />
          </group>
        </Suspense>

        <ContactShadows position={[0, -1.54, 0]} opacity={0.16} blur={2.4} scale={6.4} far={3.2} color="#ae9b8c" />

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={2.7}
          maxDistance={7.4}
          minPolarAngle={MathUtils.degToRad(18)}
          maxPolarAngle={MathUtils.degToRad(162)}
          rotateSpeed={0.9}
          zoomSpeed={1.35}
        />
      </Canvas>

      <div className="reboot-stage-overlay">
        <span>按住拖拽旋转</span>
        <span>滚轮缩放</span>
        <span>自由查看 360 度细节</span>
      </div>
    </div>
  );
}

function SceneLights({ top, bottom, glow }: { top: string; bottom: string; glow: string }) {
  return (
    <>
      <color attach="background" args={[top]} />
      <fog attach="fog" args={[new Color(bottom), 6, 10]} />
      <ambientLight intensity={1.1} color="#fff7ef" />
      <hemisphereLight intensity={1.05} color="#fff9f3" groundColor="#d7c6ba" />
      <spotLight position={[4.8, 7, 4.8]} angle={0.44} intensity={12.6} penumbra={0.86} color="#fff8ef" castShadow />
      <spotLight position={[-4.2, 4.6, 3.8]} angle={0.56} intensity={4.2} penumbra={0.92} color={top} />
      <pointLight position={[0, 2.4, -3.2]} intensity={1.8} color={glow} />
      <pointLight position={[0, -0.2, 1.6]} intensity={1} color="#fff7f2" />
    </>
  );
}

function DisplayPedestal({ finishId }: { finishId: string }) {
  const isTech = finishId === "oxide-core";
  const topColor = isTech ? "#edf8f7" : "#fff9f1";
  const edgeColor = isTech ? "#c8e2df" : "#f2dccc";
  const baseColor = isTech ? "#ddeceb" : "#f3e7de";

  return (
    <group position={[0, -1.2, 0]}>
      <mesh>
        <cylinderGeometry args={[1.4, 1.48, 0.34, 64]} />
        <meshStandardMaterial color={baseColor} roughness={0.8} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.02, 1.08, 0.08, 64]} />
        <meshStandardMaterial color={topColor} roughness={0.56} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.06, 1.18, 64]} />
        <meshStandardMaterial color={edgeColor} roughness={0.32} emissive={topColor} emissiveIntensity={0.06} />
      </mesh>
    </group>
  );
}



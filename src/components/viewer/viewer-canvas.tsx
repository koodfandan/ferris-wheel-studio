import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { ACESFilmicToneMapping } from "three";
import type { FigureConfig } from "../../lib/config";
import { CAMERA_TARGET, type ViewPreset } from "../../lib/camera-presets";
import { FigureAsset, useAssetAvailability } from "./figure-asset";
import { OrbitController } from "./orbit-controller";
import { StageLights } from "./stage-lights";
import {
  createDragHandlers,
  TurntableController,
  useDragState,
} from "./turntable-controller";
import { ViewerHud } from "./viewer-hud";
import { ViewerToolbar } from "./viewer-toolbar";

type Props = {
  config: FigureConfig;
  assetUrl?: string | null;
  assetName?: string | null;
  showToolbar?: boolean;
  showHud?: boolean;
  activeView?: ViewPreset;
  onActiveViewChange?: (view: ViewPreset) => void;
};

export function ViewerCanvas({
  config,
  assetUrl,
  assetName,
  showToolbar = true,
  showHud = true,
  activeView: controlledActiveView,
  onActiveViewChange,
}: Props) {
  const controlsRef = useRef<any>(null);
  const rootRef = useRef<Group | null>(null);
  const [internalActiveView, setInternalActiveView] = useState<ViewPreset>("front");
  const assetStatus = useAssetAvailability(assetUrl, assetName);
  const dragState = useDragState();
  const dragHandlers = useMemo(() => createDragHandlers(dragState), [dragState]);
  const activeView = controlledActiveView ?? internalActiveView;
  const setActiveView = onActiveViewChange ?? setInternalActiveView;

  return (
    <div className="canvas-shell">
      {showToolbar && (
        <ViewerToolbar
          mode={config.viewMode}
          activeView={activeView}
          onViewChange={setActiveView}
          onReset={() => setActiveView("front")}
        />
      )}
      <Suspense fallback={<ViewerFallback />}>
        <Canvas
          dpr={[1, 1.5]}
          shadows
          gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.92 }}
          camera={{ position: [0, 1.05, 7.6], fov: 24 }}
        >
          <StageLights config={config} />
          <TurntableController config={config} rootRef={rootRef} dragState={dragState} />
          <group
            ref={rootRef}
            scale={0.96}
            onPointerDown={(event) => dragHandlers.onPointerDown(event.clientX)}
            onPointerMove={(event) => dragHandlers.onPointerMove(event.clientX)}
            onPointerUp={() => dragHandlers.onPointerEnd()}
            onPointerMissed={() => dragHandlers.onPointerEnd()}
            onPointerOut={() => dragHandlers.onPointerEnd()}
          >
            <FigureAsset config={config} assetStatus={assetStatus} assetUrl={assetUrl} />
          </group>
          <OrbitController config={config} activeView={activeView} controlsRef={controlsRef} />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={6.2}
            maxDistance={10.8}
            minPolarAngle={0.6}
            maxPolarAngle={2.2}
            enableRotate={config.viewMode === "inspect"}
            enableZoom
            enableDamping
            dampingFactor={0.1}
            rotateSpeed={0.58}
            target={CAMERA_TARGET}
          />
          <ContactShadows position={[0, -2.25, 0]} opacity={0.22} blur={2.1} scale={7} far={3.1} />
          <Environment preset="studio" blur={0.75} />
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.14} luminanceThreshold={0.93} luminanceSmoothing={0.28} />
            <Vignette eskil={false} offset={0.06} darkness={0.08} />
          </EffectComposer>
        </Canvas>
      </Suspense>
      {showHud && <ViewerHud mode={config.viewMode} assetStatus={assetStatus} />}
    </div>
  );
}

function ViewerFallback() {
  return (
    <div className="viewer-fallback">
      <div className="viewer-fallback-card">
        <b>3D Viewer Loading</b>
        <span>If your browser cannot start WebGL or module scripts correctly, this area will stay on fallback instead of rendering blank.</span>
      </div>
    </div>
  );
}

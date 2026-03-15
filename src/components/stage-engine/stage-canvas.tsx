import { CameraControls } from "@react-three/drei";
import type { CameraControls as CameraControlsHandle } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CameraControlsImpl from "camera-controls";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { ACESFilmicToneMapping } from "three";
import { shouldBlindboxPlayCelebration } from "../../features/blindbox/blindbox.selectors";
import type { BlindboxPhase, BlindboxRarity } from "../../features/blindbox/blindbox.types";
import { getDefaultPrototype, type CharacterPrototypeId } from "../../lib/character-prototypes-v2";
import { getPaletteOption, type StageMode, type StudioRecipe, type StudioSlot } from "../../lib/studio-system";
import { BlindboxCelebration } from "./blindbox-celebration";
import type { StageLayout } from "./stage-layout";
import { StageScene } from "./stage-scene";

type Locale = "zh" | "en";

type Props = {
  recipe: StudioRecipe;
  focusSlot: StudioSlot;
  stageMode: StageMode;
  layout: StageLayout;
  locale: Locale;
  activePrototype?: CharacterPrototypeId;
  blindboxActive: boolean;
  blindboxPhase: BlindboxPhase;
  blindboxToken: number;
  blindboxRarity: BlindboxRarity | null;
};

const MODE_DEFAULTS: Record<StageMode, { zoom: number }> = {
  assemble: { zoom: 7.2 },
  inspect: { zoom: 6.6 },
  shelf: { zoom: 7.7 },
};

export function StageCanvas({
  recipe,
  focusSlot,
  stageMode,
  layout,
  locale,
  activePrototype = getDefaultPrototype(recipe.species).id,
  blindboxActive,
  blindboxPhase,
  blindboxToken,
  blindboxRarity,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<CameraControlsHandle | null>(null);
  const palette = getPaletteOption(recipe.palette);
  const [isArmed, setIsArmed] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasInitialFramingReady, setHasInitialFramingReady] = useState(false);
  const didDragRef = useRef(false);
  const pointerGestureRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
  });
  const suppressCanvasDuringBlindbox = blindboxPhase === "pop-box" || blindboxPhase === "snap-open";
  const needsRealtimeBlindboxRender =
    blindboxPhase === "handoff" || blindboxPhase === "reveal" || blindboxPhase === "settle-on-base";
  const controlsEnabled = !blindboxActive && isArmed;

  useEffect(() => {
    setIsArmed(false);
    setIsInteracting(false);
    didDragRef.current = false;
    pointerGestureRef.current.pointerId = -1;
  }, [blindboxActive]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) {
      controls.enabled = controlsEnabled;
    }
  }, [controlsEnabled]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsArmed(false);
        setIsInteracting(false);
        didDragRef.current = false;
        pointerGestureRef.current.pointerId = -1;
      }
    };

    const onPointerDownCapture = (event: globalThis.PointerEvent) => {
      const node = containerRef.current;
      if (!node) return;
      if (!node.contains(event.target as Node)) {
        setIsArmed(false);
        setIsInteracting(false);
        didDragRef.current = false;
        pointerGestureRef.current.pointerId = -1;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDownCapture, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
    };
  }, []);

  function handlePointerDownCapture(event: ReactPointerEvent<HTMLDivElement>) {
    if (blindboxActive || event.button !== 0) return;
    didDragRef.current = false;
    pointerGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  }

  function handlePointerMoveCapture(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerGestureRef.current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - pointerGestureRef.current.startX;
    const deltaY = event.clientY - pointerGestureRef.current.startY;
    if (Math.hypot(deltaX, deltaY) > 5) {
      didDragRef.current = true;
    }
  }

  function handlePointerUpCapture(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerGestureRef.current.pointerId === event.pointerId) {
      pointerGestureRef.current.pointerId = -1;
    }
  }

  function handleWheelCapture(event: ReactWheelEvent<HTMLDivElement>) {
    if (blindboxActive || isArmed) return;
    window.scrollBy({
      left: 0,
      top: event.deltaY,
      behavior: "auto",
    });
  }

  const canvasClassName = blindboxActive
    ? isArmed
      ? (isInteracting
        ? "stage-canvas is-armed is-interacting is-blindbox-active"
        : "stage-canvas is-armed is-blindbox-active")
      : "stage-canvas is-blindbox-active"
    : isArmed
      ? (isInteracting ? "stage-canvas is-armed is-interacting" : "stage-canvas is-armed")
      : "stage-canvas";

  return (
    <div
      ref={containerRef}
      className={canvasClassName}
      data-blindbox-active={blindboxActive ? "true" : "false"}
      data-blindbox-phase={blindboxPhase}
      data-initial-framing-ready={hasInitialFramingReady ? "true" : "false"}
      onClick={() => {
        if (blindboxActive) return;
        if (didDragRef.current) {
          didDragRef.current = false;
          return;
        }
        setIsInteracting(false);
        setIsArmed((current) => !current);
      }}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMoveCapture={handlePointerMoveCapture}
      onPointerUpCapture={handlePointerUpCapture}
      onPointerCancelCapture={handlePointerUpCapture}
      onWheelCapture={handleWheelCapture}
    >
      <div className="stage-canvas-arm-indicator" aria-live="polite">
        {isArmed
          ? (locale === "zh" ? "已激活 · 可拖拽/缩放" : "Active · Drag/Zoom enabled")
          : (locale === "zh" ? "点击舞台后可操控" : "Click stage to enable controls")}
      </div>

      <BlindboxCelebration
        active={shouldBlindboxPlayCelebration(blindboxPhase)}
        phase={blindboxPhase}
        token={blindboxToken}
        rarity={blindboxRarity}
        accent={palette.colors.accent}
        accentSoft={palette.colors.accentSoft}
        glow={palette.colors.glow}
        glowSoft={palette.colors.glowSoft}
      />

      <Suspense fallback={<StageCanvasFallback locale={locale} />}>
        <Canvas
          frameloop={needsRealtimeBlindboxRender ? "always" : (suppressCanvasDuringBlindbox ? "demand" : "always")}
          shadows
          dpr={suppressCanvasDuringBlindbox ? [1, 1.1] : blindboxActive ? [1, 1.35] : [1, 1.6]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 0.9,
          }}
          camera={{ position: [0, 1.26, MODE_DEFAULTS[stageMode].zoom], fov: 30 }}
        >
          <CameraControls
            ref={controlsRef}
            enabled={controlsEnabled}
            minPolarAngle={0.52}
            maxPolarAngle={2.44}
            smoothTime={0.46}
            draggingSmoothTime={0.16}
            azimuthRotateSpeed={0.92}
            polarRotateSpeed={0.8}
            dollySpeed={1.22}
            dollyToCursor
            mouseButtons={{
              left: isArmed ? CameraControlsImpl.ACTION.ROTATE : CameraControlsImpl.ACTION.NONE,
              middle: isArmed ? CameraControlsImpl.ACTION.DOLLY : CameraControlsImpl.ACTION.NONE,
              right: CameraControlsImpl.ACTION.NONE,
              wheel: isArmed ? CameraControlsImpl.ACTION.DOLLY : CameraControlsImpl.ACTION.NONE,
            }}
            touches={{
              one: isArmed ? CameraControlsImpl.ACTION.TOUCH_ROTATE : CameraControlsImpl.ACTION.NONE,
              two: isArmed ? CameraControlsImpl.ACTION.TOUCH_DOLLY_ROTATE : CameraControlsImpl.ACTION.NONE,
              three: CameraControlsImpl.ACTION.NONE,
            }}
            onStart={() => {
              setIsInteracting(true);
            }}
            onEnd={() => setIsInteracting(false)}
          />

          <StageScene
            recipe={recipe}
            focusSlot={focusSlot}
            stageMode={stageMode}
            layout={layout}
            activePrototype={activePrototype}
            controlsRef={controlsRef}
            viewerArmed={isArmed}
            blindboxActive={blindboxActive}
            blindboxPhase={blindboxPhase}
            onInitialFramingReady={() => setHasInitialFramingReady(true)}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

function StageCanvasFallback({ locale }: { locale: Locale }) {
  return (
    <div className="stage-canvas-fallback">
      <div className="stage-canvas-fallback-card">
        <strong>{locale === "zh" ? "舞台加载中" : "Loading stage"}</strong>
        <span>{locale === "zh" ? "正在准备 3D 模型和展示灯光。" : "Preparing the 3D model and stage lights."}</span>
      </div>
    </div>
  );
}

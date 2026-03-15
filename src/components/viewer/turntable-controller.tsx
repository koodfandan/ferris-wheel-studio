import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { MutableRefObject } from "react";
import type { Group } from "three";
import type { FigureConfig } from "../../lib/config";

export type DragState = {
  down: boolean;
  x: number;
  velocity: number;
  angle: number;
};

export function TurntableController({
  config,
  rootRef,
  dragState,
}: {
  config: FigureConfig;
  rootRef: MutableRefObject<Group | null>;
  dragState: MutableRefObject<DragState>;
}) {
  useFrame((_, delta) => {
    if (!dragState.current.down) {
      dragState.current.angle += dragState.current.velocity;
      dragState.current.velocity *= 0.92;
      if (config.viewMode === "showcase") {
        dragState.current.angle += delta * 0.22;
      }
    }

    if (rootRef.current) {
      rootRef.current.rotation.y += (dragState.current.angle - rootRef.current.rotation.y) * 0.12;
    }
  });
  return null;
}

export function useDragState() {
  return useRef<DragState>({
    down: false,
    x: 0,
    velocity: 0,
    angle: 0,
  });
}

export function createDragHandlers(dragState: MutableRefObject<DragState>) {
  return {
    onPointerDown(clientX: number) {
      dragState.current.down = true;
      dragState.current.x = clientX;
      dragState.current.velocity = 0;
    },
    onPointerMove(clientX: number) {
      if (!dragState.current.down) return;
      const dx = clientX - dragState.current.x;
      dragState.current.x = clientX;
      dragState.current.angle += dx * 0.01;
      dragState.current.velocity = dx * 0.0018;
    },
    onPointerEnd() {
      dragState.current.down = false;
    },
  };
}

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import type { MutableRefObject } from "react";
import type { FigureConfig } from "../../lib/config";
import { CAMERA_PRESETS, CAMERA_TARGET, type ViewPreset } from "../../lib/camera-presets";

type Props = {
  config: FigureConfig;
  activeView: ViewPreset;
  controlsRef: MutableRefObject<any>;
};

export function OrbitController({ config, activeView, controlsRef }: Props) {
  const camera = useThree((state) => state.camera as PerspectiveCamera);

  useEffect(() => {
    const [x, y, z] = CAMERA_PRESETS[activeView];
    camera.position.set(x, y, z);
    if (controlsRef.current) {
      controlsRef.current.target.set(...CAMERA_TARGET);
      controlsRef.current.update();
    }
  }, [activeView, camera, controlsRef]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = config.viewMode === "inspect";
      controlsRef.current.target.set(...CAMERA_TARGET);
      controlsRef.current.update();
    }
  }, [config.viewMode, controlsRef]);

  return null;
}

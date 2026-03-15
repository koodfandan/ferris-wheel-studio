export type ViewPreset = "front" | "back" | "left" | "right" | "top";

export const CAMERA_PRESETS: Record<ViewPreset, [number, number, number]> = {
  front: [0, 1.05, 7.6],
  back: [0, 1.05, -7.6],
  left: [-7.6, 1.0, 0],
  right: [7.6, 1.0, 0],
  top: [0, 7.3, 0.1],
};

export const CAMERA_TARGET: [number, number, number] = [0, 0.7, 0];

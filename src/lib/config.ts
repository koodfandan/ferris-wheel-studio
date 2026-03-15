export type LightMode = "warm" | "blue" | "rose";

export type FigureConfig = {
  title: string;
  ringSize: number;
  headScale: number;
  cabinCount: number;
  lightMode: LightMode;
  glowStrength: number;
  spinEnabled: boolean;
  floatEnabled: boolean;
  viewMode: "showcase" | "inspect";
};

export const defaultConfig: FigureConfig = {
  title: "Dream Fair Wheel",
  ringSize: 100,
  headScale: 100,
  cabinCount: 6,
  lightMode: "warm",
  glowStrength: 32,
  spinEnabled: false,
  floatEnabled: true,
  viewMode: "inspect",
};

export function lightLabel(mode: LightMode) {
  if (mode === "blue") return "Ice Blue";
  if (mode === "rose") return "Rose Candy";
  return "Warm Glow";
}

export function specLightLabel(mode: LightMode) {
  if (mode === "blue") return "Cool blue glow";
  if (mode === "rose") return "Rose candy glow";
  return "Warm breathing glow";
}

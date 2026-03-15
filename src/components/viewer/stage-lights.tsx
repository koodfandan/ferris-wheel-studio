import type { FigureConfig } from "../../lib/config";

type Props = {
  config: FigureConfig;
};

function palette(mode: FigureConfig["lightMode"]) {
  if (mode === "blue") {
    return { glow: "#7db5ff", accent: "#a9cdff", bg: "#edf5ff" };
  }
  if (mode === "rose") {
    return { glow: "#ff9b94", accent: "#ffd1d1", bg: "#fff1f0" };
  }
  return { glow: "#ffd97c", accent: "#ffe7af", bg: "#fff7e8" };
}

export function StageLights({ config }: Props) {
  const colors = palette(config.lightMode);
  const glow = config.glowStrength / 100;

  return (
    <>
      <color attach="background" args={["#fdf4ec"]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4.8, 5.2, 7.4]} intensity={1.45} color="#fffaf3" castShadow />
      <directionalLight position={[-4.6, 2.4, 5.2]} intensity={0.52} color="#ffe8dd" />
      <directionalLight position={[0, 3.8, -4.4]} intensity={0.38} color={colors.accent} />
      <pointLight position={[0, 1.5, 4.2]} intensity={0.85} color="#fff8f3" />
      <pointLight position={[0, 2.1, -1.1]} intensity={0.34 + glow * 0.3} color={colors.glow} />
      <pointLight position={[0, -0.45, 2.3]} intensity={0.46} color="#fff3e7" />
    </>
  );
}

import { Color } from "three";
import type { FinishPreset } from "./catalog-v2";

type DnaProfile = {
  shellSat: number;
  bodySat: number;
  accentSat: number;
  glowSat: number;
  shellMinSat: number;
  bodyMinSat: number;
  accentMinSat: number;
  glowMinSat: number;
  accentHue: number;
  shellLight: number;
  bodyLight: number;
  accentLight: number;
};

const DEFAULT_DNA: DnaProfile = {
  shellSat: 0.16,
  bodySat: 0.14,
  accentSat: 0.26,
  glowSat: 0.2,
  shellMinSat: 0.2,
  bodyMinSat: 0.24,
  accentMinSat: 0.44,
  glowMinSat: 0.36,
  accentHue: 0,
  shellLight: 0.03,
  bodyLight: 0.01,
  accentLight: 0.03,
};

const CHARACTER_DNA: Record<string, DnaProfile> = {
  "veil-nun": { shellSat: 0.11, bodySat: 0.12, accentSat: 0.28, glowSat: 0.18, shellMinSat: 0.18, bodyMinSat: 0.2, accentMinSat: 0.46, glowMinSat: 0.36, accentHue: 0.012, shellLight: 0.02, bodyLight: 0.01, accentLight: 0.03 },
  "bubble-diver": { shellSat: 0.24, bodySat: 0.22, accentSat: 0.34, glowSat: 0.28, shellMinSat: 0.3, bodyMinSat: 0.32, accentMinSat: 0.52, glowMinSat: 0.45, accentHue: -0.016, shellLight: 0.05, bodyLight: 0.04, accentLight: 0.04 },
  "post-dog": { shellSat: 0.2, bodySat: 0.18, accentSat: 0.31, glowSat: 0.24, shellMinSat: 0.26, bodyMinSat: 0.28, accentMinSat: 0.48, glowMinSat: 0.39, accentHue: 0.015, shellLight: 0.04, bodyLight: 0.03, accentLight: 0.04 },
  "tin-wolf": { shellSat: 0.2, bodySat: 0.22, accentSat: 0.36, glowSat: 0.28, shellMinSat: 0.24, bodyMinSat: 0.3, accentMinSat: 0.56, glowMinSat: 0.46, accentHue: -0.02, shellLight: 0.02, bodyLight: 0.02, accentLight: 0.03 },
  "dune-tortle": { shellSat: 0.2, bodySat: 0.19, accentSat: 0.32, glowSat: 0.27, shellMinSat: 0.26, bodyMinSat: 0.28, accentMinSat: 0.5, glowMinSat: 0.42, accentHue: 0.012, shellLight: 0.03, bodyLight: 0.02, accentLight: 0.03 },
  "mirror-snake": { shellSat: 0.23, bodySat: 0.22, accentSat: 0.34, glowSat: 0.3, shellMinSat: 0.3, bodyMinSat: 0.32, accentMinSat: 0.54, glowMinSat: 0.46, accentHue: -0.014, shellLight: 0.04, bodyLight: 0.03, accentLight: 0.03 },
  "frost-penguin": { shellSat: 0.28, bodySat: 0.24, accentSat: 0.38, glowSat: 0.33, shellMinSat: 0.36, bodyMinSat: 0.34, accentMinSat: 0.58, glowMinSat: 0.5, accentHue: 0.02, shellLight: 0.05, bodyLight: 0.04, accentLight: 0.04 },
  "cloud-jelly": { shellSat: 0.22, bodySat: 0.22, accentSat: 0.34, glowSat: 0.32, shellMinSat: 0.3, bodyMinSat: 0.3, accentMinSat: 0.54, glowMinSat: 0.5, accentHue: -0.016, shellLight: 0.05, bodyLight: 0.04, accentLight: 0.03 },
  "spore-bear": { shellSat: 0.22, bodySat: 0.2, accentSat: 0.32, glowSat: 0.28, shellMinSat: 0.3, bodyMinSat: 0.3, accentMinSat: 0.52, glowMinSat: 0.44, accentHue: 0.012, shellLight: 0.04, bodyLight: 0.03, accentLight: 0.03 },
  "scrap-crow": { shellSat: 0.18, bodySat: 0.2, accentSat: 0.35, glowSat: 0.26, shellMinSat: 0.24, bodyMinSat: 0.28, accentMinSat: 0.56, glowMinSat: 0.42, accentHue: -0.016, shellLight: 0.02, bodyLight: 0.02, accentLight: 0.03 },
  "sugar-lamb": { shellSat: 0.28, bodySat: 0.26, accentSat: 0.36, glowSat: 0.32, shellMinSat: 0.36, bodyMinSat: 0.36, accentMinSat: 0.56, glowMinSat: 0.5, accentHue: 0.014, shellLight: 0.05, bodyLight: 0.04, accentLight: 0.04 },
  "porcelain-deer": { shellSat: 0.14, bodySat: 0.14, accentSat: 0.28, glowSat: 0.22, shellMinSat: 0.2, bodyMinSat: 0.22, accentMinSat: 0.46, glowMinSat: 0.38, accentHue: 0.008, shellLight: 0.03, bodyLight: 0.03, accentLight: 0.03 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function tuneHex(
  hex: string,
  {
    hue = 0,
    sat = 0,
    minSat = 0,
    light = 0,
  }: {
    hue?: number;
    sat?: number;
    minSat?: number;
    light?: number;
  },
) {
  const color = new Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  color.setHSL((hsl.h + hue + 1) % 1, clamp(Math.max(hsl.s + sat, minSat), 0, 0.98), clamp(hsl.l + light, 0.06, 0.92));
  return `#${color.getHexString()}`;
}

export function buildCharacterFinish(finish: FinishPreset, characterId: string): FinishPreset {
  const dna = CHARACTER_DNA[characterId] ?? DEFAULT_DNA;

  return {
    ...finish,
    skin: tuneHex(finish.skin, { sat: 0.1, minSat: 0.14, light: 0.02 }),
    shell: tuneHex(finish.shell, { sat: dna.shellSat, minSat: dna.shellMinSat, light: dna.shellLight }),
    body: tuneHex(finish.body, { sat: dna.bodySat, minSat: dna.bodyMinSat, light: dna.bodyLight }),
    accent: tuneHex(finish.accent, { hue: dna.accentHue, sat: dna.accentSat, minSat: dna.accentMinSat, light: dna.accentLight }),
    accentSoft: tuneHex(finish.accentSoft, { hue: dna.accentHue * 0.6, sat: dna.accentSat * 0.55, minSat: dna.accentMinSat * 0.72, light: 0.04 }),
    prop: tuneHex(finish.prop, { sat: 0.2, minSat: 0.3, light: 0.03 }),
    metal: tuneHex(finish.metal, { sat: 0.05, light: 0.01 }),
    glow: tuneHex(finish.glow, { sat: dna.glowSat, minSat: dna.glowMinSat, light: 0.05 }),
    glowSoft: tuneHex(finish.glowSoft, { sat: dna.glowSat * 0.65, minSat: dna.glowMinSat * 0.72, light: 0.05 }),
  };
}

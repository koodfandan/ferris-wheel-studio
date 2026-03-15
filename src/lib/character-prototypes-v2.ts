import type { SpeciesId } from "./studio-system";

export type CharacterPrototypeId =
  | "human-luna"
  | "human-coco"
  | "human-aria"
  | "animal-bunny"
  | "animal-bear"
  | "animal-fox"
  | "creature-axolotl"
  | "creature-cloudling"
  | "creature-starmoth"
  | "robot-botu"
  | "robot-capsule"
  | "robot-dronecat";

export type CharacterPrototypeOption = {
  id: CharacterPrototypeId;
  species: SpeciesId;
  label: string;
  labelZh: string;
  badge: string;
  note: string;
};

export type PrototypeRecipePatch = Partial<{
  expression: string;
  silhouette: string;
  headpiece: string;
  outfit: string;
  prop: string;
  frame: string;
  pods: string;
  base: string;
  palette: string;
}>;

export const CHARACTER_PROTOTYPE_OPTIONS: CharacterPrototypeOption[] = [
  {
    id: "human-luna",
    species: "human",
    label: "Maskling",
    labelZh: "面罩童",
    badge: "Mask",
    note: "Patchwork child with a split porcelain face and sleepy bell collar.",
  },
  {
    id: "human-coco",
    species: "human",
    label: "Bloom Witch",
    labelZh: "花帽巫",
    badge: "Bloom",
    note: "Tiny witch with petal curls, fungal cape, and crooked garden silhouette.",
  },
  {
    id: "human-aria",
    species: "human",
    label: "Candle Kid",
    labelZh: "烛芯孩",
    badge: "Wax",
    note: "Tall wick-headed child with wax-drip clothing and ash-lit accessories.",
  },
  {
    id: "animal-bunny",
    species: "animal",
    label: "Tri-Eye Rabbit",
    labelZh: "三眼兔",
    badge: "Odd Pet",
    note: "Long-ear rabbit with three eyes and a burrow-soft monster toy body.",
  },
  {
    id: "animal-bear",
    species: "animal",
    label: "Mushroom Bear",
    labelZh: "蘑菇熊",
    badge: "Forest",
    note: "Chunky bear stacked with mushroom caps, moss tufts, and sleepy paws.",
  },
  {
    id: "animal-fox",
    species: "animal",
    label: "Doubletail Hound",
    labelZh: "双尾犬",
    badge: "Rover",
    note: "Playful hound with two tails, floppy ears, and a stretched toy muzzle.",
  },
  {
    id: "creature-axolotl",
    species: "creature",
    label: "Long-Ear Fish",
    labelZh: "长耳鱼",
    badge: "Lagoon",
    note: "Pond creature with floating ear-fins and a bubble-heavy side profile.",
  },
  {
    id: "creature-cloudling",
    species: "creature",
    label: "Ragbug",
    labelZh: "布偶虫",
    badge: "Stitch",
    note: "Rag-stuffed bug with pins, pocket folds, and uneven plush shell layers.",
  },
  {
    id: "creature-starmoth",
    species: "creature",
    label: "Shell Dragon",
    labelZh: "贝壳龙",
    badge: "Tide",
    note: "Compact dragon with shell plates, pearl crest, and heavy tail weight.",
  },
  {
    id: "robot-botu",
    species: "robot",
    label: "Owl Deer",
    labelZh: "鸮鹿机",
    badge: "Forest Bot",
    note: "Mechanical owl-deer hybrid with branch antennae and lantern eyes.",
  },
  {
    id: "robot-capsule",
    species: "robot",
    label: "Night Fox",
    labelZh: "夜巡狐",
    badge: "Scout",
    note: "Lean scout fox with radar ears, narrow visor, and stealth armor blocks.",
  },
  {
    id: "robot-dronecat",
    species: "robot",
    label: "Cloud Hedgehog",
    labelZh: "云刺猬",
    badge: "Mist Core",
    note: "Round hover hedgehog with mist quills, halo fans, and compact drone belly.",
  },
];

const DEFAULT_PROTOTYPE_BY_SPECIES: Record<SpeciesId, CharacterPrototypeId> = {
  human: "human-luna",
  animal: "animal-bunny",
  creature: "creature-axolotl",
  robot: "robot-botu",
};

const PROTOTYPE_PRESET_MAP: Record<CharacterPrototypeId, PrototypeRecipePatch> = {
  "human-luna": {
    expression: "expression-luna-dream",
    silhouette: "silhouette-bob",
    headpiece: "headpiece-luna-halo",
    outfit: "outfit-luna-pajama",
    prop: "prop-wand",
    frame: "frame-classic",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "midnight-jelly",
  },
  "human-coco": {
    expression: "expression-coco-wink",
    silhouette: "silhouette-curl",
    headpiece: "headpiece-coco-cloud",
    outfit: "outfit-coco-fairdress",
    prop: "prop-ticket",
    frame: "frame-pearl",
    pods: "pods-candy",
    base: "base-ticket",
    palette: "peach-fizz",
  },
  "human-aria": {
    expression: "expression-aria-dream",
    silhouette: "silhouette-bob",
    headpiece: "headpiece-aria-halo",
    outfit: "outfit-aria-pajama",
    prop: "prop-wand",
    frame: "frame-pearl",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "midnight-jelly",
  },
  "animal-bunny": {
    expression: "expression-bunny-smile",
    silhouette: "silhouette-bunny",
    headpiece: "headpiece-bunny-cloud",
    outfit: "outfit-bunny-plush",
    prop: "prop-ticket",
    frame: "frame-classic",
    pods: "pods-plush",
    base: "base-ticket",
    palette: "vanilla-muse",
  },
  "animal-bear": {
    expression: "expression-bear-dream",
    silhouette: "silhouette-bear",
    headpiece: "headpiece-bear-cloud",
    outfit: "outfit-bear-plush-cozy",
    prop: "prop-ticket",
    frame: "frame-classic",
    pods: "pods-plush",
    base: "base-cloud",
    palette: "vanilla-muse",
  },
  "animal-fox": {
    expression: "expression-fox-wink",
    silhouette: "silhouette-bunny",
    headpiece: "headpiece-fox-bow",
    outfit: "outfit-fox-plush-cape",
    prop: "prop-ticket",
    frame: "frame-candy",
    pods: "pods-candy",
    base: "base-ticket",
    palette: "peach-fizz",
  },
  "creature-axolotl": {
    expression: "expression-axo-dream",
    silhouette: "silhouette-foam",
    headpiece: "headpiece-axo-halo",
    outfit: "outfit-axo-cape-foam",
    prop: "prop-lantern",
    frame: "frame-pearl",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "mint-parade",
  },
  "creature-cloudling": {
    expression: "expression-cloudling-dream",
    silhouette: "silhouette-foam",
    headpiece: "headpiece-cloudling-halo",
    outfit: "outfit-cloudling-cape-soft",
    prop: "prop-wand",
    frame: "frame-classic",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "vanilla-muse",
  },
  "creature-starmoth": {
    expression: "expression-starmoth-dream",
    silhouette: "silhouette-foam",
    headpiece: "headpiece-starmoth-halo",
    outfit: "outfit-starmoth-cape-shine",
    prop: "prop-lantern",
    frame: "frame-pearl",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "midnight-jelly",
  },
  "robot-botu": {
    expression: "expression-botu-led",
    silhouette: "silhouette-shell",
    headpiece: "headpiece-botu-antenna-plus",
    outfit: "outfit-botu-pod-mk2",
    prop: "prop-battery",
    frame: "frame-bulb",
    pods: "pods-pixel",
    base: "base-dock",
    palette: "mint-parade",
  },
  "robot-capsule": {
    expression: "expression-capsule-led",
    silhouette: "silhouette-shell",
    headpiece: "headpiece-capsule-antenna-plus",
    outfit: "outfit-capsule-pod-mk2",
    prop: "prop-battery",
    frame: "frame-bulb",
    pods: "pods-pixel",
    base: "base-dock",
    palette: "midnight-jelly",
  },
  "robot-dronecat": {
    expression: "expression-dronecat-led",
    silhouette: "silhouette-shell",
    headpiece: "headpiece-dronecat-antenna-plus",
    outfit: "outfit-dronecat-pod-mk2",
    prop: "prop-battery",
    frame: "frame-bulb",
    pods: "pods-pixel",
    base: "base-dock",
    palette: "mint-parade",
  },
};

export function getPrototypeOptions(species: SpeciesId) {
  return CHARACTER_PROTOTYPE_OPTIONS.filter((item) => item.species === species);
}

export function getPrototypeById(id: CharacterPrototypeId) {
  return CHARACTER_PROTOTYPE_OPTIONS.find((item) => item.id === id) ?? CHARACTER_PROTOTYPE_OPTIONS[0];
}

export function getDefaultPrototype(species: SpeciesId) {
  return getPrototypeById(DEFAULT_PROTOTYPE_BY_SPECIES[species]);
}

export function getPrototypePreset(id: CharacterPrototypeId) {
  return PROTOTYPE_PRESET_MAP[id] ?? {};
}

export function applyPrototypePreset<T extends Record<string, unknown>>(recipe: T, id: CharacterPrototypeId) {
  const preset = getPrototypePreset(id);
  return { ...recipe, ...preset };
}

export function ensurePrototypeForSpecies(species: SpeciesId, prototypeId: CharacterPrototypeId) {
  const matched = CHARACTER_PROTOTYPE_OPTIONS.find((item) => item.id === prototypeId && item.species === species);
  return matched?.id ?? DEFAULT_PROTOTYPE_BY_SPECIES[species];
}

export function getPrototypeToken(id: CharacterPrototypeId) {
  if (id.startsWith("human-")) return "HU";
  if (id.startsWith("animal-")) return "AN";
  if (id.startsWith("creature-")) return "CR";
  return "RB";
}

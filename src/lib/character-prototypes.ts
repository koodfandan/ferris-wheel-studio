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
    label: "Luna Doll",
    labelZh: "露娜娃娃",
    badge: "Core",
    note: "Classic blindbox doll silhouette.",
  },
  {
    id: "human-coco",
    species: "human",
    label: "Coco Pastry",
    labelZh: "可可甜点",
    badge: "Sweet",
    note: "Round dessert-inspired proportions.",
  },
  {
    id: "human-aria",
    species: "human",
    label: "Aria Star",
    labelZh: "艾莉亚星愿",
    badge: "Stage",
    note: "Tall star-show performer shape.",
  },
  {
    id: "animal-bunny",
    species: "animal",
    label: "Bunny Puff",
    labelZh: "泡芙兔",
    badge: "Pet",
    note: "Long-ear plush toy profile.",
  },
  {
    id: "animal-bear",
    species: "animal",
    label: "Bear Bun",
    labelZh: "熊熊团子",
    badge: "Pet",
    note: "Chunky bear collectible silhouette.",
  },
  {
    id: "animal-fox",
    species: "animal",
    label: "Fox Mochi",
    labelZh: "糯米狐",
    badge: "Pet",
    note: "Slim fox face and puffy tail.",
  },
  {
    id: "creature-axolotl",
    species: "creature",
    label: "Axo Glow",
    labelZh: "荧光六角灵",
    badge: "Night",
    note: "Water-spirit frill and glow details.",
  },
  {
    id: "creature-cloudling",
    species: "creature",
    label: "Cloudling",
    labelZh: "云团精灵",
    badge: "Dream",
    note: "Soft cloud body with floating loops.",
  },
  {
    id: "creature-starmoth",
    species: "creature",
    label: "Star Moth",
    labelZh: "星蛾精灵",
    badge: "Night",
    note: "Wing-like decorations and halo feel.",
  },
  {
    id: "robot-botu",
    species: "robot",
    label: "Bot-U",
    labelZh: "波特U",
    badge: "Neo",
    note: "Classic round toy robot shell.",
  },
  {
    id: "robot-capsule",
    species: "robot",
    label: "Capsule Unit",
    labelZh: "胶囊机体",
    badge: "Neo",
    note: "Capsule suit with visor panel.",
  },
  {
    id: "robot-dronecat",
    species: "robot",
    label: "Drone Cat",
    labelZh: "巡航猫机",
    badge: "Neo",
    note: "Cat-ear robot with drone ring accents.",
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
    expression: "expression-luna-smile",
    silhouette: "silhouette-bob",
    headpiece: "headpiece-luna-cloud",
    outfit: "outfit-luna-pajama",
    prop: "prop-ticket",
    frame: "frame-classic",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "vanilla-muse",
  },
  "human-coco": {
    expression: "expression-coco-wink",
    silhouette: "silhouette-curl",
    headpiece: "headpiece-coco-bow",
    outfit: "outfit-coco-fairdress",
    prop: "prop-ticket",
    frame: "frame-candy",
    pods: "pods-candy",
    base: "base-ticket",
    palette: "peach-fizz",
  },
  "human-aria": {
    expression: "expression-aria-smile",
    silhouette: "silhouette-bob",
    headpiece: "headpiece-aria-halo",
    outfit: "outfit-aria-fairdress",
    prop: "prop-wand",
    frame: "frame-pearl",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "midnight-jelly",
  },
  "animal-bunny": {
    expression: "expression-bunny-smile",
    silhouette: "silhouette-bunny",
    headpiece: "headpiece-bunny-bow",
    outfit: "outfit-bunny-plush",
    prop: "prop-ticket",
    frame: "frame-candy",
    pods: "pods-plush",
    base: "base-ticket",
    palette: "peach-fizz",
  },
  "animal-bear": {
    expression: "expression-bear-dream",
    silhouette: "silhouette-bear",
    headpiece: "headpiece-bear-cloud",
    outfit: "outfit-bear-plush",
    prop: "prop-ticket",
    frame: "frame-classic",
    pods: "pods-plush",
    base: "base-cloud",
    palette: "vanilla-muse",
  },
  "animal-fox": {
    expression: "expression-fox-wink",
    silhouette: "silhouette-bear",
    headpiece: "headpiece-fox-bow",
    outfit: "outfit-fox-plush",
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
    outfit: "outfit-axo-cape",
    prop: "prop-lantern",
    frame: "frame-pearl",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "mint-parade",
  },
  "creature-cloudling": {
    expression: "expression-cloudling-smile",
    silhouette: "silhouette-foam",
    headpiece: "headpiece-cloudling-cloud",
    outfit: "outfit-cloudling-cape",
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
    outfit: "outfit-starmoth-cape",
    prop: "prop-wand",
    frame: "frame-pearl",
    pods: "pods-moon",
    base: "base-cloud",
    palette: "midnight-jelly",
  },
  "robot-botu": {
    expression: "expression-botu-led",
    silhouette: "silhouette-shell",
    headpiece: "headpiece-botu-antenna",
    outfit: "outfit-botu-pod",
    prop: "prop-battery",
    frame: "frame-bulb",
    pods: "pods-pixel",
    base: "base-dock",
    palette: "mint-parade",
  },
  "robot-capsule": {
    expression: "expression-capsule-led",
    silhouette: "silhouette-shell",
    headpiece: "headpiece-capsule-antenna",
    outfit: "outfit-capsule-pod",
    prop: "prop-battery",
    frame: "frame-classic",
    pods: "pods-pixel",
    base: "base-dock",
    palette: "midnight-jelly",
  },
  "robot-dronecat": {
    expression: "expression-dronecat-led",
    silhouette: "silhouette-shell",
    headpiece: "headpiece-dronecat-antenna",
    outfit: "outfit-dronecat-pod",
    prop: "prop-battery",
    frame: "frame-bulb",
    pods: "pods-pixel",
    base: "base-dock",
    palette: "midnight-jelly",
  },
};

export function getPrototypeOptions(species: SpeciesId) {
  return CHARACTER_PROTOTYPE_OPTIONS.filter((item) => item.species === species);
}

export function getPrototypeById(id: CharacterPrototypeId) {
  return (
    CHARACTER_PROTOTYPE_OPTIONS.find((item) => item.id === id) ??
    CHARACTER_PROTOTYPE_OPTIONS[0]
  );
}

export function getDefaultPrototype(species: SpeciesId) {
  return getPrototypeById(DEFAULT_PROTOTYPE_BY_SPECIES[species]);
}

export function getPrototypePreset(id: CharacterPrototypeId) {
  return PROTOTYPE_PRESET_MAP[id] ?? {};
}

export function applyPrototypePreset<T extends Record<string, unknown>>(
  recipe: T,
  id: CharacterPrototypeId,
) {
  const preset = getPrototypePreset(id);
  return { ...recipe, ...preset };
}

export function ensurePrototypeForSpecies(
  species: SpeciesId,
  prototypeId: CharacterPrototypeId,
) {
  const matched = CHARACTER_PROTOTYPE_OPTIONS.find(
    (item) => item.id === prototypeId && item.species === species,
  );
  return matched?.id ?? DEFAULT_PROTOTYPE_BY_SPECIES[species];
}

export function getPrototypeToken(id: CharacterPrototypeId) {
  if (id.startsWith("human-")) return "HU";
  if (id.startsWith("animal-")) return "AN";
  if (id.startsWith("creature-")) return "CR";
  return "RB";
}

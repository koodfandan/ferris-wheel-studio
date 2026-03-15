import type { CharacterPrototypeId } from "./character-prototypes-v2";
import { applyPartOverride } from "./prototype-part-overrides-v2";
export type StudioSection = "series" | "build" | "inspect" | "shelf" | "collection";
export type StageMode = "assemble" | "inspect" | "shelf";
export type SpeciesId = "human" | "animal" | "creature" | "robot";
export type StudioSlot =
  | "expression"
  | "silhouette"
  | "headpiece"
  | "outfit"
  | "prop"
  | "frame"
  | "pods"
  | "base"
  | "palette";

export type PaletteId =
  | "vanilla-muse"
  | "peach-fizz"
  | "mint-parade"
  | "midnight-jelly";

export type PartSlot = Exclude<StudioSlot, "palette">;

export type PaletteOption = {
  id: PaletteId;
  label: string;
  blurb: string;
  finish: string;
  colors: {
    pageTop: string;
    pageBottom: string;
    panel: string;
    panelStrong: string;
    line: string;
    ink: string;
    muted: string;
    accent: string;
    accentSoft: string;
    accentStrong: string;
    shell: string;
    skin: string;
    blush: string;
    hair: string;
    body: string;
    prop: string;
    metal: string;
    glass: string;
    glow: string;
    glowSoft: string;
  };
};

export type PartOption = {
  id: string;
  slot: PartSlot;
  species: SpeciesId[];
  prototypes?: CharacterPrototypeId[];
  label: string;
  badge: string;
  blurb: string;
  chip: string;
  spatialTag?: string;
  spatialWeight?: number;
};

export type StudioRecipe = {
  species: SpeciesId;
  expression: string;
  silhouette: string;
  headpiece: string;
  outfit: string;
  prop: string;
  frame: string;
  pods: string;
  base: string;
  palette: PaletteId;
};

export const SECTION_OPTIONS: Array<{
  id: StudioSection;
  label: string;
  kicker: string;
  blurb: string;
}> = [
  {
    id: "series",
    label: "Series",
    kicker: "World Shelf",
    blurb: "Pick a toy universe, then start from a species base and matching mood pack.",
  },
  {
    id: "build",
    label: "Build",
    kicker: "Assembly Atelier",
    blurb: "Swap parts like modular blind-box pieces and build a character that feels collectible.",
  },
  {
    id: "inspect",
    label: "Inspect",
    kicker: "Face Check",
    blurb: "Read the expression, material, silhouette, and back view before saving the recipe.",
  },
  {
    id: "shelf",
    label: "Shelf",
    kicker: "Retail Stage",
    blurb: "Show the final figure like a boxed launch edition under a collector display light.",
  },
  {
    id: "collection",
    label: "Collection",
    kicker: "Saved Recipes",
    blurb: "Build a whole shelf of variants across doll, animal, creature, and robot families.",
  },
];

export const STAGE_MODE_OPTIONS: Array<{
  id: StageMode;
  label: string;
  blurb: string;
}> = [
  { id: "assemble", label: "Assemble", blurb: "Drag the figure and test parts in the workbench light." },
  { id: "inspect", label: "Inspect", blurb: "Sharper face read and more neutral material lighting." },
  { id: "shelf", label: "Shelf", blurb: "Retail turntable mood with softer theatrical light." },
];

export const SPECIES_OPTIONS: Array<{
  id: SpeciesId;
  label: string;
  chinese: string;
  badge: string;
  blurb: string;
}> = [
  {
    id: "human",
    label: "Doll Human",
    chinese: "人物",
    badge: "Core Line",
    blurb: "Big-head doll proportion with hair-led silhouette and outfit focus.",
  },
  {
    id: "animal",
    label: "Dream Animal",
    chinese: "动物",
    badge: "Pet Box",
    blurb: "Rounded fur shell, ear language, plush pose, and soft display cuteness.",
  },
  {
    id: "creature",
    label: "Moon Creature",
    chinese: "精灵",
    badge: "Night Fair",
    blurb: "Halo, fins, cape, and surreal carnival ornaments with dreamy proportions.",
  },
  {
    id: "robot",
    label: "Toy Robot",
    chinese: "机械宠物",
    badge: "Neo Plush",
    blurb: "Cute shell pieces, visor faces, dock bases, and lit accessory details.",
  },
];

export const SLOT_OPTIONS: Array<{
  id: StudioSlot;
  label: string;
  blurb: string;
}> = [
  { id: "expression", label: "Expression", blurb: "Face print and mood" },
  { id: "silhouette", label: "Silhouette", blurb: "Hair, fur, shell shape" },
  { id: "headpiece", label: "Headpiece", blurb: "Bow, halo, crown, antenna" },
  { id: "outfit", label: "Outfit", blurb: "Main body costume" },
  { id: "prop", label: "Prop", blurb: "Handheld collectible" },
  { id: "frame", label: "Frame", blurb: "Ferris or theme frame" },
  { id: "pods", label: "Pods", blurb: "Ride pods or side capsules" },
  { id: "base", label: "Base", blurb: "Display platform" },
  { id: "palette", label: "Palette", blurb: "Color and finish pack" },
];

export const PALETTE_OPTIONS: PaletteOption[] = [
  {
    id: "vanilla-muse",
    label: "Vanilla Muse",
    blurb: "Cream shell, butter gold trim, soft coral blush.",
    finish: "PVC matte + satin trim",
    colors: {
      pageTop: "#fff8f1",
      pageBottom: "#f6decf",
      panel: "rgba(255, 250, 245, 0.82)",
      panelStrong: "rgba(255, 246, 238, 0.95)",
      line: "rgba(151, 111, 86, 0.18)",
      ink: "#3f2d22",
      muted: "#856a5a",
      accent: "#ef7d66",
      accentSoft: "#ffd7c7",
      accentStrong: "#d46f43",
      shell: "#fff4ea",
      skin: "#fff3e9",
      blush: "#f7b7ab",
      hair: "#5b4337",
      body: "#f6d8cb",
      prop: "#ffb15b",
      metal: "#d8b678",
      glass: "#f9dfaa",
      glow: "#ffd36a",
      glowSoft: "#fff0c3",
    },
  },
  {
    id: "peach-fizz",
    label: "Peach Fizz",
    blurb: "Candy peach body, strawberry trim, milky warm stage.",
    finish: "PVC matte + gloss candy pods",
    colors: {
      pageTop: "#fff4f1",
      pageBottom: "#ffd9cf",
      panel: "rgba(255, 247, 244, 0.82)",
      panelStrong: "rgba(255, 240, 236, 0.96)",
      line: "rgba(163, 87, 75, 0.2)",
      ink: "#4b2928",
      muted: "#8f5f56",
      accent: "#fa7a74",
      accentSoft: "#ffc9c2",
      accentStrong: "#db5848",
      shell: "#fff1eb",
      skin: "#fff0ea",
      blush: "#ffb4b0",
      hair: "#6b3e3b",
      body: "#ffd3cb",
      prop: "#ffb467",
      metal: "#e0b675",
      glass: "#ffd59c",
      glow: "#ffbe76",
      glowSoft: "#ffe7c5",
    },
  },
  {
    id: "mint-parade",
    label: "Mint Parade",
    blurb: "Cool mint body, pearl shell, icy toy capsule glow.",
    finish: "Pearl matte + frosted clear pods",
    colors: {
      pageTop: "#f7fcfb",
      pageBottom: "#d9f0ed",
      panel: "rgba(248, 255, 253, 0.82)",
      panelStrong: "rgba(238, 251, 248, 0.95)",
      line: "rgba(78, 114, 113, 0.18)",
      ink: "#264341",
      muted: "#54706d",
      accent: "#6ec8ba",
      accentSoft: "#c6efe6",
      accentStrong: "#49a99a",
      shell: "#f2f9f7",
      skin: "#fff5ef",
      blush: "#f0c6c6",
      hair: "#44706d",
      body: "#cfe8e4",
      prop: "#96d8ff",
      metal: "#9fc7d8",
      glass: "#d2fbff",
      glow: "#9de6f5",
      glowSoft: "#defcff",
    },
  },
  {
    id: "midnight-jelly",
    label: "Midnight Jelly",
    blurb: "Night-shelf navy mood with pearl cream character and lit halo parts.",
    finish: "Soft matte + night showcase glow",
    colors: {
      pageTop: "#f3f0ff",
      pageBottom: "#d4d4f7",
      panel: "rgba(252, 249, 255, 0.82)",
      panelStrong: "rgba(241, 238, 252, 0.95)",
      line: "rgba(86, 81, 144, 0.18)",
      ink: "#252245",
      muted: "#67638d",
      accent: "#8d7df2",
      accentSoft: "#ddd6ff",
      accentStrong: "#5d59b6",
      shell: "#f8f5ff",
      skin: "#fff2ed",
      blush: "#f1b6cf",
      hair: "#47428a",
      body: "#ddd6ff",
      prop: "#7aa0ff",
      metal: "#b8b1ec",
      glass: "#dedbff",
      glow: "#bcb7ff",
      glowSoft: "#efecff",
    },
  },
];

export const PART_OPTIONS: PartOption[] = [
  {
    id: "expression-smile",
    slot: "expression",
    species: ["human", "animal", "creature"],
    label: "Smile Print",
    badge: "Classic",
    blurb: "Open eyes and a soft blush smile.",
    chip: "#f7b7ab",
  },
  {
    id: "expression-sleepy",
    slot: "expression",
    species: ["human", "animal", "creature", "robot"],
    label: "Sleepy Print",
    badge: "Dream",
    blurb: "Curved closed eyes and tiny mouth.",
    chip: "#bca4ff",
  },
  {
    id: "expression-wink",
    slot: "expression",
    species: ["human", "animal"],
    label: "Wink Print",
    badge: "Hero",
    blurb: "One open eye with a bouncy cheek mood.",
    chip: "#ff9d8f",
  },
  {
    id: "expression-led",
    slot: "expression",
    species: ["robot"],
    label: "LED Visor",
    badge: "Neo",
    blurb: "Light-strip faceplate with minimal mouth slit.",
    chip: "#79d8ff",
  },

  {
    id: "silhouette-bob",
    slot: "silhouette",
    species: ["human"],
    prototypes: ["human-luna", "human-aria"],
    label: "Bob Cap",
    badge: "Hair",
    blurb: "Round bob shell that frames the face clearly.",
    chip: "#8a6552",
  },
  {
    id: "silhouette-curl",
    slot: "silhouette",
    species: ["human"],
    prototypes: ["human-coco"],
    label: "Candy Curl",
    badge: "Hair",
    blurb: "Chunky toy curls with a sweeter outer line.",
    chip: "#6e4d42",
  },
  {
    id: "silhouette-bunny",
    slot: "silhouette",
    species: ["animal"],
    prototypes: ["animal-bunny", "animal-fox"],
    label: "Bunny Fur",
    badge: "Fur",
    blurb: "Tall ears and plush cheek cover.",
    chip: "#f0d5d5",
  },
  {
    id: "silhouette-bear",
    slot: "silhouette",
    species: ["animal"],
    prototypes: ["animal-bear", "animal-fox"],
    label: "Bear Fur",
    badge: "Fur",
    blurb: "Round ears and a compact plush shell.",
    chip: "#b8967a",
  },
  {
    id: "silhouette-foam",
    slot: "silhouette",
    species: ["creature"],
    prototypes: ["creature-axolotl", "creature-cloudling", "creature-starmoth"],
    label: "Foam Crest",
    badge: "Crest",
    blurb: "Cloudy crown silhouette for night-fair creatures.",
    chip: "#d9cfff",
  },
  {
    id: "silhouette-shell",
    slot: "silhouette",
    species: ["robot"],
    prototypes: ["robot-botu", "robot-capsule", "robot-dronecat"],
    label: "Helmet Dome",
    badge: "Shell",
    blurb: "Rounded shell plate that reads more like a toy casing.",
    chip: "#9ecae8",
  },

  {
    id: "headpiece-cloud",
    slot: "headpiece",
    species: ["human", "animal", "creature"],
    label: "Cloud Crown",
    badge: "Dream",
    blurb: "Puffy cloud cap stacked above the head.",
    chip: "#eef7ff",
  },
  {
    id: "headpiece-bow",
    slot: "headpiece",
    species: ["human", "animal"],
    label: "Coral Bow",
    badge: "Cute",
    blurb: "Classic collector bow with glossy center bead.",
    chip: "#ff9d8f",
  },
  {
    id: "headpiece-halo",
    slot: "headpiece",
    species: ["creature", "human"],
    label: "Moon Halo",
    badge: "Night",
    blurb: "Floating halo ring behind the upper head silhouette.",
    chip: "#dac8ff",
  },
  {
    id: "headpiece-antenna",
    slot: "headpiece",
    species: ["robot"],
    label: "Twin Antenna",
    badge: "Neo",
    blurb: "Toy antenna pair with glowing star tips.",
    chip: "#8bdfff",
  },

  {
    id: "outfit-pajama",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-luna"],
    label: "Pajama Body",
    badge: "Soft",
    blurb: "Rounded sleeper outfit with soft cuffs.",
    chip: "#ffd7cf",
  },
  {
    id: "outfit-fairdress",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-coco", "human-aria"],
    label: "Fair Dress",
    badge: "Stage",
    blurb: "A short-stage dress shell with a ribbon waist.",
    chip: "#ffc4b8",
  },
  {
    id: "outfit-plush",
    slot: "outfit",
    species: ["animal"],
    prototypes: ["animal-bunny", "animal-bear", "animal-fox"],
    label: "Plush Suit",
    badge: "Pet",
    blurb: "Pillow-round body with paw-like sleeves.",
    chip: "#dfc8bb",
  },
  {
    id: "outfit-cape",
    slot: "outfit",
    species: ["creature"],
    prototypes: ["creature-axolotl", "creature-cloudling", "creature-starmoth"],
    label: "Night Cape",
    badge: "Night",
    blurb: "Fantasy cape block with a moonlike hem.",
    chip: "#cbc1ff",
  },
  {
    id: "outfit-pod",
    slot: "outfit",
    species: ["robot"],
    prototypes: ["robot-botu", "robot-capsule", "robot-dronecat"],
    label: "Pod Suit",
    badge: "Neo",
    blurb: "Collector shell torso with dock ports.",
    chip: "#c5dff1",
  },

  {
    id: "prop-ticket",
    slot: "prop",
    species: ["human", "animal"],
    label: "Ticket Strip",
    badge: "Fair",
    blurb: "A folded ticket prop for the amusement motif.",
    chip: "#ffc56d",
    spatialTag: "Slim reach",
    spatialWeight: 0,
  },
  {
    id: "prop-wand",
    slot: "prop",
    species: ["human", "creature"],
    label: "Star Wand",
    badge: "Dream",
    blurb: "Bright wand silhouette that reads well on shelf shots.",
    chip: "#ffe192",
    spatialTag: "Tall slim",
    spatialWeight: 1,
  },
  {
    id: "prop-lantern",
    slot: "prop",
    species: ["creature"],
    label: "Moon Lantern",
    badge: "Night",
    blurb: "A hanging lantern accent for darker palettes.",
    chip: "#bdb1ff",
    spatialTag: "Deep lantern",
    spatialWeight: 3,
  },
  {
    id: "prop-battery",
    slot: "prop",
    species: ["robot"],
    label: "Battery Core",
    badge: "Neo",
    blurb: "Cute battery heart for the toy robot family.",
    chip: "#6dcfff",
    spatialTag: "Compact block",
    spatialWeight: 2,
  },

  {
    id: "frame-classic",
    slot: "frame",
    species: ["human", "animal", "creature", "robot"],
    label: "Classic Ring",
    badge: "Wheel",
    blurb: "Balanced ferris silhouette with matte trim.",
    chip: "#f4d48a",
    spatialTag: "Balanced clearance",
    spatialWeight: 1,
  },
  {
    id: "frame-candy",
    slot: "frame",
    species: ["human", "animal"],
    label: "Candy Wheel",
    badge: "Sweet",
    blurb: "Double candy ring with playful bead markers.",
    chip: "#ffb29c",
    spatialTag: "Deep frame",
    spatialWeight: 3,
  },
  {
    id: "frame-pearl",
    slot: "frame",
    species: ["creature"],
    label: "Pearl Halo Frame",
    badge: "Night",
    blurb: "Open halo arc with pearl nodes and moon trim.",
    chip: "#d7ccff",
    spatialTag: "Open clearance",
    spatialWeight: 0,
  },
  {
    id: "frame-bulb",
    slot: "frame",
    species: ["robot"],
    label: "Bulb Grid",
    badge: "Neo",
    blurb: "Segmented ring with bulb lights and panel joints.",
    chip: "#90e1ff",
    spatialTag: "Wide ring",
    spatialWeight: 2,
  },

  {
    id: "pods-moon",
    slot: "pods",
    species: ["human", "animal", "creature"],
    label: "Moon Pods",
    badge: "Dream",
    blurb: "Rounded moon capsules with warm clear windows.",
    chip: "#ffe8af",
  },
  {
    id: "pods-candy",
    slot: "pods",
    species: ["human", "animal"],
    label: "Candy Pods",
    badge: "Sweet",
    blurb: "Hard-candy capsules with saturated shells.",
    chip: "#ffbca7",
  },
  {
    id: "pods-plush",
    slot: "pods",
    species: ["animal"],
    label: "Plush Pods",
    badge: "Pet",
    blurb: "Soft oval carriers with plush seams.",
    chip: "#dfd0c6",
  },
  {
    id: "pods-pixel",
    slot: "pods",
    species: ["robot"],
    label: "Pixel Pods",
    badge: "Neo",
    blurb: "Boxy clear pods with lit tech frames.",
    chip: "#99ddff",
  },

  {
    id: "base-cloud",
    slot: "base",
    species: ["human", "animal", "creature"],
    label: "Cloud Platform",
    badge: "Dream",
    blurb: "Soft cloud platform with a candy stage disc.",
    chip: "#f5e6f4",
    spatialTag: "Low profile",
    spatialWeight: 0,
  },
  {
    id: "base-ticket",
    slot: "base",
    species: ["human", "animal"],
    label: "Ticket Booth",
    badge: "Fair",
    blurb: "Playful booth base with a front shelf line.",
    chip: "#ffd28d",
    spatialTag: "Mid profile",
    spatialWeight: 2,
  },
  {
    id: "base-dock",
    slot: "base",
    species: ["robot"],
    label: "Charging Dock",
    badge: "Neo",
    blurb: "Docked platform with a lit trim lip and ports.",
    chip: "#a8daf8",
    spatialTag: "Low dock",
    spatialWeight: 1,
  },
  {
    id: "expression-luna-smile",
    slot: "expression",
    species: ["human"],
    prototypes: ["human-luna"],
    label: "Luna Smile",
    badge: "Luna",
    blurb: "Soft open-eye smile made for Luna.",
    chip: "#f7b7ab",
  },
  {
    id: "expression-luna-dream",
    slot: "expression",
    species: ["human"],
    prototypes: ["human-luna"],
    label: "Luna Dream",
    badge: "Luna",
    blurb: "Gentle sleepy face for Luna.",
    chip: "#d8c9ff",
  },
  {
    id: "headpiece-luna-cloud",
    slot: "headpiece",
    species: ["human"],
    prototypes: ["human-luna"],
    label: "Luna Cloud",
    badge: "Luna",
    blurb: "Cloud cap tuned for Luna profile.",
    chip: "#eef7ff",
  },
  {
    id: "headpiece-luna-halo",
    slot: "headpiece",
    species: ["human"],
    prototypes: ["human-luna"],
    label: "Luna Halo",
    badge: "Luna",
    blurb: "Moon halo tuned for Luna profile.",
    chip: "#dac8ff",
  },
  {
    id: "outfit-luna-pajama",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-luna"],
    label: "Luna Pajama",
    badge: "Luna",
    blurb: "Cream pajama shell for Luna.",
    chip: "#ffd7cf",
  },
  {
    id: "outfit-luna-fairdress",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-luna"],
    label: "Luna Fair Dress",
    badge: "Luna",
    blurb: "Stage dress shell for Luna.",
    chip: "#ffc4b8",
  },
  {
    id: "expression-coco-wink",
    slot: "expression",
    species: ["human"],
    prototypes: ["human-coco"],
    label: "Coco Wink",
    badge: "Coco",
    blurb: "Playful wink face for Coco.",
    chip: "#ff9d8f",
  },
  {
    id: "expression-coco-smile",
    slot: "expression",
    species: ["human"],
    prototypes: ["human-coco"],
    label: "Coco Smile",
    badge: "Coco",
    blurb: "Warm smile face for Coco.",
    chip: "#f7b7ab",
  },
  {
    id: "headpiece-coco-bow",
    slot: "headpiece",
    species: ["human"],
    prototypes: ["human-coco"],
    label: "Coco Bow",
    badge: "Coco",
    blurb: "Candy bow for Coco line.",
    chip: "#ff9d8f",
  },
  {
    id: "headpiece-coco-cloud",
    slot: "headpiece",
    species: ["human"],
    prototypes: ["human-coco"],
    label: "Coco Cloud",
    badge: "Coco",
    blurb: "Dessert cloud cap for Coco line.",
    chip: "#eef7ff",
  },
  {
    id: "outfit-coco-fairdress",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-coco"],
    label: "Coco Fair Dress",
    badge: "Coco",
    blurb: "Candy stage dress for Coco line.",
    chip: "#ffc4b8",
  },
  {
    id: "outfit-coco-pajama",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-coco"],
    label: "Coco Pajama",
    badge: "Coco",
    blurb: "Soft sleepwear variant for Coco line.",
    chip: "#ffd7cf",
  },
  {
    id: "expression-aria-dream",
    slot: "expression",
    species: ["human"],
    prototypes: ["human-aria"],
    label: "Aria Dream",
    badge: "Aria",
    blurb: "Dreamy showtime face for Aria.",
    chip: "#d8c9ff",
  },
  {
    id: "expression-aria-smile",
    slot: "expression",
    species: ["human"],
    prototypes: ["human-aria"],
    label: "Aria Smile",
    badge: "Aria",
    blurb: "Hero smile face for Aria.",
    chip: "#f7b7ab",
  },
  {
    id: "headpiece-aria-halo",
    slot: "headpiece",
    species: ["human"],
    prototypes: ["human-aria"],
    label: "Aria Halo",
    badge: "Aria",
    blurb: "Star halo set for Aria.",
    chip: "#dac8ff",
  },
  {
    id: "headpiece-aria-bow",
    slot: "headpiece",
    species: ["human"],
    prototypes: ["human-aria"],
    label: "Aria Bow",
    badge: "Aria",
    blurb: "Ribbon bow set for Aria.",
    chip: "#ff9d8f",
  },
  {
    id: "outfit-aria-fairdress",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-aria"],
    label: "Aria Fair Dress",
    badge: "Aria",
    blurb: "Show dress shell for Aria.",
    chip: "#ffc4b8",
  },
  {
    id: "outfit-aria-pajama",
    slot: "outfit",
    species: ["human"],
    prototypes: ["human-aria"],
    label: "Aria Lounge",
    badge: "Aria",
    blurb: "Cozy dress-down look for Aria.",
    chip: "#ffd7cf",
  },
  {
    id: "expression-bunny-smile",
    slot: "expression",
    species: ["animal"],
    prototypes: ["animal-bunny"],
    label: "Bunny Smile",
    badge: "Bunny",
    blurb: "Bright bunny smile print.",
    chip: "#f7b7ab",
  },
  {
    id: "expression-bunny-wink",
    slot: "expression",
    species: ["animal"],
    prototypes: ["animal-bunny"],
    label: "Bunny Wink",
    badge: "Bunny",
    blurb: "Playful bunny wink print.",
    chip: "#ff9d8f",
  },
  {
    id: "headpiece-bunny-bow",
    slot: "headpiece",
    species: ["animal"],
    prototypes: ["animal-bunny"],
    label: "Bunny Bow",
    badge: "Bunny",
    blurb: "Bow headpiece for bunny line.",
    chip: "#ff9d8f",
  },
  {
    id: "headpiece-bunny-cloud",
    slot: "headpiece",
    species: ["animal"],
    prototypes: ["animal-bunny"],
    label: "Bunny Cloud",
    badge: "Bunny",
    blurb: "Cloud headpiece for bunny line.",
    chip: "#eef7ff",
  },
  {
    id: "outfit-bunny-plush",
    slot: "outfit",
    species: ["animal"],
    prototypes: ["animal-bunny"],
    label: "Bunny Plush",
    badge: "Bunny",
    blurb: "Round plush body for bunny line.",
    chip: "#dfc8bb",
  },
  {
    id: "outfit-bunny-plush-puff",
    slot: "outfit",
    species: ["animal"],
    prototypes: ["animal-bunny"],
    label: "Bunny Puff Suit",
    badge: "Bunny",
    blurb: "Extra puffy plush body for bunny line.",
    chip: "#e9d4c9",
  },
  {
    id: "expression-bear-dream",
    slot: "expression",
    species: ["animal"],
    prototypes: ["animal-bear"],
    label: "Bear Dream",
    badge: "Bear",
    blurb: "Sleepy bear face print.",
    chip: "#d8c9ff",
  },
  {
    id: "expression-bear-smile",
    slot: "expression",
    species: ["animal"],
    prototypes: ["animal-bear"],
    label: "Bear Smile",
    badge: "Bear",
    blurb: "Warm bear smile print.",
    chip: "#f7b7ab",
  },
  {
    id: "headpiece-bear-cloud",
    slot: "headpiece",
    species: ["animal"],
    prototypes: ["animal-bear"],
    label: "Bear Cloud",
    badge: "Bear",
    blurb: "Cloud cap for bear line.",
    chip: "#eef7ff",
  },
  {
    id: "headpiece-bear-bow",
    slot: "headpiece",
    species: ["animal"],
    prototypes: ["animal-bear"],
    label: "Bear Bow",
    badge: "Bear",
    blurb: "Ribbon cap for bear line.",
    chip: "#ff9d8f",
  },
  {
    id: "outfit-bear-plush",
    slot: "outfit",
    species: ["animal"],
    prototypes: ["animal-bear"],
    label: "Bear Plush",
    badge: "Bear",
    blurb: "Dense plush body for bear line.",
    chip: "#dfc8bb",
  },
  {
    id: "outfit-bear-plush-cozy",
    slot: "outfit",
    species: ["animal"],
    prototypes: ["animal-bear"],
    label: "Bear Cozy Suit",
    badge: "Bear",
    blurb: "Cozy plush body for bear line.",
    chip: "#d6c0b4",
  },
  {
    id: "expression-fox-wink",
    slot: "expression",
    species: ["animal"],
    prototypes: ["animal-fox"],
    label: "Fox Wink",
    badge: "Fox",
    blurb: "Mischief wink face for fox line.",
    chip: "#ff9d8f",
  },
  {
    id: "expression-fox-dream",
    slot: "expression",
    species: ["animal"],
    prototypes: ["animal-fox"],
    label: "Fox Dream",
    badge: "Fox",
    blurb: "Sleepy fox face for fox line.",
    chip: "#d8c9ff",
  },
  {
    id: "headpiece-fox-bow",
    slot: "headpiece",
    species: ["animal"],
    prototypes: ["animal-fox"],
    label: "Fox Bow",
    badge: "Fox",
    blurb: "Bow top for fox line.",
    chip: "#ff9d8f",
  },
  {
    id: "headpiece-fox-cloud",
    slot: "headpiece",
    species: ["animal"],
    prototypes: ["animal-fox"],
    label: "Fox Cloud",
    badge: "Fox",
    blurb: "Cloud top for fox line.",
    chip: "#eef7ff",
  },
  {
    id: "outfit-fox-plush",
    slot: "outfit",
    species: ["animal"],
    prototypes: ["animal-fox"],
    label: "Fox Plush",
    badge: "Fox",
    blurb: "Slim plush body for fox line.",
    chip: "#dfc8bb",
  },
  {
    id: "outfit-fox-plush-cape",
    slot: "outfit",
    species: ["animal"],
    prototypes: ["animal-fox"],
    label: "Fox Cape Plush",
    badge: "Fox",
    blurb: "Cape plush body for fox line.",
    chip: "#d9c4b8",
  },
  {
    id: "expression-axo-dream",
    slot: "expression",
    species: ["creature"],
    prototypes: ["creature-axolotl"],
    label: "Axo Dream",
    badge: "Axo",
    blurb: "Sleepy glow face for axo line.",
    chip: "#d8c9ff",
  },
  {
    id: "expression-axo-smile",
    slot: "expression",
    species: ["creature"],
    prototypes: ["creature-axolotl"],
    label: "Axo Smile",
    badge: "Axo",
    blurb: "Bright smile face for axo line.",
    chip: "#f7b7ab",
  },
  {
    id: "headpiece-axo-halo",
    slot: "headpiece",
    species: ["creature"],
    prototypes: ["creature-axolotl"],
    label: "Axo Halo",
    badge: "Axo",
    blurb: "Halo set for axo line.",
    chip: "#dac8ff",
  },
  {
    id: "headpiece-axo-cloud",
    slot: "headpiece",
    species: ["creature"],
    prototypes: ["creature-axolotl"],
    label: "Axo Cloud",
    badge: "Axo",
    blurb: "Cloud set for axo line.",
    chip: "#eef7ff",
  },
  {
    id: "outfit-axo-cape",
    slot: "outfit",
    species: ["creature"],
    prototypes: ["creature-axolotl"],
    label: "Axo Cape",
    badge: "Axo",
    blurb: "Moon cape body for axo line.",
    chip: "#cbc1ff",
  },
  {
    id: "outfit-axo-cape-foam",
    slot: "outfit",
    species: ["creature"],
    prototypes: ["creature-axolotl"],
    label: "Axo Foam Cape",
    badge: "Axo",
    blurb: "Foam edge cape body for axo line.",
    chip: "#c4b8ff",
  },
  {
    id: "expression-cloudling-smile",
    slot: "expression",
    species: ["creature"],
    prototypes: ["creature-cloudling"],
    label: "Cloudling Smile",
    badge: "Cloud",
    blurb: "Soft smile face for cloudling line.",
    chip: "#f7b7ab",
  },
  {
    id: "expression-cloudling-dream",
    slot: "expression",
    species: ["creature"],
    prototypes: ["creature-cloudling"],
    label: "Cloudling Dream",
    badge: "Cloud",
    blurb: "Dream face for cloudling line.",
    chip: "#d8c9ff",
  },
  {
    id: "headpiece-cloudling-cloud",
    slot: "headpiece",
    species: ["creature"],
    prototypes: ["creature-cloudling"],
    label: "Cloudling Crown",
    badge: "Cloud",
    blurb: "Cloud crown for cloudling line.",
    chip: "#eef7ff",
  },
  {
    id: "headpiece-cloudling-halo",
    slot: "headpiece",
    species: ["creature"],
    prototypes: ["creature-cloudling"],
    label: "Cloudling Halo",
    badge: "Cloud",
    blurb: "Halo ring for cloudling line.",
    chip: "#dac8ff",
  },
  {
    id: "outfit-cloudling-cape",
    slot: "outfit",
    species: ["creature"],
    prototypes: ["creature-cloudling"],
    label: "Cloudling Cape",
    badge: "Cloud",
    blurb: "Dream cape body for cloudling line.",
    chip: "#cbc1ff",
  },
  {
    id: "outfit-cloudling-cape-soft",
    slot: "outfit",
    species: ["creature"],
    prototypes: ["creature-cloudling"],
    label: "Cloudling Soft Cape",
    badge: "Cloud",
    blurb: "Soft cape body for cloudling line.",
    chip: "#cfc7ff",
  },
  {
    id: "expression-starmoth-dream",
    slot: "expression",
    species: ["creature"],
    prototypes: ["creature-starmoth"],
    label: "StarMoth Dream",
    badge: "Moth",
    blurb: "Dream face for starmoth line.",
    chip: "#d8c9ff",
  },
  {
    id: "expression-starmoth-smile",
    slot: "expression",
    species: ["creature"],
    prototypes: ["creature-starmoth"],
    label: "StarMoth Smile",
    badge: "Moth",
    blurb: "Smile face for starmoth line.",
    chip: "#f7b7ab",
  },
  {
    id: "headpiece-starmoth-halo",
    slot: "headpiece",
    species: ["creature"],
    prototypes: ["creature-starmoth"],
    label: "StarMoth Halo",
    badge: "Moth",
    blurb: "Halo set for starmoth line.",
    chip: "#dac8ff",
  },
  {
    id: "headpiece-starmoth-cloud",
    slot: "headpiece",
    species: ["creature"],
    prototypes: ["creature-starmoth"],
    label: "StarMoth Cloud",
    badge: "Moth",
    blurb: "Cloud set for starmoth line.",
    chip: "#eef7ff",
  },
  {
    id: "outfit-starmoth-cape",
    slot: "outfit",
    species: ["creature"],
    prototypes: ["creature-starmoth"],
    label: "StarMoth Cape",
    badge: "Moth",
    blurb: "Wing cape body for starmoth line.",
    chip: "#cbc1ff",
  },
  {
    id: "outfit-starmoth-cape-shine",
    slot: "outfit",
    species: ["creature"],
    prototypes: ["creature-starmoth"],
    label: "StarMoth Shine Cape",
    badge: "Moth",
    blurb: "Shine cape body for starmoth line.",
    chip: "#beb2ff",
  },
  {
    id: "expression-botu-led",
    slot: "expression",
    species: ["robot"],
    prototypes: ["robot-botu"],
    label: "BotU LED",
    badge: "BotU",
    blurb: "LED visor face for BotU line.",
    chip: "#79d8ff",
  },
  {
    id: "expression-botu-dream",
    slot: "expression",
    species: ["robot"],
    prototypes: ["robot-botu"],
    label: "BotU Dream",
    badge: "BotU",
    blurb: "Sleepy visor face for BotU line.",
    chip: "#9dcfff",
  },
  {
    id: "headpiece-botu-antenna",
    slot: "headpiece",
    species: ["robot"],
    prototypes: ["robot-botu"],
    label: "BotU Antenna",
    badge: "BotU",
    blurb: "Twin antenna for BotU line.",
    chip: "#8bdfff",
  },
  {
    id: "headpiece-botu-antenna-plus",
    slot: "headpiece",
    species: ["robot"],
    prototypes: ["robot-botu"],
    label: "BotU Antenna+",
    badge: "BotU",
    blurb: "Enhanced antenna for BotU line.",
    chip: "#77d2ff",
  },
  {
    id: "outfit-botu-pod",
    slot: "outfit",
    species: ["robot"],
    prototypes: ["robot-botu"],
    label: "BotU Pod",
    badge: "BotU",
    blurb: "Core pod shell for BotU line.",
    chip: "#c5dff1",
  },
  {
    id: "outfit-botu-pod-mk2",
    slot: "outfit",
    species: ["robot"],
    prototypes: ["robot-botu"],
    label: "BotU Pod Mk2",
    badge: "BotU",
    blurb: "Upgraded pod shell for BotU line.",
    chip: "#bbd8eb",
  },
  {
    id: "expression-capsule-led",
    slot: "expression",
    species: ["robot"],
    prototypes: ["robot-capsule"],
    label: "Capsule LED",
    badge: "Capsule",
    blurb: "LED visor face for capsule line.",
    chip: "#79d8ff",
  },
  {
    id: "expression-capsule-dream",
    slot: "expression",
    species: ["robot"],
    prototypes: ["robot-capsule"],
    label: "Capsule Dream",
    badge: "Capsule",
    blurb: "Sleepy visor face for capsule line.",
    chip: "#9dcfff",
  },
  {
    id: "headpiece-capsule-antenna",
    slot: "headpiece",
    species: ["robot"],
    prototypes: ["robot-capsule"],
    label: "Capsule Antenna",
    badge: "Capsule",
    blurb: "Antenna top for capsule line.",
    chip: "#8bdfff",
  },
  {
    id: "headpiece-capsule-antenna-plus",
    slot: "headpiece",
    species: ["robot"],
    prototypes: ["robot-capsule"],
    label: "Capsule Antenna+",
    badge: "Capsule",
    blurb: "Enhanced antenna top for capsule line.",
    chip: "#77d2ff",
  },
  {
    id: "outfit-capsule-pod",
    slot: "outfit",
    species: ["robot"],
    prototypes: ["robot-capsule"],
    label: "Capsule Pod",
    badge: "Capsule",
    blurb: "Capsule pod shell for capsule line.",
    chip: "#c5dff1",
  },
  {
    id: "outfit-capsule-pod-mk2",
    slot: "outfit",
    species: ["robot"],
    prototypes: ["robot-capsule"],
    label: "Capsule Pod Mk2",
    badge: "Capsule",
    blurb: "Alt capsule shell for capsule line.",
    chip: "#bbd8eb",
  },
  {
    id: "expression-dronecat-led",
    slot: "expression",
    species: ["robot"],
    prototypes: ["robot-dronecat"],
    label: "DroneCat LED",
    badge: "DroneCat",
    blurb: "LED visor face for dronecat line.",
    chip: "#79d8ff",
  },
  {
    id: "expression-dronecat-dream",
    slot: "expression",
    species: ["robot"],
    prototypes: ["robot-dronecat"],
    label: "DroneCat Dream",
    badge: "DroneCat",
    blurb: "Sleepy visor face for dronecat line.",
    chip: "#9dcfff",
  },
  {
    id: "headpiece-dronecat-antenna",
    slot: "headpiece",
    species: ["robot"],
    prototypes: ["robot-dronecat"],
    label: "DroneCat Antenna",
    badge: "DroneCat",
    blurb: "Antenna top for dronecat line.",
    chip: "#8bdfff",
  },
  {
    id: "headpiece-dronecat-antenna-plus",
    slot: "headpiece",
    species: ["robot"],
    prototypes: ["robot-dronecat"],
    label: "DroneCat Antenna+",
    badge: "DroneCat",
    blurb: "Enhanced antenna top for dronecat line.",
    chip: "#77d2ff",
  },
  {
    id: "outfit-dronecat-pod",
    slot: "outfit",
    species: ["robot"],
    prototypes: ["robot-dronecat"],
    label: "DroneCat Pod",
    badge: "DroneCat",
    blurb: "Pod shell for dronecat line.",
    chip: "#c5dff1",
  },
  {
    id: "outfit-dronecat-pod-mk2",
    slot: "outfit",
    species: ["robot"],
    prototypes: ["robot-dronecat"],
    label: "DroneCat Pod Mk2",
    badge: "DroneCat",
    blurb: "Alt pod shell for dronecat line.",
    chip: "#bbd8eb",
  },
];

export function createStudioRecipe(species: SpeciesId = "human", prototypeId?: CharacterPrototypeId): StudioRecipe {
  return {
    species,
    expression: firstPart(species, "expression", prototypeId),
    silhouette: firstPart(species, "silhouette", prototypeId),
    headpiece: firstPart(species, "headpiece", prototypeId),
    outfit: firstPart(species, "outfit", prototypeId),
    prop: firstPart(species, "prop", prototypeId),
    frame: firstPart(species, "frame", prototypeId),
    pods: firstPart(species, "pods", prototypeId),
    base: firstPart(species, "base", prototypeId),
    palette: "vanilla-muse",
  };
}

export function repairStudioRecipe(
  recipe: StudioRecipe,
  species: SpeciesId,
  prototypeId?: CharacterPrototypeId,
): StudioRecipe {
  return {
    ...recipe,
    species,
    expression: ensurePart(recipe.expression, species, "expression", prototypeId),
    silhouette: ensurePart(recipe.silhouette, species, "silhouette", prototypeId),
    headpiece: ensurePart(recipe.headpiece, species, "headpiece", prototypeId),
    outfit: ensurePart(recipe.outfit, species, "outfit", prototypeId),
    prop: ensurePart(recipe.prop, species, "prop", prototypeId),
    frame: ensurePart(recipe.frame, species, "frame", prototypeId),
    pods: ensurePart(recipe.pods, species, "pods", prototypeId),
    base: ensurePart(recipe.base, species, "base", prototypeId),
  };
}

export function randomizeStudioRecipe(species: SpeciesId, prototypeId?: CharacterPrototypeId): StudioRecipe {
  return {
    species,
    expression: randomPart(species, "expression", prototypeId),
    silhouette: randomPart(species, "silhouette", prototypeId),
    headpiece: randomPart(species, "headpiece", prototypeId),
    outfit: randomPart(species, "outfit", prototypeId),
    prop: randomPart(species, "prop", prototypeId),
    frame: randomPart(species, "frame", prototypeId),
    pods: randomPart(species, "pods", prototypeId),
    base: randomPart(species, "base", prototypeId),
    palette: PALETTE_OPTIONS[Math.floor(Math.random() * PALETTE_OPTIONS.length)].id,
  };
}

export function getSlotOptions(species: SpeciesId, slot: PartSlot, prototypeId?: CharacterPrototypeId): PartOption[] {
  const scopedBySpecies = PART_OPTIONS.filter(
    (item) => item.slot === slot && item.species.includes(species),
  );

  if (!prototypeId) {
    return scopedBySpecies.map(applyPartOverride);
  }

  const prototypeScoped = scopedBySpecies.filter((item) =>
    item.prototypes?.includes(prototypeId),
  );

  const exclusiveSlots: PartSlot[] = ["expression", "headpiece", "outfit"];
  if (exclusiveSlots.includes(slot)) {
    return (prototypeScoped.length ? prototypeScoped : scopedBySpecies).map(applyPartOverride);
  }

  if (!prototypeScoped.length) {
    return scopedBySpecies.filter((item) => !item.prototypes?.length).map(applyPartOverride);
  }

  const sharedSlots: PartSlot[] = ["prop", "frame", "pods", "base", "silhouette"];
  if (!sharedSlots.includes(slot)) {
    if (prototypeScoped.length >= 2) {
      return prototypeScoped.map(applyPartOverride);
    }

    const fallbackFromSpecies = scopedBySpecies.filter(
      (item) => !prototypeScoped.some((scoped) => scoped.id === item.id),
    );
    return [...prototypeScoped, ...fallbackFromSpecies].map(applyPartOverride);
  }

  const sharedFallback = scopedBySpecies.filter((item) => !item.prototypes?.length);
  return [...prototypeScoped, ...sharedFallback].map(applyPartOverride);
}

export function getPartOption(partId: string) {
  const part = PART_OPTIONS.find((item) => item.id === partId) ?? null;
  return part ? applyPartOverride(part) : null;
}

export function getPaletteOption(paletteId: PaletteId) {
  return PALETTE_OPTIONS.find((item) => item.id === paletteId) ?? PALETTE_OPTIONS[0];
}

export function getRecipeLabel(recipe: StudioRecipe, slot: StudioSlot) {
  if (slot === "palette") {
    return getPaletteOption(recipe.palette).label;
  }

  return getPartOption(recipe[slot])?.label ?? recipe[slot];
}

export const LEDGER_ORDER: StudioSlot[] = [
  "expression",
  "silhouette",
  "headpiece",
  "outfit",
  "prop",
  "frame",
  "pods",
  "base",
  "palette",
];

function ensurePart(currentId: string, species: SpeciesId, slot: PartSlot, prototypeId?: CharacterPrototypeId) {
  const match = PART_OPTIONS.find(
    (item) =>
      item.id === currentId &&
      item.slot === slot &&
      item.species.includes(species) &&
      (!prototypeId || !item.prototypes?.length || item.prototypes.includes(prototypeId)),
  );

  return match?.id ?? firstPart(species, slot, prototypeId);
}

function firstPart(species: SpeciesId, slot: PartSlot, prototypeId?: CharacterPrototypeId) {
  return getSlotOptions(species, slot, prototypeId)[0]?.id ?? "";
}

function randomPart(species: SpeciesId, slot: PartSlot, prototypeId?: CharacterPrototypeId) {
  const options = getSlotOptions(species, slot, prototypeId);
  return options[Math.floor(Math.random() * options.length)]?.id ?? "";
}

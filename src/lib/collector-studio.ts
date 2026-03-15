import type { LightMode } from "./config";

export type StudioMode = "discover" | "assemble" | "inspect" | "shelf";
export type Species = "human" | "animal" | "creature" | "robot-pet";
export type RecipeSlot =
  | "face"
  | "hairOrFur"
  | "headAccessory"
  | "bodyOutfit"
  | "leftProp"
  | "ring"
  | "cabins"
  | "base";

export type PaletteId = "cream-dream" | "peach-pop" | "mint-magic";

export type PartOption = {
  id: string;
  slot: RecipeSlot;
  species: Species[];
  label: string;
  blurb: string;
  tags: string[];
};

export type PaletteOption = {
  id: PaletteId;
  label: string;
  blurb: string;
  lightMode: LightMode;
};

export type ProductRecipe = {
  species: Species;
  face: string;
  hairOrFur: string;
  headAccessory: string;
  bodyOutfit: string;
  leftProp: string;
  ring: string;
  cabins: string;
  base: string;
  palette: PaletteId;
};

export const STUDIO_MODES: { id: StudioMode; label: string; blurb: string }[] = [
  { id: "discover", label: "Discover", blurb: "Pick a species and open a series mood." },
  { id: "assemble", label: "Assemble", blurb: "Swap parts like a blind-box toy rack." },
  { id: "inspect", label: "Inspect", blurb: "Use 360 view to check face and materials." },
  { id: "shelf", label: "Shelf", blurb: "Show the final collectible like a launch page." },
];

export const SPECIES_OPTIONS: {
  id: Species;
  label: string;
  blurb: string;
  badge: string;
}[] = [
  { id: "human", label: "Doll Girl", blurb: "Soft face, bow details, outfit-led styling.", badge: "Core Series" },
  { id: "animal", label: "Dream Animal", blurb: "Ears, tail language, plushy silhouettes.", badge: "Pet Box" },
  { id: "creature", label: "Moon Creature", blurb: "Fantasy ears, halo props, surreal palettes.", badge: "Night Fair" },
  { id: "robot-pet", label: "Mecha Pet", blurb: "Toy robot shell with cute expression logic.", badge: "Future Plush" },
];

export const SLOT_META: { id: RecipeSlot; label: string; blurb: string }[] = [
  { id: "face", label: "Face", blurb: "Expression print" },
  { id: "hairOrFur", label: "Hair / Fur", blurb: "Main silhouette" },
  { id: "headAccessory", label: "Head Piece", blurb: "Hat, bow, halo" },
  { id: "bodyOutfit", label: "Body", blurb: "Outfit shell" },
  { id: "leftProp", label: "Prop", blurb: "Handheld item" },
  { id: "ring", label: "Wheel", blurb: "Ferris ring variant" },
  { id: "cabins", label: "Cabins", blurb: "Capsule set" },
  { id: "base", label: "Base", blurb: "Display platform" },
];

export const PALETTE_OPTIONS: PaletteOption[] = [
  { id: "cream-dream", label: "Cream Dream", blurb: "Ivory, warm gold, milky blush.", lightMode: "warm" },
  { id: "peach-pop", label: "Peach Pop", blurb: "Candy peach, rosy blush, soft sunset glow.", lightMode: "rose" },
  { id: "mint-magic", label: "Mint Magic", blurb: "Icy mint, pearl white, cool toy glow.", lightMode: "blue" },
];

export const PART_OPTIONS: PartOption[] = [
  { id: "face-smile", slot: "face", species: ["human", "animal", "creature"], label: "Smile Face", blurb: "Soft happy face with blush.", tags: ["cute", "default"] },
  { id: "face-sleepy", slot: "face", species: ["human", "animal", "creature", "robot-pet"], label: "Sleepy Face", blurb: "Dreamy eyes and tiny mouth.", tags: ["sleepy", "night"] },
  { id: "face-wink", slot: "face", species: ["human", "animal"], label: "Wink Face", blurb: "Blind-box hero expression.", tags: ["playful"] },
  { id: "face-led", slot: "face", species: ["robot-pet"], label: "LED Face", blurb: "Screen-style eye mask.", tags: ["future"] },

  { id: "hair-bob", slot: "hairOrFur", species: ["human"], label: "Bob Hair", blurb: "Round silhouette for display shots.", tags: ["hair"] },
  { id: "hair-curl", slot: "hairOrFur", species: ["human"], label: "Candy Curl", blurb: "More toy-like volume.", tags: ["hair"] },
  { id: "fur-bunny", slot: "hairOrFur", species: ["animal"], label: "Bunny Fur", blurb: "Tall ear-friendly fur shell.", tags: ["fur"] },
  { id: "fur-bear", slot: "hairOrFur", species: ["animal"], label: "Bear Fur", blurb: "Short plush style cap.", tags: ["fur"] },
  { id: "creature-foam", slot: "hairOrFur", species: ["creature"], label: "Foam Crest", blurb: "Cloud-like fantasy head shell.", tags: ["fantasy"] },
  { id: "robot-shell", slot: "hairOrFur", species: ["robot-pet"], label: "Robot Shell", blurb: "Rounded plated dome.", tags: ["tech"] },

  { id: "hat-cloud", slot: "headAccessory", species: ["human", "animal", "creature"], label: "Cloud Hat", blurb: "POP-like dream cap.", tags: ["dream"] },
  { id: "bow-coral", slot: "headAccessory", species: ["human", "animal"], label: "Coral Bow", blurb: "Classic blind-box bow.", tags: ["cute"] },
  { id: "halo-moon", slot: "headAccessory", species: ["creature", "human"], label: "Moon Halo", blurb: "Night fair signature accent.", tags: ["night"] },
  { id: "antenna-star", slot: "headAccessory", species: ["robot-pet"], label: "Star Antenna", blurb: "Toy-tech topper.", tags: ["future"] },

  { id: "body-pajama", slot: "bodyOutfit", species: ["human"], label: "Cream Pajama", blurb: "Soft homewear collectible body.", tags: ["soft"] },
  { id: "body-fairdress", slot: "bodyOutfit", species: ["human"], label: "Fair Dress", blurb: "Mini stage dress shell.", tags: ["show"] },
  { id: "body-plush", slot: "bodyOutfit", species: ["animal"], label: "Plush Suit", blurb: "Round and stuffed silhouette.", tags: ["plush"] },
  { id: "body-cape", slot: "bodyOutfit", species: ["creature"], label: "Night Cape", blurb: "Fantasy cape body.", tags: ["night"] },
  { id: "body-pod", slot: "bodyOutfit", species: ["robot-pet"], label: "Toy Pod", blurb: "Rounded robot torso.", tags: ["tech"] },

  { id: "prop-starwand", slot: "leftProp", species: ["human", "creature"], label: "Star Wand", blurb: "Shelf-friendly hand prop.", tags: ["magic"] },
  { id: "prop-ticket", slot: "leftProp", species: ["human", "animal"], label: "Ticket", blurb: "Amusement park accessory.", tags: ["fair"] },
  { id: "prop-lantern", slot: "leftProp", species: ["creature"], label: "Moon Lantern", blurb: "Night glow accessory.", tags: ["night"] },
  { id: "prop-battery", slot: "leftProp", species: ["robot-pet"], label: "Battery Heart", blurb: "Cute mecha core prop.", tags: ["tech"] },

  { id: "ring-classic", slot: "ring", species: ["human", "animal", "creature", "robot-pet"], label: "Classic Ring", blurb: "Balanced ferris silhouette.", tags: ["default"] },
  { id: "ring-candy", slot: "ring", species: ["human", "animal"], label: "Candy Ring", blurb: "Sweet glossy wheel frame.", tags: ["sweet"] },
  { id: "ring-pearl", slot: "ring", species: ["creature"], label: "Pearl Ring", blurb: "Moonlit elegant ring.", tags: ["night"] },
  { id: "ring-bulb", slot: "ring", species: ["robot-pet"], label: "Bulb Ring", blurb: "Toy-light ring with nodes.", tags: ["future"] },

  { id: "cabins-moon", slot: "cabins", species: ["human", "animal", "creature"], label: "Moon Cabins", blurb: "Dream capsule set.", tags: ["dream"] },
  { id: "cabins-candy", slot: "cabins", species: ["human", "animal"], label: "Candy Cabins", blurb: "Sweet capsule shells.", tags: ["sweet"] },
  { id: "cabins-plush", slot: "cabins", species: ["animal"], label: "Plush Pods", blurb: "Soft toy carriers.", tags: ["plush"] },
  { id: "cabins-pixel", slot: "cabins", species: ["robot-pet"], label: "Pixel Pods", blurb: "Tech style transparent pods.", tags: ["future"] },

  { id: "base-cloud", slot: "base", species: ["human", "animal", "creature"], label: "Cloud Base", blurb: "Dream fair platform.", tags: ["dream"] },
  { id: "base-ticket", slot: "base", species: ["human", "animal"], label: "Ticket Booth", blurb: "Funfair ticket counter base.", tags: ["fair"] },
  { id: "base-dock", slot: "base", species: ["robot-pet"], label: "Charging Dock", blurb: "Toy tech cradle base.", tags: ["tech"] },
];

export function createRecipe(species: Species = "human"): ProductRecipe {
  return {
    species,
    face: firstPart(species, "face"),
    hairOrFur: firstPart(species, "hairOrFur"),
    headAccessory: firstPart(species, "headAccessory"),
    bodyOutfit: firstPart(species, "bodyOutfit"),
    leftProp: firstPart(species, "leftProp"),
    ring: firstPart(species, "ring"),
    cabins: firstPart(species, "cabins"),
    base: firstPart(species, "base"),
    palette: "cream-dream",
  };
}

export function repairRecipe(recipe: ProductRecipe, species: Species): ProductRecipe {
  return {
    ...recipe,
    species,
    face: ensurePart(recipe.face, species, "face"),
    hairOrFur: ensurePart(recipe.hairOrFur, species, "hairOrFur"),
    headAccessory: ensurePart(recipe.headAccessory, species, "headAccessory"),
    bodyOutfit: ensurePart(recipe.bodyOutfit, species, "bodyOutfit"),
    leftProp: ensurePart(recipe.leftProp, species, "leftProp"),
    ring: ensurePart(recipe.ring, species, "ring"),
    cabins: ensurePart(recipe.cabins, species, "cabins"),
    base: ensurePart(recipe.base, species, "base"),
  };
}

export function randomizeRecipe(species: Species): ProductRecipe {
  return {
    species,
    face: randomPart(species, "face"),
    hairOrFur: randomPart(species, "hairOrFur"),
    headAccessory: randomPart(species, "headAccessory"),
    bodyOutfit: randomPart(species, "bodyOutfit"),
    leftProp: randomPart(species, "leftProp"),
    ring: randomPart(species, "ring"),
    cabins: randomPart(species, "cabins"),
    base: randomPart(species, "base"),
    palette: PALETTE_OPTIONS[Math.floor(Math.random() * PALETTE_OPTIONS.length)].id,
  };
}

export function getParts(species: Species, slot: RecipeSlot) {
  return PART_OPTIONS.filter((part) => part.slot === slot && part.species.includes(species));
}

export function getPalette(id: PaletteId) {
  return PALETTE_OPTIONS.find((palette) => palette.id === id) ?? PALETTE_OPTIONS[0];
}

export function getPartLabel(partId: string) {
  return PART_OPTIONS.find((part) => part.id === partId)?.label ?? partId;
}

function ensurePart(currentId: string, species: Species, slot: RecipeSlot) {
  const match = PART_OPTIONS.find(
    (part) => part.id === currentId && part.slot === slot && part.species.includes(species),
  );
  return match?.id ?? firstPart(species, slot);
}

function firstPart(species: Species, slot: RecipeSlot) {
  return getParts(species, slot)[0]?.id ?? "";
}

function randomPart(species: Species, slot: RecipeSlot) {
  const options = getParts(species, slot);
  return options[Math.floor(Math.random() * options.length)]?.id ?? "";
}

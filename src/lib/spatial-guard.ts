import type { SpatialRegistry } from "./asset-registry";
import type { CharacterPrototypeId } from "./character-prototypes-v2";
import { solveStageSpatialLayout } from "./spatial-solver";
import {
  PALETTE_OPTIONS,
  getPartOption,
  getSlotOptions,
  type PaletteId,
  type PartSlot,
  type SpeciesId,
  type StudioRecipe,
  type StudioSlot,
} from "./studio-system";

export type SpatialGuardResult = {
  recipe: StudioRecipe;
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>;
  repairedSlots: StudioSlot[];
  advice: SpatialRepairAdvice[];
  accepted: boolean;
};

export type SpatialOptionState = {
  id: string;
  disabled: boolean;
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>;
  conflictTags: string[];
  summary: string | null;
  details?: string[];
};

type SpatialImpactSlot = "prop" | "frame" | "base";

export type SpatialRepairAdvice = {
  kind: "auto" | "suggested";
  slot: SpatialImpactSlot;
  id: string;
  label: string;
  fromLabel: string;
  reason: string;
};

export type SpatialAutoFixRecord = SpatialRepairAdvice & {
  entryId: string;
  source: string;
};

const SPATIAL_REPAIR_PRIORITY: SpatialImpactSlot[] = ["prop", "frame", "base"];

export function evaluateRecipeSpatialWarnings(
  recipe: StudioRecipe,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
) {
  return solveStageSpatialLayout({
    baseId: recipe.base,
    frameId: recipe.frame,
    backdropId: "backdrop-none",
    characterId: getCharacterAssetId(recipe.species, prototypeId),
    propId: recipe.prop,
    registry,
  }).warnings;
}

export function buildSpatialOptionStates(
  recipe: StudioRecipe,
  slot: StudioSlot,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
): SpatialOptionState[] {
  const optionIds =
    slot === "palette"
      ? PALETTE_OPTIONS.map((item) => item.id)
      : getSlotOptions(recipe.species, slot as PartSlot).map((item) => item.id);

  return optionIds.map((id) => {
    const candidate = applySlotValue(recipe, slot, id);
    const warnings = evaluateRecipeSpatialWarnings(candidate, registry, prototypeId);
    const conflictTags = summarizeSpatialWarnings(warnings);
    return {
      id,
      disabled: isSpatialImpactSlot(slot) && warnings.length > 0,
      warnings,
      conflictTags,
      summary: conflictTags.length ? conflictTags.join(" · ") : null,
    };
  });
}

export function buildSpatialOptionStatesDetailed(
  recipe: StudioRecipe,
  slot: StudioSlot,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
): SpatialOptionState[] {
  const optionIds =
    slot === "palette"
      ? PALETTE_OPTIONS.map((item) => item.id)
      : getSlotOptions(recipe.species, slot as PartSlot).map((item) => item.id);

  return optionIds.map((id) => {
    const candidate = applySlotValue(recipe, slot, id);
    const warnings = evaluateRecipeSpatialWarnings(candidate, registry, prototypeId);
    const conflictTags = summarizeSpatialWarnings(warnings);
    return {
      id,
      disabled: isSpatialImpactSlot(slot) && warnings.length > 0,
      warnings,
      conflictTags,
      summary: conflictTags.length ? conflictTags.join(" · ") : null,
      details: warnings.map((warning) => simplifySpatialMessage(warning.message)),
    };
  });
}

export function randomizeSpatiallyStableRecipe(
  species: SpeciesId,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
) {
  let bestRecipe = buildRandomRecipe(species, prototypeId);
  let bestWarnings = evaluateRecipeSpatialWarnings(bestRecipe, registry, prototypeId);

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const candidate = buildRandomRecipe(species, prototypeId);
    const warnings = evaluateRecipeSpatialWarnings(candidate, registry, prototypeId);
    if (warnings.length === 0) {
      return candidate;
    }

    if (warnings.length < bestWarnings.length) {
      bestRecipe = candidate;
      bestWarnings = warnings;
    }
  }

  return bestRecipe;
}

export function guardRecipeSelection(
  current: StudioRecipe,
  candidate: StudioRecipe,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
): SpatialGuardResult {
  const directWarnings = evaluateRecipeSpatialWarnings(candidate, registry, prototypeId);
  if (directWarnings.length === 0) {
    return {
      recipe: candidate,
      warnings: directWarnings,
      repairedSlots: [],
      advice: [],
      accepted: true,
    };
  }

  const repaired = findNearestValidRecipe(candidate, directWarnings, registry, prototypeId);
  if (repaired) {
    const repairedSlots = diffSpatialSlots(candidate, repaired);
    return {
      recipe: repaired,
      warnings: [],
      repairedSlots,
      advice: createRepairAdviceFromRecipe(candidate, repaired, repairedSlots, directWarnings),
      accepted: true,
    };
  }

  return {
    recipe: current,
    warnings: directWarnings,
    repairedSlots: [],
    advice: buildRepairAdvice(candidate, directWarnings, registry, prototypeId),
    accepted: false,
  };
}

function findNearestValidRecipe(
  recipe: StudioRecipe,
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
): StudioRecipe | null {
  const slotPriority = getRepairPriority(warnings);
  const optionMap = {
    base: buildRepairOptionOrder(recipe, "base", registry, prototypeId),
    frame: buildRepairOptionOrder(recipe, "frame", registry, prototypeId),
    prop: buildRepairOptionOrder(recipe, "prop", registry, prototypeId),
  };

  for (const slot of slotPriority) {
    for (const id of optionMap[slot]) {
      if (id === recipe[slot]) continue;
      const candidate = { ...recipe, [slot]: id } as StudioRecipe;
      if (evaluateRecipeSpatialWarnings(candidate, registry, prototypeId).length === 0) {
        return candidate;
      }
    }
  }

  for (let firstIndex = 0; firstIndex < slotPriority.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < slotPriority.length; secondIndex += 1) {
      const firstSlot = slotPriority[firstIndex];
      const secondSlot = slotPriority[secondIndex];

      for (const firstId of optionMap[firstSlot]) {
        for (const secondId of optionMap[secondSlot]) {
          if (firstId === recipe[firstSlot] && secondId === recipe[secondSlot]) continue;

          const candidate = {
            ...recipe,
            [firstSlot]: firstId,
            [secondSlot]: secondId,
          } as StudioRecipe;

          if (evaluateRecipeSpatialWarnings(candidate, registry, prototypeId).length === 0) {
            return candidate;
          }
        }
      }
    }
  }

  const [firstSlot, secondSlot, thirdSlot] = slotPriority;
  for (const firstId of optionMap[firstSlot]) {
    for (const secondId of optionMap[secondSlot]) {
      for (const thirdId of optionMap[thirdSlot]) {
        if (
          firstId === recipe[firstSlot] &&
          secondId === recipe[secondSlot] &&
          thirdId === recipe[thirdSlot]
        ) {
          continue;
        }

        const candidate = {
          ...recipe,
          [firstSlot]: firstId,
          [secondSlot]: secondId,
          [thirdSlot]: thirdId,
        } as StudioRecipe;

        if (evaluateRecipeSpatialWarnings(candidate, registry, prototypeId).length === 0) {
          return candidate;
        }
      }
    }
  }

  return null;
}

function prioritize(currentId: string, ids: string[]) {
  const unique = Array.from(new Set(ids));
  return [currentId, ...unique.filter((id) => id !== currentId)];
}

function rankSpatialOptions(ids: string[]) {
  return [...ids].sort((left, right) => {
    const leftWeight = getPartOption(left)?.spatialWeight ?? 999;
    const rightWeight = getPartOption(right)?.spatialWeight ?? 999;
    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }

    const leftLabel = getPartOption(left)?.label ?? left;
    const rightLabel = getPartOption(right)?.label ?? right;
    return leftLabel.localeCompare(rightLabel);
  });
}

function buildRandomRecipe(species: SpeciesId, prototypeId?: CharacterPrototypeId): StudioRecipe {
  return {
    species,
    expression: chooseRandom(getSlotOptions(species, "expression", prototypeId).map((item) => item.id)) ?? "",
    silhouette: chooseRandom(getSlotOptions(species, "silhouette", prototypeId).map((item) => item.id)) ?? "",
    headpiece: chooseRandom(getSlotOptions(species, "headpiece", prototypeId).map((item) => item.id)) ?? "",
    outfit: chooseRandom(getSlotOptions(species, "outfit", prototypeId).map((item) => item.id)) ?? "",
    prop: chooseWeightedSpatial(getSlotOptions(species, "prop", prototypeId).map((item) => item.id)) ?? "",
    frame: chooseWeightedSpatial(getSlotOptions(species, "frame", prototypeId).map((item) => item.id)) ?? "",
    pods: chooseRandom(getSlotOptions(species, "pods", prototypeId).map((item) => item.id)) ?? "",
    base: chooseWeightedSpatial(getSlotOptions(species, "base", prototypeId).map((item) => item.id)) ?? "",
    palette: chooseRandom(PALETTE_OPTIONS.map((item) => item.id)) ?? PALETTE_OPTIONS[0].id,
  };
}

function diffSpatialSlots(previous: StudioRecipe, next: StudioRecipe) {
  return SPATIAL_REPAIR_PRIORITY.filter((slot) => previous[slot] !== next[slot]);
}

function buildRepairAdvice(
  recipe: StudioRecipe,
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
): SpatialRepairAdvice[] {
  const slotPriority = getRepairPriority(warnings);
  const advice: SpatialRepairAdvice[] = [];

  for (const slot of slotPriority) {
    const options = buildRepairOptionOrder(recipe, slot, registry, prototypeId).filter((id) => id !== recipe[slot]);

    for (const id of options) {
      const candidate = { ...recipe, [slot]: id } as StudioRecipe;
      if (evaluateRecipeSpatialWarnings(candidate, registry, prototypeId).length === 0) {
        advice.push({
          kind: "suggested",
          slot,
          id,
          label: getPartOption(id)?.label ?? id,
          fromLabel: getPartOption(recipe[slot])?.label ?? recipe[slot],
          reason: getAdviceReason(slot, warnings),
        });
        break;
      }
    }
  }

  if (advice.length > 0) {
    return advice.slice(0, 3);
  }

  const repaired = findNearestValidRecipe(recipe, warnings, registry, prototypeId);
  if (!repaired) {
    return [];
  }

  return createRepairAdviceFromRecipe(recipe, repaired, diffSpatialSlots(recipe, repaired), warnings);
}

function buildRepairOptionOrder(
  recipe: StudioRecipe,
  slot: SpatialImpactSlot,
  registry: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
) {
  const weighted = rankSpatialOptions(getSlotOptions(recipe.species, slot, prototypeId).map((item) => item.id));
  const fallbacks = getSpatialFallbacks(registry, recipe.species, slot, recipe[slot], prototypeId);
  return prioritize(recipe[slot], [...fallbacks, ...weighted]);
}

function getSpatialFallbacks(
  registry: SpatialRegistry,
  species: SpeciesId,
  slot: SpatialImpactSlot,
  id: string,
  prototypeId?: CharacterPrototypeId,
) {
  const definition =
    slot === "base"
      ? registry.base[id]
      : slot === "frame"
        ? registry.frame[id]
        : registry.prop[id];

  if (!definition) {
    return [];
  }

  const knownIds = new Set(getSlotOptions(species, slot, prototypeId).map((item) => item.id));

  return definition.fallbacks.filter((fallbackId) => fallbackId !== id && knownIds.has(fallbackId));
}

function createRepairAdviceFromRecipe(
  previousRecipe: StudioRecipe,
  recipe: StudioRecipe,
  repairedSlots: SpatialImpactSlot[],
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>,
): SpatialRepairAdvice[] {
  return repairedSlots.map((slot) => ({
    kind: "auto",
    slot,
    id: recipe[slot],
    label: getPartOption(recipe[slot])?.label ?? recipe[slot],
    fromLabel: getPartOption(previousRecipe[slot])?.label ?? previousRecipe[slot],
    reason: getAdviceReason(slot, warnings),
  }));
}

function summarizeSpatialWarnings(
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>,
) {
  return Array.from(new Set(warnings.map((warning) => getSpatialWarningLabel(warning.code))));
}

function simplifySpatialMessage(message: string) {
  return message
    .replace(/^Frame bottom gap .* required .*$/i, "Frame sits too low for the current base.")
    .replace(/^Frame\/backdrop gap .* required .*$/i, "Frame depth conflicts with the rear stage layer.")
    .replace(/^Support height .* stable frame mount\.$/i, "Support geometry is too short for this frame.")
    .replace(/^Character\/frame gap .* required .*$/i, "Character body pushes too close to the frame.")
    .replace(/^Prop\/frame gap .* required .*$/i, "Prop extends too far into the frame.")
    .replace(/^Base asset is missing required anchors.*$/i, "This asset is missing stage anchor data.");
}

function getSpatialWarningLabel(code: ReturnType<typeof evaluateRecipeSpatialWarnings>[number]["code"]) {
  switch (code) {
    case "base-frame-clearance":
      return "frame hits base";
    case "frame-backdrop-clearance":
      return "frame hits backdrop";
    case "support-underflow":
      return "support too short";
    case "character-frame-clearance":
      return "character hits frame";
    case "prop-frame-clearance":
      return "prop hits frame";
    case "missing-anchor":
      return "anchor data missing";
    default:
      return code;
  }
}

function getAdviceReason(
  slot: SpatialImpactSlot,
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>,
) {
  const leadingWarning = warnings[0];

  if (slot === "prop") {
    return leadingWarning?.code === "prop-frame-clearance"
      ? "Try a slimmer prop profile to clear the ring face."
      : "Pick a prop with a lighter front reach.";
  }

  if (slot === "frame") {
    return leadingWarning?.code === "base-frame-clearance"
      ? "Pick a higher-clearance frame profile."
      : "Use a frame profile that opens more space around the character.";
  }

  return leadingWarning?.code === "base-frame-clearance"
    ? "Use a lower base profile to open the ring gap."
    : "Choose a base that leaves more stage clearance for this frame.";
}

function getCharacterAssetId(species: SpeciesId, prototypeId?: CharacterPrototypeId) {
  if (prototypeId?.startsWith("animal-")) return "character-animal";
  if (prototypeId?.startsWith("creature-")) return "character-creature";
  if (prototypeId?.startsWith("robot-")) return "character-robot";
  if (prototypeId?.startsWith("human-")) return "character-human";

  if (species === "animal") return "character-animal";
  if (species === "creature") return "character-creature";
  if (species === "robot") return "character-robot";
  return "character-human";
}

function getRepairPriority(
  warnings: ReturnType<typeof evaluateRecipeSpatialWarnings>,
) {
  const requested = new Set<SpatialImpactSlot>();

  warnings.forEach((warning) => {
    switch (warning.code) {
      case "prop-frame-clearance":
        requested.add("prop");
        requested.add("frame");
        requested.add("base");
        break;
      case "character-frame-clearance":
      case "base-frame-clearance":
      case "support-underflow":
      case "missing-anchor":
      case "frame-backdrop-clearance":
        requested.add("frame");
        requested.add("base");
        break;
      default:
        requested.add("prop");
        requested.add("frame");
        requested.add("base");
        break;
    }
  });

  return [
    ...SPATIAL_REPAIR_PRIORITY.filter((slot) => requested.has(slot)),
    ...SPATIAL_REPAIR_PRIORITY.filter((slot) => !requested.has(slot)),
  ];
}

function isSpatialImpactSlot(slot: StudioSlot): slot is SpatialImpactSlot {
  return slot === "prop" || slot === "frame" || slot === "base";
}

function chooseRandom<T>(items: T[]) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function chooseWeightedSpatial(ids: string[]) {
  const ranked = rankSpatialOptions(ids);
  if (!ranked.length) return null;
  const topBand = ranked.slice(0, Math.min(3, ranked.length));
  return topBand[Math.floor(Math.random() * topBand.length)] ?? ranked[0];
}

export function applySlotValue(recipe: StudioRecipe, slot: StudioSlot, id: string): StudioRecipe {
  if (slot === "palette") {
    return { ...recipe, palette: id as PaletteId };
  }

  return { ...recipe, [slot]: id } as StudioRecipe;
}

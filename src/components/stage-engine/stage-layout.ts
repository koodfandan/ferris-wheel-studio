import type { SpatialRegistry } from "../../lib/asset-registry";
import type { CharacterPrototypeId } from "../../lib/character-prototypes-v2";
import { solveStageSpatialLayout } from "../../lib/spatial-solver";
import type { SpeciesId } from "../../lib/studio-system";

export type StageLayout = ReturnType<typeof solveStageSpatialLayout>;

export function createStageLayout(
  baseVariant: string,
  frameVariant: string,
  species: SpeciesId,
  propId: string,
  registry?: SpatialRegistry,
  prototypeId?: CharacterPrototypeId,
): StageLayout {
  return solveStageSpatialLayout({
    baseId: baseVariant,
    frameId: frameVariant,
    backdropId: "backdrop-none",
    characterId: getCharacterAssetId(species, prototypeId),
    propId,
    registry,
  });
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

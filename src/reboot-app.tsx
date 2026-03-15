import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CharacterStage } from "./reboot/stage";
import { getCharacterCopy, getFinishCopy, getOptionMeta, SLOT_COPY } from "./reboot/copy";
import {
  buildDefaultRecipe,
  CHARACTER_DEFINITIONS,
  FINISH_PRESETS,
  getCharacterDefinition,
  getFinishPreset,
  randomizeRecipe,
  type CharacterRecipe,
  type StudioSlotId,
} from "./reboot/studio-data";

type SavedLook = {
  id: string;
  characterId: string;
  recipe: CharacterRecipe;
  note: string;
};

type RecipeStore = Record<string, CharacterRecipe>;

const STORAGE_KEY = "reboot-figure-saves-v1";
const PANEL_SLOTS: StudioSlotId[] = ["variant", "face", "head", "body", "back", "prop", "finish"];

function buildInitialRecipes(): RecipeStore {
  return Object.fromEntries(
    CHARACTER_DEFINITIONS.map((character) => [character.id, buildDefaultRecipe(character)]),
  ) as RecipeStore;
}

function loadSavedLooks(): SavedLook[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedLook[]) : [];
  } catch {
    return [];
  }
}

export default function RebootApp() {
  const [activeCharacterId, setActiveCharacterId] = useState(CHARACTER_DEFINITIONS[0]?.id ?? "maskling");
  const [activeSlot, setActiveSlot] = useState<StudioSlotId>("variant");
  const [recipes, setRecipes] = useState<RecipeStore>(() => buildInitialRecipes());
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => loadSavedLooks());

  const activeCharacter = useMemo(() => getCharacterDefinition(activeCharacterId), [activeCharacterId]);
  const currentRecipe = recipes[activeCharacterId] ?? buildDefaultRecipe(activeCharacter);
  const activeFinish = getFinishPreset(currentRecipe.finish);
  const activeCopy = getCharacterCopy(activeCharacter.id);
  const finishCopy = getFinishCopy(currentRecipe.finish);

  const currentOptions = useMemo(() => {
    if (activeSlot === "finish") {
      return FINISH_PRESETS.map((finish) => ({ id: finish.id }));
    }

    return activeCharacter.slots[activeSlot];
  }, [activeCharacter, activeSlot]);

  const changedCount = PANEL_SLOTS.reduce((count, slot) => {
    return count + Number(currentRecipe[slot] !== activeCharacter.defaultRecipe[slot]);
  }, 0);

  const pageStyle = {
    "--shell-top": activeFinish.pageTop,
    "--shell-bottom": activeFinish.pageBottom,
    "--shell-panel": activeFinish.panel,
    "--shell-line": activeFinish.line,
    "--shell-ink": activeFinish.ink,
    "--shell-muted": activeFinish.muted,
    "--shell-accent": activeFinish.accent,
    "--shell-accent-soft": activeFinish.accentSoft,
    "--shell-stage-top": activeFinish.stageTop,
    "--shell-stage-bottom": activeFinish.stageBottom,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLooks));
  }, [savedLooks]);

  function setRecipeForCharacter(characterId: string, recipe: CharacterRecipe) {
    setRecipes((current) => ({
      ...current,
      [characterId]: recipe,
    }));
  }

  function handleCharacterSelect(characterId: string) {
    setActiveCharacterId(characterId);
    setActiveSlot("variant");
  }

  function handleOptionSelect(slot: StudioSlotId, value: string) {
    setRecipeForCharacter(activeCharacterId, {
      ...currentRecipe,
      [slot]: value,
    });
  }

  function handleResetCurrent() {
    setRecipeForCharacter(activeCharacterId, buildDefaultRecipe(activeCharacter));
  }

  function handleRandomizeCurrent() {
    setRecipeForCharacter(activeCharacterId, randomizeRecipe(activeCharacter));
  }

  function handleSaveCurrent() {
    const next: SavedLook = {
      id: typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`,
      characterId: activeCharacterId,
      recipe: { ...currentRecipe },
      note: `${activeCopy.name} · ${finishCopy.label}`,
    };

    setSavedLooks((current) => [next, ...current].slice(0, 12));
  }

  function handleApplySaved(look: SavedLook) {
    setActiveCharacterId(look.characterId);
    setActiveSlot("variant");
    setRecipeForCharacter(look.characterId, look.recipe);
  }

  function handleRemoveSaved(id: string) {
    setSavedLooks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="reboot-page" style={pageStyle}>
      <div className="reboot-shell">
        <aside className="reboot-panel reboot-panel-left">
          <div className="reboot-panel-head">
            <span className="reboot-kicker">角色库</span>
            <h1>角色手办工坊</h1>
            <p>彻底脱离摩天轮主题，只保留角色展示、切换和造型组合。</p>
          </div>

          <div className="reboot-character-list">
            {CHARACTER_DEFINITIONS.map((character) => {
              const copy = getCharacterCopy(character.id);
              const selected = character.id === activeCharacterId;

              return (
                <button
                  key={character.id}
                  type="button"
                  className={`reboot-character-card${selected ? " is-active" : ""}`}
                  onClick={() => handleCharacterSelect(character.id)}
                >
                  <div className="reboot-character-card-head">
                    <strong>{copy.name}</strong>
                    <span>{copy.badge}</span>
                  </div>
                  <em>{copy.family}</em>
                  <p>{copy.intro}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="reboot-stage-panel">
          <header className="reboot-stage-head">
            <div>
              <span className="reboot-kicker">中央展台</span>
              <h2>{activeCopy.name}</h2>
              <p>{activeCopy.intro}</p>
            </div>

            <div className="reboot-stat-grid">
              <article>
                <strong>{CHARACTER_DEFINITIONS.length}</strong>
                <span>角色原型</span>
              </article>
              <article>
                <strong>{PANEL_SLOTS.length}</strong>
                <span>可调槽位</span>
              </article>
              <article>
                <strong>{changedCount}</strong>
                <span>已改动项</span>
              </article>
              <article>
                <strong>{savedLooks.length}</strong>
                <span>收藏组合</span>
              </article>
            </div>
          </header>

          <section className="reboot-stage-wrap">
            <CharacterStage character={activeCharacter} recipe={currentRecipe} activeSlot={activeSlot} />
          </section>

          <footer className="reboot-stage-foot">
            <div className="reboot-chip-row">
              {PANEL_SLOTS.map((slot) => (
                <span key={slot} className="reboot-chip">
                  <b>{SLOT_COPY[slot].label}</b>
                  <small>
                    {slot === "finish"
                      ? finishCopy.label
                      : getOptionMeta(currentRecipe[slot], slot).label}
                  </small>
                </span>
              ))}
            </div>

            <div className="reboot-action-row">
              <button type="button" className="reboot-action" onClick={handleRandomizeCurrent}>
                随机一套
              </button>
              <button type="button" className="reboot-action" onClick={handleResetCurrent}>
                恢复默认
              </button>
              <button type="button" className="reboot-action reboot-action-strong" onClick={handleSaveCurrent}>
                收藏当前造型
              </button>
            </div>
          </footer>
        </main>

        <aside className="reboot-panel reboot-panel-right">
          <section className="reboot-side-block">
            <div className="reboot-side-head">
              <div>
                <span className="reboot-kicker">当前角色</span>
                <h3>{activeCopy.name}</h3>
              </div>
              <span className="reboot-family-pill">{activeCopy.family}</span>
            </div>

            <div className="reboot-summary-card">
              <strong>{finishCopy.label}</strong>
              <p>{finishCopy.blurb}</p>
            </div>
          </section>

          <section className="reboot-side-block reboot-side-grow">
            <div className="reboot-side-head">
              <div>
                <span className="reboot-kicker">造型槽位</span>
                <h3>直接换造型</h3>
              </div>
            </div>

            <div className="reboot-slot-tabs">
              {PANEL_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`reboot-slot-tab${slot === activeSlot ? " is-active" : ""}`}
                  onClick={() => setActiveSlot(slot)}
                >
                  <strong>{SLOT_COPY[slot].label}</strong>
                  <span>{SLOT_COPY[slot].hint}</span>
                </button>
              ))}
            </div>

            <div className="reboot-option-grid">
              {currentOptions.map((option) => {
                const selected = currentRecipe[activeSlot] === option.id;

                if (activeSlot === "finish") {
                  const finish = getFinishPreset(option.id);
                  const copy = getFinishCopy(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`reboot-option-card reboot-option-finish${selected ? " is-active" : ""}`}
                      onClick={() => handleOptionSelect("finish", option.id)}
                    >
                      <span className="reboot-swatch" style={{ background: finish.swatch }} />
                      <strong>{copy.label}</strong>
                      <p>{copy.blurb}</p>
                    </button>
                  );
                }

                const optionMeta = getOptionMeta(option.id, activeSlot);

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`reboot-option-card${selected ? " is-active" : ""}`}
                    onClick={() => handleOptionSelect(activeSlot, option.id)}
                  >
                    <span>{optionMeta.badge}</span>
                    <strong>{optionMeta.label}</strong>
                    <p>{optionMeta.blurb}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="reboot-side-block">
            <div className="reboot-side-head">
              <div>
                <span className="reboot-kicker">收藏夹</span>
                <h3>保存过的组合</h3>
              </div>
            </div>

            <div className="reboot-save-list">
              {savedLooks.length === 0 ? (
                <div className="reboot-empty-card">
                  <strong>还没有收藏</strong>
                  <p>先在中间调一套满意的造型，再点“收藏当前造型”。</p>
                </div>
              ) : (
                savedLooks.map((look) => {
                  const copy = getCharacterCopy(look.characterId);
                  const savedFinish = getFinishCopy(look.recipe.finish);

                  return (
                    <article key={look.id} className="reboot-save-card">
                      <div>
                        <strong>{copy.name}</strong>
                        <span>{look.note}</span>
                        <p>{savedFinish.label}</p>
                      </div>
                      <div className="reboot-save-actions">
                        <button type="button" onClick={() => handleApplySaved(look)}>
                          应用
                        </button>
                        <button type="button" onClick={() => handleRemoveSaved(look.id)}>
                          删除
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

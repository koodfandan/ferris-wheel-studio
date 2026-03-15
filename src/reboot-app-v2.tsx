import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CharacterStageV2 } from "./reboot/stage-v2";
import {
  buildDefaultRecipe,
  EDITABLE_SLOTS,
  FIGURE_DEFINITIONS,
  FINISH_PRESETS,
  getFigureDefinition,
  getFinishPreset,
  randomizeRecipe,
  type FigureOption,
  type FigureRecipe,
  type FigureSlotId,
} from "./reboot/catalog-v2";
import { getFigureTheme } from "./reboot/theme-v2";

type SavedLook = {
  id: string;
  characterId: string;
  recipe: FigureRecipe;
  note: string;
};

type RecipeStore = Record<string, FigureRecipe>;

const STORAGE_KEY = "reboot-figure-saves-v2";

function buildInitialRecipes(): RecipeStore {
  return Object.fromEntries(
    FIGURE_DEFINITIONS.map((character) => [character.id, buildDefaultRecipe(character)]),
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

export default function RebootAppV2() {
  const [activeCharacterId, setActiveCharacterId] = useState(FIGURE_DEFINITIONS[0]?.id ?? "veil-nun");
  const [activeSlot, setActiveSlot] = useState<FigureSlotId>("variant");
  const [recipes, setRecipes] = useState<RecipeStore>(() => buildInitialRecipes());
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => loadSavedLooks());
  const [stageTransitionToken, setStageTransitionToken] = useState(0);
  const [stageSwitching, setStageSwitching] = useState(false);

  const activeCharacter = useMemo(() => getFigureDefinition(activeCharacterId), [activeCharacterId]);
  const currentRecipe = recipes[activeCharacterId] ?? buildDefaultRecipe(activeCharacter);
  const activeFinish = getFinishPreset(currentRecipe.finish);
  const activeTheme = getFigureTheme(activeCharacter.id);

  const currentOptions = useMemo(() => {
    if (activeSlot === "finish") {
      return FINISH_PRESETS;
    }

    return activeCharacter.slots[activeSlot];
  }, [activeCharacter, activeSlot]);

  const changedCount = EDITABLE_SLOTS.reduce((count, slot) => {
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
    "--theme-from": activeTheme.accentFrom,
    "--theme-to": activeTheme.accentTo,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLooks));
  }, [savedLooks]);

  useEffect(() => {
    if (!stageSwitching) return;
    const timer = window.setTimeout(() => setStageSwitching(false), 520);
    return () => window.clearTimeout(timer);
  }, [stageSwitching, stageTransitionToken]);

  function setRecipeForCharacter(characterId: string, recipe: FigureRecipe) {
    setRecipes((current) => ({
      ...current,
      [characterId]: recipe,
    }));
  }

  function handleCharacterSelect(characterId: string) {
    if (characterId !== activeCharacterId) {
      setStageTransitionToken((current) => current + 1);
      setStageSwitching(true);
    }
    setActiveCharacterId(characterId);
    setActiveSlot("variant");
  }

  function handleOptionSelect(slot: FigureSlotId, value: string) {
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
      note: `${activeCharacter.name} · ${activeFinish.label}`,
    };

    setSavedLooks((current) => [next, ...current].slice(0, 12));
  }

  function handleApplySaved(look: SavedLook) {
    setStageTransitionToken((current) => current + 1);
    setStageSwitching(true);
    setActiveCharacterId(look.characterId);
    setActiveSlot("variant");
    setRecipeForCharacter(look.characterId, look.recipe);
  }

  function handleRemoveSaved(id: string) {
    setSavedLooks((current) => current.filter((item) => item.id !== id));
  }

  function getSelectedLabel(slot: FigureSlotId) {
    if (slot === "finish") return activeFinish.label;
    return activeCharacter.slots[slot].find((item) => item.id === currentRecipe[slot])?.label ?? "未设置";
  }

  return (
    <div className="reboot-page" style={pageStyle}>
      <div className="reboot-shell">
        <aside className="reboot-panel reboot-panel-left">
          <div className="reboot-panel-head">
            <span className="reboot-kicker">角色骨架库</span>
            <h1>独立角色工坊</h1>
            <p>这次不是一套底模换脸，而是 12 套完全不同的角色骨架和主题类型。</p>
          </div>

          <div className="reboot-character-list">
            {FIGURE_DEFINITIONS.map((character) => {
              const selected = character.id === activeCharacterId;
              return (
                <button
                  key={character.id}
                  type="button"
                  className={`reboot-character-card${selected ? " is-active" : ""}`}
                  onClick={() => handleCharacterSelect(character.id)}
                >
                  <div className="reboot-character-card-head">
                    <strong>{character.name}</strong>
                    <span>{character.badge}</span>
                  </div>
                  <em>{character.family}</em>
                  <small className="reboot-character-tone">{getFigureTheme(character.id).title}</small>
                  <p>{character.intro}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="reboot-stage-panel">
          <header className="reboot-stage-head">
            <div>
              <span className="reboot-kicker">中央展台</span>
              <h2>{activeCharacter.name}</h2>
              <p>{activeCharacter.intro}</p>
            </div>

            <div className="reboot-stat-grid">
              <article>
                <strong>{FIGURE_DEFINITIONS.length}</strong>
                <span>独立骨架</span>
              </article>
              <article>
                <strong>{EDITABLE_SLOTS.length}</strong>
                <span>改造槽位</span>
              </article>
              <article>
                <strong>{changedCount}</strong>
                <span>当前改动</span>
              </article>
              <article>
                <strong>{savedLooks.length}</strong>
                <span>收藏组合</span>
              </article>
            </div>
          </header>

          <section className={`reboot-stage-wrap${stageSwitching ? " is-switching" : ""}`}>
            <CharacterStageV2 character={activeCharacter} recipe={currentRecipe} transitionToken={stageTransitionToken} />
          </section>

          <footer className="reboot-stage-foot">
            <div className="reboot-chip-row">
              {EDITABLE_SLOTS.map((slot) => (
                <span key={slot} className="reboot-chip">
                  <b>{slot === "finish" ? "材质" : activeCharacter.slotMeta[slot].label}</b>
                  <small>{getSelectedLabel(slot)}</small>
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
                <h3>{activeCharacter.name}</h3>
              </div>
              <span className="reboot-family-pill">{activeCharacter.family}</span>
            </div>

            <div className="reboot-summary-card">
              <strong>{activeFinish.label}</strong>
              <p>{activeCharacter.badge} · {activeFinish.badge}</p>
            </div>

            <div className="reboot-summary-card reboot-theme-card">
              <strong>{activeTheme.title}</strong>
              <p>{activeTheme.atmosphere}</p>
              <div className="reboot-theme-tags">
                {activeTheme.keywords.map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="reboot-side-block reboot-side-grow">
            <div className="reboot-side-head">
              <div>
                <span className="reboot-kicker">角色专属改造</span>
                <h3>{activeSlot === "finish" ? "材质方案" : activeCharacter.slotMeta[activeSlot].label}</h3>
              </div>
            </div>

            <div className="reboot-slot-tabs">
              {EDITABLE_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`reboot-slot-tab${slot === activeSlot ? " is-active" : ""}`}
                  onClick={() => setActiveSlot(slot)}
                >
                  <strong>{slot === "finish" ? "材质" : activeCharacter.slotMeta[slot].label}</strong>
                  <span>{slot === "finish" ? "切换收藏质感" : activeCharacter.slotMeta[slot].hint}</span>
                </button>
              ))}
            </div>

            <div className="reboot-option-grid">
              {currentOptions.map((option) => {
                const selected = currentRecipe[activeSlot] === option.id;

                if (activeSlot === "finish") {
                  const finish = option as (typeof FINISH_PRESETS)[number];
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      className={`reboot-option-card reboot-option-finish${selected ? " is-active" : ""}`}
                      onClick={() => handleOptionSelect("finish", finish.id)}
                    >
                      <span className="reboot-swatch" style={{ background: finish.swatch }} />
                      <strong>{finish.label}</strong>
                      <p>{finish.badge}</p>
                    </button>
                  );
                }

                const figureOption = option as FigureOption;

                return (
                  <button
                    key={figureOption.id}
                    type="button"
                    className={`reboot-option-card${selected ? " is-active" : ""}`}
                    onClick={() => handleOptionSelect(activeSlot, figureOption.id)}
                  >
                    <span>{figureOption.badge}</span>
                    <strong>{figureOption.label}</strong>
                    <p>{figureOption.blurb}</p>
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
                  <p>先把当前角色调到满意，再点“收藏当前造型”。</p>
                </div>
              ) : (
                savedLooks.map((look) => {
                  const character = getFigureDefinition(look.characterId);
                  const finish = getFinishPreset(look.recipe.finish);

                  return (
                    <article key={look.id} className="reboot-save-card">
                      <div>
                        <strong>{character.name}</strong>
                        <span>{look.note}</span>
                        <p>{character.badge} · {finish.label}</p>
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

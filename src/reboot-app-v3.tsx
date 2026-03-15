import { Suspense, lazy, useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { useMachine } from "@xstate/react";
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
import {
  SLOT_DISPLAY,
  getCharacterDisplay,
  getFinishDisplay,
  getOptionDisplay,
  getThemeDisplay,
} from "./reboot/display-copy";
import { blindboxMachine } from "./features/blindbox/blindbox.machine";
import { UnboxShell } from "./features/blindbox/components/unbox-shell";
import type { BlindboxPhase } from "./features/blindbox/blindbox.types";
import { getFigureTheme } from "./reboot/theme-v2";

type SavedLook = {
  id: string;
  characterId: string;
  recipe: FigureRecipe;
  note: string;
};

type RecipeStore = Record<string, FigureRecipe>;

const STORAGE_KEY = "reboot-figure-saves-v2";
const PRIMARY_SLOTS: FigureSlotId[] = ["variant", "face", "head", "body"];
const SECONDARY_SLOTS: FigureSlotId[] = EDITABLE_SLOTS.filter((slot) => !PRIMARY_SLOTS.includes(slot));

const LazyCharacterStageV2 = lazy(async () => {
  const module = await import("./reboot/stage-v2");
  return { default: module.CharacterStageV2 };
});

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

export default function RebootAppV3() {
  const [activeCharacterId, setActiveCharacterId] = useState(FIGURE_DEFINITIONS[0]?.id ?? "veil-nun");
  const [activeSlot, setActiveSlot] = useState<FigureSlotId>("variant");
  const [recipes, setRecipes] = useState<RecipeStore>(() => buildInitialRecipes());
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => loadSavedLooks());
  const [stageTransitionToken, setStageTransitionToken] = useState(0);
  const [stageSwitching, setStageSwitching] = useState(false);
  const qualityMode: "low" | "standard" | "high" = "high";
  const [characterQuery, setCharacterQuery] = useState("");
  const [blindboxSnapshot, sendBlindbox] = useMachine(blindboxMachine);
  const slotTabsRef = useRef<HTMLDivElement | null>(null);
  const slotTabsDragRef = useRef<{ active: boolean; pointerId: number; startX: number; startLeft: number }>({
    active: false,
    pointerId: -1,
    startX: 0,
    startLeft: 0,
  });

  const activeCharacter = useMemo(() => getFigureDefinition(activeCharacterId), [activeCharacterId]);
  const blindboxPhase = `${blindboxSnapshot.value}`;
  const blindboxActive = blindboxSnapshot.hasTag("active");
  const blindboxToken = blindboxSnapshot.context.token;
  const blindboxSelectedBoxIndex = blindboxSnapshot.context.selectedBoxIndex;
  const blindboxRarity = blindboxSnapshot.context.rarity;
  const currentRecipe = recipes[activeCharacterId] ?? buildDefaultRecipe(activeCharacter);
  const activeFinish = getFinishPreset(currentRecipe.finish);
  const activeTheme = getFigureTheme(activeCharacter.id);
  const activeCharacterDisplay = getCharacterDisplay(activeCharacter.id, activeCharacter.english);
  const activeThemeDisplay = getThemeDisplay(activeCharacter.id);
  const activeFinishDisplay = getFinishDisplay(activeFinish.id);

  const filteredCharacters = useMemo(() => {
    const keyword = characterQuery.trim().toLowerCase();
    if (!keyword) return FIGURE_DEFINITIONS;
    return FIGURE_DEFINITIONS.filter((character) => {
      const copy = getCharacterDisplay(character.id, character.english);
      return (
        character.id.toLowerCase().includes(keyword) ||
        character.english.toLowerCase().includes(keyword) ||
        copy.name.toLowerCase().includes(keyword) ||
        copy.family.toLowerCase().includes(keyword)
      );
    });
  }, [characterQuery]);

  const currentOptions = useMemo(() => {
    if (activeSlot === "finish") return FINISH_PRESETS;
    return activeCharacter.slots[activeSlot];
  }, [activeCharacter, activeSlot]);

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
      sendBlindbox({ type: "RESET" });
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

  function handleBlindboxDraw() {
    if (blindboxActive) return;
    setRecipeForCharacter(activeCharacterId, randomizeRecipe(activeCharacter));
    setStageTransitionToken((current) => current + 1);
    sendBlindbox({ type: "DRAW" });
  }

  function handleApplySaved(look: SavedLook) {
    setStageTransitionToken((current) => current + 1);
    setStageSwitching(true);
    sendBlindbox({ type: "RESET" });
    setActiveCharacterId(look.characterId);
    setActiveSlot("variant");
    setRecipeForCharacter(look.characterId, look.recipe);
  }

  function handleRemoveSaved(id: string) {
    setSavedLooks((current) => current.filter((item) => item.id !== id));
  }

  function handleClearSaved() {
    setSavedLooks([]);
  }

  function handleSlotTabsWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const el = slotTabsRef.current;
    if (!el) return;
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    event.preventDefault();
    el.scrollLeft += event.deltaY;
  }

  function handleSlotTabsPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const el = slotTabsRef.current;
    if (!el) return;
    slotTabsDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startLeft: el.scrollLeft,
    };
    el.setPointerCapture(event.pointerId);
    el.classList.add("is-dragging");
  }

  function handleSlotTabsPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const el = slotTabsRef.current;
    const drag = slotTabsDragRef.current;
    if (!el || !drag.active || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    el.scrollLeft = drag.startLeft - deltaX;
  }

  function handleSlotTabsPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const el = slotTabsRef.current;
    const drag = slotTabsDragRef.current;
    if (!el || !drag.active || drag.pointerId !== event.pointerId) return;
    drag.active = false;
    drag.pointerId = -1;
    try {
      el.releasePointerCapture(event.pointerId);
    } catch {
      // noop
    }
    el.classList.remove("is-dragging");
  }

  function scrollSecondarySlots(direction: "left" | "right") {
    const el = slotTabsRef.current;
    if (!el) return;
    const step = 180;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }

  return (
    <div className="reboot-page" style={pageStyle}>
      <div className="reboot-shell">
        <aside className="reboot-panel reboot-panel-left">
          <div className="reboot-panel-head">
            <span className="reboot-kicker">角色骨架库</span>
            <h1>独立角色工坊</h1>
            <p>保留核心功能，持续优化角色质感、流畅度和盲盒展示体验。</p>
          </div>

          <div className="reboot-search-row">
            <input
              className="reboot-search-input"
              value={characterQuery}
              onChange={(event) => setCharacterQuery(event.target.value)}
              placeholder="搜索角色（中文 / English / ID）"
              aria-label="搜索角色"
            />
            <span className="reboot-search-count">{filteredCharacters.length} / {FIGURE_DEFINITIONS.length}</span>
          </div>

          <div className="reboot-character-list">
            {filteredCharacters.length === 0 ? (
              <div className="reboot-empty-card">
                <strong>没有匹配角色</strong>
                <p>请换个关键词，或清空搜索后再试。</p>
              </div>
            ) : (
              filteredCharacters.map((character) => {
              const selected = character.id === activeCharacterId;
              const display = getCharacterDisplay(character.id, character.english);
              const themeDisplay = getThemeDisplay(character.id);

              return (
                <button
                  key={character.id}
                  type="button"
                  className={`reboot-character-card${selected ? " is-active" : ""}`}
                  onClick={() => handleCharacterSelect(character.id)}
                >
                  <div className="reboot-character-card-head">
                    <strong>{display.name}</strong>
                    <span>{display.badge}</span>
                  </div>
                  <em>{display.family}</em>
                  <small className="reboot-character-tone">{themeDisplay.title}</small>
                  <p>{display.intro}</p>
                </button>
              );
              })
            )}
          </div>
        </aside>

        <main className="reboot-stage-panel">
          <header className="reboot-stage-head">
            <div>
              <span className="reboot-kicker">中央展台</span>
              <h2>{activeCharacterDisplay.name}</h2>
              <p>{activeCharacterDisplay.intro}</p>
            </div>
          </header>

          <section className={`reboot-stage-wrap${stageSwitching ? " is-switching" : ""}${blindboxActive ? " is-blindbox" : ""}`}>
            <div className="reboot-stage-quick-actions">
              <button
                type="button"
                className="reboot-action reboot-action-strong"
                onClick={handleBlindboxDraw}
                disabled={blindboxActive}
              >
                {blindboxActive ? "盲盒进行中..." : "盲盒再抽一次"}
              </button>
            </div>
            <Suspense fallback={<div className="reboot-stage-shell" />}>
              <LazyCharacterStageV2
                character={activeCharacter}
                recipe={currentRecipe}
                transitionToken={stageTransitionToken}
                qualityMode={qualityMode}
                blindboxActive={blindboxActive}
              />
            </Suspense>
            <UnboxShell
              active={blindboxActive}
              phase={blindboxPhase as BlindboxPhase}
              token={blindboxToken}
              locale="zh"
              selectedBoxIndex={blindboxSelectedBoxIndex}
              rarity={blindboxRarity}
              accent={activeFinish.accent}
              accentSoft={activeFinish.accentSoft}
              accentStrong={activeFinish.accent}
              glow={activeFinish.glow}
              glowSoft={activeFinish.glowSoft}
            />
          </section>
        </main>

        <aside className="reboot-panel reboot-panel-right">
          <section className="reboot-side-block">
            <div className="reboot-side-head">
              <div>
                <span className="reboot-kicker">当前角色</span>
                <h3>{activeCharacterDisplay.name}</h3>
              </div>
              <span className="reboot-family-pill">{activeCharacterDisplay.family}</span>
            </div>

            <div className="reboot-summary-card">
              <strong>{activeFinishDisplay.label}</strong>
              <p>{activeCharacterDisplay.badge} · {activeFinishDisplay.blurb}</p>
            </div>

            <div className="reboot-summary-card reboot-theme-card">
              <strong>{activeThemeDisplay.title}</strong>
              <p>{activeThemeDisplay.atmosphere}</p>
              <div className="reboot-theme-tags">
                {activeThemeDisplay.keywords.map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="reboot-side-block reboot-side-grow">
            <div className="reboot-side-head">
              <div>
                <span className="reboot-kicker">角色专属改造</span>
                <h3>{SLOT_DISPLAY[activeSlot].label}</h3>
              </div>
              <span className="reboot-side-tip">常用槽位固定显示，其余可滑动</span>
            </div>

            <div className="reboot-slot-primary">
              {PRIMARY_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`reboot-slot-tab${slot === activeSlot ? " is-active" : ""}`}
                  onClick={() => setActiveSlot(slot)}
                >
                  <strong>{SLOT_DISPLAY[slot].label}</strong>
                  <span>{SLOT_DISPLAY[slot].hint}</span>
                </button>
              ))}
            </div>
            <div className="reboot-slot-secondary-wrap">
              <div className="reboot-slot-secondary-head">
                <span className="reboot-slot-secondary-label">更多槽位</span>
                <div className="reboot-slot-scroll-actions">
                  <button type="button" onClick={() => scrollSecondarySlots("left")} aria-label="向左查看更多槽位">
                    ←
                  </button>
                  <button type="button" onClick={() => scrollSecondarySlots("right")} aria-label="向右查看更多槽位">
                    →
                  </button>
                </div>
              </div>
              <div
                ref={slotTabsRef}
                className="reboot-slot-tabs"
                onWheel={handleSlotTabsWheel}
                onPointerDown={handleSlotTabsPointerDown}
                onPointerMove={handleSlotTabsPointerMove}
                onPointerUp={handleSlotTabsPointerEnd}
                onPointerCancel={handleSlotTabsPointerEnd}
              >
                {SECONDARY_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`reboot-slot-tab${slot === activeSlot ? " is-active" : ""}`}
                    onClick={() => setActiveSlot(slot)}
                  >
                    <strong>{SLOT_DISPLAY[slot].label}</strong>
                    <span>{SLOT_DISPLAY[slot].hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="reboot-option-grid">
              {currentOptions.map((option, index) => {
                const selected = currentRecipe[activeSlot] === option.id;

                if (activeSlot === "finish") {
                  const finish = option as (typeof FINISH_PRESETS)[number];
                  const finishDisplay = getFinishDisplay(finish.id);
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      className={`reboot-option-card reboot-option-finish${selected ? " is-active" : ""}`}
                      onClick={() => handleOptionSelect("finish", finish.id)}
                    >
                      <span className="reboot-swatch" style={{ background: finish.swatch }} />
                      <strong>{finishDisplay.label}</strong>
                      <p>{finishDisplay.blurb}</p>
                    </button>
                  );
                }

                const figureOption = option as FigureOption;
                const optionDisplay = getOptionDisplay(activeSlot, figureOption, index);

                return (
                  <button
                    key={figureOption.id}
                    type="button"
                    className={`reboot-option-card${selected ? " is-active" : ""}`}
                    onClick={() => handleOptionSelect(activeSlot, figureOption.id)}
                  >
                    <span>{optionDisplay.badge}</span>
                    <strong>{optionDisplay.label}</strong>
                    <p>{optionDisplay.blurb}</p>
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
              {savedLooks.length > 0 ? (
                <button type="button" className="reboot-side-clear" onClick={handleClearSaved}>
                  清空
                </button>
              ) : null}
            </div>

            <div className="reboot-save-list">
              {savedLooks.length === 0 ? (
                <div className="reboot-empty-card">
                  <strong>还没有收藏</strong>
                  <p>先把当前角色调到满意，再点击“收藏当前造型”。</p>
                </div>
              ) : (
                savedLooks.map((look) => {
                  const character = getFigureDefinition(look.characterId);
                  const finish = getFinishPreset(look.recipe.finish);
                  const characterDisplay = getCharacterDisplay(character.id, character.english);
                  const finishDisplay = getFinishDisplay(finish.id);
                  const note = `${characterDisplay.name} · ${finishDisplay.label}`;

                  return (
                    <article key={look.id} className="reboot-save-card">
                      <div>
                        <strong>{characterDisplay.name}</strong>
                        <span>{note}</span>
                        <p>{characterDisplay.badge} · {finishDisplay.label}</p>
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

import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import { getBlindboxPhaseDuration, getBlindboxRarityProfile } from "../blindbox.selectors";
import type { BlindboxLocale, BlindboxPhase, BlindboxRarity } from "../blindbox.types";
import { UnboxBoxSvg } from "./unbox-box-svg";

type Props = {
  active: boolean;
  phase: BlindboxPhase;
  token: number;
  locale: BlindboxLocale;
  selectedBoxIndex: number;
  rarity: BlindboxRarity | null;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  glow: string;
  glowSoft: string;
};

export function UnboxShell({
  active,
  phase,
  token,
  locale,
  selectedBoxIndex,
  rarity,
  accent,
  accentSoft,
  accentStrong,
  glow,
  glowSoft,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const centerShellRef = useRef<HTMLDivElement | null>(null);
  const boxRootRef = useRef<SVGGElement | null>(null);
  const boxBodyRef = useRef<SVGGElement | null>(null);
  const topFlapRef = useRef<SVGGElement | null>(null);
  const bottomFlapRef = useRef<SVGGElement | null>(null);
  const leftFlapRef = useRef<SVGGElement | null>(null);
  const rightFlapRef = useRef<SVGGElement | null>(null);
  const figureClipRef = useRef<SVGRectElement | null>(null);
  const figureRef = useRef<SVGGElement | null>(null);
  const silhouetteRef = useRef<SVGGElement | null>(null);
  const flashRef = useRef<SVGGElement | null>(null);
  const rarityBadgeRef = useRef<SVGGElement | null>(null);
  const phaseTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const themeStyle = useMemo(
    () =>
      ({
        "--unbox-accent": accent,
        "--unbox-accent-soft": accentSoft,
        "--unbox-accent-strong": accentStrong,
        "--unbox-glow": glow,
        "--unbox-glow-soft": glowSoft,
      }) as CSSProperties,
    [accent, accentSoft, accentStrong, glow, glowSoft],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    phaseTimelineRef.current?.kill();
    phaseTimelineRef.current = null;

    gsap.set(root, { autoAlpha: active && token !== 0 ? 1 : 0 });
    gsap.set(backdropRef.current, { autoAlpha: 1 });
    gsap.set(centerShellRef.current, {
      autoAlpha: 0,
      x: 336,
      y: 14,
      scale: 0.8,
      rotate: -18,
      transformOrigin: "50% 82%",
    });
    gsap.set(boxRootRef.current, { autoAlpha: 1, y: 0, scale: 1, transformOrigin: "50% 78%" });
    gsap.set(boxBodyRef.current, { autoAlpha: 1, y: 0, scaleX: 1, scaleY: 1, transformOrigin: "50% 88%" });
    gsap.set(topFlapRef.current, { x: 0, y: 0, rotate: 0, transformOrigin: "50% 100%" });
    gsap.set(bottomFlapRef.current, { x: 0, y: 0, rotate: 0, transformOrigin: "50% 0%" });
    gsap.set(leftFlapRef.current, { x: 0, y: 0, rotate: 0, transformOrigin: "100% 50%" });
    gsap.set(rightFlapRef.current, { x: 0, y: 0, rotate: 0, transformOrigin: "0% 50%" });
    gsap.set(figureClipRef.current, { attr: { x: 148, y: 234, width: 124, height: 18 } });
    gsap.set(figureRef.current, { autoAlpha: 0, y: 18, scale: 0.62, transformOrigin: "50% 80%" });
    gsap.set(silhouetteRef.current, { autoAlpha: 0, y: 10, scale: 0.68, transformOrigin: "50% 80%" });
    gsap.set(flashRef.current, { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
    gsap.set(rarityBadgeRef.current, { autoAlpha: 0, y: 10 });
  }, [active, token]);

  useLayoutEffect(() => {
    if (!active || token === 0 || phase === "idle" || phase === "viewer-ready") {
      phaseTimelineRef.current?.kill();
      phaseTimelineRef.current = null;
      gsap.set(rootRef.current, { autoAlpha: 0 });
      return;
    }

    const phaseSeconds = getBlindboxPhaseDuration(phase, rarity) / 1000;
    const rarityProfile = getBlindboxRarityProfile(rarity);

    phaseTimelineRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
    });

    switch (phase) {
      case "pop-box": {
        timeline.set(rootRef.current, { autoAlpha: 1 }, 0);
        timeline.to(centerShellRef.current, {
          autoAlpha: 1,
          keyframes: [
            {
              x: 188,
              y: 10,
              scale: 0.9,
              rotate: -13,
              duration: Math.max(0.18, phaseSeconds * 0.34),
              ease: "power1.out",
            },
            {
              x: 26,
              y: -3,
              scale: 1.08,
              rotate: 3,
              duration: Math.max(0.14, phaseSeconds * 0.22),
              ease: "power2.out",
            },
            {
              x: 0,
              y: 0,
              scale: 1.01,
              rotate: 0,
              duration: Math.max(0.12, phaseSeconds * 0.18),
              ease: "power2.out",
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: Math.max(0.12, phaseSeconds * 0.14),
              ease: "power1.out",
            },
          ],
        }, 0);
        timeline.fromTo(
          boxBodyRef.current,
          { scaleX: 0.9, scaleY: 1.1 },
          {
            keyframes: [
              {
                scaleX: 0.95,
                scaleY: 1.06,
                duration: Math.max(0.16, phaseSeconds * 0.26),
                ease: "power1.out",
              },
              {
                scaleX: 1.04,
                scaleY: 0.96,
                duration: Math.max(0.14, phaseSeconds * 0.2),
                ease: "power2.out",
              },
              {
                scaleX: 1,
                scaleY: 1,
                duration: Math.max(0.12, phaseSeconds * 0.16),
                ease: "power1.out",
              },
            ],
          },
          0.08,
        );
        break;
      }
      case "snap-open": {
        timeline.set(centerShellRef.current, { autoAlpha: 1, y: 0, scale: 1, rotate: 0 }, 0);
        timeline.to(centerShellRef.current, {
          keyframes: [
            {
              rotate: -13,
              x: -24,
              y: -3,
              duration: Math.max(0.14, phaseSeconds * 0.2),
              ease: "power1.inOut",
            },
            {
              rotate: 0,
              x: 0,
              y: 0,
              duration: Math.max(0.08, phaseSeconds * 0.12),
              ease: "power1.inOut",
            },
            {
              rotate: 13,
              x: 24,
              y: -2,
              duration: Math.max(0.14, phaseSeconds * 0.2),
              ease: "power1.inOut",
            },
            {
              rotate: 0,
              x: 0,
              y: 0,
              duration: Math.max(0.08, phaseSeconds * 0.12),
              ease: "power1.inOut",
            },
            {
              rotate: 0,
              x: 0,
              y: 0,
              duration: Math.max(0.12, phaseSeconds * 0.18),
              ease: "power1.out",
            },
          ],
        }, 0);
        timeline.to(boxBodyRef.current, {
          keyframes: [
            {
              scaleX: 0.96,
              scaleY: 1.04,
              duration: Math.max(0.14, phaseSeconds * 0.2),
              ease: "power1.inOut",
            },
            {
              scaleX: 1,
              scaleY: 1,
              duration: Math.max(0.08, phaseSeconds * 0.12),
              ease: "power1.inOut",
            },
            {
              scaleX: 1.04,
              scaleY: 0.96,
              duration: Math.max(0.14, phaseSeconds * 0.2),
              ease: "power1.inOut",
            },
            {
              scaleX: 1,
              scaleY: 1,
              duration: Math.max(0.08, phaseSeconds * 0.12),
              ease: "power1.inOut",
            },
            {
              scaleX: 0.992,
              scaleY: 1.008,
              duration: Math.max(0.08, phaseSeconds * 0.08),
              ease: "power1.out",
            },
            {
              scaleX: 1,
              scaleY: 1,
              duration: Math.max(0.1, phaseSeconds * 0.12),
              ease: "power1.out",
            },
          ],
        }, 0);
        break;
      }
      case "handoff": {
        timeline.set(rootRef.current, { autoAlpha: 1 }, 0);
        timeline.set(centerShellRef.current, { autoAlpha: 1, y: 0, scale: 1, rotate: 0 }, 0);
        timeline.to(backdropRef.current, {
          autoAlpha: 0.14,
          duration: Math.max(0.18, phaseSeconds * 0.4),
          ease: "power2.out",
        }, 0);
        timeline.to(silhouetteRef.current, {
          autoAlpha: 0.14,
          y: -4,
          scale: 0.72,
          duration: Math.max(0.16, phaseSeconds * 0.38),
          ease: "power2.out",
        }, 0.02);
        timeline.to(figureRef.current, {
          autoAlpha: 0,
          y: -6,
          scale: 0.66,
          duration: Math.max(0.18, phaseSeconds * 0.34),
          ease: "power2.out",
        }, 0);
        timeline.to(boxBodyRef.current, {
          autoAlpha: 0.94,
          y: 0,
          scale: 0.992,
          duration: Math.max(0.18, phaseSeconds * 0.36),
          ease: "power2.out",
        }, 0.02);
        timeline.to(centerShellRef.current, {
          y: 2,
          scale: 0.99,
          autoAlpha: 1,
          duration: Math.max(0.18, phaseSeconds * 0.38),
          ease: "power2.out",
        }, 0.04);
        break;
      }
      case "reveal": {
        timeline.set(rootRef.current, { autoAlpha: 1 }, 0);
        timeline.set(centerShellRef.current, { autoAlpha: 1, y: 2, scale: 0.99, rotate: 0 }, 0);
        timeline.set(backdropRef.current, { autoAlpha: 0.08 }, 0);
        timeline.set(boxBodyRef.current, { autoAlpha: 0.86 }, 0);
        timeline.to(flashRef.current, {
          autoAlpha: 0.18,
          scale: rarityProfile.flashScale,
          duration: Math.max(0.18, phaseSeconds * 0.12),
          ease: "power3.out",
        }, 0);
        timeline.to(silhouetteRef.current, {
          autoAlpha: 0.1,
          y: -8,
          scale: 0.74,
          duration: Math.max(0.22, phaseSeconds * 0.2),
          ease: "power2.out",
        }, 0);
        timeline.to(centerShellRef.current, {
          y: 12,
          scale: 0.964,
          autoAlpha: 0.56,
          duration: Math.max(0.38, phaseSeconds * 0.42),
          ease: "power1.out",
        }, phaseSeconds * 0.04);
        timeline.to(boxBodyRef.current, {
          autoAlpha: 0.42,
          scale: 0.976,
          duration: Math.max(0.34, phaseSeconds * 0.4),
          ease: "power1.out",
        }, phaseSeconds * 0.04);
        timeline.to(backdropRef.current, {
          autoAlpha: 0.02,
          duration: Math.max(0.24, phaseSeconds * 0.24),
          ease: "power1.out",
        }, phaseSeconds * 0.04);
        timeline.to(flashRef.current, {
          autoAlpha: 0,
          scale: rarityProfile.flashScale + 0.08,
          duration: Math.max(0.24, phaseSeconds * 0.18),
        }, phaseSeconds * 0.16);
        break;
      }
      case "settle-on-base": {
        timeline.set(rootRef.current, { autoAlpha: 0 }, 0);
        break;
      }
      default:
        return;
    }

    phaseTimelineRef.current = timeline;

    return () => {
      if (phaseTimelineRef.current === timeline) {
        phaseTimelineRef.current = null;
      }
      timeline.kill();
    };
  }, [active, phase, rarity, token]);

  const selectedCode = String(selectedBoxIndex + 1).padStart(2, "0");

  return (
    <div
      ref={rootRef}
      className={active ? "unbox-shell is-active" : "unbox-shell"}
      style={themeStyle}
      data-phase={phase}
      data-token={token}
      aria-hidden={!active}
    >
      <div ref={backdropRef} className="unbox-shell-backdrop" />

      <div className="unbox-shell-stage">
        <div className="unbox-stage-chip" aria-hidden="true">
          <span>{locale === "zh" ? "盲盒编号" : "BOX ID"}</span>
          <strong>{selectedCode}</strong>
        </div>

        <div ref={centerShellRef} className="unbox-stage-hero">
          <UnboxBoxSvg
            locale={locale}
            rarity={rarity}
            refs={{
              boxRootRef,
              boxBodyRef,
              topFlapRef,
              bottomFlapRef,
              leftFlapRef,
              rightFlapRef,
              figureClipRef,
              figureRef,
              silhouetteRef,
              flashRef,
              rarityBadgeRef,
            }}
          />
        </div>
      </div>
    </div>
  );
}

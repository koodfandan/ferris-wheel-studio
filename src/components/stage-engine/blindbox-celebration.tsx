import canvasConfetti from "canvas-confetti";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { getBlindboxRarityProfile } from "../../features/blindbox/blindbox.selectors";
import type { BlindboxPhase, BlindboxRarity } from "../../features/blindbox/blindbox.types";

type Props = {
  active: boolean;
  phase: BlindboxPhase;
  token: number;
  rarity: BlindboxRarity | null;
  accent: string;
  accentSoft: string;
  glow: string;
  glowSoft: string;
};

export function BlindboxCelebration({
  active,
  phase,
  token,
  rarity,
  accent,
  accentSoft,
  glow,
  glowSoft,
}: Props) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const celebratedTokenRef = useRef(0);

  const shellStyle = {
    "--blindbox-accent": accent,
    "--blindbox-accent-soft": accentSoft,
    "--blindbox-glow": glow,
    "--blindbox-glow-soft": glowSoft,
  } as CSSProperties;

  useLayoutEffect(() => {
    phaseTimelineRef.current?.kill();
    phaseTimelineRef.current = null;

    gsap.set(shellRef.current, { autoAlpha: active && token !== 0 ? 1 : 0 });
    gsap.set(flashRef.current, { autoAlpha: 0, scale: 0.68, transformOrigin: "50% 50%" });
  }, [active, token]);

  useLayoutEffect(() => {
    if (!active || token === 0 || (phase !== "reveal" && phase !== "settle-on-base" && phase !== "viewer-ready")) {
      phaseTimelineRef.current?.kill();
      phaseTimelineRef.current = null;
      gsap.set(shellRef.current, { autoAlpha: 0 });
      return;
    }

    const rarityProfile = getBlindboxRarityProfile(rarity);
    const phaseSeconds = rarityProfile.settleMs / 1000;
    const timeline = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
    });

    timeline.set(shellRef.current, { autoAlpha: 1 }, 0);
    if (phase === "reveal") {
      timeline.set(flashRef.current, {
        autoAlpha: 0.08,
        scale: rarityProfile.flashScale - 0.08,
      }, 0);
    } else if (phase === "settle-on-base") {
      timeline.set(flashRef.current, {
        autoAlpha: 0.08,
        scale: rarityProfile.flashScale - 0.04,
      }, 0);
    } else {
      timeline.set(flashRef.current, {
        autoAlpha: 0.08,
        scale: rarityProfile.flashScale - 0.02,
      }, 0);
      timeline.to(shellRef.current, {
        autoAlpha: 0,
        duration: Math.max(0.18, phaseSeconds * 0.22),
      }, phaseSeconds * 0.46);
    }

    phaseTimelineRef.current = timeline;

    return () => {
      if (phaseTimelineRef.current === timeline) {
        phaseTimelineRef.current = null;
      }
      timeline.kill();
    };
  }, [active, phase, rarity, token]);

  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    if (!active || token === 0) return;
    if (phase !== "reveal") return;
    if (celebratedTokenRef.current === token) return;

    celebratedTokenRef.current = token;

    const fire = canvasConfetti.create(canvas, {
      resize: true,
      useWorker: true,
    });
    const profile = getBlindboxRarityProfile(rarity);
    const particleScale = rarity === "secret" ? 1 : rarity === "rare" ? 0.72 : 0.42;

    fire({
      particleCount: Math.max(0, Math.round(12 * particleScale)),
      spread: 24 + Math.round(8 * profile.confettiBurst),
      startVelocity: 18 + Math.round(8 * profile.confettiBurst),
      scalar: 0.62 + profile.confettiBurst * 0.08,
      ticks: 90,
      origin: { x: 0.5, y: 0.68 },
      colors: [accent, accentSoft, glow, glowSoft, "#ffffff"],
    });
  }, [accent, accentSoft, active, glow, glowSoft, phase, rarity, token]);

  return (
    <div
      ref={shellRef}
      className={active ? "blindbox-celebration is-visible" : "blindbox-celebration"}
      style={shellStyle}
      aria-hidden={!active}
    >
      <canvas ref={confettiCanvasRef} className="blindbox-celebration-canvas" />
      <div ref={flashRef} className="blindbox-celebration-flash" />
    </div>
  );
}


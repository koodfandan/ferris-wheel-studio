import type { MutableRefObject } from "react";
import type { BlindboxLocale, BlindboxRarity } from "../blindbox.types";

export type UnboxBoxRefs = {
  boxRootRef: MutableRefObject<SVGGElement | null>;
  boxBodyRef: MutableRefObject<SVGGElement | null>;
  topFlapRef: MutableRefObject<SVGGElement | null>;
  bottomFlapRef: MutableRefObject<SVGGElement | null>;
  leftFlapRef: MutableRefObject<SVGGElement | null>;
  rightFlapRef: MutableRefObject<SVGGElement | null>;
  figureClipRef: MutableRefObject<SVGRectElement | null>;
  figureRef: MutableRefObject<SVGGElement | null>;
  silhouetteRef: MutableRefObject<SVGGElement | null>;
  flashRef: MutableRefObject<SVGGElement | null>;
  rarityBadgeRef: MutableRefObject<SVGGElement | null>;
};

type Props = {
  locale: BlindboxLocale;
  rarity: BlindboxRarity | null;
  refs: UnboxBoxRefs;
};

export function UnboxBoxSvg({ locale: _locale, rarity: _rarity, refs }: Props) {
  return (
    <svg viewBox="0 0 420 420" className="unbox-box-svg" aria-hidden="true">
      <defs>
        <linearGradient id="unboxShellGradient" x1="10%" y1="4%" x2="92%" y2="96%">
          <stop offset="0%" stopColor="rgba(255, 251, 248, 0.99)" />
          <stop offset="48%" stopColor="rgba(255, 231, 220, 0.98)" />
          <stop offset="100%" stopColor="rgba(247, 190, 162, 0.98)" />
        </linearGradient>
        <linearGradient id="unboxFlapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 252, 249, 0.96)" />
          <stop offset="100%" stopColor="rgba(245, 169, 135, 0.96)" />
        </linearGradient>
        <linearGradient id="unboxSideGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 248, 243, 0.94)" />
          <stop offset="100%" stopColor="rgba(244, 198, 172, 0.94)" />
        </linearGradient>
        <linearGradient id="unboxPanelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 250, 246, 0.96)" />
          <stop offset="100%" stopColor="rgba(255, 239, 230, 0.94)" />
        </linearGradient>
        <radialGradient id="unboxHeroCardGradient" cx="50%" cy="18%" r="88%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="58%" stopColor="rgba(255, 237, 228, 0.97)" />
          <stop offset="100%" stopColor="rgba(252, 212, 193, 0.96)" />
        </radialGradient>
        <linearGradient id="unboxInfoRibbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.94)" />
          <stop offset="100%" stopColor="rgba(255, 233, 223, 0.94)" />
        </linearGradient>
        <linearGradient id="unboxTrimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.96)" />
          <stop offset="52%" stopColor="rgba(255, 231, 220, 0.92)" />
          <stop offset="100%" stopColor="rgba(239, 125, 102, 0.34)" />
        </linearGradient>
        <linearGradient id="unboxSealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.88)" />
          <stop offset="100%" stopColor="rgba(255, 214, 197, 0.94)" />
        </linearGradient>
        <radialGradient id="unboxPortraitGradient" cx="50%" cy="24%" r="78%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="62%" stopColor="rgba(255, 236, 226, 0.98)" />
          <stop offset="100%" stopColor="rgba(249, 199, 175, 0.96)" />
        </radialGradient>
        <radialGradient id="unboxBadgeGradient" cx="50%" cy="28%" r="72%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.96)" />
          <stop offset="100%" stopColor="rgba(255, 224, 210, 0.96)" />
        </radialGradient>
        <radialGradient id="unboxFlashGradient" cx="50%" cy="44%" r="56%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor="var(--unbox-glow-soft)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--unbox-glow)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="unboxFigureClip">
          <rect ref={refs.figureClipRef} x="154" y="232" width="112" height="20" rx="18" />
        </clipPath>
      </defs>

      <g ref={refs.boxRootRef}>
        <g ref={refs.flashRef}>
          <circle cx="210" cy="208" r="116" fill="url(#unboxFlashGradient)" />
          <ellipse cx="210" cy="320" rx="102" ry="24" fill="rgba(255,255,255,0.18)" />
        </g>

        <g ref={refs.figureRef} clipPath="url(#unboxFigureClip)">
          <circle cx="178" cy="176" r="20" fill="var(--unbox-accent-soft)" />
          <circle cx="242" cy="176" r="20" fill="var(--unbox-accent-soft)" />
          <circle cx="210" cy="210" r="60" fill="#ffd9c8" />
          <path
            d="M158 206 C168 166, 252 166, 262 206 C248 188, 230 180, 210 180 C190 180, 172 188, 158 206 Z"
            fill="var(--unbox-accent)"
          />
          <circle cx="190" cy="212" r="5.5" fill="#4f3225" />
          <circle cx="230" cy="212" r="5.5" fill="#4f3225" />
          <circle cx="180" cy="230" r="7.5" fill="rgba(255, 161, 150, 0.42)" />
          <circle cx="240" cy="230" r="7.5" fill="rgba(255, 161, 150, 0.42)" />
          <path d="M195 242 C202 250, 218 250, 225 242" fill="none" stroke="#684134" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M164 318 C170 264, 250 264, 256 318 L238 332 C226 340, 194 340, 182 332 Z"
            fill="var(--unbox-accent-soft)"
          />
          <circle cx="168" cy="292" r="14" fill="#ffd9c8" />
          <circle cx="252" cy="292" r="14" fill="#ffd9c8" />
          <circle cx="194" cy="340" r="12" fill="#ffd9c8" />
          <circle cx="226" cy="340" r="12" fill="#ffd9c8" />
        </g>

        <g ref={refs.silhouetteRef} clipPath="url(#unboxFigureClip)">
          <circle cx="210" cy="208" r="62" fill="rgba(255,255,255,0.86)" />
          <circle cx="178" cy="176" r="18" fill="rgba(255,255,255,0.76)" />
          <circle cx="242" cy="176" r="18" fill="rgba(255,255,255,0.76)" />
          <path d="M164 316 C174 258, 246 258, 256 316 Z" fill="rgba(255,255,255,0.8)" />
        </g>

        <g ref={refs.boxBodyRef}>
          <ellipse cx="210" cy="340" rx="98" ry="22" fill="rgba(154, 97, 64, 0.16)" />
          <rect
            x="110"
            y="140"
            width="200"
            height="192"
            rx="34"
            fill="rgba(255,255,255,0.36)"
            stroke="rgba(255,255,255,0.48)"
            strokeWidth="1.2"
          />
          <rect
            x="116"
            y="146"
            width="188"
            height="180"
            rx="30"
            fill="url(#unboxShellGradient)"
            stroke="rgba(158, 102, 72, 0.22)"
            strokeWidth="2.4"
          />
          <rect
            x="122"
            y="152"
            width="176"
            height="168"
            rx="28"
            fill="none"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="1.4"
          />
          <rect x="128" y="158" width="164" height="22" rx="11" fill="url(#unboxSealGradient)" />
          <rect x="138" y="162" width="86" height="10" rx="5" fill="rgba(255,255,255,0.6)" />
          <rect x="232" y="162" width="46" height="14" rx="7" fill="rgba(255,255,255,0.72)" />
          <circle cx="284" cy="169" r="5" fill="rgba(255,255,255,0.72)" />
          <circle cx="272" cy="169" r="2.8" fill="rgba(255,255,255,0.42)" />
          <path d="M132 186 C154 176, 180 174, 210 174 C240 174, 266 176, 288 186" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="1.2" />
          <rect
            x="136"
            y="184"
            width="148"
            height="118"
            rx="30"
            fill="url(#unboxTrimGradient)"
          />
          <rect
            x="144"
            y="188"
            width="132"
            height="108"
            rx="28"
            fill="rgba(255, 249, 244, 0.9)"
            stroke="rgba(255,255,255,0.84)"
            strokeWidth="1.6"
          />
          <rect x="154" y="196" width="112" height="14" rx="7" fill="rgba(255,255,255,0.82)" />
          <rect x="166" y="200" width="58" height="5" rx="2.5" fill="rgba(239, 125, 102, 0.24)" />
          <circle cx="246" cy="203" r="4.2" fill="rgba(239, 125, 102, 0.52)" />
          <circle cx="257" cy="203" r="2.6" fill="rgba(239, 125, 102, 0.26)" />
          <circle cx="210" cy="242" r="37" fill="url(#unboxPortraitGradient)" />
          <ellipse cx="210" cy="242" rx="48" ry="56" fill="none" stroke="rgba(239, 125, 102, 0.18)" strokeWidth="3" />
          <path d="M174 226 C184 199, 236 199, 246 226" fill="none" stroke="rgba(239,125,102,0.58)" strokeWidth="8" strokeLinecap="round" />
          <circle cx="176" cy="228" r="6.5" fill="rgba(239,125,102,0.8)" />
          <circle cx="244" cy="228" r="6.5" fill="rgba(239,125,102,0.8)" />
          <circle cx="192" cy="222" r="12" fill="var(--unbox-accent-soft)" />
          <circle cx="228" cy="222" r="12" fill="var(--unbox-accent-soft)" />
          <circle cx="210" cy="242" r="30" fill="#fff2ea" />
          <circle cx="210" cy="242" r="20" fill="#ffdacc" />
          <path d="M186 240 C194 222, 226 222, 234 240 C225 231, 218 227, 210 227 C202 227, 195 231, 186 240 Z" fill="var(--unbox-accent)" />
          <circle cx="201" cy="244" r="3.5" fill="#5a3d30" />
          <circle cx="219" cy="244" r="3.5" fill="#5a3d30" />
          <path d="M203 254 C206 258, 214 258, 217 254" fill="none" stroke="#6d4637" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="183" cy="257" r="4.8" fill="rgba(255, 183, 171, 0.54)" />
          <circle cx="237" cy="257" r="4.8" fill="rgba(255, 183, 171, 0.54)" />
          <path d="M156 286 C174 272, 190 266, 210 266 C230 266, 246 272, 264 286" fill="none" stroke="rgba(239,125,102,0.26)" strokeWidth="4" strokeLinecap="round" />
          <rect x="160" y="272" width="100" height="18" rx="9" fill="url(#unboxInfoRibbonGradient)" />
          <rect x="178" y="278" width="64" height="6" rx="3" fill="rgba(239, 125, 102, 0.3)" />
          <circle cx="168" cy="281" r="3.2" fill="rgba(239, 125, 102, 0.26)" />
          <circle cx="252" cy="281" r="3.2" fill="rgba(239, 125, 102, 0.26)" />
          <rect x="154" y="304" width="112" height="10" rx="5" fill="rgba(255,255,255,0.4)" />
          <rect x="170" y="308" width="80" height="3.5" rx="1.75" fill="rgba(239, 125, 102, 0.16)" />
          <g opacity="0.88">
            <circle cx="150" cy="214" r="8" fill="url(#unboxBadgeGradient)" stroke="rgba(255,255,255,0.82)" strokeWidth="1.2" />
            <circle cx="150" cy="214" r="3" fill="rgba(239,125,102,0.48)" />
            <circle cx="270" cy="214" r="8" fill="url(#unboxBadgeGradient)" stroke="rgba(255,255,255,0.82)" strokeWidth="1.2" />
            <circle cx="270" cy="214" r="3" fill="rgba(239,125,102,0.48)" />
          </g>
          <path d="M126 318 C170 292, 252 292, 294 318" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="2.2" />
        </g>

        <g ref={refs.topFlapRef} />
        <g ref={refs.bottomFlapRef} />
        <g ref={refs.leftFlapRef} />
        <g ref={refs.rightFlapRef} />

        <g ref={refs.rarityBadgeRef}>
          <rect x="148" y="292" width="124" height="28" rx="14" fill="rgba(255,255,255,0.92)" />
          <rect x="182" y="304" width="56" height="5" rx="2.5" fill="rgba(239, 125, 102, 0.26)" />
        </g>
      </g>
    </svg>
  );
}

# Blindbox Unbox Technical Implementation

## 1. Final technical decision

Use one stable hybrid stack:

- `React 18 + TypeScript + Vite` for the app shell
- `XState v5 + @xstate/react` for unbox flow and interaction state
- `GSAP + inline SVG` for blind-box packaging animation
- `three + @react-three/fiber + @react-three/drei` for the 3D figure stage
- `@react-three/postprocessing` for the final quality layer
- `GLTFLoader + useGLTF + gltfjsx + glTF-Transform` for model pipeline
- `Zod` for manifest validation
- `canvas-confetti` only for reveal-end celebration

This is the final route because it separates three different jobs correctly:

1. Packaging suspense
2. Flow control
3. 3D viewing and modular assembly

Do not use one layer to do all three jobs.

## 2. Why this route is technically correct

### 2.1 Packaging animation should not be owned by 3D

The blind-box outer package includes:

- seal strip
- lid hinge
- inner foil bag
- card insert
- rarity flash card

These are mostly flat branded surfaces with controlled motion.

They are easier and cheaper to maintain as:

- `SVG shapes`
- `CSS mask/clipPath`
- `GSAP timelines`

If packaging is modeled in 3D, every new series requires:

- new box model
- new UV/material treatment
- new lid rig
- new foil bag mesh
- new tuning for camera framing

That is high maintenance and unnecessary.

### 2.2 The 3D viewer should start after suspense is already created

The 3D layer should only handle:

- reveal silhouette
- revealed figure
- fixed base
- 360 view
- modular part swapping

This keeps the 3D stage reusable across series.

### 2.3 A state machine is mandatory

The unbox flow has gating rules:

- result is decided early
- rarity is hidden before reveal
- model preloading must happen before reveal
- interaction is locked until the reveal settles
- builder mode opens only after viewer-ready

This is not safe to manage with scattered local state and timeouts.

## 3. Feature architecture

### 3.1 Folder layout

```text
src/
  app/
    studio-page.tsx
  features/
    blindbox/
      blindbox.machine.ts
      blindbox.types.ts
      blindbox.constants.ts
      blindbox.selectors.ts
      components/
        blindbox-grid.tsx
        blindbox-launch-pad.tsx
        unbox-shell.tsx
        unbox-box-svg.tsx
        unbox-foil-bag.tsx
        rarity-badge.tsx
    viewer/
      viewer-stage.tsx
      viewer-scene.tsx
      viewer-controls.tsx
      viewer-effects.tsx
      viewer-camera.ts
      viewer-interaction.machine.ts
    builder/
      builder-panel.tsx
      builder-slots.tsx
      builder-palette.tsx
    assets/
      schemas/
        series.schema.ts
        figure.schema.ts
        reveal-profile.schema.ts
      registry/
        asset-registry.ts
        figure-registry.ts
        reveal-registry.ts
      loaders/
        load-figure.ts
        preload-figure.ts
      manifests/
        series/
        figures/
        reveal/
  lib/
    animation/
      gsap-timeline.ts
    spatial/
      spatial-guard.ts
      spatial-solver.ts
```

### 3.2 Current project migration target

The current files should be treated as migration targets, not final structure:

- `src/App.tsx`
  - keep only page composition and top-level orchestration
- `src/components/stage-engine/stage-canvas.tsx`
  - split into `viewer-stage.tsx` and `viewer-controls.tsx`
- `src/components/stage-engine/stage-scene.tsx`
  - keep only scene lighting, aura, shadows, base, figure
- `src/components/stage-engine/blindbox-celebration.tsx`
  - downgrade to celebration-only layer
- current blindbox logic in `App.tsx`
  - move into `features/blindbox/blindbox.machine.ts`

## 4. State machine design

### 4.1 Blind-box flow states

```text
idle
  -> pickBox
  -> pullSeal
  -> openLid
  -> liftInnerBag
  -> tearInnerBag
  -> revealSilhouette
  -> revealFigure
  -> settleOnBase
  -> viewerReady
  -> builderReady
```

### 4.2 Context

```ts
type BlindboxContext = {
  seriesId: string;
  selectedBoxId: string | null;
  drawToken: number;
  rarity: "basic" | "rare" | "secret" | null;
  figureId: string | null;
  revealProfileId: string | null;
  preloadStatus: "idle" | "loading" | "ready" | "failed";
  preloadError: string | null;
  interactionMode: "page-scroll" | "viewer-armed";
};
```

### 4.3 Events

```ts
type BlindboxEvent =
  | { type: "PICK_BOX"; boxId: string }
  | { type: "PACKAGING_READY" }
  | { type: "PRELOAD_DONE" }
  | { type: "PRELOAD_FAILED"; error: string }
  | { type: "REVEAL_COMPLETE" }
  | { type: "OPEN_BUILDER" }
  | { type: "CLOSE_BUILDER" }
  | { type: "RESET_DRAW" };
```

### 4.4 Rules

- `PICK_BOX` immediately decides:
  - rarity
  - figure id
  - reveal profile
- `openLid` starts async preload actor
- `revealFigure` can only happen after:
  - packaging timeline reached reveal point
  - preload status is `ready`
- if preload is not ready:
  - hold in `tearInnerBag`
  - extend foil bag hover by `200-400ms`
- `viewerReady` enables 3D activation
- `builderReady` unlocks modular slot UI

## 5. Packaging animation system

### 5.1 Technical choice

Use:

- `inline SVG`
- `GSAP timeline`
- `CSS variables`
- `clipPath` and `mask-image`

### 5.2 Packaging layer tree

```text
unbox-shell
  background veil
  spotlight bloom
  box container
    front face
    side face
    lid
    seal strip
    rarity sticker
  inner bag
  insert card
  reveal flash
  celebration layer
```

### 5.3 Why SVG is preferred here

- Box artwork is crisp on any screen
- Text/logo/sticker remain sharp
- Foil tear edge can be faked with masks
- Series skin swap is just data + gradients + artwork

### 5.4 GSAP timeline phases

```text
t0: selected box comes forward
t1: seal strip pulls off
t2: lid opens
t3: foil bag rises
t4: foil bag tears
t5: silhouette flash
t6: figure reveal
t7: figure settles on base
t8: confetti and rarity stamp
```

### 5.5 What GSAP should own

- transforms
- opacity
- scale
- stagger
- SVG path motion
- synchronized UI overlay transitions

GSAP should not own app truth.
App truth stays in the state machine.

## 6. 3D viewer system

### 6.1 Final viewer stack

- `Canvas`
- `Suspense`
- `useGLTF`
- `CameraControls`
- `ContactShadows`
- custom lights
- `EffectComposer`

### 6.2 Camera strategy

Stop using custom hand-written rotation math as the main strategy.

Use `CameraControls` for:

- `fitToBox`
- `fitToSphere`
- smooth dolly
- smooth rotate
- bounds
- promise-based transitions

### 6.3 Interaction rules

Default mode:

- wheel scroll = page scroll
- pointer drag = no 3D action

After click inside viewer:

- viewer is armed
- drag rotates model
- wheel zooms camera

After click outside viewer or `Escape`:

- viewer returns to page-scroll mode

### 6.4 Base and model motion rule

- base remains fixed
- only the figure rotates
- reveal transition can move the figure group
- shelf auto-rotation, if used, rotates the figure only

## 7. Render quality pipeline

### 7.1 Renderer targets

Use:

- `antialias: true`
- `alpha: true`
- proper color management
- `ACES` or postprocessing tone mapping, not both fighting each other

### 7.2 Postprocessing stack

Keep it small:

- `Bloom`
- `Noise`
- `Vignette`

Do not add these in phase 1:

- `DOF`
- `ChromaticAberration`
- `Glitch`

Reason:

- face readability matters more than flashy distortion
- DOF will blur eyes and mouth too easily

### 7.3 Lighting setup

Use a stable 3-light stage:

- key light
- fill light
- rim/back light

Optional reveal-only helpers:

- aura mesh
- sparkle particles
- reveal flash plane

### 7.4 Brightness guardrail

Set a rule:

- no face material should be readable only because bloom is strong
- face readability must remain good with postprocessing disabled

## 8. Asset pipeline

### 8.1 Base format

All figures and swappable parts use:

- `glTF 2.0`
- shipped as `.glb`

### 8.2 Recommended pipeline

1. Source model exported to `glb`
2. `glTF-Transform optimize`
3. optional texture compression
4. `gltfjsx --types --keepnames`
5. register in manifest

### 8.3 Required naming contract

Every figure core must include named anchors:

- `anchor_head`
- `anchor_face`
- `anchor_hair`
- `anchor_headpiece`
- `anchor_outfit`
- `anchor_prop_r`
- `anchor_base`

Every part manifest must include:

- `id`
- `slot`
- `modelPath`
- `anchor`
- `bbox`
- `collisionTag`
- `fallbackId`

### 8.4 Preload strategy

When box is selected:

- determine the final figure id immediately
- call preload for:
  - figure core
  - default parts
  - reveal profile assets

This preload runs during:

- `openLid`
- `liftInnerBag`
- `tearInnerBag`

The reveal waits for readiness.

## 9. Data manifest system

### 9.1 Series manifest

```ts
type SeriesManifest = {
  id: string;
  title: string;
  boxSkinId: string;
  lineupCount: number;
  hasSecret: boolean;
  figurePool: Array<{
    figureId: string;
    rarity: "basic" | "rare" | "secret";
    weight: number;
  }>;
};
```

### 9.2 Figure manifest

```ts
type FigureManifest = {
  id: string;
  coreModelPath: string;
  defaultBaseId: string;
  defaultPaletteId: string;
  defaultCamera: {
    polar: number;
    azimuth: number;
    distance: number;
    target: [number, number, number];
  };
  anchors: Record<string, string>;
  slots: Record<string, string[]>;
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  revealProfileId: string;
};
```

### 9.3 Reveal profile

```ts
type RevealProfile = {
  id: string;
  rarity: "basic" | "rare" | "secret";
  flashStrength: number;
  auraStrength: number;
  particleCount: number;
  holdMs: number;
  confettiPreset: "none" | "soft" | "burst";
};
```

### 9.4 Validation

All manifests should be validated with `zod` at load time.

If a manifest fails:

- do not crash the viewer
- fail the current draw
- log the manifest error
- show a branded fallback panel

## 10. Spatial compatibility system

Keep and extend the current spatial guard route.

Do not delete it.

Add these checks:

- head hair overlap
- headpiece clearance
- prop-to-face clearance
- prop-to-frame clearance
- outfit-to-base clearance

### 10.1 Compatibility outcome

Each combination returns:

- `allowed`
- `autoReplace`
- `blocked`

### 10.2 UI behavior

- `allowed`: apply directly
- `autoReplace`: apply and show why
- `blocked`: disable and explain why

This is the only scalable way to add more figures later without constant manual fixes.

## 11. Packages to add

Install:

```bash
npm install zod camera-controls
```

Already selected in the current route:

- `xstate`
- `@xstate/react`
- `gsap`
- `canvas-confetti`

## 12. File-by-file implementation order

### Phase 1: state and packaging

Create:

- `src/features/blindbox/blindbox.machine.ts`
- `src/features/blindbox/blindbox.types.ts`
- `src/features/blindbox/components/unbox-shell.tsx`
- `src/features/blindbox/components/unbox-box-svg.tsx`

Update:

- `src/App.tsx`

Goal:

- old timeout flow is fully removed
- draw flow is machine-driven

### Phase 2: viewer controls rebuild

Create:

- `src/features/viewer/viewer-controls.tsx`
- `src/features/viewer/viewer-stage.tsx`

Update:

- `src/components/stage-engine/stage-scene.tsx`

Goal:

- viewer activation logic is isolated
- `CameraControls` replaces custom camera math where possible

### Phase 3: asset manifest layer

Create:

- `src/features/assets/schemas/*.ts`
- `src/features/assets/manifests/*.json`
- `src/features/assets/loaders/*.ts`

Goal:

- figure data is not hardcoded in scene components

### Phase 4: builder integration

Create:

- `src/features/builder/*.tsx`

Goal:

- reveal result feeds modular assembly

### Phase 5: rarity branching and polish

Create or update:

- reveal profile registry
- rarity-specific UI states
- series skin registry

Goal:

- basic, rare, and secret each feel different without changing core architecture

## 13. What should be removed or downgraded

The current temporary reveal system should not remain the final architecture:

- hardcoded blindbox phase timers inside `App.tsx`
- reveal logic mixed directly into generic stage components
- celebration layer acting like the main unbox animation
- hand-maintained camera rotation as the primary viewer system

These parts can exist during migration, but they should not remain the final design.

## 14. Performance budget

Target:

- desktop first meaningful interaction under `2.5s`
- reveal transition should not hitch under normal laptop GPU
- first reveal model payload under `8MB` compressed
- each accessory part preferably under `1MB`

Guardrails:

- use lazy preload by selected series
- do not preload the entire catalog
- keep packaging animation in 2D to reduce 3D scene complexity

## 15. Testing strategy

### 15.1 Unit

- state machine transitions
- manifest validation
- reveal profile selection
- spatial compatibility decisions

### 15.2 Integration

- select box -> reveal -> viewer ready
- select box -> preload delayed -> reveal hold
- reveal -> open builder -> swap part

### 15.3 Manual QA

- wheel scroll outside armed viewer
- wheel zoom inside armed viewer
- second click exits armed mode
- base remains fixed
- secret reveal differs from basic reveal
- face remains readable after reveal

## 16. Acceptance criteria

The rebuild is complete only if all are true:

1. The user understands within 3 seconds that this is a blind-box draw interface.
2. Every draw passes through packaging suspense before 3D reveal.
3. The 3D stage never reveals the figure before the packaging state allows it.
4. The viewer can be freely inspected after reveal.
5. The builder can replace parts without breaking the scene.
6. Adding a new figure does not require rewriting the flow engine.

## 17. Primary references

- POP MART App Store listing: https://apps.apple.com/us/app/pop-mart/id1594346256
- POP MART 2025 Interim Report: https://prod-out-res.popmart.com/cms/INTERIM_REPORT_2025_569e88db3c.pdf
- XState docs: https://stately.ai/docs/xstate
- XState actors: https://stately.ai/docs/actors
- GSAP timeline docs: https://gsap.com/docs/v3/GSAP/Timeline/
- R3F events docs: https://r3f.docs.pmnd.rs/api/events
- Drei docs: https://drei.docs.pmnd.rs/
- camera-controls: https://github.com/yomotsu/camera-controls
- Three.js color management: https://threejs.org/manual/en/color-management.html
- Three.js GLTFLoader: https://threejs.org/docs/pages/GLTFLoader.html
- react-postprocessing: https://github.com/pmndrs/react-postprocessing
- gltfjsx: https://github.com/pmndrs/gltfjsx
- glTF-Transform: https://gltf-transform.dev/
- Zod docs: https://zod.dev/

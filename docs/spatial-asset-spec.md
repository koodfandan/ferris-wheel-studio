# Spatial Asset Spec

This project uses a spatial contract so future collectible models can be added without repeated hand-tuned anti-clipping fixes.

## Goal

Each future figure, base, frame, and backdrop should be described by:

- anchors
- proxy volumes
- clearance requirements
- allowed solve axes
- basic geometric metrics

The runtime solver then places the stage by rule instead of by isolated hard-coded coordinates.

## Files

- Runtime types: [src/lib/spatial-types.ts](D:/Codex/test/ferris-wheel-studio/src/lib/spatial-types.ts)
- Manifest helpers: [src/lib/spatial-manifest.ts](D:/Codex/test/ferris-wheel-studio/src/lib/spatial-manifest.ts)
- Default registry: [src/lib/asset-registry.ts](D:/Codex/test/ferris-wheel-studio/src/lib/asset-registry.ts)
- Layout solver: [src/lib/spatial-solver.ts](D:/Codex/test/ferris-wheel-studio/src/lib/spatial-solver.ts)
- Fast validator: [src/lib/spatial-validate.ts](D:/Codex/test/ferris-wheel-studio/src/lib/spatial-validate.ts)
- JSON template: [public/models/templates/collector-spatial.template.json](D:/Codex/test/ferris-wheel-studio/public/models/templates/collector-spatial.template.json)

## Required roles

At minimum, a collectible stage bundle should describe:

- `base`
- `frame`
- `backdrop`

Recommended additional roles:

- `character`
- `prop`

## Required manifest fields

Every asset entry should contain:

- `id`
- `role`
- `anchors`
- `proxies`
- `metrics`

Optional but strongly recommended:

- `clearance`
- `solveAxes`

## Anchor rules

### Base

Base assets should expose:

- `frame_mount`
- `support_left`
- `support_right`
- `backdrop_mount`

### Frame

Frame assets should expose:

- `center`

### Character

Character assets should expose:

- `root`
- `head`
- `left_hand`
- `right_hand` when applicable

## Proxy rules

Use simplified collision volumes, not full mesh geometry, for runtime layout:

- `box` for bases, backdrops, and blocky costumes
- `sphere` for rings, heads, and rounded shells

These proxies are used by the fast solver and validator.

## Clearance rules

Clearance values are the minimum safe spacing around the asset:

- `top`
- `bottom`
- `front`
- `back`
- `side`

Examples:

- Frame `bottom` clearance prevents the ring from sinking into the base.
- Frame `back` clearance prevents the ring from visually colliding with the backdrop.
- Base `top` clearance ensures enough mount headroom.

## Solve axes

Do not let every part move freely.

Recommended defaults:

- `base`: `[]`
- `frame`: `["y", "z"]`
- `backdrop`: `["z"]`
- `character`: `["x", "y"]`
- `prop`: `["x", "y", "z"]`

This keeps the product display stable.

## Metrics rules

Current solver expects these metrics:

### Base metrics

- `topY`
- `supportSpanHalf`

### Frame metrics

- `outerRadius`
- `depth`
- `supportDrop`

### Backdrop metrics

- `thickness`
- `width`

## Runtime solve order

The current solve order is:

1. base
2. frame
3. backdrop
4. supports

Character and prop rules can be added on top of this.

## Validation strategy

Current fast validation checks:

- base/frame vertical clearance
- frame/backdrop depth clearance
- support height sanity
- missing required anchors

Next recommended step:

- add BVH-based narrow-phase validation for high-risk combinations

## Asset onboarding flow

When a new figure family is introduced:

1. Export or define the visual model.
2. Create a sidecar spatial manifest JSON using the template.
3. Register that manifest through the manifest helper layer.
4. Run the solver.
5. Inspect warnings before enabling the asset in production.

## Important constraint

This system can prevent recurring clipping only if incoming assets obey the spatial contract.

If arbitrary external GLB files are loaded without:

- anchors
- proxy volumes
- metrics
- clearance

then no runtime system can guarantee stable non-clipping behavior.

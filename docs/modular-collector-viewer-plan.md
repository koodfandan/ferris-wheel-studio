# Modular Collector Viewer Plan

## 1. Final product definition

This site should no longer be treated as a single 3D viewer for one finished figurine.
It should become a **collector figure studio** with two goals that must both work:

1. It must look close to a real collectible on a shelf.
2. It must let the user swap parts and assemble combinations like toy components.

The correct product shape is:

- `Shelf Mode`: looks like a real product showcase
- `Assemble Mode`: swaps parts and builds combinations
- `Inspect Mode`: free 360-degree review

The ferris wheel is still the theme, but the product logic is now a modular blind-box style collectible system.

## 2. Why the current route is not enough

The current implementation is not wrong because of one light or one camera number.
It is wrong because it is solving the wrong product:

- it is still centered on one placeholder figure
- it does not have modular slots
- it does not separate beauty display from free inspection
- it treats all rendering as one compromise setup

That means it can never simultaneously achieve:

- realistic display quality
- clear face readability
- configurable accessories
- playful assembly experience

## 3. The new architecture

The site should be rebuilt as a `dual-output asset pipeline + modular web viewer`.

### 3.1 Asset outputs

Use one master asset pipeline and export two outputs from the same design source:

1. `Beauty Output`
- rendered in Blender or Marmoset
- high-quality turntable sequence or MP4
- used in Shelf Mode
- purpose: match how a real figurine feels in product photography

2. `Interactive Output`
- exported as `glb`
- used in Assemble Mode and Inspect Mode
- purpose: interactive part swapping and 360 viewing

This split is required.
If everything is forced into one realtime viewer, the result will continue to look like a realtime demo instead of a real collectible.

## 4. Site modes

### 4.1 Shelf Mode

Purpose:
- first impression
- look expensive
- look like a real toy release page

Behavior:
- default landing state
- plays a turntable render or image sequence
- shows close-up stills for face, cabins, base, back detail
- does not expose too many controls

Visual style:
- soft retail display box atmosphere
- creamy background
- mild reflections
- no obvious realtime rendering artifacts

### 4.2 Assemble Mode

Purpose:
- let users change parts like toy components
- let users create their own combination

Behavior:
- parts are displayed in a rack, drawer, or exploded layout
- clicking a part swaps it onto the main figure
- optional exploded-view animation between assembled and disassembled states
- each selection updates the assembled model immediately

This is the mode that solves the "toy parts can be changed and assembled together" requirement.

### 4.3 Inspect Mode

Purpose:
- free 360 review
- zoom into face and materials

Behavior:
- free orbit
- controlled zoom range
- front/left/right/back presets
- no beauty tricks that hide the actual model

## 5. Modular asset design

Do not treat the figurine as one closed sculpture.
Build it as a base body plus slot-based optional parts.

### 5.1 Core slots

Recommended slot list:

- `SLOT_FACE`
- `SLOT_HEAD_SHELL`
- `SLOT_HEAD_ACCESSORY`
- `SLOT_BODY`
- `SLOT_HAND_PROP_L`
- `SLOT_HAND_PROP_R`
- `SLOT_RING_BACK`
- `SLOT_RING_CENTER`
- `SLOT_CABIN_SET`
- `SLOT_BASE_TOP`
- `SLOT_BASE_PLAQUE`
- `SLOT_EFFECT_LIGHT`

### 5.2 What should be swappable

Face layer:
- sleepy face
- smile face
- wink face
- surprise face

Head accessory:
- cloud hat
- star cap
- bow
- moon halo

Body outfit:
- cream pajamas
- fairground dress
- candy overalls
- night cape

Ferris wheel set:
- classic ring
- candy ring
- pearl ring
- light-bulb ring

Cabin set:
- moon capsules
- candy capsules
- circus capsules
- plush capsules

Base set:
- showroom box
- ticket booth base
- dreamy cloud base
- night fair base

## 6. Correct way to implement variants

Material variants and geometry variants are not the same thing.

Use `KHR_materials_variants` only for:
- colorways
- print variations
- gloss/matte packaging variants

Use separate part groups or separate GLBs for:
- hats
- faces
- props
- cabin shapes
- base structures

That is the important technical split.

## 7. Recommended glb structure

The base product should be one main GLB with slots and stable pivots.
Optional parts should either be:

- separate GLBs per slot, or
- part groups inside one GLB with node visibility switching

Recommended scene structure:

```txt
Scene
  ProductRoot
    Turntable
    FigureBase
      BodyCore
      FaceAnchor
      HeadAccessoryAnchor
      LeftPropAnchor
      RightPropAnchor
    FerrisWheelCore
      RingAnchor
      CabinAnchor_A
      CabinAnchor_B
      CabinAnchor_C
      CabinAnchor_D
      CabinAnchor_E
      CabinAnchor_F
    BaseCore
      BaseTopAnchor
      PlaqueAnchor
      LightAnchor
```

Optional part packs:

```txt
parts/
  faces/
    face-smile.glb
    face-sleepy.glb
    face-wink.glb
  head/
    bow.glb
    cloud-hat.glb
    moon-halo.glb
  body/
    pajamas.glb
    fair-dress.glb
  ring/
    ring-candy.glb
    ring-pearl.glb
  cabins/
    cabins-moon.glb
    cabins-candy.glb
  base/
    base-showcase.glb
    base-cloud.glb
```

## 8. Material rules for realistic collectible feel

If the goal is "looks like a real figurine in daily life", then material rules must be strict:

- `MAT_Face`: matte PVC, no emissive
- `MAT_Eyes`: local glossy print only
- `MAT_Blush`: decal/texture print, not geometry highlight
- `MAT_Body`: satin PVC/ABS
- `MAT_GlossTrim`: small glossy trims only
- `MAT_ClearCandy`: only transparent candy cabins or gem details
- `MAT_MetalGold`: tiny accent parts only
- `MAT_EmitBulb`: only bulbs, ring lights, base strips

Never allow:
- emissive face
- clearcoat-heavy skin
- strong environment reflections on the face
- bloom applied globally to the whole model

## 9. Rendering route

### 9.1 Shelf Mode render route

Use offline rendering:

- Blender Cycles
- neutral studio HDRI
- 3-point lighting
- 50mm product camera
- 72-frame or 120-frame turntable sequence
- face close-up stills
- detail stills for back, base, cabins, transparent parts

Output:

- `hero-turntable.mp4`
- `hero-turntable.webp` or image sequence fallback
- `detail-face.webp`
- `detail-base.webp`
- `detail-back.webp`

### 9.2 Assemble / Inspect route

Use realtime rendering:

- `React`
- `Three.js`
- `React Three Fiber`
- `drei/useGLTF`
- `GLTFLoader`
- `KTX2Loader` for compressed textures if needed

Render rules:

- `NeutralToneMapping`
- exposure around `0.78 - 0.84`
- no bloom in Inspect
- optional selective glow only for bulbs in Assemble
- low-reflection neutral environment
- `key + fill + rim` lights only

## 10. Website information architecture

### 10.1 Main navigation

Top-level tabs:

- `Shelf`
- `Assemble`
- `Inspect`
- `Recipe`

### 10.2 Shelf page

Contains:

- hero turntable render
- product title
- release-style badges
- close-up detail cards
- material notes

### 10.3 Assemble page

Contains:

- center assembled model
- left parts library
- bottom recipe strip
- right live combination summary
- optional exploded toggle

### 10.4 Inspect page

Contains:

- large viewer
- minimal toolbar
- zoom reset
- lighting toggle
- front/back/left/right presets

### 10.5 Recipe page

Contains:

- current chosen modules
- colorway
- screenshot export
- shareable config JSON

## 11. UI behavior for the toy-like assembly effect

The assembly behavior should feel like collecting and snapping parts, not like editing a CAD file.

Rules:

- use big visual part cards, not tiny dropdowns
- every part shows a thumbnail
- selected part animates into place
- inactive parts stay visible in a tray
- hovering a part previews it on the model
- clicking commits the swap

Optional enhancement:

- "blind box mix" button to randomize a valid combination
- "same series" filter to lock combinations to a themed set

## 12. State model

One configuration object should drive the whole product:

```ts
type ProductRecipe = {
  face: "smile" | "sleepy" | "wink" | "surprise";
  headAccessory: "cloud-hat" | "bow" | "moon-halo" | "star-cap";
  body: "pajamas" | "fair-dress" | "candy-overalls" | "night-cape";
  ring: "classic" | "candy" | "pearl" | "bulb";
  cabins: "moon" | "candy" | "circus" | "plush";
  base: "showcase" | "cloud" | "ticket-booth" | "night-fair";
  lightMode: "warm" | "cool" | "blue";
};
```

This object must drive:

- assembled realtime model
- recipe summary
- screenshot export
- sharable URL params
- server-side saved presets if needed later

## 13. What must be rebuilt from the current project

These are the parts that should be replaced, not merely tuned:

- the placeholder figurine geometry approach
- one-mode viewer thinking
- generic control sliders for shape
- global glow-heavy render logic
- current "single finished product" assumption

These parts can stay as the foundation:

- React + Vite shell
- R3F viewer foundation
- GLB-first direction
- asset loading workflow

## 14. Implementation phases

### Phase 1: product rebuild

- redefine the product as Shelf + Assemble + Inspect
- remove placeholder-led design decisions
- design modular slot system

### Phase 2: asset pipeline

- model the base figure
- model swappable modules
- create texture/decal workflow for face
- export final beauty render
- export final interactive GLBs

### Phase 3: website rebuild

- build Shelf page around beauty assets
- build Assemble page around modular GLB system
- build Inspect page around clean viewer
- build Recipe summary and export

### Phase 4: polish

- tune camera and light matching
- compress textures with KTX2 where needed
- optimize load path
- export screenshot and share link

## 15. Success criteria

This project is only successful if all of the following are true:

- face is readable at first glance
- model can be freely inspected in 360
- users can swap modules without breaking composition
- Shelf Mode feels close to a real boxed collectible product shot
- Assemble Mode feels like playing with toy components
- Inspect Mode feels precise, not flashy

## 16. Source references

- POP MART blind box size/material references:
  - https://au.popmart.com/products/pop-mart-pucky-animal-tea-party-series-blind-box-doll-action-figure
  - https://au.popmart.com/products/pop-mart-vivicat-sweet-delicate-series-blind-box-figure
  - https://au.popmart.com/products/pop-mart-molly-anniversary-statues-classical-retro-series-blind-box
- POP MART luminous display box references:
  - https://au.popmart.com/products/pop-mart-tv-set-luminous-display-box-container-the-monsters-catch-me-if-you-like-me
  - https://au.popmart.com/products/pop-mart-tv-set-luminous-display-box-container-dimoo-no-ones-gonna-sleep-tonight
- Three.js docs:
  - https://threejs.org/docs/pages/WebGLRenderer.html
  - https://threejs.org/docs/pages/OrbitControls.html
  - https://threejs.org/docs/pages/GLTFLoader.html
  - https://threejs.org/docs/pages/KTX2Loader.html
- glTF / Blender references:
  - https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
  - https://docs.blender.org/manual/zh-hans/4.0/addons/import_export/scene_gltf2.html
  - https://www.khronos.org/blog/blender-gltf-i-o-support-for-gltf-pbr-material-extensions
- configurator references:
  - https://sketchfab.com/3d-configurators

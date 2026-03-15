Place the final exported GLB asset here:

dream-fair-wheel.glb

The viewer loads:
/models/dream-fair-wheel.glb

Asset contract for the final figurine:

1. Scene origin
- Put the model center at world origin.
- Keep the feet or base sitting on Y=0.
- Face the figure toward +Z.

2. Scale
- Export in meters from Blender.
- Target display height: about 0.22m to 0.28m if this were a real collectible.
- Keep the model inside a roughly 4.5 x 6 x 4.5 local bounds so camera presets stay valid.

3. Recommended node groups
- Turntable
- Figure
- Wheel
- Cabins
- Base

4. Recommended material names
- MAT_Skin
- MAT_Costume
- MAT_GlossTrim
- MAT_ClearCandy
- MAT_MetalGold
- MAT_EmitWarm

5. Modeling rules
- The face must read clearly from the front at normal zoom.
- Do not use emissive on skin or facial features.
- Keep glow only on ring lights, cabin bulbs, or base light strips.
- Give the back of the head, bow, and base real detail so 360 inspection works.

6. Export rules
- Apply transforms before export.
- Use glTF 2.0 binary (.glb).
- Include materials and textures.
- Prefer 2K textures max for this prototype.
- Avoid baked overexposed lighting inside textures.

Until this file exists, the app falls back to the procedural placeholder asset.

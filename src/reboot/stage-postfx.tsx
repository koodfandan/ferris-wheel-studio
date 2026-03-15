import { Bloom, EffectComposer, HueSaturation, Noise, Vignette } from "@react-three/postprocessing";

type PostFxProps = {
  isInteracting: boolean;
};

export function StagePostFx({ isInteracting }: PostFxProps) {
  return (
    <EffectComposer multisampling={isInteracting ? 0 : 4} enableNormalPass={false}>
      <HueSaturation saturation={isInteracting ? 0 : 0.018} />
      <Bloom
        mipmapBlur={!isInteracting}
        luminanceThreshold={0.88}
        intensity={isInteracting ? 0.015 : 0.032}
        radius={isInteracting ? 0.16 : 0.34}
      />
      <Noise premultiply opacity={isInteracting ? 0.003 : 0.005} />
      <Vignette eskil={false} offset={isInteracting ? 0.4 : 0.38} darkness={isInteracting ? 0.12 : 0.18} />
    </EffectComposer>
  );
}

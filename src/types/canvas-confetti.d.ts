declare module "canvas-confetti" {
  type Options = {
    particleCount?: number;
    spread?: number;
    angle?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    scalar?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
  };

  type CreateOptions = {
    resize?: boolean;
    useWorker?: boolean;
  };

  type Fire = ((options?: Options) => Promise<null>) & {
    reset: () => void;
  };

  interface Confetti {
    (options?: Options): Promise<null>;
    create(canvas?: HTMLCanvasElement | null, options?: CreateOptions): Fire;
  }

  const confetti: Confetti;

  export default confetti;
}

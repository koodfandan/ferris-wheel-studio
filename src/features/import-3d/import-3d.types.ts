export type Import3DMode = "single-image";

export type Import3DJobStatus =
  | "queued"
  | "preprocessing"
  | "shape_generating"
  | "texture_generating"
  | "normalizing_glb"
  | "rendering_preview"
  | "ready"
  | "failed";

export type Import3DAsset = {
  assetId: string;
  name: string;
  previewImageUrl: string;
  sourceImageUrl: string;
  modelKind: "mock-proxy" | "glb";
  modelGlbUrl: string | null;
  manifest: Record<string, unknown>;
  metadata: {
    generator: string;
    textureModel: string;
    mode: Import3DMode;
    createdAt: string;
  };
};

export type Import3DJobSnapshot = {
  jobId: string;
  status: Import3DJobStatus;
  progress: number;
  asset: Import3DAsset | null;
  error: string | null;
};

export type Import3DValidationResult =
  | {
      ok: true;
      previewDataUrl: string;
      width: number;
      height: number;
    }
  | {
      ok: false;
      message: string;
    };

export type Import3DContext = {
  file: File | null;
  previewDataUrl: string | null;
  validationError: string | null;
  uploadedFileKey: string | null;
  jobId: string | null;
  job: Import3DJobSnapshot | null;
  result: Import3DAsset | null;
  placedAsset: Import3DAsset | null;
};

export type Import3DEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SELECT_FILE"; file: File; locale: "zh" | "en" }
  | { type: "START" }
  | { type: "RETRY" }
  | { type: "PLACE_ON_STAGE" }
  | { type: "CLEAR_PLACED_ASSET" };

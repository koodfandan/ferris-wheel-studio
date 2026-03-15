import type { Import3DAsset, Import3DJobSnapshot, Import3DJobStatus } from "./import-3d.types";

export type ImportRuntimeProviderStatus = {
  provider: string;
  configured: boolean;
  ready: boolean;
  issues: string[];
  details: Record<string, string | boolean | null>;
};

export type ImportRuntimeProvidersResponse = {
  activeProvider: string;
  providers: ImportRuntimeProviderStatus[];
  config?: {
    generatorProvider: string;
    enableMockPipeline: boolean;
    hunyuanApiServerBaseUrl: string;
    meshyApiKeyConfigured: boolean;
  };
};

export type ImportRuntimeSettings = {
  apiBaseUrl: string;
  generatorProvider: "auto" | "mock" | "meshy-api" | "hunyuan-api-server" | "hunyuan-local";
  meshyApiKey: string;
  hunyuanApiServerBaseUrl: string;
  enableMockPipeline: boolean;
};

const DISABLED_RUNTIME_SETTINGS: ImportRuntimeSettings = {
  apiBaseUrl: "",
  generatorProvider: "auto",
  meshyApiKey: "",
  hunyuanApiServerBaseUrl: "http://127.0.0.1:8080",
  enableMockPipeline: false,
};

export function getImportRuntimeSettings(): ImportRuntimeSettings {
  return DISABLED_RUNTIME_SETTINGS;
}

export async function fetchImportRuntimeProviders(): Promise<ImportRuntimeProvidersResponse | null> {
  return null;
}

export async function saveImportRuntimeSettings(
  patch: Partial<ImportRuntimeSettings>,
): Promise<{ settings: ImportRuntimeSettings; runtime: ImportRuntimeProvidersResponse | null }> {
  return {
    settings: {
      ...DISABLED_RUNTIME_SETTINGS,
      ...patch,
    },
    runtime: null,
  };
}

export async function uploadImportImage(_file: File): Promise<{ fileKey: string }> {
  throw new Error("import_feature_removed");
}

export async function createImportJob(_input: {
  fileName: string;
  fileKey: string;
  previewDataUrl: string;
  mode: "single-image";
}): Promise<{ jobId: string; status: Import3DJobStatus }> {
  throw new Error("import_feature_removed");
}

export async function getImportJob(_jobId: string): Promise<Import3DJobSnapshot> {
  throw new Error("import_feature_removed");
}

export async function getImportAsset(_assetId: string): Promise<Import3DAsset> {
  throw new Error("import_feature_removed");
}

import type { Import3DValidationResult } from "./import-3d.types";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MIN_DIMENSION = 512;

export async function validateImportImage(file: File, locale: "zh" | "en"): Promise<Import3DValidationResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      message:
        locale === "zh"
          ? "仅支持 PNG、JPG 或 WEBP 图片。"
          : "Only PNG, JPG, or WEBP images are supported.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      message:
        locale === "zh"
          ? "图片不能超过 8MB。"
          : "Image size must be under 8MB.",
    };
  }

  const previewDataUrl = await readFileAsDataUrl(file);
  const dimensions = await readImageSize(previewDataUrl);

  if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
    return {
      ok: false,
      message:
        locale === "zh"
          ? "图片分辨率太低，请上传至少 512px 的清晰图片。"
          : "Image resolution is too low. Please upload an image at least 512px wide.",
    };
  }

  return {
    ok: true,
    previewDataUrl,
    width: dimensions.width,
    height: dimensions.height,
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });
}

function readImageSize(src: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("image_decode_failed"));
    image.src = src;
  });
}

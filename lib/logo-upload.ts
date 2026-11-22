const MAX_RAW_FILE_BYTES = 5 * 1024 * 1024;
const MAX_STORED_DATA_URL_LEN = 85_000;

function utf8ToBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function sanitizeSvgMarkup(rawSvg: string): string {
  const cleaned = rawSvg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .trim();

  if (!/<svg[\s>]/i.test(cleaned) || !/<\/svg>/i.test(cleaned)) {
    throw new Error("INVALID_SVG");
  }
  return cleaned;
}

function loadBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("IMAGE_LOAD_FAILED"));
    };
    img.src = objectUrl;
  });
}

function renderScaledDataUrl(
  img: HTMLImageElement,
  maxDim: number,
  mime: "image/webp" | "image/png",
  quality: number,
): string {
  const naturalW = img.naturalWidth || 256;
  const naturalH = img.naturalHeight || 256;
  const scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
  const width = Math.max(1, Math.round(naturalW * scale));
  const height = Math.max(1, Math.round(naturalH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("CANVAS_UNAVAILABLE");
  }
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL(mime, quality);
}

export async function prepareLogoDataUrl(file: File): Promise<{
  dataUrl: string;
  chars: number;
}> {
  if (file.size > MAX_RAW_FILE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const isSvg =
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");

  if (isSvg) {
    const sanitized = sanitizeSvgMarkup(await file.text());
    const dataUrl = `data:image/svg+xml;base64,${utf8ToBase64(sanitized)}`;
    if (dataUrl.length > MAX_STORED_DATA_URL_LEN) {
      throw new Error("LOGO_DATA_TOO_LARGE");
    }
    return { dataUrl, chars: dataUrl.length };
  }

  const allowedRaster = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (file.type && !allowedRaster.includes(file.type)) {
    throw new Error("UNSUPPORTED_FILE_TYPE");
  }

  const img = await loadBitmap(file);
  const attempts: Array<{ maxDim: number; mime: "image/webp" | "image/png"; q: number }> = [
    { maxDim: 256, mime: "image/webp", q: 0.92 },
    { maxDim: 224, mime: "image/webp", q: 0.85 },
    { maxDim: 192, mime: "image/webp", q: 0.78 },
    { maxDim: 160, mime: "image/png", q: 0.9 },
    { maxDim: 128, mime: "image/png", q: 0.9 },
    { maxDim: 96, mime: "image/png", q: 0.85 },
  ];

  for (const attempt of attempts) {
    const candidate = renderScaledDataUrl(img, attempt.maxDim, attempt.mime, attempt.q);
    if (candidate.startsWith("data:image/") && candidate.length <= MAX_STORED_DATA_URL_LEN) {
      return { dataUrl: candidate, chars: candidate.length };
    }
  }

  throw new Error("LOGO_DATA_TOO_LARGE");
}

const MAX_PORTRAIT_DATA_URL_LEN = 90_000;

export async function preparePortraitDataUrl(file: File): Promise<{
  dataUrl: string;
  chars: number;
}> {
  if (file.size > MAX_RAW_FILE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const isSvg =
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");

  if (isSvg) {
    const sanitized = sanitizeSvgMarkup(await file.text());
    const dataUrl = `data:image/svg+xml;base64,${utf8ToBase64(sanitized)}`;
    if (dataUrl.length > MAX_PORTRAIT_DATA_URL_LEN) {
      throw new Error("LOGO_DATA_TOO_LARGE");
    }
    return { dataUrl, chars: dataUrl.length };
  }

  const allowedRaster = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (file.type && !allowedRaster.includes(file.type)) {
    throw new Error("UNSUPPORTED_FILE_TYPE");
  }

  const img = await loadBitmap(file);
  const attempts: Array<{ maxDim: number; mime: "image/webp" | "image/png"; q: number }> = [
    { maxDim: 512, mime: "image/webp", q: 0.88 },
    { maxDim: 448, mime: "image/webp", q: 0.82 },
    { maxDim: 384, mime: "image/webp", q: 0.76 },
    { maxDim: 320, mime: "image/webp", q: 0.7 },
    { maxDim: 256, mime: "image/png", q: 0.9 },
  ];

  for (const attempt of attempts) {
    const candidate = renderScaledDataUrl(img, attempt.maxDim, attempt.mime, attempt.q);
    if (candidate.startsWith("data:image/") && candidate.length <= MAX_PORTRAIT_DATA_URL_LEN) {
      return { dataUrl: candidate, chars: candidate.length };
    }
  }

  throw new Error("LOGO_DATA_TOO_LARGE");
}

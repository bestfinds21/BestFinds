/**
 * Resize and compress an image file to fit within maxDim x maxDim,
 * returning a JPEG data URL at the given quality.
 * Keeps aspect ratio. Never upscales.
 */
export function resizeImage(
  file: File,
  maxDim = 1400,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const { naturalWidth: w, naturalHeight: h } = img;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        const tw = Math.round(w * scale);
        const th = Math.round(h * scale);

        const canvas = document.createElement("canvas");
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, tw, th);

        // Prefer JPEG for photos (smaller), keep PNG only for transparency
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(outputType, quality));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

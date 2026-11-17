export const PHOTO_SIZE = 720;

const SHADOW: [number, number, number] = [26, 20, 14];
const LIGHT: [number, number, number] = [241, 228, 195];
const CONTRAST = 1.45;

export function duotone(r: number, g: number, b: number): [number, number, number] {
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const contrasted = Math.min(Math.max((luma - 0.5) * CONTRAST + 0.5, 0), 1);
  return [
    Math.round(SHADOW[0] + (LIGHT[0] - SHADOW[0]) * contrasted),
    Math.round(SHADOW[1] + (LIGHT[1] - SHADOW[1]) * contrasted),
    Math.round(SHADOW[2] + (LIGHT[2] - SHADOW[2]) * contrasted),
  ];
}

export function coverCrop(width: number, height: number): { sx: number; sy: number; size: number } {
  const size = Math.min(width, height);
  return { sx: (width - size) / 2, sy: Math.max((height - size) / 3, 0), size };
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) return createImageBitmap(file, { imageOrientation: 'from-image' });
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  await image.decode();
  URL.revokeObjectURL(url);
  return image;
}

export async function processPhoto(file: File): Promise<HTMLCanvasElement> {
  const source = await decode(file);
  const canvas = document.createElement('canvas');
  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;
  const { sx, sy, size } = coverCrop(source.width, source.height);
  ctx.drawImage(source, sx, sy, size, size, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
  const pixels = ctx.getImageData(0, 0, PHOTO_SIZE, PHOTO_SIZE);
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 22;
    const [r, g, b] = duotone(data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0);
    data[i] = r + grain;
    data[i + 1] = g + grain;
    data[i + 2] = b + grain;
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas;
}

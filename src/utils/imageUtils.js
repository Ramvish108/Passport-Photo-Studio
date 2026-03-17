import { PASSPORT } from '../constants';

/**
 * Get cropped image as a base64 data URL from a canvas crop area.
 * Uses react-easy-crop's pixel values.
 */
export async function getCroppedImg(imageSrc, pixelCrop, bgColor = '#ffffff') {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Output at passport pixel dimensions (300 DPI)
  canvas.width = PASSPORT.WIDTH_PX;
  canvas.height = PASSPORT.HEIGHT_PX;

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the cropped region scaled to passport size
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    canvas.width, canvas.height
  );

  return canvas.toDataURL('image/jpeg', 0.96);
}

export function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (e) => reject(e));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}

/**
 * Apply CSS filter string to an image and return new data URL.
 */
export async function applyFilter(imageSrc, filterString) {
  if (!filterString) return imageSrc;
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.filter = filterString;
  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.96);
}

/**
 * Build filter string from manual sliders.
 */
export function buildFilterString(brightness, contrast, saturation) {
  return `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100})`;
}

/**
 * Compute the CSS filter for the final photo tile.
 */
export function computeFilter(preset, brightness, contrast, saturation, presets) {
  if (preset !== 'none') {
    const p = presets.find(p => p.value === preset);
    return p ? p.filter : '';
  }
  return buildFilterString(brightness, contrast, saturation);
}

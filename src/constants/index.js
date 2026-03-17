export const PASSPORT = {
  WIDTH_MM: 35,
  HEIGHT_MM: 45,
  ASPECT_RATIO: 35 / 45,
  PX_PER_MM_300DPI: 300 / 25.4,
  get WIDTH_PX() { return Math.round(this.WIDTH_MM * this.PX_PER_MM_300DPI); },
  get HEIGHT_PX() { return Math.round(this.HEIGHT_MM * this.PX_PER_MM_300DPI); },
};

export const A4 = {
  WIDTH_MM: 210,
  HEIGHT_MM: 297,
  get WIDTH_PX() { return Math.round(this.WIDTH_MM * (300 / 25.4)); },
  get HEIGHT_PX() { return Math.round(this.HEIGHT_MM * (300 / 25.4)); },
};

export const LAYOUT = {
  MARGIN_MM: 8,
  GAP_MM: 4,
  COLS: 5,
  get PHOTOS_PER_SHEET() { return this.COLS * 4; },
};

export const PHOTO_COUNT_OPTIONS = [5, 10, 15, 20];

export const BORDER_STYLES = [
  { label: 'None',   value: 'none',   color: 'transparent', width: 0 },
  { label: 'Thin',   value: 'thin',   color: '#1a1410',     width: 1 },
  { label: 'Medium', value: 'medium', color: '#1a1410',     width: 2 },
  { label: 'Thick',  value: 'thick',  color: '#1a1410',     width: 3 },
  { label: 'White',  value: 'white',  color: '#ffffff',     width: 2 },
];

export const BG_OPTIONS = [
  { label: 'White',      value: '#ffffff' },
  { label: 'Off-white',  value: '#f5f0e8' },
  { label: 'Light blue', value: '#dce8f5' },
  { label: 'Light grey', value: '#e8e8e8' },
];

export const ENHANCE_PRESETS = [
  { label: 'None',  value: 'none',  filter: '' },
  { label: 'Auto',  value: 'auto',  filter: 'brightness(1.05) contrast(1.08) saturate(1.05)' },
  { label: 'Vivid', value: 'vivid', filter: 'brightness(1.1) contrast(1.15) saturate(1.2)' },
  { label: 'Soft',  value: 'soft',  filter: 'brightness(1.08) contrast(0.95) saturate(0.9)' },
  { label: 'Sharp', value: 'sharp', filter: 'contrast(1.2) saturate(1.1)' },
];
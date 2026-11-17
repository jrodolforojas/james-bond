import type { StopId } from '../../stops/catalog';

export const MAP_VIEWBOX = { width: 342, top: 24, height: 248 };

export const PINS: Record<StopId, { x: number; y: number; labelX: number; labelY: number }> = {
  london: { x: 263, y: 74, labelX: 272, labelY: 78 },
  montenegro: { x: 313, y: 123, labelX: 250, labelY: 142 },
  fortknox: { x: 37, y: 148, labelX: 16, labelY: 176 },
  scotland: { x: 251, y: 44, labelX: 192, labelY: 40 },
  jamaica: { x: 60, y: 256, labelX: 72, labelY: 260 },
};

export const ROUTE_CURVES: Record<StopId, { cx: number; cy: number } | null> = {
  london: null,
  montenegro: { cx: 300, cy: 90 },
  fortknox: { cx: 180, cy: 70 },
  scotland: { cx: 140, cy: 30 },
  jamaica: { cx: 160, cy: 200 },
};

export const LANDMASSES = [
  'M0 40 Q40 20 90 50 Q110 90 80 130 Q60 170 40 210 L0 220 Z',
  'M30 230 Q60 220 90 250 L70 300 L20 300 Z',
  'M240 20 Q270 10 300 30 L342 30 L342 160 Q320 150 300 130 Q280 120 262 112 Q250 90 246 70 Q238 50 240 20 Z',
  'M300 170 Q330 160 342 180 L342 300 L290 300 Q280 240 300 170 Z',
];

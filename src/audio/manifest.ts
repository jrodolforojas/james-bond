import type { CueName } from './synth';

// Cues listed here play a CC0 file from public/audio/ instead of their synthesized fallback.
// Sources and licenses for every file are recorded in art/audio/CREDITS.md.
export const CUE_FILES: Partial<Record<CueName, string>> = {};

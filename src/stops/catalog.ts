export const STOP_ORDER = ['london', 'montenegro', 'fortknox', 'scotland', 'jamaica'] as const;
export type StopId = (typeof STOP_ORDER)[number];

export const PLAYABLE_STOPS: ReadonlySet<StopId> = new Set<StopId>(['london', 'fortknox']);

export const EVIDENCE_NUMBER: Partial<Record<StopId, number>> = {
  montenegro: 1,
  fortknox: 2,
  scotland: 3,
  jamaica: 4,
};

export const EVIDENCE_TOTAL = Object.keys(EVIDENCE_NUMBER).length;

export const STOP_COLORS: Record<StopId, { background: string; foreground: string }> = {
  london: { background: 'var(--london-blue)', foreground: 'var(--bone)' },
  montenegro: { background: 'var(--montenegro-felt)', foreground: 'var(--bone)' },
  fortknox: { background: 'var(--fortknox-gold)', foreground: 'var(--ink)' },
  scotland: { background: 'var(--scotland-night)', foreground: 'var(--bone)' },
  jamaica: { background: 'var(--jamaica-turquoise)', foreground: 'var(--ink)' },
};

export function nextStop(completed: readonly StopId[]): StopId | undefined {
  return STOP_ORDER.find((stop) => PLAYABLE_STOPS.has(stop) && !completed.includes(stop));
}

export function stopNumber(stop: StopId): number {
  return STOP_ORDER.indexOf(stop) + 1;
}

export function evidenceCount(completed: readonly StopId[]): number {
  return completed.filter((stop) => EVIDENCE_NUMBER[stop] !== undefined).length;
}

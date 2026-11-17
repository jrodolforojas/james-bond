export const RANKS = ['analyst', 'fieldAgent', 'doubleO'] as const;
export type Rank = (typeof RANKS)[number];

const DOUBLE_O_MAX_MS = 6 * 60_000;
const FIELD_AGENT_MAX_MS = 9 * 60_000;

export function missionDurationMs(startedAt: number | null, finishedAt: number | null): number {
  if (startedAt === null || finishedAt === null) return 0;
  return Math.max(finishedAt - startedAt, 0);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function rankByTime(durationMs: number): number {
  if (durationMs <= DOUBLE_O_MAX_MS) return RANKS.indexOf('doubleO');
  if (durationMs <= FIELD_AGENT_MAX_MS) return RANKS.indexOf('fieldAgent');
  return RANKS.indexOf('analyst');
}

export function rankFor(durationMs: number, usedEjectorSeat: boolean): Rank {
  const level = rankByTime(durationMs) - (usedEjectorSeat ? 1 : 0);
  return RANKS[Math.max(level, 0)] ?? 'analyst';
}

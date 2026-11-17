export const WIRES = ['red', 'blue', 'yellow', 'green', 'white'] as const;
export type Wire = (typeof WIRES)[number];

export const CORRECT_WIRE: Wire = 'green';
export const START_MS = 30_000;
export const WRONG_CUT_PENALTY_MS = 5_000;
export const START_LIVES = 3;
export const HAT_THROWS_AT_MS = [22_000, 12_000] as const;
export const FREEZE_AT_MS = 7_000;
export const CLUE_COUNT = 3;

export type BombStatus = 'running' | 'defused' | 'exploded';

export interface BombState {
  remainingMs: number;
  lives: number;
  cut: Wire[];
  hatsThrown: number;
  status: BombStatus;
}

export function createBomb(bonusMs = 0, previouslyCut: readonly Wire[] = []): BombState {
  return {
    remainingMs: START_MS + bonusMs,
    lives: START_LIVES,
    cut: previouslyCut.filter((wire) => wire !== CORRECT_WIRE),
    hatsThrown: 0,
    status: 'running',
  };
}

function withTime(state: BombState, remainingMs: number): BombState {
  if (remainingMs > 0) return { ...state, remainingMs };
  return { ...state, remainingMs: 0, status: 'exploded' };
}

export function tick(state: BombState, elapsedMs: number): BombState {
  if (state.status !== 'running') return state;
  return withTime(state, state.remainingMs - elapsedMs);
}

export function cutWire(state: BombState, wire: Wire, free = false): BombState {
  if (state.status !== 'running') return state;
  if (state.cut.includes(wire)) return state;
  const cut = [...state.cut, wire];
  if (wire === CORRECT_WIRE) return { ...state, cut, status: 'defused' };
  if (free) return { ...state, cut };
  return withTime({ ...state, cut }, state.remainingMs - WRONG_CUT_PENALTY_MS);
}

export function isHatDue(state: BombState): boolean {
  if (state.status !== 'running') return false;
  const threshold = HAT_THROWS_AT_MS[state.hatsThrown];
  if (threshold === undefined) return false;
  return state.remainingMs <= threshold;
}

export function throwHat(state: BombState): BombState {
  return { ...state, hatsThrown: state.hatsThrown + 1 };
}

export function hitByHat(state: BombState): BombState {
  if (state.status !== 'running') return state;
  const lives = state.lives - 1;
  if (lives > 0) return { ...state, lives };
  return { ...state, lives: 0, status: 'exploded' };
}

export function frozenClockMs(state: BombState): number {
  return Math.min(state.remainingMs, FREEZE_AT_MS);
}

export function isLateDefuse(frozenMs: number): boolean {
  return Math.ceil(frozenMs / 1000) < FREEZE_AT_MS / 1000;
}

export function activeClue(state: BombState): number {
  const wrongCuts = state.cut.filter((wire) => wire !== CORRECT_WIRE).length;
  return Math.min(wrongCuts, CLUE_COUNT - 1);
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(ms, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function shuffleWires(random: () => number = Math.random): Wire[] {
  const order = [...WIRES];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j] as Wire, order[i] as Wire];
  }
  return order;
}

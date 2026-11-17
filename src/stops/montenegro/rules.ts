export const GESTURES = ['eye', 'chips', 'drum', 'tie', 'drink'] as const;
export type Gesture = (typeof GESTURES)[number];

export const SEAT_COUNT = 5;
export const LE_CHIFFRE_SEAT = 2;
export const CARRIER_GESTURE: Gesture = 'drum';
export const ROUNDS = 3;
export const ROUND_SECONDS = 5;
export const START_CHIPS = 3;

const GLINT_WINDOW: readonly [number, number] = [1.6, 3.4];
const CARRIER_DELAY_S = 0.35;
const QUIET_AROUND_GLINT_S = 0.8;
const DECOY_WINDOW: readonly [number, number] = [0.4, 4.4];

export type Random = () => number;

export interface Seat {
  index: number;
  gesture: Gesture;
}

export interface Table {
  seats: Seat[];
  carrier: number;
}

export type RoundEvent = { at: number; kind: 'glint' } | { at: number; kind: 'gesture'; seat: number };

export type Verdict = 'correct' | 'trap' | 'wrong';

function shuffle<T>(items: readonly T[], random: Random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

function between([min, max]: readonly [number, number], random: Random): number {
  return min + random() * (max - min);
}

export function createTable(random: Random = Math.random): Table {
  const others = [0, 1, 3, 4];
  const carrier = others[Math.floor(random() * others.length)] ?? 0;
  const decoyGestures = shuffle<Gesture>(['chips', 'tie', 'drink'], random);
  const seats = Array.from({ length: SEAT_COUNT }, (_, index): Seat => {
    if (index === LE_CHIFFRE_SEAT) return { index, gesture: 'eye' };
    if (index === carrier) return { index, gesture: CARRIER_GESTURE };
    return { index, gesture: decoyGestures.shift() ?? 'chips' };
  });
  return { seats, carrier };
}

function decoyTime(glint: number, random: Random): number {
  for (let attempt = 0; attempt < 20; attempt++) {
    const at = between(DECOY_WINDOW, random);
    if (Math.abs(at - glint) > QUIET_AROUND_GLINT_S) return at;
  }
  return glint > ROUND_SECONDS / 2 ? DECOY_WINDOW[0] : DECOY_WINDOW[1];
}

export function scheduleRound(table: Table, random: Random = Math.random): RoundEvent[] {
  const glint = between(GLINT_WINDOW, random);
  const events: RoundEvent[] = [
    { at: glint, kind: 'glint' },
    { at: glint + CARRIER_DELAY_S, kind: 'gesture', seat: table.carrier },
  ];
  table.seats
    .filter((seat) => seat.index !== table.carrier)
    .forEach((seat) => {
      events.push({ at: decoyTime(glint, random), kind: 'gesture', seat: seat.index });
    });
  events.push({ at: decoyTime(glint, random), kind: 'gesture', seat: LE_CHIFFRE_SEAT });
  return events.sort((a, b) => a.at - b.at);
}

export function judge(table: Table, seat: number): Verdict {
  if (seat === table.carrier) return 'correct';
  if (seat === LE_CHIFFRE_SEAT) return 'trap';
  return 'wrong';
}

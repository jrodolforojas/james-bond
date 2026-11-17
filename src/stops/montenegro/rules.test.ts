import { describe, expect, it } from 'vitest';
import {
  CARRIER_GESTURE,
  createTable,
  judge,
  LE_CHIFFRE_SEAT,
  type Random,
  ROUND_SECONDS,
  SEAT_COUNT,
  scheduleRound,
} from './rules';

function seeded(seed: number): Random {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const SEEDS = Array.from({ length: 40 }, (_, i) => i + 1);

describe('Montenegro table', () => {
  it.each(SEEDS)('seed %i: Le Chiffre touches his eye and never carries the case', (seed) => {
    const table = createTable(seeded(seed));
    expect(table.seats).toHaveLength(SEAT_COUNT);
    expect(table.seats[LE_CHIFFRE_SEAT]?.gesture).toBe('eye');
    expect(table.carrier).not.toBe(LE_CHIFFRE_SEAT);
  });

  it.each(SEEDS)('seed %i: every seat has a different gesture and the carrier drums', (seed) => {
    const table = createTable(seeded(seed));
    const gestures = table.seats.map((seat) => seat.gesture);
    expect(new Set(gestures).size).toBe(SEAT_COUNT);
    expect(table.seats[table.carrier]?.gesture).toBe(CARRIER_GESTURE);
  });
});

describe('Montenegro round schedule', () => {
  it.each(SEEDS)('seed %i: only the carrier reacts right after the case glints', (seed) => {
    const random = seeded(seed);
    const table = createTable(random);
    const events = scheduleRound(table, random);
    const glint = events.find((event) => event.kind === 'glint');
    expect(glint).toBeDefined();
    const reactions = events.filter(
      (event) => event.kind === 'gesture' && event.at > (glint?.at ?? 0) && event.at - (glint?.at ?? 0) < 0.8,
    );
    expect(reactions).toEqual([expect.objectContaining({ seat: table.carrier })]);
  });

  it.each(SEEDS)('seed %i: every seat gestures and Le Chiffre twice, inside the round', (seed) => {
    const random = seeded(seed);
    const table = createTable(random);
    const gestures = scheduleRound(table, random).filter((event) => event.kind === 'gesture');
    expect(gestures).toHaveLength(SEAT_COUNT + 1);
    expect(
      gestures.filter((event) => event.kind === 'gesture' && event.seat === LE_CHIFFRE_SEAT),
    ).toHaveLength(2);
    gestures.forEach((event) => {
      expect(event.at).toBeGreaterThan(0);
      expect(event.at).toBeLessThan(ROUND_SECONDS);
    });
  });
});

describe('Montenegro verdict', () => {
  const table = createTable(seeded(7));

  it('rewards pointing at the carrier', () => {
    expect(judge(table, table.carrier)).toBe('correct');
  });

  it('flags Le Chiffre as the trap', () => {
    expect(judge(table, LE_CHIFFRE_SEAT)).toBe('trap');
  });

  it('marks any other player as wrong', () => {
    const other = [0, 1, 3, 4].find((seat) => seat !== table.carrier) ?? 0;
    expect(judge(table, other)).toBe('wrong');
  });
});

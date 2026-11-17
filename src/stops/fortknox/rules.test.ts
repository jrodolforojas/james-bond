import { describe, expect, it } from 'vitest';
import {
  activeClue,
  createBomb,
  cutWire,
  FREEZE_AT_MS,
  formatClock,
  frozenClockMs,
  hitByHat,
  isHatDue,
  isLateDefuse,
  START_LIVES,
  START_MS,
  shuffleWires,
  throwHat,
  tick,
  WIRES,
} from './rules';

describe('bomb rules', () => {
  it('starts with 30 seconds and 3 lives', () => {
    const bomb = createBomb();
    expect(bomb.remainingMs).toBe(START_MS);
    expect(bomb.lives).toBe(START_LIVES);
    expect(bomb.status).toBe('running');
  });

  it('gives Dalton 10 extra seconds', () => {
    expect(createBomb(10_000).remainingMs).toBe(40_000);
  });

  it('keeps wrong cuts from a failed attempt so the used clues stay crossed out', () => {
    const retry = createBomb(0, ['red', 'blue']);
    expect(retry.cut).toEqual(['red', 'blue']);
    expect(activeClue(retry)).toBe(2);
    expect(retry.remainingMs).toBe(START_MS);
  });

  it('explodes when time runs out', () => {
    expect(tick(createBomb(), START_MS).status).toBe('exploded');
  });

  it('defuses on the green wire', () => {
    expect(cutWire(createBomb(), 'green').status).toBe('defused');
  });

  it('subtracts 5 seconds for a wrong wire', () => {
    const bomb = cutWire(createBomb(), 'red');
    expect(bomb.remainingMs).toBe(25_000);
    expect(bomb.status).toBe('running');
  });

  it('explodes if a wrong cut drains the clock', () => {
    const almostOut = tick(createBomb(), 26_000);
    expect(cutWire(almostOut, 'red').status).toBe('exploded');
  });

  it('ignores cutting the same wire twice', () => {
    const once = cutWire(createBomb(), 'red');
    expect(cutWire(once, 'red')).toBe(once);
  });

  it('ignores input once the bomb is no longer running', () => {
    const defused = cutWire(createBomb(), 'green');
    expect(tick(defused, 5_000)).toBe(defused);
    expect(hitByHat(defused)).toBe(defused);
  });

  it('throws the hat at 0:22 and 0:12', () => {
    const at22 = tick(createBomb(), 8_000);
    expect(isHatDue(at22)).toBe(true);
    const thrownOnce = throwHat(at22);
    expect(isHatDue(thrownOnce)).toBe(false);
    const at12 = tick(thrownOnce, 10_000);
    expect(isHatDue(at12)).toBe(true);
    expect(isHatDue(throwHat(at12))).toBe(false);
  });

  it('explodes after losing the third life', () => {
    const bomb = hitByHat(hitByHat(hitByHat(createBomb())));
    expect(bomb.lives).toBe(0);
    expect(bomb.status).toBe('exploded');
  });

  it('freezes the clock at 0:07 when there is time to spare', () => {
    const defused = cutWire(createBomb(), 'green');
    expect(frozenClockMs(defused)).toBe(FREEZE_AT_MS);
  });

  it('freezes where it is when under 7 seconds', () => {
    const late = cutWire(tick(createBomb(), 26_000), 'green');
    expect(frozenClockMs(late)).toBe(4_000);
  });

  it('only counts as late when the clock reads under 0:07', () => {
    expect(isLateDefuse(7_000)).toBe(false);
    expect(isLateDefuse(6_500)).toBe(false);
    expect(isLateDefuse(6_000)).toBe(true);
  });

  it('advances the active clue on each wrong cut, capped at the last one', () => {
    const bomb = createBomb();
    expect(activeClue(bomb)).toBe(0);
    expect(activeClue(cutWire(bomb, 'red'))).toBe(1);
    expect(activeClue(cutWire(cutWire(cutWire(bomb, 'red'), 'blue'), 'white'))).toBe(2);
  });

  it('formats the clock rounding seconds up', () => {
    expect(formatClock(30_000)).toBe('0:30');
    expect(formatClock(6_100)).toBe('0:07');
    expect(formatClock(0)).toBe('0:00');
  });

  it('shuffles the wires into a full permutation', () => {
    let seed = 3;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const order = shuffleWires(random);
    expect([...order].sort()).toEqual([...WIRES].sort());
    expect(order).not.toEqual([...WIRES]);
  });
});

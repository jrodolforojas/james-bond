import { describe, expect, it } from 'vitest';
import { formatDuration, missionDurationMs, rankFor } from './rank';

const MINUTE = 60_000;

describe('mission rank', () => {
  it('measures the mission from acceptance to the final screen', () => {
    expect(missionDurationMs(1_000, 61_000)).toBe(60_000);
    expect(missionDurationMs(null, 61_000)).toBe(0);
  });

  it('formats the duration as mm:ss', () => {
    expect(formatDuration(372_000)).toBe('06:12');
    expect(formatDuration(0)).toBe('00:00');
  });

  it('gives Double-O to missions within six minutes', () => {
    expect(rankFor(5 * MINUTE, false)).toBe('doubleO');
  });

  it('gives Field agent up to nine minutes', () => {
    expect(rankFor(8 * MINUTE, false)).toBe('fieldAgent');
  });

  it('gives Analyst beyond nine minutes', () => {
    expect(rankFor(12 * MINUTE, false)).toBe('analyst');
  });

  it('drops one rank for using the ejector seat, never below Analyst', () => {
    expect(rankFor(5 * MINUTE, true)).toBe('fieldAgent');
    expect(rankFor(12 * MINUTE, true)).toBe('analyst');
  });
});

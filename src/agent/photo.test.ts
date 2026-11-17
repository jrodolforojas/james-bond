import { describe, expect, it } from 'vitest';
import { coverCrop, duotone } from './photo';

describe('agent photo', () => {
  it('maps black to the dark ink and white to the paper tone', () => {
    expect(duotone(0, 0, 0)).toEqual([26, 20, 14]);
    expect(duotone(255, 255, 255)).toEqual([241, 228, 195]);
  });

  it('keeps mid grey in the middle of the duotone', () => {
    const [r] = duotone(128, 128, 128);
    expect(r).toBeGreaterThan(120);
    expect(r).toBeLessThan(140);
  });

  it('crops a centered square, biased up for portraits', () => {
    expect(coverCrop(1000, 500)).toEqual({ sx: 250, sy: 0, size: 500 });
    expect(coverCrop(600, 900)).toEqual({ sx: 0, sy: 100, size: 600 });
  });
});

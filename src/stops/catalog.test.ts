import { describe, expect, it } from 'vitest';
import { evidenceCount, nextStop, stopNumber } from './catalog';

describe('stop catalog', () => {
  it('starts with the first playable stop', () => {
    expect(nextStop([])).toBe('london');
    expect(nextStop(['london'])).toBe('montenegro');
    expect(nextStop(['london', 'montenegro'])).toBe('fortknox');
  });

  it('has no next stop once every playable stop is completed', () => {
    expect(nextStop(['london', 'montenegro', 'fortknox'])).toBeUndefined();
  });

  it('numbers stops in mission order', () => {
    expect(stopNumber('london')).toBe(1);
    expect(stopNumber('fortknox')).toBe(3);
  });

  it('counts only stops that hold evidence', () => {
    expect(evidenceCount(['london', 'fortknox'])).toBe(1);
  });
});

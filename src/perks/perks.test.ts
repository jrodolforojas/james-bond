import { describe, expect, it } from 'vitest';
import { BASE_PERKS, perksFor } from './perks';

describe('perks', () => {
  it('gives nothing extra without an era or gadget', () => {
    expect(perksFor(null, null)).toEqual(BASE_PERKS);
  });

  it('Connery gets the ejector seat and the DB5 support', () => {
    const perks = perksFor('connery', null);
    expect(perks.ejectorSeat).toBe(true);
    expect(perks.db5Support).toBe(true);
  });

  it('Moore can afford one more mistake with Dr. No', () => {
    expect(perksFor('moore', null).triviaMaxWrong).toBe(3);
  });

  it('Dalton gets 10 extra seconds on the bomb', () => {
    expect(perksFor('dalton', null).bombBonusMs).toBe(10_000);
  });

  it('Craig gets one more health point in the shootout', () => {
    expect(perksFor('craig', null).shootoutLives).toBe(6);
  });

  it('the laser watch gives one free cut', () => {
    expect(perksFor(null, 'laser').laserCuts).toBe(1);
  });

  it('the palm-print pistol widens the aim', () => {
    expect(perksFor(null, 'palm').shootoutHitRadius).toBeGreaterThan(BASE_PERKS.shootoutHitRadius);
  });

  it('Brosnan and the tracker radio stack their trivia hints', () => {
    expect(perksFor('brosnan', null).triviaHints).toBe(1);
    expect(perksFor(null, 'tracker').triviaHints).toBe(1);
    expect(perksFor('brosnan', 'tracker').triviaHints).toBe(2);
  });
});

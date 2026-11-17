import { describe, expect, it } from 'vitest';
import { CARDS, type UnlockInputs, unlockedIds, unreadCount } from './cards';

const fresh: UnlockInputs = { era: null, completed: [], step: { screen: 'arrival' }, finishedAt: null };

describe('dossier cards', () => {
  it('has seven cards in mission order', () => {
    expect(CARDS.map((card) => card.id)).toEqual([
      'eras',
      'who',
      'firstBook',
      'villains',
      'origin',
      'birthplace',
      'agent',
    ]);
  });

  it('starts with every card locked', () => {
    expect(unlockedIds(fresh)).toEqual([]);
  });

  it('unlocks the eras card once a vehicle is assigned', () => {
    expect(unlockedIds({ ...fresh, era: 'craig' })).toEqual(['eras']);
  });

  it('unlocks each stop card when its stop is completed', () => {
    expect(unlockedIds({ ...fresh, era: 'craig', completed: ['fortknox'] })).toEqual(['eras', 'villains']);
  });

  it('unlocks the agent card on the final screen', () => {
    expect(unlockedIds({ ...fresh, step: { screen: 'final' } })).toEqual(['agent']);
  });

  it('counts unlocked cards that have not been read', () => {
    const mission = { ...fresh, era: 'craig' as const, completed: ['fortknox' as const] };
    expect(unreadCount(mission, [])).toBe(2);
    expect(unreadCount(mission, ['eras'])).toBe(1);
  });

  it('unlocks every card in demo mode', () => {
    expect(unlockedIds(fresh, true)).toHaveLength(CARDS.length);
  });
});

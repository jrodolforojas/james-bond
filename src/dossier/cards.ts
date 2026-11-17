import { DEMO } from '../config';
import type { EraId, Step } from '../state/store';
import type { StopId } from '../stops/catalog';

export type CardSource = { kind: 'recruitment' } | { kind: 'stop'; stop: StopId } | { kind: 'final' };

export interface DossierCard {
  id: CardId;
  source: CardSource;
  color: string;
}

export const CARD_IDS = ['eras', 'who', 'firstBook', 'villains', 'origin', 'birthplace', 'agent'] as const;
export type CardId = (typeof CARD_IDS)[number];

export const CARDS: readonly DossierCard[] = [
  { id: 'eras', source: { kind: 'recruitment' }, color: 'var(--manila-dark)' },
  { id: 'who', source: { kind: 'stop', stop: 'london' }, color: 'var(--london-blue)' },
  { id: 'firstBook', source: { kind: 'stop', stop: 'montenegro' }, color: 'var(--montenegro-felt)' },
  { id: 'villains', source: { kind: 'stop', stop: 'fortknox' }, color: 'var(--fortknox-gold)' },
  { id: 'origin', source: { kind: 'stop', stop: 'scotland' }, color: 'var(--scotland-night)' },
  { id: 'birthplace', source: { kind: 'stop', stop: 'jamaica' }, color: 'var(--jamaica-turquoise)' },
  { id: 'agent', source: { kind: 'final' }, color: '#000' },
];

export interface UnlockInputs {
  era: EraId | null;
  completed: readonly StopId[];
  step: Step;
  finishedAt: number | null;
}

export function isUnlocked(card: DossierCard, mission: UnlockInputs, demo = DEMO): boolean {
  if (demo) return true;
  if (card.source.kind === 'recruitment') return mission.era !== null;
  if (card.source.kind === 'stop') return mission.completed.includes(card.source.stop);
  return mission.finishedAt !== null || mission.step.screen === 'final';
}

export function unlockedIds(mission: UnlockInputs, demo = DEMO): CardId[] {
  return CARDS.filter((card) => isUnlocked(card, mission, demo)).map((card) => card.id);
}

export function unreadCount(mission: UnlockInputs, seen: readonly CardId[]): number {
  return unlockedIds(mission).filter((id) => !seen.includes(id)).length;
}

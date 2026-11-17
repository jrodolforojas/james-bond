import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { trackEvent } from '../analytics/track';
import { DEMO } from '../config';
import type { CardId } from '../dossier/cards';
import { missionDurationMs, rankFor } from '../share/rank';
import type { StopId } from '../stops/catalog';

export const ERAS = ['connery', 'moore', 'dalton', 'brosnan', 'craig'] as const;
export type EraId = (typeof ERAS)[number];

export const GADGETS = ['laser', 'tracker', 'palm'] as const;
export type GadgetId = (typeof GADGETS)[number];

export type Step =
  | { screen: 'arrival' }
  | { screen: 'recruitment' }
  | { screen: 'map' }
  | { screen: 'stop'; stop: StopId }
  | { screen: 'final' };

interface MissionState {
  step: Step;
  visit: number;
  era: EraId | null;
  gadget: GadgetId | null;
  completed: StopId[];
  startedAt: number | null;
  finishedAt: number | null;
  seenCards: CardId[];
  ejectorUsed: boolean;
  soundOn: boolean;
  setStep: (step: Step) => void;
  markCardSeen: (card: CardId) => void;
  acceptMission: () => void;
  chooseEra: (era: EraId) => void;
  chooseGadget: (gadget: GadgetId) => void;
  completeStop: (stop: StopId) => void;
  spendEjectorSeat: () => void;
  setSoundOn: (on: boolean) => void;
  finishMission: () => void;
  reset: () => void;
}

const initialMission = {
  step: { screen: 'arrival' } as Step,
  visit: 0,
  era: null,
  gadget: null,
  completed: [],
  startedAt: null,
  finishedAt: null,
  seenCards: [] as CardId[],
  ejectorUsed: false,
};

const memoryFallback = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryFallback.get(key) ?? null;
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memoryFallback.set(key, value);
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      memoryFallback.delete(key);
    }
  },
};

export const useMission = create<MissionState>()(
  persist(
    (set) => ({
      ...initialMission,
      setStep: (step) => set((state) => ({ step, visit: state.visit + 1 })),
      markCardSeen: (card) =>
        set((state) => {
          if (state.seenCards.includes(card)) return state;
          return { seenCards: [...state.seenCards, card] };
        }),
      acceptMission: () => {
        trackEvent('mission_started');
        set({ startedAt: Date.now(), step: { screen: 'recruitment' } });
      },
      chooseEra: (era) => {
        trackEvent('era_chosen', { era });
        set({ era });
      },
      chooseGadget: (gadget) => {
        trackEvent('gadget_chosen', { gadget });
        set({ gadget });
      },
      completeStop: (stop) =>
        set((state) => {
          if (state.completed.includes(stop)) return state;
          trackEvent('stop_completed', { stop });
          return { completed: [...state.completed, stop] };
        }),
      spendEjectorSeat: () => {
        trackEvent('perk_used', { perk: 'ejectorSeat' });
        set({ ejectorUsed: true });
      },
      soundOn: DEMO,
      setSoundOn: (soundOn) => {
        trackEvent('sound_toggled', { on: soundOn });
        set({ soundOn });
      },
      finishMission: () =>
        set((state) => {
          if (state.finishedAt) return state;
          const finishedAt = Date.now();
          const duration = missionDurationMs(state.startedAt, finishedAt);
          trackEvent('mission_completed', {
            minutes: Math.round(duration / 60_000),
            rank: rankFor(duration, state.ejectorUsed),
          });
          return { finishedAt };
        }),
      reset: () => set((state) => ({ ...initialMission, soundOn: state.soundOn })),
    }),
    {
      name: DEMO ? 'exp007:demo' : 'exp007:v1',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({
        step,
        era,
        gadget,
        completed,
        startedAt,
        finishedAt,
        seenCards,
        ejectorUsed,
        soundOn,
      }) => ({
        step,
        era,
        gadget,
        completed,
        startedAt,
        finishedAt,
        seenCards,
        ejectorUsed,
        soundOn,
      }),
    },
  ),
);

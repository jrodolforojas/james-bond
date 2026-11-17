import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { CardId } from '../dossier/cards';
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
  era: EraId | null;
  gadget: GadgetId | null;
  completed: StopId[];
  startedAt: number | null;
  finishedAt: number | null;
  seenCards: CardId[];
  ejectorUsed: boolean;
  setStep: (step: Step) => void;
  markCardSeen: (card: CardId) => void;
  acceptMission: () => void;
  chooseEra: (era: EraId) => void;
  chooseGadget: (gadget: GadgetId) => void;
  completeStop: (stop: StopId) => void;
  spendEjectorSeat: () => void;
  finishMission: () => void;
  reset: () => void;
}

const initialMission = {
  step: { screen: 'arrival' } as Step,
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
      setStep: (step) => set({ step }),
      markCardSeen: (card) =>
        set((state) => {
          if (state.seenCards.includes(card)) return state;
          return { seenCards: [...state.seenCards, card] };
        }),
      acceptMission: () => set({ startedAt: Date.now(), step: { screen: 'recruitment' } }),
      chooseEra: (era) => set({ era }),
      chooseGadget: (gadget) => set({ gadget }),
      completeStop: (stop) =>
        set((state) => {
          if (state.completed.includes(stop)) return state;
          return { completed: [...state.completed, stop] };
        }),
      spendEjectorSeat: () => set({ ejectorUsed: true }),
      finishMission: () => set((state) => ({ finishedAt: state.finishedAt ?? Date.now() })),
      reset: () => set({ ...initialMission }),
    }),
    {
      name: 'exp007:v1',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ step, era, gadget, completed, startedAt, finishedAt, seenCards, ejectorUsed }) => ({
        step,
        era,
        gadget,
        completed,
        startedAt,
        finishedAt,
        seenCards,
        ejectorUsed,
      }),
    },
  ),
);

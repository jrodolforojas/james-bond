import type { EraId, GadgetId } from '../state/store';

export interface Perks {
  bombBonusMs: number;
  laserCuts: number;
  triviaHints: number;
  triviaMaxWrong: number;
  shootoutLives: number;
  shootoutHitRadius: number;
  ejectorSeat: boolean;
  db5Support: boolean;
}

export const BASE_PERKS: Perks = {
  bombBonusMs: 0,
  laserCuts: 0,
  triviaHints: 0,
  triviaMaxWrong: 2,
  shootoutLives: 5,
  shootoutHitRadius: 0.06,
  ejectorSeat: false,
  db5Support: false,
};

const ERA_PERKS: Record<EraId, Partial<Perks>> = {
  connery: { ejectorSeat: true, db5Support: true },
  moore: { triviaMaxWrong: 3 },
  dalton: { bombBonusMs: 10_000 },
  brosnan: { triviaHints: 1 },
  craig: { shootoutLives: 6 },
};

const GADGET_PERKS: Record<GadgetId, Partial<Perks>> = {
  laser: { laserCuts: 1 },
  tracker: { triviaHints: 1 },
  palm: { shootoutHitRadius: 0.1 },
};

export function perksFor(era: EraId | null, gadget: GadgetId | null): Perks {
  const fromEra = era ? ERA_PERKS[era] : {};
  const fromGadget = gadget ? GADGET_PERKS[gadget] : {};
  return {
    ...BASE_PERKS,
    ...fromEra,
    ...fromGadget,
    triviaHints: (fromEra.triviaHints ?? 0) + (fromGadget.triviaHints ?? 0),
  };
}

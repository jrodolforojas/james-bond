import { useMission } from '../state/store';
import { type Perks, perksFor } from './perks';

export function usePerks(): Perks {
  const era = useMission((state) => state.era);
  const gadget = useMission((state) => state.gadget);
  return perksFor(era, gadget);
}

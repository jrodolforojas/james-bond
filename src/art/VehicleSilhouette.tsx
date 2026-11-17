import type { EraId } from '../state/store';

const COUPE =
  'M8 96 Q10 74 44 68 L118 60 Q150 30 190 26 L252 26 Q284 30 304 58 L362 64 Q392 70 394 92 L394 102 L8 102 Z';
const WEDGE = 'M6 98 L14 78 L150 44 L250 36 L330 58 L392 76 L394 102 L6 102 Z';
const SEDAN =
  'M8 96 Q10 76 40 72 L110 66 Q136 34 176 30 L268 30 Q300 32 318 62 L370 68 Q392 72 394 92 L394 102 L8 102 Z';

export const VEHICLE_PATHS: Record<EraId, string> = {
  connery: COUPE,
  moore: WEDGE,
  dalton: COUPE,
  brosnan: SEDAN,
  craig: COUPE,
};

interface VehicleSilhouetteProps {
  era: EraId;
  rim: string;
}

export function VehicleSilhouette({ era, rim }: VehicleSilhouetteProps) {
  return (
    <svg viewBox="0 0 400 130" aria-hidden="true" className="vehicle">
      <path d={VEHICLE_PATHS[era]} fill="#1c1c1e" stroke={rim} strokeWidth="4" data-body />
      <circle cx="92" cy="102" r="24" fill="#000" />
      <circle cx="92" cy="102" r="14" fill="#2a2a2e" />
      <circle cx="316" cy="102" r="24" fill="#000" />
      <circle cx="316" cy="102" r="14" fill="#2a2a2e" />
    </svg>
  );
}

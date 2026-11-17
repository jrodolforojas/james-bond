import type { GadgetId } from '../state/store';

interface LondonSceneProps {
  label: string;
}

export function LondonScene({ label }: LondonSceneProps) {
  return (
    <svg viewBox="0 0 342 300" role="img" aria-label={label} className="ldn-scene">
      <circle cx="260" cy="70" r="44" fill="#5b6770" />
      <path
        d="M20 230 L20 180 L60 180 L60 140 L100 140 L100 100 L150 100 L150 70 L210 70 L210 100 L260 100 L260 140 L300 140 L300 180 L330 180 L330 230 Z"
        fill="#0b0b0c"
        data-building
      />
      <g fill="#e0534a" data-alarm-lights>
        <rect x="160" y="80" width="10" height="6" />
        <rect x="190" y="80" width="10" height="6" />
        <rect x="112" y="112" width="10" height="6" />
        <rect x="238" y="112" width="10" height="6" />
        <rect x="72" y="152" width="10" height="6" />
        <rect x="278" y="152" width="10" height="6" />
      </g>
      <path d="M0 230 L342 230 L342 300 L0 300 Z" fill="#14283f" />
      <g stroke="#5b6770" strokeWidth="2" opacity="0.6" data-river>
        <line x1="30" y1="250" x2="110" y2="250" />
        <line x1="150" y1="266" x2="260" y2="266" />
        <line x1="60" y1="284" x2="140" y2="284" />
      </g>
    </svg>
  );
}

export function ShadowedM() {
  return (
    <svg viewBox="0 0 64 70" aria-hidden="true" className="ldn-m">
      <circle cx="32" cy="26" r="14" fill="#0b0b0c" />
      <path d="M8 70 Q8 44 32 42 Q56 44 56 70 Z" fill="#0b0b0c" />
    </svg>
  );
}

const GADGET_PATHS: Record<GadgetId, string> = {
  laser: 'M22 6 H38 V16 A16 16 0 0 1 38 44 V54 H22 V44 A16 16 0 0 1 22 16 Z M30 22 A8 8 0 1 0 30.1 22 Z',
  tracker: 'M16 20 H44 V54 H16 Z M22 28 H38 V34 H22 Z M40 20 L50 4 L52 6 L44 20 Z',
  palm: 'M6 18 H48 V28 H30 L26 50 H14 L18 28 H6 Z M50 20 H56 V24 H50 Z',
};

interface GadgetIconProps {
  gadget: GadgetId;
  color: string;
}

export function GadgetIcon({ gadget, color }: GadgetIconProps) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" className="gadget-icon">
      <path d={GADGET_PATHS[gadget]} fill={color} fillRule="evenodd" />
    </svg>
  );
}

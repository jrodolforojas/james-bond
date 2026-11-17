interface FortKnoxSceneProps {
  label: string;
}

export function FortKnoxScene({ label }: FortKnoxSceneProps) {
  return (
    <svg viewBox="0 0 342 360" role="img" aria-label={label} className="fk-scene">
      <circle cx="250" cy="150" r="140" fill="#e8b52a" />
      <circle cx="250" cy="150" r="100" fill="none" stroke="#5c430a" strokeWidth="3" />
      <g stroke="#5c430a" strokeWidth="3">
        <line x1="250" y1="50" x2="250" y2="250" />
        <line x1="150" y1="150" x2="350" y2="150" />
      </g>
      <circle cx="250" cy="150" r="22" fill="#5c430a" />
      <g transform="translate(20 20)" fill="#0b0b0c" data-villain>
        <circle cx="80" cy="44" r="24" />
        <path d="M50 76 Q80 68 110 76 Q140 96 146 150 Q150 200 128 220 L124 340 L92 340 L86 240 L74 240 L68 340 L36 340 L32 220 Q10 200 14 150 Q20 96 50 76 Z" />
      </g>
      <g transform="translate(160 20)" fill="#0b0b0c" data-henchman>
        <ellipse cx="90" cy="40" rx="38" ry="7" />
        <path d="M64 40 Q64 10 90 10 Q116 10 116 40 Z" />
        <circle cx="90" cy="60" r="20" />
        <path d="M40 86 Q90 72 140 86 Q170 100 172 150 L176 240 L156 244 L148 160 L146 340 L104 340 L96 250 L84 250 L76 340 L34 340 L32 160 L24 244 L4 240 L8 150 Q10 100 40 86 Z" />
      </g>
    </svg>
  );
}

export function BowlerHat() {
  return (
    <svg viewBox="-36 -24 72 36" aria-hidden="true" className="fk-hat">
      <ellipse cx="0" cy="6" rx="34" ry="6" fill="#0b0b0c" stroke="#d4a017" strokeWidth="1.5" />
      <path d="M-20 6 Q-20 -20 0 -20 Q20 -20 20 6 Z" fill="#0b0b0c" stroke="#d4a017" strokeWidth="1.5" />
    </svg>
  );
}

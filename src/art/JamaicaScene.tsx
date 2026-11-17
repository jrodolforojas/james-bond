interface JamaicaSceneProps {
  label: string;
}

export function JamaicaScene({ label }: JamaicaSceneProps) {
  return (
    <svg viewBox="0 0 342 360" role="img" aria-label={label} className="jam-scene">
      <circle cx="270" cy="70" r="36" fill="#e8d3a2" data-sun />
      <path d="M0 190 Q171 180 342 190 L342 360 L0 360 Z" fill="#128a86" />
      <path d="M190 190 Q220 150 262 162 Q300 150 320 190 Z" fill="#0b0b0c" data-island />
      <rect x="250" y="140" width="4" height="22" fill="#0b0b0c" />
      <path d="M0 290 Q140 262 342 300 L342 360 L0 360 Z" fill="#e8d3a2" />
      <g data-palm>
        <path d="M40 300 Q50 220 30 140" stroke="#0b0b0c" strokeWidth="7" fill="none" strokeLinecap="round" />
        <g fill="#0b0b0c">
          <path d="M30 140 Q-10 130 -20 160 Q10 140 30 142 Z" />
          <path d="M30 140 Q70 120 100 150 Q70 134 30 142 Z" />
          <path d="M30 140 Q20 100 50 90 Q34 110 32 140 Z" />
        </g>
      </g>
      <g transform="translate(150 150)" data-dr-no>
        <circle cx="50" cy="26" r="18" fill="#0b0b0c" />
        <path d="M18 160 L20 58 Q50 46 80 58 L82 160 Z" fill="#0b0b0c" />
        <rect x="6" y="96" width="16" height="22" rx="3" fill="#8e97a3" />
        <rect x="78" y="96" width="16" height="22" rx="3" fill="#8e97a3" />
      </g>
    </svg>
  );
}

export function DrNoBust() {
  return (
    <svg viewBox="0 0 48 56" aria-hidden="true" className="jam-bust">
      <circle cx="24" cy="16" r="12" fill="#0b0b0c" />
      <path d="M4 56 Q4 30 24 28 Q44 30 44 56 Z" fill="#0b0b0c" />
      <rect x="2" y="44" width="8" height="10" rx="2" fill="#8e97a3" />
      <rect x="38" y="44" width="8" height="10" rx="2" fill="#8e97a3" />
    </svg>
  );
}

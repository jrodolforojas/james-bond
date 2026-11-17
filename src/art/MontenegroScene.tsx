interface MontenegroSceneProps {
  label: string;
}

export function MontenegroScene({ label }: MontenegroSceneProps) {
  return (
    <svg viewBox="0 0 342 340" role="img" aria-label={label} className="mtn-scene">
      <line x1="171" y1="0" x2="171" y2="40" stroke="#0b0b0c" strokeWidth="2" />
      <path d="M121 40 L221 40 L246 80 L96 80 Z" fill="#0b0b0c" data-chandelier />
      <g fill="#0b0b0c">
        <circle cx="110" cy="92" r="4" />
        <circle cx="140" cy="98" r="4" />
        <circle cx="171" cy="100" r="4" />
        <circle cx="202" cy="98" r="4" />
        <circle cx="232" cy="92" r="4" />
      </g>
      <g data-le-chiffre>
        <circle cx="171" cy="170" r="34" fill="#0b0b0c" />
        <path d="M101 290 Q101 214 171 208 Q241 214 241 290 Z" fill="#0b0b0c" />
        <path d="M183 166 Q186 178 183 190 Q180 178 183 166 Z" fill="#b0172a" data-tear />
      </g>
      <path d="M0 286 Q171 262 342 286 L342 340 L0 340 Z" fill="#0a3f28" />
      <g fill="#b0172a">
        <ellipse cx="60" cy="300" rx="14" ry="4" />
        <ellipse cx="60" cy="295" rx="14" ry="4" />
        <ellipse cx="280" cy="304" rx="14" ry="4" />
      </g>
      <g fill="#f4eee1">
        <ellipse cx="60" cy="290" rx="14" ry="4" />
        <ellipse cx="280" cy="299" rx="14" ry="4" />
      </g>
    </svg>
  );
}

interface PlayerSilhouetteProps {
  tear: boolean;
  ring: string;
}

export function PlayerSilhouette({ tear, ring }: PlayerSilhouetteProps) {
  return (
    <svg viewBox="0 0 64 74" aria-hidden="true" className="player">
      <circle cx="32" cy="38" r="35" fill="none" stroke={ring} strokeWidth="3" />
      <g data-body>
        <path d="M6 74 Q6 42 32 40 Q58 42 58 74 Z" fill="#0b0b0c" />
      </g>
      <g data-head>
        <circle cx="32" cy="22" r="14" fill="#0b0b0c" />
        {tear && <path d="M37 21 Q39 27 37 33 Q35 27 37 21 Z" fill="#b0172a" />}
      </g>
      <rect x="40" y="60" width="6" height="12" rx="2" fill="#f4eee1" opacity="0" data-glass />
      <circle cx="46" cy="66" r="5" fill="#1c1c1e" stroke="#0b0b0c" data-hand />
    </svg>
  );
}

export function Briefcase({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 60 44" aria-hidden="true" className="briefcase">
      <rect x="22" y="2" width="16" height="8" rx="2" fill="none" stroke="#3b2a17" strokeWidth="3" />
      <rect x="2" y="10" width="56" height="32" rx="3" fill="#3b2a17" />
      {open && <rect x="10" y="4" width="40" height="18" fill="#f1e4c3" transform="rotate(-4 30 13)" />}
      <rect x="27" y="22" width="6" height="5" fill="#d4a017" />
    </svg>
  );
}

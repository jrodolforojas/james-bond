import type { Lane } from '../stops/scotland/rules';

export const HOUSE_VIEW = { width: 342, height: 380 };

export const SLOT_BOXES: Record<Lane, { x: number; y: number; w: number; h: number }> = {
  upperLeft: { x: 92, y: 170, w: 44, h: 48 },
  upperRight: { x: 206, y: 170, w: 44, h: 48 },
  lowerLeft: { x: 72, y: 252, w: 44, h: 48 },
  door: { x: 148, y: 240, w: 46, h: 90 },
  lowerRight: { x: 226, y: 252, w: 44, h: 48 },
};

interface ScotlandHouseProps {
  label?: string;
  burning?: boolean;
  litWindows?: boolean;
}

export function ScotlandHouse({ label, burning = false, litWindows = false }: ScotlandHouseProps) {
  const windowFill = litWindows || burning ? '#f2662a' : '#0b0b0c';
  return (
    <svg
      viewBox={`0 0 ${HOUSE_VIEW.width} ${HOUSE_VIEW.height}`}
      className="sco-house"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <g fill="#f4eee1" opacity="0.6" data-stars>
        <circle cx="30" cy="30" r="1.5" />
        <circle cx="120" cy="60" r="1.5" />
        <circle cx="300" cy="40" r="1.5" />
        <circle cx="220" cy="18" r="1.5" />
        <circle cx="70" cy="110" r="1.2" />
      </g>
      <path d="M0 330 L80 300 L171 320 L260 290 L342 310 L342 380 L0 380 Z" fill="#071022" />
      <path d="M40 330 L40 160 L171 70 L302 160 L302 330 Z" fill="#1a2638" />
      <rect x="250" y="80" width="24" height="70" fill="#1a2638" />
      {Object.entries(SLOT_BOXES).map(([lane, box]) => (
        <rect key={lane} x={box.x} y={box.y} width={box.w} height={box.h} fill={windowFill} data-window />
      ))}
      {burning && (
        <g fill="none" strokeLinecap="round" data-flames>
          <path d="M120 150 C 100 100, 150 80, 126 30" stroke="#f2662a" strokeWidth="16" />
          <path d="M180 120 C 196 80, 160 60, 184 10" stroke="#f2662a" strokeWidth="12" />
          <path d="M240 150 C 224 110, 260 90, 244 50" stroke="#d4a017" strokeWidth="8" />
          <path d="M150 130 C 140 100, 168 86, 154 56" stroke="#d4a017" strokeWidth="6" />
        </g>
      )}
      <g fill="none" stroke="#aeb8c6" strokeLinecap="round" data-mist>
        <path d="M-20 340 C 80 310, 150 370, 240 330 S 360 300, 400 330" strokeWidth="30" opacity="0.14" />
        <path d="M-20 300 C 60 280, 140 320, 220 290 S 350 270, 400 300" strokeWidth="18" opacity="0.1" />
      </g>
    </svg>
  );
}

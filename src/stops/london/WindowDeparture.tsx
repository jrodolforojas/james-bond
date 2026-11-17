import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { prefersReducedMotion } from '../../motion';

const WINDOW = { x: 95, y: 230, width: 200, height: 280 };
const ROOFTOPS =
  'M0 660 L0 600 L40 600 L40 560 L70 560 L70 610 L110 610 L110 520 L130 500 L150 520 L150 620 L200 620 L200 570 L250 570 L250 615 L300 615 L300 550 L340 550 L340 600 L390 600 L390 800 L0 800 Z';
const GRID_ROWS = [160, 320, 480, 640];
const GRID_COLUMNS = [78, 156, 234, 312];

interface WindowDepartureProps {
  onDone: () => void;
}

export function WindowDeparture({ onDone }: WindowDepartureProps) {
  const { t } = useTranslation('london');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.delayedCall(0.3, onDone);
        return;
      }
      const origin = `${WINDOW.x + WINDOW.width / 2}px ${WINDOW.y + WINDOW.height / 2}px`;
      gsap
        .timeline({ onComplete: onDone })
        .to('[data-frame]', { scale: 9, svgOrigin: origin, duration: 1, ease: 'power2.in' }, 0.5)
        .to('[data-rooftops]', { y: 420, duration: 1.4, ease: 'sine.inOut' }, 1.2)
        .to('[data-sky]', { fill: '#14283f', duration: 1.2 }, 1.4)
        .to('[data-grid]', { opacity: 1, duration: 0.6 }, 2.1)
        .fromTo(
          '[data-dot]',
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, svgOrigin: '195 400', duration: 0.3 },
          2.4,
        )
        .to({}, { duration: 0.5 });
    },
    { scope },
  );

  return (
    <main className="screen departure" ref={scope}>
      <svg
        viewBox="0 0 390 800"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={t('departureLabel')}
      >
        <rect width="390" height="800" fill="#1f3a5f" data-sky />
        <g stroke="#2e4a6e" strokeWidth="1" opacity="0" data-grid>
          {GRID_ROWS.map((y) => (
            <line key={`r${y}`} x1="0" y1={y} x2="390" y2={y} />
          ))}
          {GRID_COLUMNS.map((x) => (
            <line key={`c${x}`} x1={x} y1="0" x2={x} y2="800" />
          ))}
        </g>
        <path d={ROOFTOPS} fill="#0b0b0c" data-rooftops />
        <g data-dot>
          <circle cx="195" cy="400" r="9" fill="#0b0b0c" />
          <circle cx="195" cy="400" r="4" fill="#e0534a" />
        </g>
        <g data-frame>
          <path
            fillRule="evenodd"
            fill="#14181d"
            d={`M-400 -400 H790 V1200 H-400 Z M${WINDOW.x} ${WINDOW.y} h${WINDOW.width} v${WINDOW.height} h-${WINDOW.width} Z`}
          />
          <rect
            x={WINDOW.x - 8}
            y={WINDOW.y - 8}
            width={WINDOW.width + 16}
            height={WINDOW.height + 16}
            fill="none"
            stroke="#0b0b0c"
            strokeWidth="16"
          />
          <rect
            x={WINDOW.x + WINDOW.width / 2 - 4}
            y={WINDOW.y}
            width="8"
            height={WINDOW.height}
            fill="#0b0b0c"
          />
        </g>
      </svg>
    </main>
  );
}

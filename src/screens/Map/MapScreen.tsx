import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type CSSProperties, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../flow/navigate';
import { prefersReducedMotion } from '../../motion';
import { useMission } from '../../state/store';
import {
  EVIDENCE_TOTAL,
  evidenceCount,
  nextStop,
  STOP_COLORS,
  STOP_ORDER,
  type StopId,
} from '../../stops/catalog';
import { LANDMASSES, MAP_VIEWBOX, PINS, ROUTE_CURVES } from './geo';
import './map.css';

type PinState = 'done' | 'next' | 'locked';

function segmentPath(from: StopId, to: StopId): string {
  const a = PINS[from];
  const b = PINS[to];
  const curve = ROUTE_CURVES[to];
  if (!curve) return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  return `M${a.x} ${a.y} Q${curve.cx} ${curve.cy} ${b.x} ${b.y}`;
}

function pinState(stop: StopId, completed: readonly StopId[], next: StopId | undefined): PinState {
  if (completed.includes(stop)) return 'done';
  if (stop === next) return 'next';
  return 'locked';
}

export function MapScreen() {
  const { t } = useTranslation('map');
  const completed = useMission((state) => state.completed);
  const next = nextStop(completed);
  const scope = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const nextIndex = next ? STOP_ORDER.indexOf(next) : STOP_ORDER.length;

  useGSAP(
    () => {
      const fresh = scope.current?.querySelector<SVGPathElement>('[data-fresh-route]');
      if (!fresh || prefersReducedMotion()) return;
      const length = fresh.getTotalLength();
      gsap.fromTo(
        fresh,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.3 },
      );
    },
    { scope },
  );

  const { contextSafe } = useGSAP({ scope });

  const enterStop = contextSafe((stop: StopId) => {
    const board = boardRef.current;
    const zoom = scope.current?.querySelector<HTMLElement>('[data-zoom]');
    const go = () => navigate({ screen: 'stop', stop });
    if (!board || !zoom || prefersReducedMotion()) return go();
    const rect = board.getBoundingClientRect();
    const host = scope.current?.getBoundingClientRect() ?? rect;
    const pin = PINS[stop];
    const left = rect.left - host.left + (pin.x / MAP_VIEWBOX.width) * rect.width;
    const top =
      rect.top - host.top + (pin.y / MAP_VIEWBOX.height) * rect.height + (scope.current?.scrollTop ?? 0);
    gsap
      .timeline({ onComplete: go })
      .set(zoom, { display: 'block', left, top, scale: 0.2, background: STOP_COLORS[stop].background })
      .to(zoom, { scale: 60, duration: 0.7, ease: 'power3.in' });
  });

  return (
    <main className="screen map" ref={scope}>
      <header>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1 className="display map__title">
          {t('evidence')}{' '}
          <em>
            {evidenceCount(completed)}/{EVIDENCE_TOTAL}
          </em>
        </h1>
      </header>

      <div className="map__board" ref={boardRef}>
        <svg viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} role="img" aria-label={t('mapLabel')}>
          <g stroke="#26262a" strokeWidth="1">
            {[60, 120, 180, 240].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2={MAP_VIEWBOX.width} y2={y} />
            ))}
            {[57, 114, 171, 228, 285].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2={MAP_VIEWBOX.height} />
            ))}
          </g>
          <g fill="#1e1e22">
            {LANDMASSES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <text x="150" y="190" fill="#4a4a4e" fontSize="10" letterSpacing="3" className="map__label">
            {t('ocean')}
          </text>

          {STOP_ORDER.slice(1).map((stop, i) => {
            const from = STOP_ORDER[i];
            const index = i + 1;
            const travelled = index < nextIndex;
            const fresh = index === nextIndex;
            return (
              <path
                key={stop}
                d={segmentPath(from, stop)}
                fill="none"
                stroke="#e0534a"
                strokeWidth={travelled || fresh ? 2 : 1.5}
                strokeDasharray={travelled || fresh ? undefined : '4 5'}
                opacity={travelled || fresh ? 1 : 0.45}
                data-fresh-route={fresh ? '' : undefined}
              />
            );
          })}

          {STOP_ORDER.map((stop) => {
            const pin = PINS[stop];
            const state = pinState(stop, completed, next);
            const color = state === 'next' ? STOP_COLORS[stop].background : '#e0534a';
            return (
              <g key={stop}>
                {state === 'next' && (
                  <circle
                    className="map__pulse"
                    cx={pin.x}
                    cy={pin.y}
                    r="9"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                  />
                )}
                {state === 'done' && <circle cx={pin.x} cy={pin.y} r="5" fill={color} />}
                {state === 'next' && <circle cx={pin.x} cy={pin.y} r="5" fill={color} />}
                {state === 'locked' && (
                  <circle cx={pin.x} cy={pin.y} r="6" fill="#0b0b0c" stroke="#8e897f" strokeWidth="1.5" />
                )}
                <text
                  x={pin.labelX}
                  y={pin.labelY}
                  className="map__label"
                  fill={state === 'next' ? color : undefined}
                >
                  {t(`stops.${stop}.place`)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <ol className="stops">
        {STOP_ORDER.map((stop, index) => {
          const state = pinState(stop, completed, next);
          return (
            <li key={stop}>
              <button
                type="button"
                className={`is-${state}`}
                disabled={state !== 'next'}
                onClick={() => enterStop(stop)}
                style={{ '--stop-color': STOP_COLORS[stop].background } as CSSProperties}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="stops__name">
                  {t(`stops.${stop}.name`)} · {t(`stops.${stop}.subtitle`)}
                </span>
                {state === 'done' && <span className="stops__tag">{t('done')}</span>}
                {state === 'locked' && <span className="stops__tag">{t('locked')}</span>}
                {state === 'next' && <span aria-hidden="true">▸</span>}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="map__zoom" data-zoom aria-hidden="true" />
    </main>
  );
}

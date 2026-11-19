import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FortKnoxScene } from '../../art/FortKnoxScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';
import { BOMB_VIEW, WIRE_COLORS, WIRE_ROWS } from '../../stops/fortknox/BombGame';
import { CORRECT_WIRE, FREEZE_AT_MS, START_MS, WIRES } from '../../stops/fortknox/rules';
import { GamePanel } from '../GamePanel';
import { StopOpening } from '../StopOpening';

const CUT_DASH = '44 18 400';

function formatClock(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  return `0:${String(seconds).padStart(2, '0')}`;
}

function Bomb() {
  const { t } = useTranslation('fortknox');
  const scope = useRef<HTMLDivElement>(null);
  const clues = t('clues', { returnObjects: true });

  useGSAP(
    () => {
      const root = scope.current;
      const timer = root?.querySelector<HTMLElement>('[data-timer]');
      const cut = root?.querySelector<SVGPathElement>('[data-cut]');
      const stopped = root?.querySelector<HTMLElement>('[data-stopped]');
      if (!root || !timer || !cut || !stopped) return;
      const render = (ms: number) => {
        const frozen = ms <= FREEZE_AT_MS;
        timer.textContent = formatClock(ms);
        timer.classList.toggle('is-frozen', frozen);
        timer.classList.toggle('is-critical', !frozen && ms <= 12_000);
        cut.setAttribute('stroke-dasharray', frozen ? CUT_DASH : 'none');
        stopped.style.opacity = frozen ? '1' : '0';
      };
      if (prefersReducedMotion()) return render(FREEZE_AT_MS);
      const clock = { ms: START_MS };
      gsap.to(clock, {
        ms: FREEZE_AT_MS,
        ease: 'none',
        onUpdate: () => render(clock.ms),
        scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 55%', scrub: 0.4 },
      });
    },
    { scope },
  );

  return (
    <div className="bf-bomb" ref={scope}>
      <div className="bomb__timer" role="timer" aria-label={t('timerLabel')} data-timer>
        {formatClock(START_MS)}
      </div>
      <div className="bomb__panel" aria-hidden="true">
        <svg viewBox={`0 0 ${BOMB_VIEW.width} ${BOMB_VIEW.height}`} aria-hidden="true">
          <rect
            x="120"
            y="110"
            width="110"
            height="110"
            fill="#2a2210"
            stroke="var(--fortknox-gold)"
            strokeWidth="2"
          />
          <rect x="140" y="128" width="70" height="74" fill="var(--paper)" transform="rotate(-4 175 165)" />
          <g fill="#000">
            <rect x="148" y="140" width="50" height="5" />
            <rect x="148" y="152" width="40" height="5" />
            <rect x="148" y="164" width="52" height="5" />
            <rect x="148" y="176" width="34" height="5" />
          </g>
          {WIRES.map((wire, row) => {
            const geometry = WIRE_ROWS[row] ?? WIRE_ROWS[0];
            return (
              <g key={wire} fill="none" strokeWidth="7" strokeLinecap="round" stroke={WIRE_COLORS[wire]}>
                <path d={geometry.left} data-cut={wire === CORRECT_WIRE ? true : undefined} />
                <path d={geometry.right} opacity="0.9" />
              </g>
            );
          })}
        </svg>
        <span className="eyebrow bf-stopped" data-stopped>
          {t('stopped')}
        </span>
      </div>
      <ul className="bomb__manual">
        <li className="bomb__manual-title">{t('manual')}</li>
        {clues.map((clue) => (
          <li key={clue}>{clue}</li>
        ))}
      </ul>
    </div>
  );
}

export function FortKnoxSection() {
  const { t } = useTranslation('fortknox');

  return (
    <>
      <StopOpening
        stop="fortknox"
        copy={{
          eyebrow: t('eyebrow'),
          titleStart: t('titleStart'),
          titleEm: t('titleEm'),
          theme: t('theme'),
        }}
        scene={<FortKnoxScene label={t('sceneLabel')} />}
        voice={<MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>}
        build={(timeline) => {
          timeline
            .from('[data-villain]', { x: -60, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0)
            .from('[data-henchman]', { x: 60, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.15);
        }}
      />
      <GamePanel game="fortknox" cardId="villains">
        <p className="eyebrow bf-eyebrow bf-hud">{t('defusal')}</p>
        <Bomb />
        <MoneypennyRadio>{`"${t('success')}"`}</MoneypennyRadio>
      </GamePanel>
    </>
  );
}

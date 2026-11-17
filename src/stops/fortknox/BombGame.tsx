import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BowlerHat } from '../../art/FortKnoxScene';
import { playCue } from '../../audio/audio';
import { prefersReducedMotion } from '../../motion';
import { EjectorSeat } from '../../perks/EjectorSeat';
import '../../perks/perks.css';
import {
  activeClue,
  type BombState,
  CORRECT_WIRE,
  createBomb,
  cutWire,
  FREEZE_AT_MS,
  formatClock,
  frozenClockMs,
  hitByHat,
  isHatDue,
  START_LIVES,
  throwHat,
  tick,
  WIRES,
  type Wire,
} from './rules';

type Direction = 'up' | 'down';

const VIEW = { width: 350, height: 330 };
const ROW_HEIGHT = 60;
const SWIPE_THRESHOLD_PX = 30;
const CRITICAL_MS = 5_000;
const HAT_WARNING_S = 0.8;
const HAT_FLIGHT_S = 0.7;

const ROWS = [
  { y: 40, left: 'M20 40 Q80 40 120 130', right: 'M230 130 Q290 60 330 40' },
  { y: 100, left: 'M20 100 Q70 110 120 155', right: 'M230 155 Q290 120 330 100' },
  { y: 170, left: 'M20 170 Q70 170 120 175', right: 'M230 175 Q290 175 330 170' },
  { y: 240, left: 'M20 240 Q80 230 120 195', right: 'M230 195 Q290 230 330 240' },
  { y: 300, left: 'M20 300 Q90 300 120 212', right: 'M230 212 Q290 290 330 300' },
] as const;

const WIRE_COLORS: Record<Wire, string> = {
  red: 'var(--wire-red)',
  blue: 'var(--wire-blue)',
  yellow: 'var(--wire-yellow)',
  green: 'var(--wire-green)',
  white: 'var(--wire-white)',
};

interface HatThrow {
  direction: Direction;
  dodged: boolean;
  failed: boolean;
}

interface BombGameProps {
  bonusMs?: number;
  order?: readonly Wire[];
  previouslyCut?: readonly Wire[];
  laserCuts?: number;
  onEject?: () => void;
  onDefused: (frozenMs: number) => void;
  onExploded: (cut: Wire[]) => void;
}

export function BombGame({
  bonusMs = 0,
  order = WIRES,
  previouslyCut = [],
  laserCuts = 0,
  onEject,
  onDefused,
  onExploded,
}: BombGameProps) {
  const { t } = useTranslation('fortknox');
  const scope = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hatThrow = useRef<HatThrow | null>(null);
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const [bomb, setBomb] = useState<BombState>(() => createBomb(bonusMs, previouslyCut));
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<Wire | null>(null);
  const [hatDirection, setHatDirection] = useState<Direction | null>(null);
  const [displayMs, setDisplayMs] = useState<number | null>(null);
  const [lasers, setLasers] = useState(laserCuts);
  const clues = t('clues', { returnObjects: true });
  const clueIndex = activeClue(bomb);
  const shownMs = displayMs ?? bomb.remainingMs;
  const running = started && bomb.status === 'running';

  const secondsLeft = Math.ceil(bomb.remainingMs / 1000);

  // biome-ignore lint/correctness/useExhaustiveDependencies: tick once per displayed second
  useEffect(() => {
    if (running) playCue('tick');
  }, [secondsLeft, running]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-vault]', { display: 'none' });
        setStarted(true);
        return;
      }
      gsap
        .timeline({ onComplete: () => setStarted(true) })
        .to('[data-vault-wheel]', { rotation: 90, duration: 0.6, ease: 'power2.inOut', delay: 0.2 })
        .to('[data-vault-door]', { scale: 2.8, opacity: 0, duration: 0.7, ease: 'power2.in' })
        .to('[data-vault]', { opacity: 0, duration: 0.3 }, '<0.3')
        .set('[data-vault]', { display: 'none' })
        .from('[data-hud]', { y: -30, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' })
        .from('[data-manual]', { y: 30, opacity: 0, duration: 0.4, ease: 'power2.out' }, '<');
    },
    { scope },
  );

  useEffect(() => {
    if (!running) return;
    const onTick = (_time: number, deltaMs: number) => setBomb((state) => tick(state, deltaMs));
    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [running]);

  const { contextSafe } = useGSAP({ scope });

  const flashLabel = contextSafe((name: 'wrong' | 'dodged' | 'hit') => {
    gsap.fromTo(
      `[data-flash="${name}"]`,
      { opacity: 1, scale: 1.4 },
      { opacity: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
    );
  });

  const resolveHat = contextSafe(() => {
    const thrown = hatThrow.current;
    hatThrow.current = null;
    setHatDirection(null);
    if (thrown?.dodged) {
      playCue('click');
      return flashLabel('dodged');
    }
    setBomb((state) => hitByHat(state));
    playCue('hit');
    flashLabel('hit');
    gsap.fromTo(panelRef.current, { x: -6 }, { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
  });

  const launchHat = contextSafe(() => {
    playCue('whoosh');
    const direction: Direction = Math.random() < 0.5 ? 'up' : 'down';
    hatThrow.current = { direction, dodged: false, failed: false };
    setHatDirection(direction);
    const panelWidth = panelRef.current?.clientWidth ?? 340;
    gsap
      .timeline()
      .to({}, { duration: HAT_WARNING_S })
      .fromTo(
        '[data-hat]',
        { x: 0, rotation: 0, opacity: 1 },
        { x: -(panelWidth + 160), rotation: -720, duration: HAT_FLIGHT_S, ease: 'none' },
      )
      .set('[data-hat]', { opacity: 0 })
      .add(resolveHat);
  });

  useEffect(() => {
    if (!running || hatThrow.current || !isHatDue(bomb)) return;
    setBomb((state) => throwHat(state));
    launchHat();
  }, [running, bomb, launchHat]);

  const dodge = contextSafe((direction: Direction) => {
    const thrown = hatThrow.current;
    if (!thrown || thrown.dodged || thrown.failed) return;
    if (direction !== thrown.direction) {
      thrown.failed = true;
      return;
    }
    thrown.dodged = true;
    gsap.to(panelRef.current, {
      y: direction === 'up' ? -26 : 26,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
  });

  const finishDefused = contextSafe((state: BombState) => {
    const target = frozenClockMs(state);
    const late = state.remainingMs <= FREEZE_AT_MS;
    if (late || prefersReducedMotion()) {
      setDisplayMs(target);
      gsap.delayedCall(1.4, () => onDefused(target));
      return;
    }
    const counter = { ms: state.remainingMs };
    gsap.to(counter, {
      ms: target,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => setDisplayMs(counter.ms),
      onComplete: () => void gsap.delayedCall(1, () => onDefused(target)),
    });
  });

  const finishExploded = contextSafe((state: BombState) => {
    playCue('static');
    gsap.delayedCall(0.3, () => onExploded(state.cut));
  });

  const status = bomb.status;
  // biome-ignore lint/correctness/useExhaustiveDependencies: react only to status transitions, reading the state at that moment
  useEffect(() => {
    if (status === 'defused') return finishDefused(bomb);
    if (status === 'exploded') return finishExploded(bomb);
  }, [status]);

  const pressWire = contextSafe((wire: Wire) => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    if (!running || bomb.cut.includes(wire)) return;
    if (selected !== wire) return setSelected(wire);
    setSelected(null);
    setBomb((state) => cutWire(state, wire));
    playCue('snap');
    if (wire === CORRECT_WIRE) return;
    playCue('buzz');
    flashLabel('wrong');
    gsap.fromTo('[data-penalty]', { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.9 });
    gsap.fromTo('[data-timer]', { x: -5 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
  });

  const fireLaser = contextSafe(() => {
    if (!running || !selected || lasers <= 0) return;
    const wire = selected;
    const row = order.indexOf(wire);
    const geometry = ROWS[row] ?? ROWS[0];
    setSelected(null);
    setLasers((count) => count - 1);
    gsap.fromTo(
      '[data-laser]',
      { attr: { x2: 350, y2: 330 }, opacity: 1 },
      {
        attr: { x2: 60, y2: geometry.y + 8 },
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => {
          setBomb((state) => cutWire(state, wire, true));
          playCue('snap');
          gsap.to('[data-laser]', { opacity: 0, duration: 0.3 });
        },
      },
    );
  });

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.clientY;
  };

  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;
    const dy = event.clientY - start;
    if (Math.abs(dy) < SWIPE_THRESHOLD_PX) return;
    swiped.current = true;
    dodge(dy < 0 ? 'up' : 'down');
  };

  const timerClass = [
    'bomb__timer',
    running && bomb.remainingMs <= CRITICAL_MS ? 'is-critical' : '',
    bomb.status === 'defused' ? 'is-frozen' : '',
  ].join(' ');

  return (
    <main className="screen bomb" ref={scope}>
      <div className="bomb__hud" data-hud>
        <span>{t('defusal')}</span>
        <span
          className="bomb__lives"
          role="img"
          aria-label={t('livesLabel', { n: bomb.lives, total: START_LIVES })}
        >
          {t('lives')}
          {Array.from({ length: START_LIVES }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length life counter
            <span key={i} className={`bomb__life ${i < bomb.lives ? '' : 'is-lost'}`} />
          ))}
        </span>
      </div>

      <div className={timerClass} role="timer" aria-label={t('timerLabel')} data-timer data-hud>
        {formatClock(shownMs)}
        <span className="bomb__penalty" data-penalty aria-hidden="true">
          {t('penalty')}
        </span>
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: a fieldset collapses absolutely positioned children to zero height */}
      <div
        className="bomb__panel"
        role="group"
        ref={panelRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-label={t('bombLabel')}
      >
        <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} aria-hidden="true">
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
          {order.map((wire, row) => {
            const geometry = ROWS[row] ?? ROWS[0];
            const isCut = bomb.cut.includes(wire);
            return (
              <g key={wire} fill="none" strokeWidth="7" strokeLinecap="round" stroke={WIRE_COLORS[wire]}>
                {selected === wire && (
                  <path d={geometry.left} stroke="#fff" strokeWidth="16" opacity="0.25" />
                )}
                <path d={geometry.left} strokeDasharray={isCut ? '44 18 400' : undefined} />
                <path d={geometry.right} opacity="0.9" />
              </g>
            );
          })}
          <line x1="350" y1="330" x2="350" y2="330" stroke="#e0534a" strokeWidth="3" opacity="0" data-laser />
        </svg>

        {order.map((wire, row) => {
          const geometry = ROWS[row] ?? ROWS[0];
          const top = ((geometry.y - ROW_HEIGHT / 2) / VIEW.height) * 100;
          const height = (ROW_HEIGHT / VIEW.height) * 100;
          return (
            <button
              key={wire}
              type="button"
              className="bomb__wire"
              style={{ top: `${top}%`, height: `${height}%` }}
              aria-label={t(`wires.${wire}`)}
              aria-pressed={selected === wire}
              disabled={!running || bomb.cut.includes(wire)}
              onClick={() => pressWire(wire)}
            >
              {selected === wire && <span className="bomb__confirm">{t('confirmCut')}</span>}
            </button>
          );
        })}

        {hatDirection && (
          <div className="bomb__warning" aria-live="assertive">
            <span>{t('hatIncoming')}</span>
            <span className="bomb__warning-arrow" aria-hidden="true">
              {hatDirection === 'up' ? '↑' : '↓'}
            </span>
          </div>
        )}
        <div className="bomb__hat" data-hat>
          <BowlerHat />
        </div>

        <div className="bomb__flash-label" data-flash="wrong" aria-hidden="true">
          <span className="stamp" style={{ fontSize: 18 }}>
            {t('wrong')}
          </span>
        </div>
        <div className="bomb__flash-label" data-flash="dodged" aria-hidden="true">
          <span className="stamp" style={{ fontSize: 18, color: 'var(--fortknox-gold)' }}>
            {t('dodged')}
          </span>
        </div>
        <div className="bomb__flash-label" data-flash="hit" aria-hidden="true">
          <span className="stamp" style={{ fontSize: 18 }}>
            {t('hit')}
          </span>
        </div>

        <div className="bomb__vault" data-vault aria-hidden="true">
          <div className="bomb__vault-door" data-vault-door>
            <div className="bomb__vault-wheel" data-vault-wheel />
          </div>
        </div>
      </div>

      <ul className="bomb__manual" data-manual>
        <li className="bomb__manual-title">{t('manual')}</li>
        {clues.map((clue, index) => (
          <li
            key={clue}
            className={`bomb__clue ${index < clueIndex ? 'is-used' : ''} ${index === clueIndex ? 'is-active' : ''}`}
          >
            {clue}
          </li>
        ))}
      </ul>

      <div className="bomb__controls">
        <button
          type="button"
          className="bomb__dodge"
          aria-label={t('dodgeUp')}
          disabled={!hatDirection}
          onClick={() => dodge('up')}
        >
          ↑
        </button>
        <span className="bomb__hint">{hatDirection ? t('dodgeHint') : t('selectHint')}</span>
        <button
          type="button"
          className="bomb__dodge"
          aria-label={t('dodgeDown')}
          disabled={!hatDirection}
          onClick={() => dodge('down')}
        >
          ↓
        </button>
      </div>

      {(laserCuts > 0 || onEject) && (
        <div className="perk-bar">
          {laserCuts > 0 && (
            <button
              type="button"
              className="perk-btn"
              aria-label={t('laserLabel')}
              disabled={!running || !selected || lasers <= 0}
              onClick={fireLaser}
            >
              {t('laser', { n: lasers })}
            </button>
          )}
          {onEject && <EjectorSeat onEject={onEject} />}
        </div>
      )}
    </main>
  );
}

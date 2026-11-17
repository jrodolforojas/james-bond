import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, PlayerSilhouette } from '../../art/MontenegroScene';
import { playCue } from '../../audio/audio';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';
import { EjectorSeat } from '../../perks/EjectorSeat';
import '../../perks/perks.css';
import {
  createTable,
  type Gesture,
  judge,
  LE_CHIFFRE_SEAT,
  ROUND_SECONDS,
  ROUNDS,
  START_CHIPS,
  scheduleRound,
  type Verdict,
} from './rules';

type Phase = 'watching' | 'choosing' | 'feedback';

const SEAT_POSITIONS = [
  { left: 14, top: 44 },
  { left: 29, top: 14 },
  { left: 50, top: 3 },
  { left: 71, top: 14 },
  { left: 86, top: 44 },
];

type GestureMotion = (timeline: gsap.core.Timeline, seat: Element) => void;

const GESTURE_MOTION: Record<Gesture, GestureMotion> = {
  eye: (tl, seat) => {
    const hand = seat.querySelector('[data-hand]');
    tl.to(hand, { x: -8, y: -42, duration: 0.25 }, 0).to(hand, { x: 0, y: 0, duration: 0.3 }, 0.7);
  },
  chips: (tl, seat) => {
    tl.to(seat.querySelector('[data-head]'), { y: 4, duration: 0.25, yoyo: true, repeat: 1 }, 0);
  },
  drum: (tl, seat) => {
    tl.to(seat.querySelector('[data-hand]'), { y: -3, duration: 0.06, yoyo: true, repeat: 7 }, 0);
  },
  tie: (tl, seat) => {
    const hand = seat.querySelector('[data-hand]');
    tl.to(hand, { x: -14, y: -26, duration: 0.25 }, 0).to(hand, { x: 0, y: 0, duration: 0.3 }, 0.7);
  },
  drink: (tl, seat) => {
    const glass = seat.querySelector('[data-glass]');
    tl.to(glass, { opacity: 1, y: -36, duration: 0.3 }, 0).to(
      glass,
      { opacity: 0, y: 0, duration: 0.3 },
      0.8,
    );
  },
};

function playGesture(seat: Element, gesture: Gesture) {
  const timeline = gsap.timeline();
  timeline
    .fromTo(
      seat.querySelector('[data-bubble]'),
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.15 },
      0,
    )
    .to(seat.querySelector('[data-bubble]'), { opacity: 0, duration: 0.2 }, 0.8);
  if (prefersReducedMotion()) return;
  GESTURE_MOTION[gesture](timeline, seat);
}

interface PokerTableProps {
  onFound: () => void;
  onEject?: () => void;
}

export function PokerTable({ onFound, onEject }: PokerTableProps) {
  const { t } = useTranslation('montenegro');
  const scope = useRef<HTMLElement>(null);
  const [table] = useState(() => createTable());
  const [phase, setPhase] = useState<Phase>('watching');
  const [round, setRound] = useState(1);
  const [chips, setChips] = useState(START_CHIPS);
  const [picked, setPicked] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  useGSAP(
    () => {
      if (phase !== 'watching') return;
      const root = scope.current;
      if (!root) return;
      const seats = root.querySelectorAll('[data-seat]');
      const finishRound = () => {
        if (round < ROUNDS) return setRound(round + 1);
        setPhase('choosing');
      };
      const timeline = gsap.timeline({ onComplete: finishRound });
      timeline.fromTo(
        '[data-card]',
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.08 },
        0,
      );
      scheduleRound(table).forEach((event) => {
        if (event.kind === 'glint') {
          timeline.call(() => playCue('ping'), [], event.at);
          timeline.fromTo(
            '[data-glint]',
            { opacity: 0 },
            { opacity: 1, duration: 0.12, yoyo: true, repeat: 1 },
            event.at,
          );
          return;
        }
        const seat = seats[event.seat];
        const gesture = table.seats[event.seat]?.gesture;
        if (!seat || !gesture) return;
        timeline.call(() => playGesture(seat, gesture), [], event.at);
        if (gesture === 'chips') timeline.call(() => playCue('chips'), [], event.at);
      });
      timeline.to({}, { duration: ROUND_SECONDS }, 0);
    },
    { scope, dependencies: [phase, round] },
  );

  const accuse = () => {
    if (picked === null) return;
    const result = judge(table, picked);
    if (result === 'correct') {
      playCue('correct');
      return onFound();
    }
    playCue('wrong');
    setChips((current) => Math.max(current - 1, 0));
    setVerdict(result);
    setPhase('feedback');
  };

  const watchAgain = () => {
    setPicked(null);
    setVerdict(null);
    setRound(ROUNDS);
    setPhase('watching');
  };

  const seatName = (index: number) => {
    if (index === LE_CHIFFRE_SEAT) return t('seatLeChiffre');
    return t('seat', { n: index + 1 });
  };

  return (
    <main className="screen poker" ref={scope}>
      <div className="poker__hud">
        <span>{t('round', { n: round, total: ROUNDS })}</span>
        <span className="poker__chips" role="img" aria-label={t('chipsLabel', { n: chips })}>
          {t('chips')}
          {Array.from({ length: START_CHIPS }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length chip counter
            <span key={i} className={`poker__chip ${i < chips ? '' : 'is-lost'}`} />
          ))}
        </span>
      </div>

      <h1 className="display poker__title">{t('question')}</h1>
      <p className="poker__hint">{t('observe')}</p>

      {/* biome-ignore lint/a11y/useSemanticElements: absolutely positioned seats need a positioned container, not a fieldset */}
      <div className="poker__table" role="group" aria-label={t('tableLabel')}>
        <div className="poker__cards" aria-hidden="true">
          <span data-card />
          <span data-card />
          <span data-card />
        </div>
        <div className="poker__case" aria-hidden="true">
          <div className="poker__glint" data-glint />
          <Briefcase open={false} />
        </div>
        {table.seats.map((seat) => {
          const position = SEAT_POSITIONS[seat.index] ?? { left: 50, top: 50 };
          return (
            <button
              key={seat.index}
              type="button"
              className="seat"
              style={{ left: `${position.left}%`, top: `${position.top}%` }}
              data-seat
              disabled={phase !== 'choosing'}
              aria-pressed={picked === seat.index}
              aria-label={seatName(seat.index)}
              onClick={() => setPicked(seat.index)}
            >
              <span className="seat__bubble" data-bubble aria-hidden="true">
                {t(`gestures.${seat.gesture}`)}
              </span>
              <PlayerSilhouette
                tear={seat.index === LE_CHIFFRE_SEAT}
                ring={picked === seat.index ? '#e0534a' : 'transparent'}
              />
            </button>
          );
        })}
      </div>

      {phase === 'feedback' && verdict && (
        <>
          <MoneypennyRadio>{`"${verdict === 'trap' ? t('trap') : t('wrong')}" ${t('replay')}`}</MoneypennyRadio>
          <button type="button" className="btn poker__watch" onClick={watchAgain}>
            {t('watchAgain')}
          </button>
        </>
      )}

      {phase !== 'feedback' && (
        <button
          type="button"
          className="btn poker__point"
          onClick={accuse}
          disabled={phase !== 'choosing' || picked === null}
        >
          {picked === null ? t('pickSomeone') : t('point', { who: seatName(picked) })}
        </button>
      )}
      {onEject && (
        <div className="perk-bar">
          <EjectorSeat onEject={onEject} />
        </div>
      )}
    </main>
  );
}

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import {
  type CSSProperties,
  forwardRef,
  type PointerEvent,
  type SyntheticEvent,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../analytics/track';
import { playCue } from '../audio/audio';
import { prefersReducedMotion } from '../motion';
import { useMission } from '../state/store';
import { CardView } from './CardView';
import { CARDS, type CardId, isUnlocked, type UnlockInputs, unreadCount } from './cards';
import './dossier.css';

type View = { kind: 'index' } | { kind: 'card'; index: number };

const SWIPE_THRESHOLD_PX = 50;

function useUnlockInputs(): UnlockInputs {
  const era = useMission((state) => state.era);
  const completed = useMission((state) => state.completed);
  const step = useMission((state) => state.step);
  const finishedAt = useMission((state) => state.finishedAt);
  return { era, completed, step, finishedAt };
}

function Grain() {
  return (
    <svg className="dossier__grain" aria-hidden="true">
      <filter id="dossier-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.15  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#dossier-grain)" />
    </svg>
  );
}

export interface DossierHandle {
  open: (card?: CardId) => void;
}

interface DossierProps {
  showTab?: boolean;
}

export const Dossier = forwardRef<DossierHandle, DossierProps>(function Dossier({ showTab = true }, ref) {
  const { t } = useTranslation('dossier');
  const mission = useUnlockInputs();
  const seenCards = useMission((state) => state.seenCards);
  const markCardSeen = useMission((state) => state.markCardSeen);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const swipeStart = useRef<number | null>(null);
  const [view, setView] = useState<View>({ kind: 'index' });
  const unlockedTotal = CARDS.filter((card) => isUnlocked(card, mission)).length;
  const unread = unreadCount(mission, seenCards);

  const currentCard = view.kind === 'card' ? CARDS[view.index] : undefined;
  const currentUnlocked = currentCard ? isUnlocked(currentCard, mission) : false;

  useEffect(() => {
    if (!currentCard || !currentUnlocked) return;
    markCardSeen(currentCard.id);
  }, [currentCard, currentUnlocked, markCardSeen]);

  const { contextSafe } = useGSAP({ scope: dialogRef });

  const open = contextSafe((card?: CardId) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const index = CARDS.findIndex((entry) => entry.id === card);
    setView(index >= 0 ? { kind: 'card', index } : { kind: 'index' });
    dialog.showModal();
    trackEvent('dossier_opened', { card: card ?? 'index' });
    playCue('paper');
    if (prefersReducedMotion()) return;
    gsap.fromTo(dialog, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
  });

  useImperativeHandle(ref, () => ({ open }), [open]);

  const close = contextSafe(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    playCue('paper');
    if (prefersReducedMotion()) return dialog.close();
    gsap.to(dialog, { yPercent: 100, duration: 0.3, ease: 'power2.in', onComplete: () => dialog.close() });
  });

  const showCard = contextSafe((index: number, direction: 1 | -1 = 1) => {
    setView({ kind: 'card', index });
    if (prefersReducedMotion()) return;
    requestAnimationFrame(() => {
      gsap.fromTo(
        cardRef.current,
        { x: 40 * direction, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
      );
    });
  });

  const step = (delta: 1 | -1) => {
    if (view.kind !== 'card') return;
    const index = view.index + delta;
    if (index < 0 || index >= CARDS.length) return;
    showCard(index, delta);
  };

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.clientX;
  };

  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;
    const dx = event.clientX - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    step(dx < 0 ? 1 : -1);
  };

  const onCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    close();
  };

  return (
    <>
      {showTab && (
        <button type="button" className="dossier-tab" onClick={() => open()} aria-label={t('open')}>
          <span>{t('tab')}</span>
          <span className="dossier-tab__count">
            · {t('countShort', { unlocked: unlockedTotal, total: CARDS.length })}
          </span>
          {unread > 0 && <span className="dossier-tab__badge">{t('unread', { count: unread })}</span>}
          <span aria-hidden="true">▲</span>
        </button>
      )}

      <dialog ref={dialogRef} className="dossier" aria-label={t('title')} onCancel={onCancel}>
        <div className="dossier__inner">
          <Grain />

          {view.kind === 'index' && (
            <>
              <div className="dossier__bar">
                <span>{t('count', { unlocked: unlockedTotal, total: CARDS.length })}</span>
                <button type="button" className="dossier__icon-btn" onClick={close} aria-label={t('close')}>
                  ✕
                </button>
              </div>
              <h2 className="display dossier__title">{t('title')}</h2>
              <p className="dossier__subtitle">{t('subtitle')}</p>
              <ol className="dossier__list">
                {CARDS.map((card, index) => {
                  const unlocked = isUnlocked(card, mission);
                  const fresh = unlocked && !seenCards.includes(card.id);
                  return (
                    <li key={card.id}>
                      <button
                        type="button"
                        className={`dossier__row ${unlocked ? '' : 'is-locked'}`}
                        style={{ '--card-color': card.color } as CSSProperties}
                        onClick={() => showCard(index)}
                      >
                        <span className="dossier__row-text">
                          <span className="dossier__row-number">
                            {t('cardNumber', { n: String(index + 1).padStart(2, '0') })}
                          </span>
                          <span className="dossier__row-title">{t(`cards.${card.id}.title`)}</span>
                        </span>
                        {fresh && <span className="dossier-tab__badge">{t('new')}</span>}
                        {!unlocked && <span className="dossier__row-tag">{t('classified')}</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          {view.kind === 'card' && currentCard && (
            <>
              <div className="dossier__bar">
                <button
                  type="button"
                  className="dossier__icon-btn"
                  onClick={() => setView({ kind: 'index' })}
                >
                  {t('back')}
                </button>
                <button type="button" className="dossier__icon-btn" onClick={close} aria-label={t('close')}>
                  ✕
                </button>
              </div>
              <div
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                style={{ display: 'flex', flex: 1 }}
              >
                <CardView
                  ref={cardRef}
                  card={currentCard}
                  number={view.index + 1}
                  unlocked={currentUnlocked}
                />
              </div>
              <nav className="dossier__nav" aria-label={t('title')}>
                <button type="button" onClick={() => step(-1)} disabled={view.index === 0}>
                  {t('previous')}
                </button>
                <span>{t('position', { n: view.index + 1, total: CARDS.length })}</span>
                <button type="button" onClick={() => step(1)} disabled={view.index === CARDS.length - 1}>
                  {t('next')}
                </button>
              </nav>
            </>
          )}
        </div>
      </dialog>
    </>
  );
});

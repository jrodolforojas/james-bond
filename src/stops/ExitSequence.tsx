import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Stamp } from '../components/Stamp';
import type { CardId } from '../dossier/cards';
import { Dossier, type DossierHandle } from '../dossier/Dossier';
import { prefersReducedMotion } from '../motion';
import './stops.css';

const EMBERS = [18, 46, 80, 120, 150, 176];
const LATE = ['[data-exit-stamp]', '[data-exit-card]', '[data-exit-continue]'];

interface ExitSequenceProps {
  hero: ReactNode;
  evidenceNumber?: number;
  cardId: CardId;
  cardTitle: string;
  continueLabel: string;
  accent: string;
  onContinue: () => void;
}

function burnTimeline(scope: HTMLElement | null, timeline: gsap.core.Timeline) {
  const burn = { value: 0 };
  const paper = scope?.querySelector<HTMLElement>('[data-exit-burn]');
  timeline
    .from('[data-exit-paper]', { opacity: 0, y: 20, duration: 0.4 })
    .to('[data-exit-edge]', { opacity: 1, duration: 0.15 })
    .to(burn, {
      value: 100,
      duration: 1.2,
      ease: 'power1.in',
      onUpdate: () => paper?.style.setProperty('--burn', String(burn.value)),
    })
    .fromTo(
      '[data-exit-ember]',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -120, x: 'random(-20, 20)', duration: 1.4, stagger: 0.1, ease: 'power1.out' },
      '<',
    )
    .to('[data-exit-edge]', { opacity: 0, duration: 0.2 })
    .fromTo(
      '[data-exit-stamp]',
      { opacity: 0, scale: 1.6 },
      { opacity: 1, scale: 1, duration: 0.16, ease: 'power4.in' },
    )
    .to(scope, { x: 4, duration: 0.04, yoyo: true, repeat: 3 });
}

export function ExitSequence({
  hero,
  evidenceNumber,
  cardId,
  cardTitle,
  continueLabel,
  accent,
  onContinue,
}: ExitSequenceProps) {
  const { t } = useTranslation();
  const scope = useRef<HTMLElement>(null);
  const dossier = useRef<DossierHandle>(null);
  const hasEvidence = evidenceNumber !== undefined;

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-exit-paper]', { opacity: 0 });
        gsap.to(LATE, { opacity: 1, duration: 0.3, stagger: 0.2, delay: 0.8 });
        return;
      }
      const timeline = gsap.timeline({ delay: hasEvidence ? 1.6 : 1 });
      if (hasEvidence) burnTimeline(scope.current, timeline);
      timeline
        .fromTo(
          '[data-exit-card]',
          { opacity: 0, y: 30, rotation: -4 },
          { opacity: 1, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.6)' },
          '+=0.3',
        )
        .to('[data-exit-continue]', { opacity: 1, duration: 0.4 }, '+=0.2');
    },
    { scope },
  );

  return (
    <main className="screen exit" ref={scope}>
      <div className="exit__hero">{hero}</div>

      {hasEvidence && (
        <>
          <div className="exit__burn" data-exit-burn aria-hidden="true">
            <div className="exit__paper" data-exit-paper>
              <span style={{ width: '40%' }} />
              <span style={{ width: '90%' }} />
              <span style={{ width: '70%' }} />
              <span style={{ width: '82%' }} />
            </div>
            <div className="exit__edge" data-exit-edge />
            {EMBERS.map((left) => (
              <span key={left} className="exit__ember" style={{ left }} data-exit-ember />
            ))}
          </div>

          <div className="exit__stamp" data-exit-stamp>
            <Stamp>
              {t('evidenceDestroyed', { n: evidenceNumber })}
              <br />
              {t('evidenceDestroyedLine2')}
            </Stamp>
          </div>
        </>
      )}

      <button
        type="button"
        className="exit__card"
        data-exit-card
        onClick={() => dossier.current?.open(cardId)}
      >
        <span className="exit__card-label">{t('cardUnlocked')}</span>
        <span className="display exit__card-title">{cardTitle}</span>
        <span className="exit__card-read">{t('readCard')}</span>
      </button>

      <button
        type="button"
        className="btn exit__continue"
        data-exit-continue
        onClick={onContinue}
        style={{ background: accent, color: 'var(--ink)' }}
      >
        {continueLabel}
      </button>

      <Dossier ref={dossier} showTab={false} />
    </main>
  );
}

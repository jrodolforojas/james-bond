import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../analytics/track';
import { prefersReducedMotion } from '../motion';
import { STOP_COLORS, type StopId, stopNumber } from './catalog';
import './stops.css';
import { playCue } from '../audio/audio';

const HOLD_SECONDS = 1.6;

interface StopTitleCardProps {
  stop: StopId;
  onDone: () => void;
}

export function StopTitleCard({ stop, onDone }: StopTitleCardProps) {
  const { t } = useTranslation(['common', 'map']);
  const scope = useRef<HTMLButtonElement>(null);
  const colors = STOP_COLORS[stop];

  useGSAP(
    () => {
      trackEvent('stop_started', { stop });
      if (stop !== 'scotland') playCue('thud');
      if (prefersReducedMotion()) {
        gsap.delayedCall(1, onDone);
        return;
      }
      gsap
        .timeline({ onComplete: onDone })
        .from('[data-title-part]', { opacity: 0, y: 14, duration: 0.6, stagger: 0.18, ease: 'power2.out' })
        .to({}, { duration: HOLD_SECONDS })
        .to('[data-title-part]', { opacity: 0, y: -10, duration: 0.35, stagger: 0.05, ease: 'power2.in' });
    },
    { scope },
  );

  return (
    <button
      type="button"
      ref={scope}
      className="screen title-card"
      style={{ background: colors.background, color: colors.foreground }}
      onClick={onDone}
    >
      <span className="eyebrow" data-title-part>
        {t('stop', { n: stopNumber(stop) })}
      </span>
      <span className="display title-card__name" data-title-part>
        {t(`map:stops.${stop}.name`)}
      </span>
      <span className="title-card__subtitle" data-title-part>
        {t(`map:stops.${stop}.subtitle`)}
      </span>
    </button>
  );
}

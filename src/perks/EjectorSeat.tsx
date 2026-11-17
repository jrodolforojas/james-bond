import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { prefersReducedMotion } from '../motion';
import { useMission } from '../state/store';
import { usePerks } from './usePerks';
import './perks.css';

interface EjectorSeatProps {
  onEject: () => void;
}

export function EjectorSeat({ onEject }: EjectorSeatProps) {
  const { t } = useTranslation();
  const perks = usePerks();
  const used = useMission((state) => state.ejectorUsed);
  const spend = useMission((state) => state.spendEjectorSeat);
  const scope = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope });

  const eject = contextSafe(() => {
    const finish = () => {
      spend();
      onEject();
    };
    if (prefersReducedMotion()) return finish();
    gsap
      .timeline({ onComplete: finish })
      .to('[data-seat-icon]', { y: -400, rotation: -20, duration: 0.6, ease: 'power3.in' });
  });

  if (!perks.ejectorSeat || used) return null;
  return (
    <button
      type="button"
      className="perk-btn perk-btn--eject"
      ref={scope}
      onClick={eject}
      aria-label={t('ejectorLabel')}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="perk-btn__icon" data-seat-icon>
        <path
          d="M7 3 H15 L16 13 H6 Z M5 14 H17 V17 H5 Z M8 18 V22 M14 18 V22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      {t('ejector')}
    </button>
  );
}

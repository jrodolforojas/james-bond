import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { prefersReducedMotion } from '../../motion';

interface TvOffProps {
  onDone: () => void;
}

export function TvOff({ onDone }: TvOffProps) {
  const { t } = useTranslation('jamaica');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-screen]', { opacity: 0 });
        gsap.delayedCall(0.6, onDone);
        return;
      }
      gsap
        .timeline({ onComplete: onDone })
        .to('[data-screen]', { x: 6, duration: 0.05, yoyo: true, repeat: 5 })
        .to('[data-screen]', { scaleY: 0.03, duration: 0.35, ease: 'power3.in' }, '+=0.2')
        .to('[data-screen]', { scaleX: 0, duration: 0.2, ease: 'power2.in' })
        .fromTo('[data-dot]', { opacity: 1, scale: 1.4 }, { opacity: 0, scale: 0.2, duration: 0.4 }, '<0.1')
        .to({}, { duration: 1 });
    },
    { scope },
  );

  return (
    <main className="screen tv-off" ref={scope} role="img" aria-label={t('tvLabel')}>
      <div className="tv-off__screen" data-screen />
      <div className="tv-off__dot" data-dot />
    </main>
  );
}

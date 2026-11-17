import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { prefersReducedMotion } from '../../motion';

const EDGE_LAYERS = Array.from({ length: 12 }, (_, i) => i - 5.5);

interface ChipToCoinProps {
  onDone: () => void;
}

export function ChipToCoin({ onDone }: ChipToCoinProps) {
  const { t } = useTranslation('montenegro');
  const scope = useRef<HTMLElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const disc = discRef.current;
      if (!disc) return;
      const becomeCoin = () => disc.classList.add('is-coin');
      if (prefersReducedMotion()) {
        gsap
          .timeline({ onComplete: onDone })
          .to(disc, { opacity: 0, duration: 0.25, delay: 0.4 })
          .add(becomeCoin)
          .to(disc, { opacity: 1, duration: 0.25 })
          .to(scope.current, { backgroundColor: '#d4a017', duration: 0.3 }, '+=0.3');
        return;
      }
      gsap.set(disc, { y: 220, rotationX: 72, scale: 0.7 });
      gsap
        .timeline({ onComplete: onDone })
        .to(disc, { y: 0, rotationX: 0, scale: 1, duration: 0.7, ease: 'power3.out' })
        .to(disc, { rotationY: 450, duration: 1.3, ease: 'power2.in' })
        .add(becomeCoin)
        .set(disc, { rotationY: -90 })
        .to('[data-flash]', { opacity: 0.55, duration: 0.06, yoyo: true, repeat: 1 }, '<')
        .to(scope.current, { backgroundColor: '#5c430a', duration: 0.4 }, '<')
        .to(disc, { rotationY: 0, duration: 0.9, ease: 'power3.out' }, '<')
        .to(disc, { scale: 14, duration: 0.9, ease: 'power2.in' }, '+=0.25')
        .to(scope.current, { backgroundColor: '#d4a017', duration: 0.3 }, '-=0.3')
        .set(disc, { opacity: 0 });
    },
    { scope },
  );

  return (
    <main className="screen chip-coin" ref={scope} role="img" aria-label={t('transitionLabel')}>
      <div className="disc" ref={discRef} aria-hidden="true">
        {EDGE_LAYERS.map((z) => (
          <div key={z} className="disc__layer" style={{ transform: `translateZ(${z}px)` }} />
        ))}
        <div className="disc__face disc__face--front" />
        <div className="disc__face disc__face--back" />
      </div>
      <div className="chip-coin__flash" data-flash aria-hidden="true" />
    </main>
  );
}

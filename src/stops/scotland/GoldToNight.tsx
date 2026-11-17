import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { prefersReducedMotion } from '../../motion';

const FLAKES = Array.from({ length: 24 }, (_, i) => ({ left: (i * 37) % 100, delay: (i * 0.29) % 2.4 }));

interface GoldToNightProps {
  label: string;
  onDone: () => void;
}

export function GoldToNight({ label, onDone }: GoldToNightProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap
          .timeline({ onComplete: onDone })
          .to(scope.current, { backgroundColor: '#0b1a33', duration: 1.2 })
          .set('[data-digits]', { opacity: 0 }, 0)
          .to('[data-hill]', { opacity: 1, duration: 0.6 })
          .to({}, { duration: 1.2 });
        return;
      }
      const timeline = gsap.timeline({ onComplete: onDone });
      timeline
        .to(scope.current, { backgroundColor: '#8a7a4a', duration: 0.8, ease: 'none' })
        .to('[data-digits]', { opacity: 0.4, duration: 0.8 }, '<')
        .to(scope.current, { backgroundColor: '#2a2a30', duration: 0.8, ease: 'none' })
        .to('[data-digits]', { opacity: 0, duration: 0.6 }, '<')
        .to(scope.current, { backgroundColor: '#0b1a33', duration: 0.8, ease: 'none' })
        .to('[data-hill]', { opacity: 1, duration: 1.2 }, '<0.4');
      gsap.utils.toArray<HTMLElement>('[data-flake]', scope.current).forEach((flake, i) => {
        const delay = 2.2 + (FLAKES[i]?.delay ?? 0);
        timeline.fromTo(
          flake,
          { opacity: 0, y: 0 },
          { opacity: 0.8, y: '110vh', x: 'random(-30, 30)', duration: 5, ease: 'none' },
          delay,
        );
      });
      timeline.to({}, { duration: 0.1 }, 5.4);
    },
    { scope },
  );

  return (
    <main className="screen gold-night" ref={scope} role="img" aria-label={label}>
      <span className="gold-night__digits" data-digits aria-hidden="true">
        0:07
      </span>
      <div className="gold-night__hill" data-hill aria-hidden="true" />
      {FLAKES.map((flake) => (
        <span
          key={flake.left}
          className="gold-night__flake"
          style={{ left: `${flake.left}%` }}
          data-flake
          aria-hidden="true"
        />
      ))}
    </main>
  );
}

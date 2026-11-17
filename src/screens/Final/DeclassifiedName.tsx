import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { playCue } from '../../audio/audio';
import { prefersReducedMotion } from '../../motion';

const LETTER_STAGGER_S = 0.12;
const DEBRIS_PER_LETTER = 4;
const START_DELAY_S = 2.2;

interface DeclassifiedNameProps {
  name: string;
  onRevealed: () => void;
}

function raggedClip(index: number): string {
  const j = (offset: number) => (((index * 37 + offset * 11) % 10) + 0.5).toFixed(1);
  return `polygon(0 ${j(1)}%, 100% ${j(2)}%, 100% ${100 - Number(j(3))}%, 0 ${100 - Number(j(4))}%)`;
}

export function DeclassifiedName({ name, onRevealed }: DeclassifiedNameProps) {
  const scope = useRef<HTMLSpanElement>(null);
  const letters = [...name.toUpperCase()];

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const chars = gsap.utils.toArray<HTMLElement>('[data-char]', root);
      const inks = gsap.utils.toArray<HTMLElement>('[data-ink]', root);
      if (prefersReducedMotion()) {
        gsap
          .timeline({ delay: 1, onComplete: onRevealed })
          .to('[data-bar]', { opacity: 0, duration: 0.3 })
          .set(inks, { opacity: 0 })
          .fromTo(chars, { visibility: 'visible', opacity: 0 }, { opacity: 1, duration: 0.3 });
        return;
      }
      const first = chars[0]?.getBoundingClientRect();
      const last = chars[chars.length - 1]?.getBoundingClientRect();
      const width = first && last ? last.right - first.left : 120;
      const timeline = gsap
        .timeline({ delay: START_DELAY_S, onComplete: onRevealed })
        .to(root, { x: 3, duration: 0.05, yoyo: true, repeat: 3 })
        .to('[data-bar]', { width, duration: 0.45, ease: 'power2.inOut' })
        .set(chars, { visibility: 'visible' })
        .set('[data-bar]', { display: 'none' });
      inks.forEach((ink, i) => {
        const at = `erase+=${i * LETTER_STAGGER_S}`;
        timeline.add(() => playCue('key'), at);
        timeline.to(ink, { scaleX: 0, duration: 0.18, ease: 'power1.in' }, at);
        timeline.fromTo(
          ink.parentElement?.querySelectorAll('[data-debris]') ?? [],
          { opacity: 1, y: 0, x: 0, rotation: 0 },
          {
            opacity: 0,
            y: 'random(30, 70)',
            x: 'random(-10, 10)',
            rotation: 'random(0, 180)',
            duration: 0.7,
            ease: 'power2.in',
          },
          at,
        );
      });
    },
    { scope },
  );

  return (
    <span className="declassified" ref={scope}>
      <span className="sr-only">{name}</span>
      <span className="declassified__bar" data-bar aria-hidden="true" />
      {letters.map((letter, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: letters repeat; position is the identity
        <span key={i} className="declassified__char" data-char aria-hidden="true">
          {letter}
          <span className="declassified__ink" style={{ clipPath: raggedClip(i) }} data-ink />
          {Array.from({ length: DEBRIS_PER_LETTER }, (_, d) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative debris
            <span key={d} className="declassified__debris" style={{ left: `${d * 25}%` }} data-debris />
          ))}
        </span>
      ))}
    </span>
  );
}

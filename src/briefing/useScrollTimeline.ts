import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { prefersReducedMotion } from '../motion';

export type BuildTimeline = (timeline: gsap.core.Timeline) => void;

export function useScrollTimeline(build: BuildTimeline) {
  const scope = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 60%', toggleActions: 'play none none reverse' },
      });
      build(timeline);
    },
    { scope },
  );
  return scope;
}

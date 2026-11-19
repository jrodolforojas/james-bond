import type { ReactNode } from 'react';
import type { StopId } from '../stops/catalog';
import { type BuildTimeline, useScrollTimeline } from './useScrollTimeline';

export interface OpeningCopy {
  eyebrow: string;
  titleStart: string;
  titleEm: string;
  theme: string;
}

interface StopOpeningProps {
  stop: StopId;
  copy: OpeningCopy;
  scene: ReactNode;
  voice: ReactNode;
  build?: BuildTimeline;
}

export function StopOpening({ stop, copy, scene, voice, build }: StopOpeningProps) {
  const scope = useScrollTimeline((timeline) => {
    build?.(timeline);
    timeline.from(
      '[data-bf-in]',
      { opacity: 0, y: 24, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
      0.1,
    );
  });

  return (
    <section className={`bf-panel bf-opening bf-opening--${stop}`} ref={scope}>
      <div className="bf-copy">
        <p className="eyebrow bf-eyebrow" data-bf-in>
          {copy.eyebrow}
        </p>
        <h2 className="display bf-title" data-bf-in>
          {copy.titleStart}
          <em>{copy.titleEm}</em>
        </h2>
        <p className="bf-theme" data-bf-in>
          {copy.theme}
        </p>
        <div className="bf-voice" data-bf-in>
          {voice}
        </div>
      </div>
      <div className="bf-visual">{scene}</div>
    </section>
  );
}

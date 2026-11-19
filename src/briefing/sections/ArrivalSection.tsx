import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';

const TYPE_SECONDS_PER_CHAR = 0.035;

function typeInto(timeline: gsap.core.Timeline, element: HTMLElement) {
  const text = element.dataset.text ?? '';
  const counter = { chars: 0 };
  timeline.to(counter, {
    chars: text.length,
    duration: text.length * TYPE_SECONDS_PER_CHAR,
    ease: 'none',
    onUpdate: () => {
      element.textContent = text.slice(0, Math.round(counter.chars));
    },
  });
}

export function ArrivalSection() {
  const { t } = useTranslation('arrival');
  const { t: tb } = useTranslation('briefing');
  const scope = useRef<HTMLElement>(null);
  const lines = t('lines', { returnObjects: true });

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;
      const typed = gsap.utils.toArray<HTMLElement>('[data-type]', root);
      const value = root.querySelector<HTMLElement>('[data-status-value]');
      if (!value) return;
      typed.forEach((element) => {
        element.textContent = '';
      });
      gsap.set(value, { opacity: 0 });
      gsap.set('[data-reveal]', { opacity: 0, y: 10 });

      const timeline = gsap.timeline({ delay: 0.6 });
      typed.forEach((element) => {
        typeInto(timeline, element);
        timeline.to({}, { duration: 0.18 });
      });
      timeline
        .set(value, { opacity: 1 })
        .add(() => value.classList.add('is-glitching'))
        .to('[data-reveal]', { opacity: 1, y: 0, duration: 0.5, stagger: 0.3, ease: 'power2.out' }, '+=0.9');
    },
    { scope },
  );

  return (
    <section className="bf-panel bf-arrival" ref={scope}>
      <div className="arrival__scanlines" aria-hidden="true" />
      <div className="bf-arrival__inner">
        <h1 className="sr-only">{tb('pageTitle')}</h1>
        <div className="arrival__channel" aria-hidden="true">
          <span>{t('channel')}</span>
          <span className="arrival__rec">● REC</span>
        </div>
        <div className="arrival__terminal">
          {lines.map((line) => (
            <span key={line} className="arrival__line" data-type data-text={line}>
              {line}
            </span>
          ))}
          <span className="arrival__status">
            <span data-type data-text={t('statusLabel')}>
              {t('statusLabel')}
            </span>
            <span className="arrival__value" data-status-value>
              {t('statusValue')}
            </span>
            <span className="arrival__cursor" aria-hidden="true" />
          </span>
        </div>
        <div data-reveal>
          <MoneypennyRadio>{`"${t('message')}"`}</MoneypennyRadio>
        </div>
      </div>
      <p className="bf-scroll" data-reveal>
        {tb('scroll')} ↓
      </p>
    </section>
  );
}

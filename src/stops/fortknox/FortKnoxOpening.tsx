import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FortKnoxScene } from '../../art/FortKnoxScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';

interface FortKnoxOpeningProps {
  onEnter: () => void;
}

export function FortKnoxOpening({ onEnter }: FortKnoxOpeningProps) {
  const { t } = useTranslation('fortknox');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .from('[data-villain]', { x: -30, opacity: 0, duration: 0.8, ease: 'power2.out' })
        .from('[data-henchman]', { x: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '<0.15')
        .from('[data-opening-reveal]', { opacity: 0, y: 10, duration: 0.5, stagger: 0.2 }, '-=0.2');
    },
    { scope },
  );

  const { contextSafe } = useGSAP({ scope });

  const enter = contextSafe(() => {
    if (prefersReducedMotion()) return onEnter();
    gsap
      .timeline({ onComplete: onEnter })
      .to('[data-villain]', { x: -120, opacity: 0, duration: 0.5, ease: 'power2.in' })
      .to('[data-henchman]', { x: 120, opacity: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .to('.fk-scene', { scale: 1.6, transformOrigin: '73% 42%', duration: 0.6, ease: 'power2.in' }, '<0.1');
  });

  return (
    <main className="screen fk-opening" ref={scope}>
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="display fk-opening__title">
        {t('titleStart')}
        <em>{t('titleEm')}</em>
      </h1>
      <p className="fk-opening__theme">{t('theme')}</p>
      <FortKnoxScene label={t('sceneLabel')} />
      <div className="fk-opening__radio" data-opening-reveal>
        <MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>
      </div>
      <button type="button" className="btn fk-opening__enter" data-opening-reveal onClick={enter}>
        {t('enter')}
      </button>
    </main>
  );
}

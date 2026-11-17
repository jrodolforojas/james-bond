import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MontenegroScene } from '../../art/MontenegroScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';

interface MontenegroOpeningProps {
  onSit: () => void;
}

export function MontenegroOpening({ onSit }: MontenegroOpeningProps) {
  const { t } = useTranslation('montenegro');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .from('[data-chandelier]', { y: -30, opacity: 0, duration: 0.8, ease: 'power2.out' })
        .from('[data-le-chiffre]', { opacity: 0, duration: 1, ease: 'sine.inOut' }, '-=0.3')
        .fromTo(
          '[data-tear]',
          { scaleY: 0, transformOrigin: '50% 0%' },
          { scaleY: 1, duration: 0.8, ease: 'power1.in' },
        )
        .from('[data-reveal]', { opacity: 0, y: 10, duration: 0.5, stagger: 0.25 }, '-=0.3');
    },
    { scope },
  );

  return (
    <main className="screen mtn-opening" ref={scope}>
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="display mtn-opening__title">
        {t('titleStart')}
        <em>{t('titleEm')}</em>
      </h1>
      <p className="mtn-opening__theme">{t('theme')}</p>
      <MontenegroScene label={t('sceneLabel')} />
      <div data-reveal>
        <MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>
      </div>
      <button type="button" className="btn mtn-opening__sit" data-reveal onClick={onSit}>
        {t('sit')}
      </button>
    </main>
  );
}

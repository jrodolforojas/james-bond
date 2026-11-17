import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { JamaicaScene } from '../../art/JamaicaScene';
import { useAmbience } from '../../audio/useAmbience';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { prefersReducedMotion } from '../../motion';

interface JamaicaOpeningProps {
  onFace: () => void;
}

export function JamaicaOpening({ onFace }: JamaicaOpeningProps) {
  const { t } = useTranslation('jamaica');
  const scope = useRef<HTMLElement>(null);
  useAmbience('waves');

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .from('[data-sun]', { y: 40, opacity: 0, duration: 1, ease: 'power2.out' })
        .from('[data-island]', { x: 40, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
        .from('[data-palm]', { x: -60, duration: 0.8, ease: 'power3.out' }, '<')
        .from('[data-dr-no]', { opacity: 0, duration: 1, ease: 'sine.inOut' }, '-=0.2')
        .from('[data-reveal]', { opacity: 0, y: 10, duration: 0.5, stagger: 0.25 }, '-=0.3');
      gsap.to('[data-palm]', {
        rotation: 2,
        transformOrigin: '40px 300px',
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    },
    { scope },
  );

  return (
    <main className="screen jam-opening" ref={scope}>
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="display jam-opening__title">
        {t('titleStart')}
        <em>{t('titleEm')}</em>
      </h1>
      <p className="jam-opening__theme">{t('theme')}</p>
      <JamaicaScene label={t('sceneLabel')} />
      <div data-reveal>
        <MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>
      </div>
      <button type="button" className="btn jam-opening__face" data-reveal onClick={onFace}>
        {t('face')}
      </button>
    </main>
  );
}

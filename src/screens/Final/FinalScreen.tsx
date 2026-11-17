import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AgentSheet, type AgentSheetHandle } from '../../agent/AgentSheet';
import { useArchivePhoto } from '../../agent/useArchivePhoto';
import { trackEvent } from '../../analytics/track';
import { playCue } from '../../audio/audio';
import { useMusic } from '../../audio/useAmbience';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { NEW_007_NAME } from '../../config';
import { Dossier } from '../../dossier/Dossier';
import { transition } from '../../flow/navigate';
import { prefersReducedMotion } from '../../motion';
import { ageOn, countryName, formatDate, REVEAL } from '../../reveal';
import { ShareSheet, type ShareSheetHandle } from '../../share/ShareSheet';
import { useMission } from '../../state/store';
import { DeclassifiedName } from './DeclassifiedName';
import './final.css';

const CTAS = [
  { id: 'films', href: 'https://www.007.com' },
  { id: 'vehicles', href: 'https://www.007.com' },
  { id: 'experiences', href: 'https://www.007.com' },
  { id: 'store', href: 'https://www.007store.com' },
] as const;

const SMOKE_RIBBONS = [
  { d: 'M-20 300 C 60 240, 120 360, 200 290 S 340 220, 410 280', width: 22 },
  { d: 'M-20 360 C 80 320, 140 410, 230 350 S 360 300, 410 340', width: 14 },
  { d: 'M20 200 C 90 160, 150 240, 220 190 S 330 140, 400 180', width: 8 },
];

export function FinalScreen() {
  const { t, i18n } = useTranslation(['final', 'share', 'agent']);
  const finishMission = useMission((state) => state.finishMission);
  const reset = useMission((state) => state.reset);
  const scope = useRef<HTMLElement>(null);
  useMusic();
  const shareSheet = useRef<ShareSheetHandle>(null);
  const agentSheet = useRef<AgentSheetHandle>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const photoUrl = useArchivePhoto(REVEAL?.photo?.src);
  const { contextSafe } = useGSAP({ scope });

  const revealed = contextSafe(() => {
    setIsRevealed(true);
    playCue('stamp');
    gsap.fromTo(
      '[data-final-stamp]',
      { opacity: 0, scale: 1.6 },
      { opacity: 0.92, scale: 1, duration: 0.18, ease: 'power4.in' },
    );
    gsap.to('[data-figure]', { opacity: 0, duration: 0.8, ease: 'sine.in' });
    gsap.fromTo(
      '[data-final-photo]',
      { opacity: 0, scale: 1.12, rotate: -4 },
      { opacity: 1, scale: 1, rotate: 3, duration: 0.9, delay: 0.2, ease: 'power3.out' },
    );
    gsap.to('[data-final-name]', { opacity: 1, duration: 1.2, delay: 0.4, ease: 'sine.out' });
    gsap.to('[data-fact]', { opacity: 1, duration: 0.5, stagger: 0.3, delay: 0.6 });
    playCue('tone');
  });

  useEffect(() => {
    finishMission();
  }, [finishMission]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .from('[data-page]', { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power2.out' })
        .from(
          '[data-smoke]',
          { opacity: 0, x: (i) => (i % 2 ? 60 : -60), duration: 1.4, stagger: 0.2, ease: 'sine.out' },
          '+=0.2',
        )
        .from('[data-figure]', { opacity: 0, duration: 1.6, ease: 'sine.inOut' }, '-=0.8')
        .from('[data-final-reveal]', { opacity: 0, y: 10, duration: 0.6, stagger: 0.4 }, '+=0.2');
      gsap.to('[data-smoke]', {
        x: (i) => (i % 2 ? -18 : 18),
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2,
      });
      gsap.to('[data-figure]', {
        scale: 1.01,
        transformOrigin: '50% 100%',
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 3,
      });
    },
    { scope },
  );

  return (
    <main className="screen final" ref={scope}>
      <svg className="final__silhouette" viewBox="0 0 390 420" role="img" aria-label={t('silhouetteLabel')}>
        <g fill="none" stroke="#f5f5f5" strokeLinecap="round" opacity="0.18">
          {SMOKE_RIBBONS.map((ribbon) => (
            <path key={ribbon.d} d={ribbon.d} strokeWidth={ribbon.width} data-smoke />
          ))}
        </g>
        <g transform="translate(115 30)" data-figure>
          <ellipse cx="80" cy="52" rx="27" ry="33" fill="#f5f5f5" />
          <path
            d="M52 92 Q80 102 108 92 L140 110 Q156 118 158 140 L162 380 L-2 380 L2 140 Q4 118 20 110 Z"
            fill="#f5f5f5"
          />
          <path d="M68 96 L80 132 L92 96 Z" fill="#000" />
        </g>
      </svg>
      {photoUrl && (
        <figure className="final__photo" data-final-photo aria-hidden={!isRevealed}>
          <img src={photoUrl} alt={t('photoAlt', { name: NEW_007_NAME })} />
        </figure>
      )}
      {NEW_007_NAME && (
        <p className="final__name" data-final-name aria-hidden="true">
          {NEW_007_NAME}
        </p>
      )}

      <article className="final__page" data-page>
        <h1 className="display final__agent">{t('agent')}</h1>
        <p style={{ margin: 0 }}>
          {t('identity')}{' '}
          {NEW_007_NAME ? (
            <DeclassifiedName name={NEW_007_NAME} onRevealed={revealed} />
          ) : (
            <span className="redacted" role="img" aria-label={t('hiddenIdentity')}>
              ██████████████
            </span>
          )}
        </p>
        {REVEAL && (
          <>
            <p className="final__fact" data-fact style={{ margin: 0 }}>
              {t('age')} {ageOn(REVEAL.birthDate, new Date()) ?? '—'}
            </p>
            <p className="final__fact" data-fact style={{ margin: 0 }}>
              {t('country')} {countryName(REVEAL.country, i18n.language)}
            </p>
          </>
        )}
        <p style={{ margin: 0 }}>{isRevealed ? t('statusRevealed') : t('status')}</p>
        <p style={{ margin: 0 }}>
          {isRevealed && REVEAL
            ? t('clearanceRevealed', { date: formatDate(REVEAL.announcedOn, i18n.language) })
            : t('clearance')}
        </p>
        {NEW_007_NAME && (
          <span className="stamp final__stamp" data-final-stamp aria-hidden="true">
            {t('declassified')}
          </span>
        )}
      </article>

      <div className="final__radio" data-final-reveal>
        <MoneypennyRadio>{`"${isRevealed ? t('moneypennyRevealed') : t('moneypenny')}"`}</MoneypennyRadio>
      </div>

      <button
        type="button"
        className="btn final__card"
        data-final-reveal
        onClick={() => shareSheet.current?.open()}
      >
        {t('share:open')}
      </button>

      <button
        type="button"
        className="btn btn--outline final__agent-btn"
        data-final-reveal
        onClick={() => agentSheet.current?.open()}
      >
        {t('agent:open')}
      </button>

      <nav className="final__ctas" data-final-reveal aria-label={t('ctaTitle')}>
        <p className="eyebrow final__ctas-title">{t('ctaTitle')}</p>
        <ul>
          {CTAS.map((cta) => (
            <li key={cta.id}>
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_clicked', { cta: cta.id })}
              >
                <span className="final__cta-kicker">{t(`ctas.${cta.id}.kicker`)}</span>
                <span className="final__cta-label">{t(`ctas.${cta.id}.label`)}</span>
                <span className="sr-only">{t('newTab')}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="btn btn--outline final__restart"
        data-final-reveal
        onClick={() => transition(reset)}
      >
        {t('restart')}
      </button>

      <ShareSheet ref={shareSheet} />
      <AgentSheet ref={agentSheet} />
      <Dossier />
    </main>
  );
}

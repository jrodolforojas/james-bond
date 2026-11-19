import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { useArchivePhoto } from '../../agent/useArchivePhoto';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { NEW_007_NAME } from '../../config';
import { prefersReducedMotion } from '../../motion';
import { ageOn, countryName, formatDate, REVEAL } from '../../reveal';
import { FinalCredits } from '../../screens/Final/FinalCredits';
import { useScrollTimeline } from '../useScrollTimeline';

const SMOKE_RIBBONS = [
  { d: 'M-20 300 C 60 240, 120 360, 200 290 S 340 220, 410 280', width: 22 },
  { d: 'M-20 360 C 80 320, 140 410, 230 350 S 360 300, 410 340', width: 14 },
  { d: 'M20 200 C 90 160, 150 240, 220 190 S 330 140, 400 180', width: 8 },
];

function RevealedName({ name }: { name: string }) {
  return (
    <span className="bf-redact">
      {name.toUpperCase()}
      <span className="bf-redact__bar" data-redaction aria-hidden="true" />
    </span>
  );
}

export function FinalSection() {
  const { t, i18n } = useTranslation('final');
  const { t: tb } = useTranslation('briefing');
  const photo = REVEAL?.photo;
  const photoUrl = useArchivePhoto(photo?.src);
  const still = prefersReducedMotion();

  const scope = useScrollTimeline((timeline) => {
    gsap.to('[data-smoke]', {
      x: (i) => (i % 2 ? -18 : 18),
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    timeline
      .from('[data-page]', { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power2.out' }, 0)
      .from('[data-figure]', { opacity: 0, duration: 1.2, ease: 'sine.inOut' }, 0.2)
      .to('[data-redaction]', { scaleX: 0, duration: 0.9, ease: 'power3.inOut' }, '+=0.2')
      .fromTo(
        '[data-final-stamp]',
        { opacity: 0, scale: 1.6 },
        { opacity: 0.92, scale: 1, duration: 0.18, ease: 'power4.in' },
      )
      .to('[data-figure]', { opacity: 0, duration: 0.6, ease: 'sine.in' }, '<')
      .fromTo(
        '[data-final-photo]',
        { opacity: 0, scale: 1.12, rotate: -4 },
        { opacity: 1, scale: 1, rotate: 3, duration: 0.9, ease: 'power3.out' },
        '<0.1',
      )
      .to('[data-final-name]', { opacity: 1, duration: 0.8 }, '<0.3')
      .to('[data-fact]', { opacity: 1, duration: 0.4, stagger: 0.2 }, '<')
      .from('[data-final-reveal]', { opacity: 0, y: 12, duration: 0.5, stagger: 0.2 }, '-=0.2');
  });

  const classes = ['bf-panel', 'bf-final'];
  if (still) classes.push('is-static');
  if (photo) classes.push('has-photo');

  return (
    <section className={classes.join(' ')} ref={scope}>
      <div className="bf-final__visual">
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
        {photo && (
          <figure className="final__photo" data-final-photo>
            <img src={photoUrl ?? photo.src} alt={t('photoAlt', { name: NEW_007_NAME })} />
          </figure>
        )}
        {NEW_007_NAME && (
          <p className="final__name" data-final-name aria-hidden="true">
            {NEW_007_NAME}
          </p>
        )}
      </div>

      <div className="bf-final__copy">
        <article className="final__page" data-page>
          <h2 className="display final__agent">{t('agent')}</h2>
          <p>
            {t('identity')}{' '}
            {NEW_007_NAME ? (
              <RevealedName name={NEW_007_NAME} />
            ) : (
              <span className="redacted" role="img" aria-label={t('hiddenIdentity')}>
                ██████████████
              </span>
            )}
          </p>
          {REVEAL && (
            <>
              <p className="final__fact" data-fact>
                {t('age')} {ageOn(REVEAL.birthDate, new Date()) ?? '—'}
              </p>
              <p className="final__fact" data-fact>
                {t('country')} {countryName(REVEAL.country, i18n.language)}
              </p>
            </>
          )}
          <p>{REVEAL ? t('statusRevealed') : t('status')}</p>
          <p>
            {REVEAL
              ? t('clearanceRevealed', { date: formatDate(REVEAL.announcedOn, i18n.language) })
              : t('clearance')}
          </p>
          {NEW_007_NAME && (
            <span className="stamp final__stamp" data-final-stamp aria-hidden="true">
              {t('declassified')}
            </span>
          )}
        </article>
        <div data-final-reveal>
          <MoneypennyRadio>{`"${REVEAL ? t('moneypennyRevealed') : t('moneypenny')}"`}</MoneypennyRadio>
        </div>
      </div>

      <div className="bf-final__footer" data-final-reveal>
        <FinalCredits />
        <p className="bf-end">{tb('end')}</p>
      </div>
    </section>
  );
}

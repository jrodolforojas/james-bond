import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { Briefcase, MontenegroScene, PlayerSilhouette } from '../../art/MontenegroScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { SEAT_POSITIONS } from '../../stops/montenegro/PokerTable';
import { GESTURES, LE_CHIFFRE_SEAT } from '../../stops/montenegro/rules';
import { GamePanel } from '../GamePanel';
import { StopOpening } from '../StopOpening';

export function MontenegroSection() {
  const { t } = useTranslation('montenegro');

  return (
    <>
      <StopOpening
        stop="montenegro"
        copy={{
          eyebrow: t('eyebrow'),
          titleStart: t('titleStart'),
          titleEm: t('titleEm'),
          theme: t('theme'),
        }}
        scene={<MontenegroScene label={t('sceneLabel')} />}
        voice={<MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>}
        build={(timeline) => {
          timeline
            .from('[data-chandelier]', { y: -40, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0)
            .from('[data-le-chiffre]', { opacity: 0, duration: 1, ease: 'sine.inOut' }, 0.4)
            .fromTo(
              '[data-tear]',
              { scaleY: 0, transformOrigin: '50% 0%' },
              { scaleY: 1, duration: 0.8, ease: 'power1.in' },
              1.1,
            );
        }}
      />
      <GamePanel
        game="montenegro"
        cardId="firstBook"
        build={(timeline) => {
          timeline
            .from('[data-card]', { y: -60, opacity: 0, duration: 0.3, stagger: 0.08 }, 0.2)
            .from('[data-seat]', { opacity: 0, y: 16, duration: 0.4, stagger: 0.08 }, 0.2)
            .fromTo(
              '[data-bubble]',
              { opacity: 0, y: 4 },
              { opacity: 1, y: 0, duration: 0.2, stagger: 0.35 },
              '+=0.2',
            );
          gsap.to('[data-glint]', { opacity: 1, duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        }}
      >
        <p className="eyebrow bf-eyebrow bf-hud">{t('round', { n: 3, total: 3 })}</p>
        <h2 className="display bf-title bf-title--stage">{t('question')}</h2>
        <p className="bf-hint">{t('observe')}</p>
        <div className="poker__table bf-poker" aria-hidden="true">
          <div className="poker__cards">
            <span data-card />
            <span data-card />
            <span data-card />
          </div>
          <div className="poker__case">
            <div className="poker__glint" data-glint />
            <Briefcase open={false} />
          </div>
          {GESTURES.map((gesture, seat) => {
            const position = SEAT_POSITIONS[seat] ?? { left: 50, top: 50 };
            return (
              <div
                key={gesture}
                className="seat"
                style={{ left: `${position.left}%`, top: `${position.top}%` }}
                data-seat
              >
                <span className="seat__bubble" data-bubble>
                  {t(`gestures.${gesture}`)}
                </span>
                <PlayerSilhouette tear={seat === LE_CHIFFRE_SEAT} ring="transparent" />
                <span className="seat__label">{t('seat', { n: seat + 1 })}</span>
              </div>
            );
          })}
        </div>
      </GamePanel>
    </>
  );
}

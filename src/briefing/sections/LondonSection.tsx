import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { GadgetIcon, LondonScene, ShadowedM } from '../../art/LondonScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { GADGETS } from '../../state/store';
import { GamePanel } from '../GamePanel';
import { StopOpening } from '../StopOpening';

export function LondonSection() {
  const { t } = useTranslation('london');

  return (
    <>
      <StopOpening
        stop="london"
        copy={{
          eyebrow: t('eyebrow'),
          titleStart: t('titleStart'),
          titleEm: t('titleEm'),
          theme: t('theme'),
        }}
        scene={
          <>
            <div className="ldn-opening__alarm" data-alarm aria-hidden="true" />
            <LondonScene label={t('sceneLabel')} />
          </>
        }
        voice={
          <div className="ldn-call">
            <div className="ldn-call__screen">
              <ShadowedM />
            </div>
            <div className="ldn-call__body">
              <span className="ldn-call__caller">{t('caller')}</span>
              <p className="ldn-call__text">{`"${t('order')}"`}</p>
            </div>
          </div>
        }
        build={(timeline) => {
          timeline.from('[data-building]', { y: 60, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0);
          gsap.to('[data-alarm]', { opacity: 0.25, duration: 0.5, yoyo: true, repeat: -1, ease: 'steps(1)' });
          gsap.to('[data-alarm-lights] rect', {
            opacity: 0.2,
            duration: 0.5,
            yoyo: true,
            repeat: -1,
            stagger: 0.12,
            ease: 'steps(1)',
          });
        }}
      />
      <GamePanel
        game="london"
        cardId="who"
        build={(timeline) => {
          timeline
            .from(
              '[data-gadget]',
              { opacity: 0, x: -40, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
              0.1,
            )
            .to(
              '[data-gadget="laser"]',
              { backgroundColor: '#1f3a5f', borderColor: '#e0534a', duration: 0.3 },
              '+=0.3',
            )
            .from('[data-q]', { opacity: 0, y: 12, duration: 0.5 }, '-=0.1');
        }}
      >
        <p className="eyebrow bf-eyebrow bf-hud">
          {t('labEyebrow')} · {t('labCount')}
        </p>
        <h2 className="display bf-title bf-title--stage">
          {t('labTitleStart')}
          <em>{t('labTitleEm')}</em>
        </h2>
        <ul className="bf-list">
          {GADGETS.map((gadget) => (
            <li key={gadget} className="gadget" data-gadget={gadget}>
              <span className="gadget__icon">
                <GadgetIcon gadget={gadget} color={gadget === 'laser' ? '#e0534a' : '#5b6770'} />
              </span>
              <span className="gadget__text">
                <span className="gadget__name">{t(`gadgets.${gadget}.name`)}</span>
                <span className="gadget__place">
                  {t('usefulIn', { place: t(`gadgets.${gadget}.place`) })}
                </span>
                <span className="gadget__perk">{t(`gadgets.${gadget}.perk`)}</span>
              </span>
            </li>
          ))}
        </ul>
        <div data-q>
          <MoneypennyRadio speaker={t('qSpeaker')}>{`"${t('qLine')}"`}</MoneypennyRadio>
        </div>
      </GamePanel>
    </>
  );
}

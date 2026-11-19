import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { HOUSE_VIEW, ScotlandHouse, SLOT_BOXES } from '../../art/ScotlandHouse';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import type { Lane } from '../../stops/scotland/rules';
import { GamePanel } from '../GamePanel';
import { StopOpening } from '../StopOpening';

const TRAPPED: readonly Lane[] = ['upperLeft', 'door'];
const WAVES = 3;

function driftMist() {
  gsap.to('[data-mist] path', {
    x: 24,
    duration: 6,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    stagger: 1.5,
  });
}

export function ScotlandSection() {
  const { t } = useTranslation('scotland');

  return (
    <>
      <StopOpening
        stop="scotland"
        copy={{
          eyebrow: t('eyebrow'),
          titleStart: t('titleStart'),
          titleEm: t('titleEm'),
          theme: t('theme'),
        }}
        scene={<ScotlandHouse label={t('houseLabel')} />}
        voice={
          <>
            <MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>
            <p className="bf-hint">{t('silva')}</p>
          </>
        }
        build={(timeline) => {
          driftMist();
          timeline.from('.sco-house', { opacity: 0, y: 40, duration: 1.2, ease: 'sine.out' }, 0);
        }}
      />
      <GamePanel
        game="scotland"
        cardId="origin"
        build={(timeline) => {
          driftMist();
          timeline
            .from(
              '[data-trap]',
              { opacity: 0, scale: 1.6, duration: 0.3, stagger: 0.25, ease: 'power4.in' },
              0.3,
            )
            .from(
              '[data-flames] path',
              { opacity: 0, scaleY: 0, transformOrigin: '50% 100%', duration: 0.6, stagger: 0.12 },
              '+=0.3',
            )
            .from('[data-wave]', { opacity: 0, duration: 0.4 }, '<');
        }}
      >
        <p className="eyebrow bf-eyebrow bf-hud" data-wave>
          <span>{t('wave', { n: WAVES, total: WAVES })}</span>
          <span>{t('trapsCount', { n: TRAPPED.length, total: TRAPPED.length })}</span>
        </p>
        <h2 className="display bf-title bf-title--stage">{t('trapsTitle')}</h2>
        <div className="bf-traps">
          <ScotlandHouse label={t('burningLabel')} burning />
          {TRAPPED.map((lane) => {
            const box = SLOT_BOXES[lane];
            return (
              <span
                key={lane}
                className="bf-trap"
                data-trap
                style={{
                  left: `${(box.x / HOUSE_VIEW.width) * 100}%`,
                  top: `${(box.y / HOUSE_VIEW.height) * 100}%`,
                  width: `${(box.w / HOUSE_VIEW.width) * 100}%`,
                  height: `${(box.h / HOUSE_VIEW.height) * 100}%`,
                }}
              >
                {t('trap')}
              </span>
            );
          })}
        </div>
        <MoneypennyRadio>{`"${t('silence')}"`}</MoneypennyRadio>
      </GamePanel>
    </>
  );
}

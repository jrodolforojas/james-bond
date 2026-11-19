import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleSilhouette } from '../../art/VehicleSilhouette';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { ERA_COLORS } from '../../screens/Recruitment/eras';
import { ERAS } from '../../state/store';
import { GamePanel } from '../GamePanel';

export function RecruitmentSection() {
  const { t } = useTranslation('recruitment');

  return (
    <GamePanel
      game="recruitment"
      cardId="eras"
      build={(timeline) => {
        timeline
          .from('[data-recruit-in]', { opacity: 0, y: 20, duration: 0.5, stagger: 0.12 }, 0)
          .from('[data-era]', { opacity: 0, y: 30, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.2)
          .from('[data-era] .vehicle', { x: -160, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.3);
      }}
    >
      <p className="eyebrow bf-eyebrow" data-recruit-in>
        {t('eyebrow')}
      </p>
      <h2 className="display bf-title bf-title--stage" data-recruit-in>
        {t('titleStart')}
        <em>{t('titleEm')}</em>
      </h2>
      <ul className="bf-eras">
        {ERAS.map((era, i) => (
          <li key={era} className="bf-era" style={{ '--era': ERA_COLORS[era] } as CSSProperties} data-era>
            <div className="bf-era__stage">
              <VehicleSilhouette era={era} rim={ERA_COLORS[era]} />
            </div>
            <span className="bf-era__n">{t('era', { n: i + 1 })}</span>
            <span className="display bf-era__actor">{t(`eras.${era}.actor`)}</span>
            <span className="bf-era__meta">
              {t(`eras.${era}.years`)} · {t(`eras.${era}.vehicle`)}
            </span>
          </li>
        ))}
        <li className="bf-era bf-era--locked" data-era>
          <div className="bf-era__stage" aria-hidden="true">
            ?
          </div>
          <span className="bf-era__n">{t('era', { n: ERAS.length + 1 })}</span>
          <span className="display bf-era__actor">{t('lockedName')}</span>
          <span className="bf-era__meta">{t('lockedLine')}</span>
        </li>
      </ul>
      <div data-recruit-in>
        <MoneypennyRadio>{`"${t('moneypenny')}"`}</MoneypennyRadio>
      </div>
    </GamePanel>
  );
}

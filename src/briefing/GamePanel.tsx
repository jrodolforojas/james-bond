import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CardView } from '../dossier/CardView';
import { CARDS, type CardId } from '../dossier/cards';
import type { StopId } from '../stops/catalog';
import { type BuildTimeline, useScrollTimeline } from './useScrollTimeline';

export type GameId = 'recruitment' | StopId;

interface GamePanelProps {
  game: GameId;
  cardId: CardId;
  children: ReactNode;
  build?: BuildTimeline;
}

export function GamePanel({ game, cardId, children, build }: GamePanelProps) {
  const { t } = useTranslation('briefing');
  const index = CARDS.findIndex((card) => card.id === cardId);
  const card = CARDS[index];
  const scope = useScrollTimeline((timeline) => {
    timeline
      .from('[data-bf-note]', { opacity: 0, y: 16, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 0)
      .from('[data-bf-card]', { opacity: 0, y: 90, rotate: 5, duration: 0.8, ease: 'power3.out' }, 0.35);
    build?.(timeline);
  });

  return (
    <section className={`bf-panel bf-game bf-game--${game}`} ref={scope}>
      <div className="bf-stage">{children}</div>
      <div className="bf-side">
        <p className="eyebrow bf-label" data-bf-note>
          {t('game')}
        </p>
        <h3 className="display bf-game__name" data-bf-note>
          {t(`games.${game}.name`)}
        </h3>
        <p className="bf-game__text" data-bf-note>
          {t(`games.${game}.text`)}
        </p>
        <p className="eyebrow bf-label" data-bf-note>
          {t('dossier')}
        </p>
        <div className="bf-card" data-bf-card>
          {card && <CardView card={card} number={index + 1} unlocked />}
        </div>
      </div>
    </section>
  );
}

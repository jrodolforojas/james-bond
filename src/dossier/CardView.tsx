import { type CSSProperties, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useArchivePhoto } from '../agent/useArchivePhoto';
import { NEW_007_NAME } from '../config';
import { ageOn, countryName, formatDate, REVEAL } from '../reveal';
import type { CardSource, DossierCard } from './cards';

const CHARS_PER_BAR = 34;
const REDACTED_IDENTITY = '██████████';

export function sourcePlace(source: CardSource): string {
  if (source.kind === 'stop') return source.stop;
  return source.kind;
}

function redactedBars(items: readonly string[]): number[] {
  return items.flatMap((item) => {
    const bars = Math.ceil(item.length / CHARS_PER_BAR);
    return Array.from({ length: bars }, (_, i) => {
      if (i < bars - 1) return 100;
      return Math.max(30, Math.round(((item.length % CHARS_PER_BAR || CHARS_PER_BAR) / CHARS_PER_BAR) * 100));
    });
  });
}

type StampKey = 'classified' | 'declassified' | 'pending';

function stampKey(card: DossierCard, unlocked: boolean): StampKey {
  if (!unlocked) return 'classified';
  if (card.id === 'agent' && !NEW_007_NAME) return 'pending';
  return 'declassified';
}

interface CardViewProps {
  card: DossierCard;
  number: number;
  unlocked: boolean;
}

export const CardView = forwardRef<HTMLElement, CardViewProps>(function CardView(
  { card, number, unlocked },
  ref,
) {
  const { t, i18n } = useTranslation('dossier');
  const place = t(`places.${sourcePlace(card.source)}` as 'places.final');
  const revealed = card.id === 'agent' && REVEAL !== null;
  const photoUrl = useArchivePhoto(revealed && unlocked ? REVEAL?.photo?.src : null);
  const itemsKey = (revealed ? 'cards.agent.itemsRevealed' : `cards.${card.id}.items`) as 'cards.agent.items';
  const items = t(itemsKey, {
    returnObjects: true,
    identity: NEW_007_NAME || REDACTED_IDENTITY,
    age: REVEAL ? (ageOn(REVEAL.birthDate, new Date()) ?? '—') : '',
    country: REVEAL ? countryName(REVEAL.country, i18n.language) : '',
    date: REVEAL ? formatDate(REVEAL.announcedOn, i18n.language) : '',
  }) as readonly string[];
  const quote = t((revealed ? 'cards.agent.quoteRevealed' : `cards.${card.id}.quote`) as 'cards.agent.quote');
  const style = { '--card-color': card.color } as CSSProperties;

  return (
    <article
      ref={ref}
      className="card"
      style={style}
      aria-label={unlocked ? undefined : t('lockedLabel', { place })}
    >
      <svg className="card__clip" viewBox="0 0 26 70" aria-hidden="true">
        <path
          d="M8 62 V12 a5 5 0 0 1 10 0 V56 a8 8 0 0 1 -16 0 V18"
          fill="none"
          stroke="#6b6b70"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="card__polaroid" aria-hidden="true">
        {photoUrl ? <img src={photoUrl} alt="" /> : <span />}
      </div>
      <span className="card__meta">
        {t('cardNumber', { n: String(number).padStart(2, '0') })}
        {unlocked ? ` · ${t('unlockedIn', { place: place.toUpperCase() })}` : ''}
      </span>
      <h3 className="display card__title">{t(`cards.${card.id}.title`)}</h3>

      {unlocked && (
        <ul className="card__items">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {unlocked && quote && <p className="card__quote">{quote}</p>}

      {!unlocked && (
        <div className="card__bars" aria-hidden="true">
          {redactedBars(items).map((width, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative bars derived from text length
            <span key={i} style={{ width: `${width}%` }} />
          ))}
        </div>
      )}
      {!unlocked && <p className="card__hint">{t('lockedHint', { place })}</p>}

      <span className="card__stamp" aria-hidden="true">
        {t(stampKey(card, unlocked))}
      </span>
    </article>
  );
});

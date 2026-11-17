import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import {
  type ChangeEvent,
  type FormEvent,
  forwardRef,
  type SyntheticEvent,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../analytics/track';
import { playCue } from '../audio/audio';
import { prefersReducedMotion } from '../motion';
import { canvasToBlob } from '../share/renderCard';
import { useMission } from '../state/store';
import { processPhoto } from './photo';
import { renderAgentCard } from './renderAgentCard';
import './agent.css';

export interface AgentSheetHandle {
  open: () => void;
}

const NAME_MAX = 28;
const COUNTRY_MAX = 32;

interface CardImage {
  url: string;
  blob: Blob;
}

export const AgentSheet = forwardRef<AgentSheetHandle>(function AgentSheet(_, ref) {
  const { t } = useTranslation(['agent', 'recruitment']);
  const era = useMission((state) => state.era);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState<HTMLCanvasElement | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [card, setCard] = useState<CardImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    () => () => {
      if (card) URL.revokeObjectURL(card.url);
    },
    [card],
  );

  const { contextSafe } = useGSAP({ scope: dialogRef });

  const open = contextSafe(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    playCue('paper');
    if (prefersReducedMotion()) return;
    gsap.fromTo(dialog, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
  });

  useImperativeHandle(ref, () => ({ open }), [open]);

  const close = contextSafe(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    playCue('paper');
    if (prefersReducedMotion()) return dialog.close();
    gsap.to(dialog, { yPercent: 100, duration: 0.3, ease: 'power2.in', onComplete: () => dialog.close() });
  });

  const onCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    close();
  };

  const onPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const processed = await processPhoto(file);
    setPhoto(processed);
    setPhotoPreview(processed.toDataURL('image/jpeg', 0.8));
    setBusy(false);
  };

  const generate = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError(t('required'));
    setError('');
    setBusy(true);
    const canvas = await renderAgentCard({
      header: t('card.header'),
      title: t('card.title'),
      subtitle: t('card.subtitle'),
      rows: [
        { label: t('card.identity'), value: name.trim() },
        { label: t('card.age'), value: age.trim() || '—' },
        { label: t('card.country'), value: country.trim() || '—' },
        { label: t('card.era'), value: era ? t(`recruitment:eras.${era}.vehicle`) : '—' },
        { label: t('card.status'), value: t('card.statusValue') },
      ],
      stamp: t('card.stamp'),
      footer: `${t('card.footer')} · ${window.location.host}`,
      photo,
    });
    const blob = await canvasToBlob(canvas);
    setBusy(false);
    if (!blob) return;
    playCue('stamp');
    trackEvent('agent_card_created', { photo: Boolean(photo), country: Boolean(country.trim()) });
    setCard({ url: URL.createObjectURL(blob), blob });
  };

  const file = card ? new File([card.blob], `${t('fileName')}.png`, { type: 'image/png' }) : null;
  const canShareFile = Boolean(file && navigator.canShare?.({ files: [file] }));

  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: t('shareText') });
      trackEvent('share_card_shared', { kind: 'agent', method: 'share' });
    } catch {
      return;
    }
  };

  return (
    <dialog ref={dialogRef} className="share-sheet agent-sheet" aria-label={t('title')} onCancel={onCancel}>
      <div className="share-sheet__inner">
        <div className="share-sheet__bar">
          <h2 className="display share-sheet__title">{t('title')}</h2>
          <button type="button" className="share-sheet__close" onClick={close} aria-label={t('close')}>
            ✕
          </button>
        </div>

        {!card && (
          <form className="agent-form" onSubmit={generate} noValidate>
            <p className="agent-form__intro">{t('intro')}</p>
            <label className="agent-form__field">
              <span>{t('name')}</span>
              <input
                value={name}
                maxLength={NAME_MAX}
                placeholder={t('namePlaceholder')}
                autoComplete="nickname"
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'agent-error' : undefined}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <div className="agent-form__row">
              <label className="agent-form__field">
                <span>{t('country')}</span>
                <input
                  value={country}
                  maxLength={COUNTRY_MAX}
                  placeholder={t('countryPlaceholder')}
                  autoComplete="country-name"
                  onChange={(event) => setCountry(event.target.value)}
                />
              </label>
              <label className="agent-form__field agent-form__field--age">
                <span>{t('age')}</span>
                <input
                  value={age}
                  inputMode="numeric"
                  maxLength={3}
                  onChange={(event) => setAge(event.target.value.replace(/\D/g, ''))}
                />
              </label>
            </div>
            <div className="agent-form__photo">
              <div className="agent-form__polaroid" aria-hidden="true">
                {photoPreview && <img src={photoPreview} alt="" />}
              </div>
              <div className="agent-form__photo-text">
                <span>{t('photo')}</span>
                <span className="agent-form__hint">{t('photoHint')}</span>
                <label className="btn btn--outline agent-form__pick">
                  {photoPreview ? t('changePhoto') : t('choosePhoto')}
                  <input type="file" accept="image/*" className="sr-only" onChange={onPhoto} />
                </label>
              </div>
            </div>
            {error && (
              <p id="agent-error" className="agent-form__error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn share-sheet__share" disabled={busy}>
              {busy ? t('generating') : t('generate')}
            </button>
          </form>
        )}

        {card && (
          <>
            <div className="share-sheet__preview">
              <img src={card.url} alt={t('preview')} />
            </div>
            {canShareFile && <p className="agent-form__hint">{t('shareHint')}</p>}
            <div className="share-sheet__actions">
              {canShareFile && (
                <button type="button" className="btn share-sheet__share" onClick={share}>
                  {t('share')}
                </button>
              )}
              <a
                className="btn share-sheet__download"
                href={card.url}
                download={`${t('fileName')}.png`}
                onClick={() => trackEvent('share_card_shared', { kind: 'agent', method: 'download' })}
              >
                {t('download')}
              </a>
            </div>
            <button type="button" className="agent-form__edit" onClick={() => setCard(null)}>
              {t('edit')}
            </button>
          </>
        )}
      </div>
    </dialog>
  );
});

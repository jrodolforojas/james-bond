import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { forwardRef, type SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VEHICLE_PATHS } from '../art/VehicleSilhouette';
import { prefersReducedMotion } from '../motion';
import { ERA_COLORS } from '../screens/Recruitment/eras';
import { useMission } from '../state/store';
import { EVIDENCE_TOTAL, evidenceCount } from '../stops/catalog';
import { formatDuration, missionDurationMs, rankFor } from './rank';
import { type CardContent, canvasToBlob, renderCard } from './renderCard';
import './share.css';

export interface ShareSheetHandle {
  open: () => void;
}

function useCardContent(): CardContent {
  const { t } = useTranslation(['share', 'recruitment', 'london']);
  const era = useMission((state) => state.era);
  const gadget = useMission((state) => state.gadget);
  const completed = useMission((state) => state.completed);
  const startedAt = useMission((state) => state.startedAt);
  const finishedAt = useMission((state) => state.finishedAt);
  const ejectorUsed = useMission((state) => state.ejectorUsed);
  const duration = missionDurationMs(startedAt, finishedAt);
  const none = t('none');
  return {
    header: t('header'),
    titleTop: t('titleTop'),
    titleBottom: t('titleBottom'),
    rows: [
      {
        label: t('era'),
        value: era ? `${t(`recruitment:eras.${era}.years`)} · ${t(`recruitment:eras.${era}.actor`)}` : none,
      },
      { label: t('vehicle'), value: era ? t(`recruitment:eras.${era}.vehicle`) : none },
      { label: t('gadget'), value: gadget ? t(`london:gadgets.${gadget}.name`) : none },
      {
        label: t('evidence'),
        value: t('evidenceValue', { n: evidenceCount(completed), total: EVIDENCE_TOTAL }),
      },
      { label: t('time'), value: formatDuration(duration) },
    ],
    rankLabel: t('rank'),
    rankValue: t(`ranks.${rankFor(duration, ejectorUsed)}`),
    approved: t('approved'),
    footer: `${t('footer')} · ${window.location.host}`,
    vehiclePath: era ? VEHICLE_PATHS[era] : null,
    vehicleColor: era ? ERA_COLORS[era] : '#d4a017',
  };
}

export const ShareSheet = forwardRef<ShareSheetHandle>(function ShareSheet(_, ref) {
  const { t, i18n } = useTranslation('share');
  const content = useCardContent();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<{ url: string; blob: Blob } | null>(null);
  const contentKey = JSON.stringify(content);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-render the card only when its content or language changes
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setImage(null);
    renderCard(content)
      .then(canvasToBlob)
      .then((blob) => {
        if (cancelled || !blob) return;
        setImage({ url: URL.createObjectURL(blob), blob });
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, contentKey, i18n.language]);

  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image.url);
    },
    [image],
  );

  const { contextSafe } = useGSAP({ scope: dialogRef });

  const open = contextSafe(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    setIsOpen(true);
    dialog.showModal();
    if (prefersReducedMotion()) return;
    gsap.fromTo(dialog, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
  });

  useImperativeHandle(ref, () => ({ open }), [open]);

  const close = contextSafe(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const done = () => {
      dialog.close();
      setIsOpen(false);
    };
    if (prefersReducedMotion()) return done();
    gsap.to(dialog, { yPercent: 100, duration: 0.3, ease: 'power2.in', onComplete: done });
  });

  const onCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    close();
  };

  const file = image ? new File([image.blob], `${t('fileName')}.png`, { type: 'image/png' }) : null;
  const canShareFile = Boolean(file && navigator.canShare?.({ files: [file] }));

  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: t('shareText') });
    } catch {
      return;
    }
  };

  return (
    <dialog ref={dialogRef} className="share-sheet" aria-label={t('sheetTitle')} onCancel={onCancel}>
      <div className="share-sheet__inner">
        <div className="share-sheet__bar">
          <h2 className="display share-sheet__title">{t('sheetTitle')}</h2>
          <button type="button" className="share-sheet__close" onClick={close} aria-label={t('close')}>
            ✕
          </button>
        </div>
        <div className="share-sheet__preview">
          {image ? <img src={image.url} alt={t('preview')} /> : <p>{t('preparing')}</p>}
        </div>
        <div className="share-sheet__actions">
          {canShareFile && (
            <button type="button" className="btn share-sheet__share" onClick={share}>
              {t('share')}
            </button>
          )}
          <a
            className={`btn share-sheet__download ${image ? '' : 'is-disabled'}`}
            href={image?.url}
            download={`${t('fileName')}.png`}
            aria-disabled={!image}
          >
            {t('download')}
          </a>
        </div>
      </div>
    </dialog>
  );
});

import { useTranslation } from 'react-i18next';
import { licenseUrl, REVEAL } from '../reveal';
import { useMission } from '../state/store';

function PhotoCredit() {
  const { t } = useTranslation();
  const photo = REVEAL?.photo;
  if (!photo) return null;
  const license = licenseUrl(photo.license);
  return (
    <>
      <br />
      {t('photoCredit', { name: REVEAL?.name })}{' '}
      <a href={photo.source} target="_blank" rel="noopener noreferrer">
        {photo.author}
      </a>
      {' · '}
      {license ? (
        <a href={license} target="_blank" rel="noopener noreferrer">
          {photo.license}
        </a>
      ) : (
        photo.license
      )}
      {'. '}
      {t('photoModified')}
    </>
  );
}

export function LegalFooter() {
  const { t } = useTranslation();
  const atFinal = useMission((state) => state.step.screen === 'final');
  return (
    <p className="legal">
      {t('legal')}
      {atFinal && <PhotoCredit />}
    </p>
  );
}

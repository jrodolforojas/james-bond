import { useTranslation } from 'react-i18next';
import { MakerCredit } from '../../components/MakerCredit';
import { licenseUrl, REVEAL } from '../../reveal';

function PhotoCredit() {
  const { t } = useTranslation();
  const photo = REVEAL?.photo;
  if (!photo) return null;
  const license = licenseUrl(photo.license);
  return (
    <p className="final__photo-credit">
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
    </p>
  );
}

export function FinalCredits() {
  return (
    <footer className="final__credits">
      <MakerCredit />
      <PhotoCredit />
    </footer>
  );
}

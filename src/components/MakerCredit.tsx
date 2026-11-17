import { useTranslation } from 'react-i18next';
import { SocialLinks } from './SocialLinks';

export function MakerCredit() {
  const { t } = useTranslation();
  return (
    <div className="maker">
      <p className="maker__line">{t('madeBy')}</p>
      <SocialLinks />
    </div>
  );
}

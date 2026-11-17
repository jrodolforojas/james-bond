import { useTranslation } from 'react-i18next';
import { type CreditPlacement, SocialLinks } from './SocialLinks';

export function MakerCredit({ placement }: { placement: CreditPlacement }) {
  const { t } = useTranslation();
  return (
    <div className="maker">
      <p className="maker__line">{t('madeBy')}</p>
      <SocialLinks placement={placement} />
    </div>
  );
}

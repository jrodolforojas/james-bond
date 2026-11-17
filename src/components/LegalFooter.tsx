import { useTranslation } from 'react-i18next';

export function LegalFooter() {
  const { t } = useTranslation();
  return <p className="legal">{t('legal')}</p>;
}

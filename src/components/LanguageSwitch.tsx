import { useTranslation } from 'react-i18next';
import { setLanguage } from '../i18n';
import { LANGUAGES } from '../i18n/resources';

export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  return (
    <fieldset className="lang-switch">
      <legend className="sr-only">{t('language')}</legend>
      {LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-pressed={i18n.language === language}
          onClick={() => setLanguage(language)}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </fieldset>
  );
}

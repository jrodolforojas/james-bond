import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { trackEvent } from '../analytics/track';
import { LANGUAGES, type Language, resources } from './resources';

function isLanguage(value: string | undefined): value is Language {
  return LANGUAGES.includes(value as Language);
}

function languageFromPath(): Language | null {
  const segment = window.location.pathname.split('/')[1];
  if (isLanguage(segment)) return segment;
  return null;
}

function languageFromBrowser(): Language {
  if (navigator.language.toLowerCase().startsWith('es')) return 'es';
  return 'en';
}

function writeLanguageToPath(language: Language) {
  const { search, hash } = window.location;
  window.history.replaceState(null, '', `/${language}${search}${hash}`);
}

function syncDocument(language: Language) {
  document.documentElement.lang = language;
  writeLanguageToPath(language);
}

export function setLanguage(language: Language) {
  trackEvent('language_changed', { language });
  void i18n.changeLanguage(language);
}

export function currentLanguage(): Language {
  if (isLanguage(i18n.language)) return i18n.language;
  return 'es';
}

const initialLanguage = languageFromPath() ?? languageFromBrowser();

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'es',
  defaultNS: 'common',
  ns: Object.keys(resources.es),
  interpolation: { escapeValue: false },
  returnEmptyString: true,
});

syncDocument(initialLanguage);
i18n.on('languageChanged', (language) => {
  if (!isLanguage(language)) return;
  syncDocument(language);
});

export default i18n;

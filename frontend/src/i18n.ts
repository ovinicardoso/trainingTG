
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import ptBR from './locales/pt-BR.json';

// the translations
const resources = {
  'pt-BR': {
    translation: ptBR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // Default language
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;

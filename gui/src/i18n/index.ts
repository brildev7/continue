import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getLocalStorage, setLocalStorage } from '../util/localStorage';
import en from './locales/en.json';
import ko from './locales/ko.json';

// 저장된 언어 설정을 가져오거나 기본값으로 'en' 사용
const savedLanguage = getLocalStorage('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      ko: {
        translation: ko
      }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// 언어가 변경될 때 로컬 스토리지에 저장
i18n.on('languageChanged', (lng) => {
  setLocalStorage('language', lng as 'en' | 'ko');
});

export default i18n; 
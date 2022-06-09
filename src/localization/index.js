import i18n from "i18next";
import { getI18n,initReactI18next,useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./resources/en";
import vi from "./resources/vi";

const LANGUAGE = window.localStorage.getItem('mc_lang') ? window.localStorage.getItem('mc_lang') : 'vi';

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: LANGUAGE,
    debug: true,
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      vi: {
        translation: vi,
      },
      en: {
        translation: en,
      },
    },
  });

export default i18n;

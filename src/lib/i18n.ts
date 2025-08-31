import en from "@/locales/en/common.json";
import id from "@/locales/id/common.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { KATALOGIN_DEFAULT_LANGUAGE, LANGUAGE_KEY_STORAGE } from "./constant";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LANGUAGE_KEY_STORAGE);
    if (stored) return stored;
  }
  return KATALOGIN_DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: getInitialLanguage(),
  fallbackLng: KATALOGIN_DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_KEY_STORAGE, lng);
  }
});

export default i18n;

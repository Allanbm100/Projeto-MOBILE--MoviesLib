// i18next - Lib 
// react-i18next
// expo-localization

import i18n from "i18next";
import { initReactI18next, Translation } from "react-i18next";
import { getLocales } from "expo-localization"

import en from "./locales/en.json"
import es from "./locales/es.json"
import pt from "./locales/pt.json"

const resources = {
    en: { Translation: en },
    es: { Translation: es },
    pt: { Translation: pt},
}

const deviceLanguage = getLocales() [0]?.languageCode || "pt"

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: deviceLanguage,
        fallbackLng: "pt",
        interpolation: { escapeValue: false }
    })

    export default i18n
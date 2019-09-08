/**
 * @author Yuriy Matviyuk
 */

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from '../i18n/en'
import uk from '../i18n/uk'
import ru from '../i18n/ru'

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'uk',
  load: 'languageOnly',
  resources: { en, uk, ru },
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false
  }
})

export default i18n

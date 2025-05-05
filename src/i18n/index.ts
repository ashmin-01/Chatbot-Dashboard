import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ar from './locales/ar'

type MessageSchema = typeof en

export const defaultLocale = 'en'

export const i18n = createI18n<[MessageSchema], 'en' | 'ar'>({
  legacy: false, // you must set `false`, to use Composition API
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    en,
    ar,
  },
})

export function setLocale(locale: string) {
  i18n.global.locale.value = locale
  document.querySelector('html')?.setAttribute('lang', locale)
  // For RTL support (Arabic)
  if (locale === 'ar') {
    document.querySelector('html')?.setAttribute('dir', 'rtl')
  } else {
    document.querySelector('html')?.setAttribute('dir', 'ltr')
  }

  // Store the selected locale in localStorage
  localStorage.setItem('locale', locale)
}

export function getStoredLocale(): string {
  return localStorage.getItem('locale') || defaultLocale
}

// Initialize locale from stored preference
export function initializeI18n() {
  const storedLocale = getStoredLocale()
  setLocale(storedLocale)
}

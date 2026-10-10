import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

type TranslationKey = string;

const translations: Record<string, any> = { en, hi, mr };

export const defaultLocale = 'en';
export const locales = ['en', 'hi', 'mr'] as const;
export type Locale = typeof locales[number];

export const languageNames: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🚩' },
};

// Get a translation value by dot-notation key
export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations[defaultLocale];
  for (const k of keys) {
    value = value?.[k];
  }
  if (typeof value !== 'string') {
    // Fallback to English
    value = translations[defaultLocale];
    for (const k of keys) {
      value = value?.[k];
    }
  }
  return typeof value === 'string' ? value : key;
}

// Get all translations for a namespace (e.g., 'auth')
export function getNamespace(locale: Locale, namespace: string): Record<string, any> {
  const data = translations[locale] || translations[defaultLocale];
  return (data as any)[namespace] || {};
}

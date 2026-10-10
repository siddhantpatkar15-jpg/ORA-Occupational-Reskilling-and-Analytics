'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { t as translate, Locale, defaultLocale, locales, languageNames } from './index';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  locales: readonly Locale[];
  languages: typeof languageNames;
}

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key: string) => key,
  locales: locales,
  languages: languageNames,
});

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);

  // Sync with localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ora_language') as Locale;
      if (saved && locales.includes(saved)) {
        setLocaleState(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!locales.includes(newLocale)) return;
    setLocaleState(newLocale);
    try {
      localStorage.setItem('ora_language', newLocale);
      document.cookie = `ora_locale=${newLocale}; path=/; max-age=31536000`;
      window.dispatchEvent(new CustomEvent('ora_language_changed', { detail: newLocale }));
    } catch (e) {
      // ignore
    }
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, locales, languages: languageNames }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

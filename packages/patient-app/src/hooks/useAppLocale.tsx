import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { type Locale, getTranslations, type Translations } from '@jordan-health/shared';

interface LocaleContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

/**
 * Provider für App-weite Lokalisierung
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jordan-health-locale');
      return (stored === 'ar' || stored === 'de') ? stored : 'de';
    }
    return 'de';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('jordan-health-locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = useMemo(() => getTranslations(locale), [locale]);
  const isRTL = locale === 'ar';

  const value = useMemo(() => ({
    locale,
    t,
    setLocale,
    isRTL,
  }), [locale, t, setLocale, isRTL]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook für Zugriff auf Lokalisierung
 */
export function useAppLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useAppLocale must be used within a LocaleProvider');
  }
  return context;
}

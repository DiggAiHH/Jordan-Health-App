import { useCallback, useMemo } from 'react';
import { type Locale, getTranslations, type Translations } from '../i18n/translations';
import { useLocalStorage } from './useLocalStorage';

interface UseLocaleReturn {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
}

/**
 * Hook für Internationalisierung mit automatischer Persistierung
 * Unterstützt Arabisch (RTL) und Deutsch (LTR)
 */
export function useLocale(defaultLocale: Locale = 'de'): UseLocaleReturn {
  const [locale, setLocaleStorage] = useLocalStorage<Locale>('jordan-health-locale', defaultLocale);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleStorage(newLocale);
      
      // Aktualisiere HTML-Attribute für CSS/Barrierefreiheit
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale === 'ar' ? 'ar' : 'de';
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      }
    },
    [setLocaleStorage]
  );

  const t = useMemo(() => getTranslations(locale), [locale]);
  
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return {
    locale,
    t,
    setLocale,
    isRTL,
    direction,
  };
}

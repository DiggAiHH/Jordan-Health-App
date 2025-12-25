import React from 'react';
import type { Locale } from '../i18n/translations';

interface LanguageSwitchProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
}

/**
 * Sprachumschalter für Deutsch/Arabisch
 * Große Touch-Flächen für einfache Bedienung
 */
export function LanguageSwitch({
  locale,
  onChange,
  className = '',
}: LanguageSwitchProps): React.ReactElement {
  return (
    <div className={`flex gap-2 ${className}`} role="radiogroup" aria-label="Sprache wählen">
      <button
        onClick={() => onChange('de')}
        className={`
          px-4 py-2 rounded-lg font-semibold text-base
          min-h-[44px] min-w-[60px]
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-blue-300
          ${
            locale === 'de'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }
        `}
        role="radio"
        aria-checked={locale === 'de'}
      >
        DE
      </button>
      <button
        onClick={() => onChange('ar')}
        className={`
          px-4 py-2 rounded-lg font-semibold text-base
          min-h-[44px] min-w-[60px]
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-blue-300
          ${
            locale === 'ar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }
        `}
        role="radio"
        aria-checked={locale === 'ar'}
        dir="rtl"
      >
        عربي
      </button>
    </div>
  );
}

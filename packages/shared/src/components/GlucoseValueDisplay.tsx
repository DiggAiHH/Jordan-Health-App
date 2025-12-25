import React from 'react';
import { classifyGlucoseValue, formatGlucoseValue } from '../utils';

interface GlucoseValueDisplayProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  locale?: 'de' | 'ar';
  className?: string;
}

/**
 * Farbcodierte Blutzucker-Anzeige
 * Große, gut lesbare Darstellung mit Farbkontrasten gemäß WCAG
 */
export function GlucoseValueDisplay({
  value,
  size = 'lg',
  showLabel = true,
  locale = 'de',
  className = '',
}: GlucoseValueDisplayProps): React.ReactElement {
  const classification = classifyGlucoseValue(value);

  const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  const labelSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`font-bold ${sizeStyles[size]}`}
        style={{ color: classification.color }}
        aria-label={`Blutzucker: ${formatGlucoseValue(value)}, Status: ${classification.label}`}
      >
        {formatGlucoseValue(value)}
      </div>
      
      {showLabel && (
        <div
          className={`font-semibold mt-2 ${labelSizeStyles[size]}`}
          style={{ color: classification.color }}
        >
          {locale === 'ar' ? classification.labelArabic : classification.label}
        </div>
      )}
    </div>
  );
}

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Karten-Komponente mit klarer visueller Hierarchie
 * Große Abstände für bessere Lesbarkeit bei älteren Nutzern
 */
export function Card({
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
  shadow = 'md',
  onClick,
}: CardProps): React.ReactElement {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const interactiveStyles = onClick
    ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300'
    : '';

  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-200
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${interactiveStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-base text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

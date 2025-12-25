import React from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Alert-Komponente für Benachrichtigungen
 * Große Schrift und deutliche Icons für geriatrische Patienten
 */
export function Alert({
  type,
  title,
  children,
  onDismiss,
  className = '',
}: AlertProps): React.ReactElement {
  const styles: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✅',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠️',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '❌',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.text}
        border-2 rounded-xl p-4
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <span className="text-2xl mr-3 flex-shrink-0" aria-hidden="true">
          {style.icon}
        </span>
        <div className="flex-1">
          {title && (
            <h4 className="text-lg font-bold mb-1">{title}</h4>
          )}
          <div className="text-base">{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3 p-2 rounded-lg hover:bg-black/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Schließen"
          >
            <span className="text-2xl" aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
}

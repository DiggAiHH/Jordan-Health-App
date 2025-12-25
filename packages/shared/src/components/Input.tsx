import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  hint?: string;
  size?: 'md' | 'lg';
}

/**
 * Barrierefreies Input-Feld mit großer Schrift für geriatrische Patienten
 * Label ist immer sichtbar (keine Placeholder-Only Patterns)
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      size = 'lg',
      id,
      className = '',
      required,
      ...props
    },
    ref
  ): React.ReactElement {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const sizeStyles = {
      md: 'py-3 px-4 text-base',
      lg: 'py-4 px-5 text-lg',
    };

    return (
      <div className="mb-4">
        <label
          htmlFor={inputId}
          className="block text-lg font-semibold text-gray-800 mb-2"
        >
          {label}
          {required && <span className="text-red-600 ml-1" aria-hidden="true">*</span>}
        </label>
        
        {hint && (
          <p id={hintId} className="text-base text-gray-600 mb-2">
            {hint}
          </p>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          className={`
            w-full rounded-xl border-2
            ${sizeStyles[size]}
            transition-colors duration-200
            focus:outline-none focus:ring-4 focus:ring-offset-1
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${className}
          `}
          required={required}
          {...props}
        />

        {error && (
          <p id={errorId} className="mt-2 text-base font-medium text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

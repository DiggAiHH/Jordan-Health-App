/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontSize: {
        // Größere Schriftgrößen für geriatrische Patienten
        'geriatric-sm': ['1.125rem', { lineHeight: '1.75rem' }],
        'geriatric-base': ['1.25rem', { lineHeight: '1.875rem' }],
        'geriatric-lg': ['1.5rem', { lineHeight: '2rem' }],
        'geriatric-xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'geriatric-2xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
    },
  },
  plugins: [],
};

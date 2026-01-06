import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitch } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout für die Ernährungs-App
 * Große Navigationselemente für geriatrische Nutzer
 */
export function Layout({ children }: LayoutProps) {
  const { t, locale, setLocale, isRTL } = useAppLocale();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.nutrition.dashboard, icon: '🏠' },
    { path: '/add', label: t.nutrition.addMeal, icon: '➕' },
    { path: '/history', label: t.patient.history, icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-amber-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-amber-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥗</span>
              <h1 className="text-2xl font-bold">
                {locale === 'ar' ? 'تتبع التغذية' : 'Ernährung'}
              </h1>
            </div>
            <LanguageSwitch locale={locale} onChange={setLocale} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-2">
          <ul className="flex justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="flex-1">
                  <Link
                    to={item.path}
                    className={`
                      flex flex-col items-center py-3 px-2
                      text-center transition-colors duration-200
                      min-h-[72px] justify-center
                      ${isActive 
                        ? 'text-amber-600 bg-amber-50' 
                        : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="text-2xl mb-1" aria-hidden="true">{item.icon}</span>
                    <span className="text-sm font-medium truncate w-full">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="h-24" aria-hidden="true" />
    </div>
  );
}

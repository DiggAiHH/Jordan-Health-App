import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitch } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout für die Arzt-App
 * Professionelles Design mit Sidebar-Navigation
 */
export function Layout({ children }: LayoutProps) {
  const { t, locale, setLocale, isRTL } = useAppLocale();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.doctor.dashboard, icon: '📊' },
    { path: '/inbox', label: t.doctor.inbox, icon: '💬' },
    { path: '/patients', label: t.doctor.patients, icon: '👥' },
    { path: '/alerts', label: t.doctor.alerts, icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">👨‍⚕️</span>
              <div>
                <h1 className="text-xl font-bold">{t.common.appName}</h1>
                <p className="text-green-200 text-sm">
                  {locale === 'ar' ? 'لوحة تحكم الطبيب' : 'Arzt-Dashboard'}
                </p>
              </div>
            </div>
            <LanguageSwitch locale={locale} onChange={setLocale} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Navigation */}
        <nav className="w-64 flex-shrink-0">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      text-lg font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700'
                      }
                    `}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

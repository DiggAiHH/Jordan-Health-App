import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitch } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout für die Admin-App
 * Professionelles Admin-Dashboard Design
 */
export function Layout({ children }: LayoutProps) {
  const { t, locale, setLocale, isRTL } = useAppLocale();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.admin.dashboard, icon: '📊' },
    { path: '/patients', label: t.admin.patients, icon: '👥' },
    { path: '/doctors', label: t.admin.doctors, icon: '👨‍⚕️' },
    { path: '/conversations', label: locale === 'ar' ? 'المحادثات' : 'Konversationen', icon: '💬' },
    { path: '/add-user', label: t.admin.addUser, icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">⚙️</span>
              <div>
                <h1 className="text-xl font-bold">{t.common.appName}</h1>
                <p className="text-purple-200 text-sm">
                  {locale === 'ar' ? 'لوحة تحكم المدير' : 'Admin-Dashboard'}
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
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700'
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

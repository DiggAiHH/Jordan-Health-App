import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

// Mock-Statistiken
const mockStats = {
  totalPatients: 248,
  totalDoctors: 12,
  activePatients: 186,
  newThisMonth: 23,
  criticalAlerts: 7,
  avgReadingsPerDay: 312,
};

/**
 * Admin-Dashboard mit Systemübersicht
 */
export function Dashboard() {
  const { t, locale } = useAppLocale();

  const statCards = [
    {
      label: locale === 'ar' ? 'إجمالي المرضى' : 'Patienten gesamt',
      value: mockStats.totalPatients,
      icon: '👥',
      color: 'bg-blue-100 text-blue-800',
      link: '/patients',
    },
    {
      label: locale === 'ar' ? 'الأطباء' : 'Ärzte',
      value: mockStats.totalDoctors,
      icon: '👨‍⚕️',
      color: 'bg-green-100 text-green-800',
      link: '/doctors',
    },
    {
      label: locale === 'ar' ? 'مرضى نشطون' : 'Aktive Patienten',
      value: mockStats.activePatients,
      icon: '✅',
      color: 'bg-purple-100 text-purple-800',
      link: '/patients',
    },
    {
      label: locale === 'ar' ? 'جدد هذا الشهر' : 'Neu diesen Monat',
      value: mockStats.newThisMonth,
      icon: '📈',
      color: 'bg-amber-100 text-amber-800',
      link: '/patients',
    },
    {
      label: locale === 'ar' ? 'تنبيهات حرجة' : 'Kritische Alerts',
      value: mockStats.criticalAlerts,
      icon: '🚨',
      color: 'bg-red-100 text-red-800',
      link: '/patients',
    },
    {
      label: locale === 'ar' ? 'متوسط القراءات/يوم' : 'Ø Messungen/Tag',
      value: mockStats.avgReadingsPerDay,
      icon: '📊',
      color: 'bg-indigo-100 text-indigo-800',
      link: '/',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.admin.dashboard}</h2>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${stat.color}`}>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{stat.icon}</span>
                <div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Schnellaktionen */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/add-user">
          <Card className="bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            <div className="flex items-center justify-center gap-4 py-4">
              <span className="text-4xl">➕</span>
              <span className="text-xl font-bold">{t.admin.addUser}</span>
            </div>
          </Card>
        </Link>
        
        <Card className="bg-gray-600 text-white hover:bg-gray-700 transition-colors cursor-pointer">
          <div className="flex items-center justify-center gap-4 py-4">
            <span className="text-4xl">📥</span>
            <span className="text-xl font-bold">{t.admin.exportData}</span>
          </div>
        </Card>
      </div>

      {/* Systemstatus */}
      <Card title={locale === 'ar' ? 'حالة النظام' : 'Systemstatus'}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">API Server</span>
            <span className="text-green-600 font-bold">✅ {locale === 'ar' ? 'متصل' : 'Online'}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Database</span>
            <span className="text-green-600 font-bold">✅ {locale === 'ar' ? 'متصل' : 'Online'}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium">KI-Service</span>
            <span className="text-green-600 font-bold">✅ {locale === 'ar' ? 'متصل' : 'Online'}</span>
          </div>
        </div>
      </Card>

      {/* Letzte Aktivitäten */}
      <Card title={locale === 'ar' ? 'آخر الأنشطة' : 'Letzte Aktivitäten'}>
        <ul className="space-y-2 text-gray-600">
          <li className="flex justify-between p-2 hover:bg-gray-50 rounded">
            <span>{locale === 'ar' ? 'مريض جديد مسجل' : 'Neuer Patient registriert'}: أحمد محمد</span>
            <span className="text-gray-400">vor 2h</span>
          </li>
          <li className="flex justify-between p-2 hover:bg-gray-50 rounded">
            <span>{locale === 'ar' ? 'تحديث بيانات طبيب' : 'Arzt-Daten aktualisiert'}: Dr. Smith</span>
            <span className="text-gray-400">vor 5h</span>
          </li>
          <li className="flex justify-between p-2 hover:bg-gray-50 rounded">
            <span>{locale === 'ar' ? 'تصدير البيانات' : 'Datenexport durchgeführt'}</span>
            <span className="text-gray-400">vor 1d</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

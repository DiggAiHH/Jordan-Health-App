import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

// Mock-Daten für Demo-Zwecke
const mockStats = {
  totalPatients: 24,
  criticalAlerts: 3,
  pendingMessages: 7,
  todayAppointments: 5,
};

const mockRecentAlerts = [
  { id: '1', patientName: 'أحمد محمد', type: 'hypoglycemia_pattern', severity: 'critical' as const },
  { id: '2', patientName: 'سارة علي', type: 'missed_readings', severity: 'warning' as const },
  { id: '3', patientName: 'محمود خالد', type: 'hyperglycemia_pattern', severity: 'warning' as const },
];

/**
 * Arzt-Dashboard mit Übersicht über Patienten und Alerts
 */
export function Dashboard() {
  const { t, locale } = useAppLocale();

  const severityColors = {
    critical: 'bg-red-100 border-red-300 text-red-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
  };

  const alertTypeLabels: Record<string, { de: string; ar: string }> = {
    hypoglycemia_pattern: { de: 'Hypoglykämie-Muster', ar: 'نمط نقص السكر' },
    hyperglycemia_pattern: { de: 'Hyperglykämie-Muster', ar: 'نمط ارتفاع السكر' },
    missed_readings: { de: 'Fehlende Messungen', ar: 'قراءات مفقودة' },
    high_variability: { de: 'Hohe Variabilität', ar: 'تباين عالي' },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.doctor.dashboard}</h2>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-4xl font-bold text-green-600">{mockStats.totalPatients}</div>
          <div className="text-gray-600 mt-1">{t.doctor.patients}</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-4xl font-bold text-red-600">{mockStats.criticalAlerts}</div>
          <div className="text-gray-600 mt-1">{t.doctor.alerts}</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-4xl font-bold text-blue-600">{mockStats.pendingMessages}</div>
          <div className="text-gray-600 mt-1">
            {locale === 'ar' ? 'رسائل معلقة' : 'Offene Nachrichten'}
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="text-4xl font-bold text-purple-600">{mockStats.todayAppointments}</div>
          <div className="text-gray-600 mt-1">
            {locale === 'ar' ? 'مواعيد اليوم' : 'Termine heute'}
          </div>
        </Card>
      </div>

      {/* Aktuelle Warnungen */}
      <Card title={locale === 'ar' ? 'تنبيهات عاجلة' : 'Aktuelle Warnungen'}>
        {mockRecentAlerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">{t.doctor.noAlerts}</p>
        ) : (
          <ul className="space-y-3">
            {mockRecentAlerts.map((alert) => (
              <li
                key={alert.id}
                className={`p-4 rounded-xl border-2 ${severityColors[alert.severity]}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{alert.patientName}</div>
                    <div className="text-sm mt-1">
                      {alertTypeLabels[alert.type]?.[locale] || alert.type}
                    </div>
                  </div>
                  <Link to={`/patients/${alert.id}`}>
                    <Button variant="secondary" size="sm">
                      {locale === 'ar' ? 'عرض' : 'Ansehen'}
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <Link to="/alerts" className="block mt-4">
          <Button variant="secondary" fullWidth>
            {locale === 'ar' ? 'جميع التنبيهات' : 'Alle Warnungen'}
          </Button>
        </Link>
      </Card>

      {/* Schnellaktionen */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/patients">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-4xl">👥</span>
              <div>
                <div className="font-bold text-lg">{t.doctor.patients}</div>
                <div className="text-gray-500">
                  {locale === 'ar' ? 'إدارة المرضى' : 'Patienten verwalten'}
                </div>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/alerts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🤖</span>
              <div>
                <div className="font-bold text-lg">{t.doctor.aiSuggestions}</div>
                <div className="text-gray-500">
                  {locale === 'ar' ? 'تحليل ذكي' : 'KI-Analyse'}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

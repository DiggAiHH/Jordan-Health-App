
import { Link } from 'react-router-dom';
import { Card, Button } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

// Mock-Alerts
const mockAlerts = [
  {
    id: '1',
    patientId: '1',
    patientName: 'أحمد محمد',
    type: 'hypoglycemia_pattern',
    severity: 'critical' as const,
    message: 'Mehrere Hypoglykämie-Episoden in den letzten 48 Stunden erkannt.',
    messageArabic: 'تم رصد عدة نوبات انخفاض سكر في آخر 48 ساعة.',
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'سارة علي',
    type: 'missed_readings',
    severity: 'warning' as const,
    message: 'Keine Blutzuckermessung seit 24 Stunden.',
    messageArabic: 'لا توجد قراءات سكر منذ 24 ساعة.',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'محمود خالد',
    type: 'hyperglycemia_pattern',
    severity: 'warning' as const,
    message: 'Postprandiale Werte konstant über 200 mg/dL.',
    messageArabic: 'قراءات ما بعد الوجبة تتجاوز 200 ملغ/ديسيلتر باستمرار.',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'فاطمة حسن',
    type: 'high_variability',
    severity: 'info' as const,
    message: 'Hohe Schwankungen bei den Blutzuckerwerten.',
    messageArabic: 'تباين عالي في قراءات سكر الدم.',
    createdAt: new Date(Date.now() - 14400000),
  },
];

/**
 * Alerts-Seite für Ärzte
 * Zeigt alle Warnungen und Benachrichtigungen
 */
export function Alerts() {
  const { t, locale } = useAppLocale();

  const severityColors = {
    critical: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', icon: '🚨' },
    warning: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', icon: '⚠️' },
    info: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', icon: 'ℹ️' },
  };

  const severityLabels: Record<string, { de: string; ar: string }> = {
    critical: { de: 'Kritisch', ar: 'حرج' },
    warning: { de: 'Warnung', ar: 'تحذير' },
    info: { de: 'Info', ar: 'معلومة' },
  };

  const alertTypeLabels: Record<string, { de: string; ar: string }> = {
    hypoglycemia_pattern: { de: 'Hypoglykämie-Muster', ar: 'نمط نقص السكر' },
    hyperglycemia_pattern: { de: 'Hyperglykämie-Muster', ar: 'نمط ارتفاع السكر' },
    missed_readings: { de: 'Fehlende Messungen', ar: 'قراءات مفقودة' },
    high_variability: { de: 'Hohe Variabilität', ar: 'تباين عالي' },
  };

  const formatTimeAgo = (date: Date): string => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    
    if (minutes < 60) {
      return locale === 'ar' 
        ? `قبل ${minutes} دقيقة`
        : `vor ${minutes} Minuten`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return locale === 'ar'
        ? `قبل ${hours} ساعة`
        : `vor ${hours} Stunden`;
    }
    
    const days = Math.floor(hours / 24);
    return locale === 'ar'
      ? `قبل ${days} يوم`
      : `vor ${days} Tagen`;
  };

  const criticalCount = mockAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = mockAlerts.filter(a => a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.doctor.alerts}</h2>

      {/* Übersicht */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
          <div className="text-gray-600">{severityLabels.critical[locale]}</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
          <div className="text-gray-600">{severityLabels.warning[locale]}</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-600">{mockAlerts.length}</div>
          <div className="text-gray-600">{locale === 'ar' ? 'الإجمالي' : 'Gesamt'}</div>
        </Card>
      </div>

      {/* Alert-Liste */}
      <div className="space-y-3">
        {mockAlerts.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl mb-4 block">✅</span>
            <p className="text-xl text-gray-500">{t.doctor.noAlerts}</p>
          </Card>
        ) : (
          mockAlerts.map((alert) => {
            const style = severityColors[alert.severity];
            return (
              <Card
                key={alert.id}
                className={`${style.bg} ${style.border} border-2`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{style.icon}</span>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-bold text-lg ${style.text}`}>
                        {alert.patientName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-sm font-semibold ${style.bg} ${style.text}`}>
                        {alertTypeLabels[alert.type]?.[locale] || alert.type}
                      </span>
                    </div>
                    
                    <p className={`${style.text}`}>
                      {locale === 'ar' ? alert.messageArabic : alert.message}
                    </p>
                    
                    <p className="text-gray-500 text-sm mt-2">
                      {formatTimeAgo(alert.createdAt)}
                    </p>
                  </div>
                  
                  <Link to={`/patients/${alert.patientId}`}>
                    <Button variant="secondary" size="sm">
                      {locale === 'ar' ? 'عرض التفاصيل' : 'Details'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

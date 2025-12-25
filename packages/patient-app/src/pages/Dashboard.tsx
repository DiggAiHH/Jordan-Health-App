import React from 'react';
import { Link } from 'react-router-dom';
import { Card, GlucoseValueDisplay, Button, Alert } from '@jordan-health/shared';
import { calculateTimeInRange, assessRiskLevel, calculateGlucoseTrend } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import { useBloodGlucoseStore } from '../hooks/useBloodGlucoseStore';

/**
 * Dashboard-Seite für Patienten
 * Zeigt wichtigste Informationen auf einen Blick
 */
export function Dashboard() {
  const { t, locale } = useAppLocale();
  const { readings, loading, getLatestReading, getReadingsForPeriod } = useBloodGlucoseStore();

  const latestReading = getLatestReading();
  const last7Days = getReadingsForPeriod(7);
  const timeInRange = calculateTimeInRange(last7Days);
  const riskLevel = assessRiskLevel(last7Days);
  const trend = calculateGlucoseTrend(last7Days);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const riskColors = {
    low: 'bg-green-100 border-green-300 text-green-800',
    moderate: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    high: 'bg-orange-100 border-orange-300 text-orange-800',
    critical: 'bg-red-100 border-red-300 text-red-800',
  };

  const trendLabels = {
    improving: { de: '📈 Verbesserung', ar: '📈 تحسن' },
    stable: { de: '➡️ Stabil', ar: '➡️ مستقر' },
    worsening: { de: '📉 Verschlechterung', ar: '📉 تراجع' },
    highly_variable: { de: '⚠️ Sehr variabel', ar: '⚠️ متغير جداً' },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{t.patient.dashboard}</h2>

      {/* Aktuelle Messung */}
      <Card title={t.patient.bloodGlucose} className="text-center">
        {latestReading ? (
          <>
            <GlucoseValueDisplay
              value={latestReading.value}
              size="xl"
              locale={locale}
            />
            <p className="text-gray-500 mt-4 text-lg">
              {new Date(latestReading.timestamp).toLocaleString(locale === 'ar' ? 'ar-JO' : 'de-DE')}
            </p>
          </>
        ) : (
          <div className="py-8">
            <p className="text-xl text-gray-500 mb-4">
              {locale === 'ar' ? 'لا توجد قراءات بعد' : 'Noch keine Messungen vorhanden'}
            </p>
            <Link to="/glucose/add">
              <Button variant="primary" size="lg">
                {t.patient.addReading}
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Schnellaktion */}
      <Link to="/glucose/add" className="block">
        <Card className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <div className="flex items-center justify-center py-4">
            <span className="text-4xl mr-4">➕</span>
            <span className="text-2xl font-bold">{t.patient.addReading}</span>
          </div>
        </Card>
      </Link>

      {/* Statistiken der letzten 7 Tage */}
      {last7Days.length > 0 && (
        <Card title={locale === 'ar' ? 'آخر 7 أيام' : 'Letzte 7 Tage'}>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600">{timeInRange}%</div>
              <div className="text-base text-gray-600 mt-1">{t.patient.timeInRange}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-800">{last7Days.length}</div>
              <div className="text-base text-gray-600 mt-1">
                {locale === 'ar' ? 'القراءات' : 'Messungen'}
              </div>
            </div>
          </div>

          {/* Trend */}
          <div className="mt-4 text-center">
            <span className="text-xl font-semibold">
              {trendLabels[trend][locale]}
            </span>
          </div>
        </Card>
      )}

      {/* Risikowarnung */}
      {riskLevel !== 'low' && (
        <Alert
          type={riskLevel === 'critical' ? 'error' : riskLevel === 'high' ? 'warning' : 'info'}
          title={locale === 'ar' ? 'تنبيه صحي' : 'Gesundheitshinweis'}
        >
          {riskLevel === 'critical' && (
            locale === 'ar' 
              ? 'يرجى التواصل مع طبيبك فوراً. تم رصد قيم حرجة.'
              : 'Bitte kontaktieren Sie sofort Ihren Arzt. Kritische Werte wurden festgestellt.'
          )}
          {riskLevel === 'high' && (
            locale === 'ar'
              ? 'يُنصح بمراجعة طبيبك. تم رصد انحرافات متكررة.'
              : 'Eine Rücksprache mit Ihrem Arzt wird empfohlen. Häufige Abweichungen wurden festgestellt.'
          )}
          {riskLevel === 'moderate' && (
            locale === 'ar'
              ? 'راقب قراءاتك بعناية وتواصل مع طبيبك إذا استمر الوضع.'
              : 'Beobachten Sie Ihre Werte aufmerksam und kontaktieren Sie Ihren Arzt bei Fortbestehen.'
          )}
        </Alert>
      )}

      {/* Chat-Button */}
      <Link to="/chat" className="block">
        <Card className="bg-green-600 text-white hover:bg-green-700 transition-colors">
          <div className="flex items-center justify-center py-4">
            <span className="text-4xl mr-4">💬</span>
            <span className="text-2xl font-bold">{t.patient.chat}</span>
          </div>
        </Card>
      </Link>
    </div>
  );
}

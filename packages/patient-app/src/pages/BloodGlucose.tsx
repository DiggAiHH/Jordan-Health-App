import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, GlucoseValueDisplay, LoadingSpinner } from '@jordan-health/shared';
import { formatDateTime, translateMeasurementContext } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import { useBloodGlucoseStore } from '../hooks/useBloodGlucoseStore';

/**
 * Blutzucker-Übersichtsseite
 * Zeigt letzte Messungen und ermöglicht neue Einträge
 */
export function BloodGlucose() {
  const { t, locale } = useAppLocale();
  const { readings, loading, getLatestReading } = useBloodGlucoseStore();

  const latestReading = getLatestReading();
  const recentReadings = readings.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text={t.common.loading} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{t.patient.bloodGlucose}</h2>
      </div>

      {/* Aktuelle Messung */}
      <Card title={locale === 'ar' ? 'القراءة الأخيرة' : 'Letzte Messung'}>
        {latestReading ? (
          <div className="text-center">
            <GlucoseValueDisplay
              value={latestReading.value}
              size="lg"
              locale={locale}
            />
            <p className="text-gray-500 mt-3 text-lg">
              {formatDateTime(latestReading.timestamp, locale)}
            </p>
            <p className="text-gray-600 mt-1">
              {translateMeasurementContext(latestReading.measurementContext, locale)}
            </p>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-500 py-8">
            {locale === 'ar' ? 'لا توجد قراءات بعد' : 'Noch keine Messungen'}
          </p>
        )}
      </Card>

      {/* Neue Messung Button */}
      <Link to="/glucose/add" className="block">
        <Button variant="primary" size="lg" fullWidth>
          <span className="mr-2">➕</span>
          {t.patient.addReading}
        </Button>
      </Link>

      {/* Letzte Messungen */}
      {recentReadings.length > 0 && (
        <Card title={locale === 'ar' ? 'آخر القراءات' : 'Letzte Messungen'}>
          <ul className="divide-y divide-gray-200">
            {recentReadings.map((reading) => (
              <li key={reading.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <GlucoseValueDisplay
                      value={reading.value}
                      size="sm"
                      showLabel={false}
                      locale={locale}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-base text-gray-600">
                      {formatDateTime(reading.timestamp, locale)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {translateMeasurementContext(reading.measurementContext, locale)}
                    </p>
                  </div>
                </div>
                {reading.notes && (
                  <p className="text-gray-500 text-sm mt-2 italic">
                    {reading.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
          
          <Link to="/history" className="block mt-4">
            <Button variant="secondary" fullWidth>
              {t.patient.history}
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

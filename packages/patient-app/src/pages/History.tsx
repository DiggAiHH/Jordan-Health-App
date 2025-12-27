import React, { useState, useMemo } from 'react';
import { Card, LoadingSpinner, Button } from '@jordan-health/shared';
import { 
  formatDate, 
  formatGlucoseValue, 
  classifyGlucoseValue,
  translateMeasurementContext,
  groupReadingsByDay,
  calculateDailyStats 
} from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import { useBloodGlucoseStore } from '../hooks/useBloodGlucoseStore';

type ViewMode = '7days' | '14days' | '30days';

/**
 * Verlaufsseite für Blutzuckermessungen
 * Gruppierte Ansicht nach Tagen mit Statistiken
 */
export function History() {
  const { t, locale } = useAppLocale();
  const { readings, loading, deleteReading } = useBloodGlucoseStore();
  const [viewMode, setViewMode] = useState<ViewMode>('7days');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const daysMap: Record<ViewMode, number> = {
    '7days': 7,
    '14days': 14,
    '30days': 30,
  };

  const filteredReadings = useMemo(() => {
    const days = daysMap[viewMode];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return readings.filter(r => new Date(r.timestamp) >= cutoff);
  }, [readings, viewMode]);

  const groupedByDay = useMemo(() => {
    return groupReadingsByDay(filteredReadings);
  }, [filteredReadings]);

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    
    const confirmMessage = locale === 'ar' 
      ? 'هل أنت متأكد من حذف هذه القراءة؟'
      : 'Sind Sie sicher, dass Sie diese Messung löschen möchten?';
    
    if (window.confirm(confirmMessage)) {
      setDeletingId(id);
      try {
        deleteReading(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text={t.common.loading} />
      </div>
    );
  }

  const viewModeLabels: Record<ViewMode, { de: string; ar: string }> = {
    '7days': { de: '7 Tage', ar: '7 أيام' },
    '14days': { de: '14 Tage', ar: '14 يوم' },
    '30days': { de: '30 Tage', ar: '30 يوم' },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{t.patient.history}</h2>

      {/* Zeitraum-Auswahl */}
      <div className="flex gap-2">
        {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`
              flex-1 py-3 px-4 rounded-xl font-semibold text-lg
              transition-all duration-200 min-h-[52px]
              focus:outline-none focus:ring-4 focus:ring-blue-300
              ${viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {viewModeLabels[mode][locale]}
          </button>
        ))}
      </div>

      {/* Statistik-Übersicht */}
      {filteredReadings.length > 0 && (
        <Card>
          <div className="grid grid-cols-3 gap-4 text-center">
            {(() => {
              const stats = calculateDailyStats(filteredReadings);
              return (
                <>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.average}
                    </div>
                    <div className="text-base text-gray-600">
                      {t.patient.average}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {stats.min}
                    </div>
                    <div className="text-base text-gray-600">
                      {locale === 'ar' ? 'الأدنى' : 'Min'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">
                      {stats.max}
                    </div>
                    <div className="text-base text-gray-600">
                      {locale === 'ar' ? 'الأعلى' : 'Max'}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </Card>
      )}

      {/* Gruppierte Messungen */}
      {filteredReadings.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-xl text-gray-500">
            {locale === 'ar' 
              ? 'لا توجد قراءات في هذه الفترة'
              : 'Keine Messungen in diesem Zeitraum'}
          </p>
        </Card>
      ) : (
        Array.from(groupedByDay.entries())
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([day, dayReadings]) => {
            const dailyStats = calculateDailyStats(dayReadings);
            
            return (
              <Card key={day}>
                {/* Tag-Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800">
                    {formatDate(day, locale)}
                  </h3>
                  <div className="text-base text-gray-600">
                    {locale === 'ar' ? 'المعدل:' : 'Ø:'} {dailyStats.average} mg/dL
                  </div>
                </div>

                {/* Messungen des Tages */}
                <ul className="space-y-3">
                  {dayReadings
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((reading) => {
                      const classification = classifyGlucoseValue(reading.value);
                      return (
                        <li 
                          key={reading.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="text-2xl font-bold min-w-[100px]"
                              style={{ color: classification.color }}
                            >
                              {formatGlucoseValue(reading.value)}
                            </div>
                            <div>
                              <div className="text-base text-gray-700">
                                {new Date(reading.timestamp).toLocaleTimeString(
                                  locale === 'ar' ? 'ar-JO' : 'de-DE',
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {translateMeasurementContext(reading.measurementContext, locale)}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(reading.id)}
                            disabled={deletingId === reading.id}
                          >
                            {deletingId === reading.id ? '...' : '🗑️'}
                          </Button>
                        </li>
                      );
                    })}
                </ul>
              </Card>
            );
          })
      )}
    </div>
  );
}

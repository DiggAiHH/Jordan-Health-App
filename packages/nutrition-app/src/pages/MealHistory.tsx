import React, { useState, useMemo } from 'react';
import { Card, Button, LoadingSpinner } from '@jordan-health/shared';
import { formatDate } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import { useMealStore } from '../hooks/useMealStore';

type ViewMode = '7days' | '14days' | '30days';

/**
 * Mahlzeiten-Verlauf mit Statistiken
 */
export function MealHistory() {
  const { t, locale } = useAppLocale();
  const { meals, loading, deleteMeal, getMealsForPeriod } = useMealStore();
  const [viewMode, setViewMode] = useState<ViewMode>('7days');

  const daysMap: Record<ViewMode, number> = {
    '7days': 7,
    '14days': 14,
    '30days': 30,
  };

  const filteredMeals = useMemo(() => {
    return getMealsForPeriod(daysMap[viewMode]);
  }, [getMealsForPeriod, viewMode]);

  const stats = useMemo(() => {
    const totalCarbs = filteredMeals.reduce((sum, m) => sum + m.totalCarbohydrates, 0);
    const totalCalories = filteredMeals.reduce((sum, m) => sum + m.totalCalories, 0);
    const avgCarbs = filteredMeals.length > 0 ? Math.round(totalCarbs / filteredMeals.length) : 0;
    const avgCalories = filteredMeals.length > 0 ? Math.round(totalCalories / filteredMeals.length) : 0;
    
    return { totalCarbs, totalCalories, avgCarbs, avgCalories, count: filteredMeals.length };
  }, [filteredMeals]);

  const handleDelete = (id: string) => {
    const confirmMessage = locale === 'ar'
      ? 'هل أنت متأكد من حذف هذه الوجبة؟'
      : 'Sind Sie sicher, dass Sie diese Mahlzeit löschen möchten?';
    
    if (window.confirm(confirmMessage)) {
      deleteMeal(id);
    }
  };

  const mealTypeIcons: Record<string, string> = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍎',
  };

  const mealTypeLabels: Record<string, { de: string; ar: string }> = {
    breakfast: { de: 'Frühstück', ar: 'فطور' },
    lunch: { de: 'Mittagessen', ar: 'غداء' },
    dinner: { de: 'Abendessen', ar: 'عشاء' },
    snack: { de: 'Snack', ar: 'وجبة خفيفة' },
  };

  const viewModeLabels: Record<ViewMode, { de: string; ar: string }> = {
    '7days': { de: '7 Tage', ar: '7 أيام' },
    '14days': { de: '14 Tage', ar: '14 يوم' },
    '30days': { de: '30 Tage', ar: '30 يوم' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text={t.common.loading} />
      </div>
    );
  }

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
              focus:outline-none focus:ring-4 focus:ring-amber-300
              ${viewMode === mode
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {viewModeLabels[mode][locale]}
          </button>
        ))}
      </div>

      {/* Statistiken */}
      <Card>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-600">{stats.avgCarbs}g</div>
            <div className="text-gray-600">{locale === 'ar' ? 'متوسط KH/وجبة' : 'Ø KH/Mahlzeit'}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">{stats.avgCalories}</div>
            <div className="text-gray-600">{locale === 'ar' ? 'متوسط kcal' : 'Ø kcal'}</div>
          </div>
        </div>
        <div className="text-center mt-4 text-gray-500">
          {stats.count} {locale === 'ar' ? 'وجبات' : 'Mahlzeiten'}
        </div>
      </Card>

      {/* Mahlzeiten-Liste */}
      {filteredMeals.length === 0 ? (
        <Card className="text-center py-12">
          <span className="text-6xl block mb-4">🍽️</span>
          <p className="text-xl text-gray-500">
            {locale === 'ar' ? 'لا توجد وجبات في هذه الفترة' : 'Keine Mahlzeiten in diesem Zeitraum'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMeals
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((meal) => (
              <Card key={meal.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{mealTypeIcons[meal.mealType]}</span>
                    <div>
                      <div className="font-bold text-lg">
                        {mealTypeLabels[meal.mealType][locale]}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {formatDate(meal.timestamp, locale)} •{' '}
                        {new Date(meal.timestamp).toLocaleTimeString(
                          locale === 'ar' ? 'ar-JO' : 'de-DE',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {meal.items.length} {locale === 'ar' ? 'أصناف' : 'Lebensmittel'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-amber-700">{meal.totalCarbohydrates}g KH</div>
                      <div className="text-gray-500 text-sm">{meal.totalCalories} kcal</div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(meal.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>

                {/* Lebensmittel-Details */}
                {meal.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {meal.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{locale === 'ar' ? item.nameArabic : item.name}</span>
                          <span>{item.carbohydrates}g KH</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Blutzucker-Werte wenn vorhanden */}
                {(meal.bloodGlucoseBefore || meal.bloodGlucoseAfter) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-4 text-sm">
                    {meal.bloodGlucoseBefore && (
                      <span className="text-gray-600">
                        {locale === 'ar' ? 'قبل:' : 'Vorher:'} {meal.bloodGlucoseBefore} mg/dL
                      </span>
                    )}
                    {meal.bloodGlucoseAfter && (
                      <span className="text-gray-600">
                        {locale === 'ar' ? 'بعد:' : 'Nachher:'} {meal.bloodGlucoseAfter} mg/dL
                      </span>
                    )}
                  </div>
                )}
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

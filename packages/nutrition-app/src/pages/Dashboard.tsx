import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import { useMealStore } from '../hooks/useMealStore';

/**
 * Dashboard für die Ernährungs-App
 * Zeigt heutige Mahlzeiten und Tagesübersicht
 */
export function Dashboard() {
  const { t, locale } = useAppLocale();
  const { loading, getTodaysMeals } = useMealStore();

  const todaysMeals = getTodaysMeals();

  const totalCarbs = todaysMeals.reduce((sum, m) => sum + m.totalCarbohydrates, 0);
  const totalCalories = todaysMeals.reduce((sum, m) => sum + m.totalCalories, 0);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text={t.common.loading} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{t.nutrition.dashboard}</h2>

      {/* Tagesübersicht */}
      <Card title={locale === 'ar' ? 'ملخص اليوم' : 'Tagesübersicht'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-amber-100 rounded-xl">
            <div className="text-4xl font-bold text-amber-700">{totalCarbs}g</div>
            <div className="text-gray-600 mt-1">{t.nutrition.carbohydrates}</div>
          </div>
          <div className="text-center p-4 bg-orange-100 rounded-xl">
            <div className="text-4xl font-bold text-orange-700">{totalCalories}</div>
            <div className="text-gray-600 mt-1">{t.nutrition.calories}</div>
          </div>
        </div>
        <div className="text-center mt-4 text-gray-500">
          {todaysMeals.length} {locale === 'ar' ? 'وجبات اليوم' : 'Mahlzeiten heute'}
        </div>
      </Card>

      {/* Schnell-Aktion: Mahlzeit hinzufügen */}
      <Link to="/add" className="block">
        <Card className="bg-amber-600 text-white hover:bg-amber-700 transition-colors">
          <div className="flex items-center justify-center py-4">
            <span className="text-4xl mr-4">➕</span>
            <span className="text-2xl font-bold">{t.nutrition.addMeal}</span>
          </div>
        </Card>
      </Link>

      {/* Heutige Mahlzeiten */}
      <Card title={t.nutrition.todaysMeals}>
        {todaysMeals.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">🍽️</span>
            <p className="text-xl text-gray-500">
              {locale === 'ar' ? 'لا توجد وجبات مسجلة اليوم' : 'Heute noch keine Mahlzeiten erfasst'}
            </p>
            <Link to="/add" className="block mt-4">
              <Button variant="primary">
                {t.nutrition.addMeal}
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {todaysMeals.map((meal) => (
              <li
                key={meal.id}
                className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{mealTypeIcons[meal.mealType]}</span>
                  <div>
                    <div className="font-bold text-lg">
                      {mealTypeLabels[meal.mealType][locale]}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(meal.timestamp).toLocaleTimeString(
                        locale === 'ar' ? 'ar-JO' : 'de-DE',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-700">
                    {meal.totalCarbohydrates}g KH
                  </div>
                  <div className="text-gray-500 text-sm">
                    {meal.totalCalories} kcal
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Empfehlungen */}
      <Card title={locale === 'ar' ? 'نصائح' : 'Tipps'}>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">💡</span>
            <p className="text-gray-700">
              {locale === 'ar'
                ? 'تناول وجبات صغيرة ومتعددة يساعد في استقرار مستوى السكر في الدم.'
                : 'Kleine, häufige Mahlzeiten helfen dabei, den Blutzucker stabil zu halten.'}
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">🥬</span>
            <p className="text-gray-700">
              {locale === 'ar'
                ? 'الخضروات الورقية لها مؤشر سكر منخفض وغنية بالألياف.'
                : 'Blattgemüse hat einen niedrigen glykämischen Index und ist ballaststoffreich.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert } from '@jordan-health/shared';
import type { MealType, MealItem, GlycemicIndexCategory } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import { useMealStore } from '../hooks/useMealStore';

// Vordefinierte Lebensmittel für Jordanien/Nahost
const commonFoods: Array<{
  name: string;
  nameArabic: string;
  carbohydrates: number;
  calories: number;
  glycemicIndex: GlycemicIndexCategory;
}> = [
  { name: 'Fladenbrot (1 Stück)', nameArabic: 'خبز عربي (قطعة)', carbohydrates: 30, calories: 165, glycemicIndex: 'high' },
  { name: 'Reis (1 Tasse)', nameArabic: 'أرز (كوب)', carbohydrates: 45, calories: 200, glycemicIndex: 'high' },
  { name: 'Linsensuppe (1 Tasse)', nameArabic: 'شوربة عدس (كوب)', carbohydrates: 20, calories: 180, glycemicIndex: 'low' },
  { name: 'Hummus (2 EL)', nameArabic: 'حمص (ملعقتين)', carbohydrates: 8, calories: 70, glycemicIndex: 'low' },
  { name: 'Falafel (3 Stück)', nameArabic: 'فلافل (3 قطع)', carbohydrates: 18, calories: 180, glycemicIndex: 'medium' },
  { name: 'Joghurt (1 Tasse)', nameArabic: 'لبن (كوب)', carbohydrates: 12, calories: 150, glycemicIndex: 'low' },
  { name: 'Datteln (3 Stück)', nameArabic: 'تمر (3 حبات)', carbohydrates: 54, calories: 200, glycemicIndex: 'high' },
  { name: 'Olivenöl (1 EL)', nameArabic: 'زيت زيتون (ملعقة)', carbohydrates: 0, calories: 120, glycemicIndex: 'low' },
  { name: 'Gurke', nameArabic: 'خيار', carbohydrates: 2, calories: 15, glycemicIndex: 'low' },
  { name: 'Tomate', nameArabic: 'بندورة', carbohydrates: 4, calories: 20, glycemicIndex: 'low' },
  { name: 'Hähnchen (100g)', nameArabic: 'دجاج (100 غرام)', carbohydrates: 0, calories: 165, glycemicIndex: 'low' },
  { name: 'Ei (1 Stück)', nameArabic: 'بيضة', carbohydrates: 1, calories: 70, glycemicIndex: 'low' },
];

/**
 * Formular zum Hinzufügen einer neuen Mahlzeit
 */
export function AddMeal() {
  const { t, locale } = useAppLocale();
  const navigate = useNavigate();
  const { addMeal } = useMealStore();

  const [mealType, setMealType] = useState<MealType>('lunch');
  const [selectedItems, setSelectedItems] = useState<MealItem[]>([]);
  const [notes, setNotes] = useState('');
  const [glucoseBefore, setGlucoseBefore] = useState('');
  const [glucoseAfter, setGlucoseAfter] = useState('');
  const [success, setSuccess] = useState(false);

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  const mealTypeLabels: Record<MealType, { de: string; ar: string; icon: string }> = {
    breakfast: { de: 'Frühstück', ar: 'فطور', icon: '🍳' },
    lunch: { de: 'Mittagessen', ar: 'غداء', icon: '🥗' },
    dinner: { de: 'Abendessen', ar: 'عشاء', icon: '🍽️' },
    snack: { de: 'Snack', ar: 'وجبة خفيفة', icon: '🍎' },
  };

  const giLabels: Record<GlycemicIndexCategory, { de: string; ar: string; color: string }> = {
    low: { de: 'Niedrig', ar: 'منخفض', color: 'text-green-600' },
    medium: { de: 'Mittel', ar: 'متوسط', color: 'text-yellow-600' },
    high: { de: 'Hoch', ar: 'مرتفع', color: 'text-red-600' },
  };

  const handleAddFood = (food: typeof commonFoods[0]) => {
    const newItem: MealItem = {
      name: food.name,
      nameArabic: food.nameArabic,
      portion: '1',
      carbohydrates: food.carbohydrates,
      calories: food.calories,
      glycemicIndex: food.glycemicIndex,
    };
    setSelectedItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) return;

    addMeal(
      mealType,
      selectedItems,
      notes || undefined,
      glucoseBefore ? parseFloat(glucoseBefore) : undefined,
      glucoseAfter ? parseFloat(glucoseAfter) : undefined
    );

    setSuccess(true);
    setTimeout(() => navigate('/'), 1500);
  };

  const totalCarbs = selectedItems.reduce((sum, item) => sum + item.carbohydrates, 0);
  const totalCalories = selectedItems.reduce((sum, item) => sum + item.calories, 0);

  if (success) {
    return (
      <div className="space-y-6">
        <Alert type="success" title={t.common.success}>
          {locale === 'ar' ? 'تم حفظ الوجبة بنجاح!' : 'Mahlzeit erfolgreich gespeichert!'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{t.nutrition.addMeal}</h2>

      <form onSubmit={handleSubmit}>
        {/* Mahlzeitentyp */}
        <Card title={t.nutrition.mealType}>
          <div className="grid grid-cols-2 gap-3">
            {mealTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`
                  p-4 rounded-xl text-lg font-medium
                  border-2 transition-all duration-200
                  flex items-center justify-center gap-2
                  focus:outline-none focus:ring-4 focus:ring-amber-300
                  ${mealType === type
                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                <span className="text-2xl">{mealTypeLabels[type].icon}</span>
                {mealTypeLabels[type][locale]}
              </button>
            ))}
          </div>
        </Card>

        {/* Lebensmittel auswählen */}
        <Card title={t.nutrition.addItem} className="mt-6">
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {commonFoods.map((food, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAddFood(food)}
                className="p-3 text-left bg-gray-50 hover:bg-amber-50 rounded-lg
                  transition-colors duration-200 border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="font-medium text-gray-800">
                  {locale === 'ar' ? food.nameArabic : food.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {food.carbohydrates}g KH • {food.calories} kcal
                </div>
                <div className={`text-xs mt-1 ${giLabels[food.glycemicIndex].color}`}>
                  GI: {giLabels[food.glycemicIndex][locale]}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Ausgewählte Lebensmittel */}
        {selectedItems.length > 0 && (
          <Card title={locale === 'ar' ? 'الأطعمة المختارة' : 'Ausgewählte Lebensmittel'} className="mt-6">
            <ul className="space-y-2 mb-4">
              {selectedItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {locale === 'ar' ? item.nameArabic : item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.carbohydrates}g KH • {item.calories} kcal
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg
                      min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={locale === 'ar' ? 'حذف' : 'Entfernen'}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {/* Summe */}
            <div className="flex justify-between p-3 bg-amber-100 rounded-lg font-bold">
              <span>{locale === 'ar' ? 'المجموع' : 'Gesamt'}:</span>
              <span>{totalCarbs}g KH • {totalCalories} kcal</span>
            </div>
          </Card>
        )}

        {/* Blutzucker vor/nach */}
        <Card title={locale === 'ar' ? 'سكر الدم' : 'Blutzucker'} className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={locale === 'ar' ? 'قبل الوجبة' : 'Vor der Mahlzeit'}
              type="number"
              value={glucoseBefore}
              onChange={(e) => setGlucoseBefore(e.target.value)}
              placeholder="mg/dL"
              size="md"
            />
            <Input
              label={locale === 'ar' ? 'بعد الوجبة' : 'Nach der Mahlzeit'}
              type="number"
              value={glucoseAfter}
              onChange={(e) => setGlucoseAfter(e.target.value)}
              placeholder="mg/dL"
              size="md"
            />
          </div>
        </Card>

        {/* Notizen */}
        <Card className="mt-6">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            {t.patient.notes} ({t.common.optional})
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl
              focus:border-amber-500 focus:ring-4 focus:ring-amber-200 focus:outline-none"
            rows={2}
            placeholder={locale === 'ar' ? 'ملاحظات إضافية...' : 'Zusätzliche Notizen...'}
          />
        </Card>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            {t.common.cancel}
          </Button>
          <Button
            type="submit"
            variant="success"
            size="lg"
            className="flex-1"
            disabled={selectedItems.length === 0}
          >
            {t.common.save}
          </Button>
        </div>
      </form>
    </div>
  );
}

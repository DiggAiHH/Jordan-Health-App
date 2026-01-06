import { useState, useCallback, useEffect } from 'react';
import type { Meal, MealType, MealItem } from '@jordan-health/shared';
import { generateId } from '@jordan-health/shared';

const STORAGE_KEY = 'jordan-health-meals';

/**
 * Hook für Mahlzeiten-Datenverwaltung mit localStorage-Persistierung
 */
export function useMealStore() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // Initiales Laden aus localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Meal[];
        const withDates = parsed.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMeals(withDates);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Mahlzeiten:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistMeals = useCallback((newMeals: Meal[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMeals));
    } catch (error) {
      console.error('Fehler beim Speichern der Mahlzeiten:', error);
    }
  }, []);

  const addMeal = useCallback((
    mealType: MealType,
    items: MealItem[],
    notes?: string,
    bloodGlucoseBefore?: number,
    bloodGlucoseAfter?: number,
    photoUrl?: string
  ): Meal => {
    const totalCarbohydrates = items.reduce((sum, item) => sum + item.carbohydrates, 0);
    const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

    const newMeal: Meal = {
      id: generateId(),
      patientId: 'current-patient',
      timestamp: new Date(),
      mealType,
      items,
      totalCarbohydrates,
      totalCalories,
      notes,
      bloodGlucoseBefore,
      bloodGlucoseAfter,
      photoUrl,
    };

    setMeals(prev => {
      const updated = [newMeal, ...prev];
      persistMeals(updated);
      return updated;
    });

    return newMeal;
  }, [persistMeals]);

  const deleteMeal = useCallback((id: string) => {
    setMeals(prev => {
      const updated = prev.filter(m => m.id !== id);
      persistMeals(updated);
      return updated;
    });
  }, [persistMeals]);

  const getTodaysMeals = useCallback((): Meal[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meals.filter(m => new Date(m.timestamp) >= today);
  }, [meals]);

  const getMealsForPeriod = useCallback((days: number): Meal[] => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return meals.filter(m => new Date(m.timestamp) >= cutoff);
  }, [meals]);

  return {
    meals,
    loading,
    addMeal,
    deleteMeal,
    getTodaysMeals,
    getMealsForPeriod,
  };
}

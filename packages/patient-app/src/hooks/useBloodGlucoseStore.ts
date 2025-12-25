import { useState, useCallback, useEffect } from 'react';
import type { BloodGlucoseReading, MeasurementContext } from '@jordan-health/shared';
import { generateId } from '@jordan-health/shared';

const STORAGE_KEY = 'jordan-health-glucose-readings';

/**
 * Hook für Blutzucker-Datenverwaltung mit localStorage-Persistierung
 * In Produktion würde dies durch API-Calls ersetzt werden
 */
export function useBloodGlucoseStore() {
  const [readings, setReadings] = useState<BloodGlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);

  // Initiales Laden aus localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BloodGlucoseReading[];
        // Timestamps rekonstruieren
        const withDates = parsed.map(r => ({
          ...r,
          timestamp: new Date(r.timestamp),
        }));
        setReadings(withDates);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Blutzuckerdaten:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Speichern bei Änderungen
  const persistReadings = useCallback((newReadings: BloodGlucoseReading[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReadings));
    } catch (error) {
      console.error('Fehler beim Speichern der Blutzuckerdaten:', error);
    }
  }, []);

  const addReading = useCallback((
    value: number,
    context: MeasurementContext,
    notes?: string
  ): BloodGlucoseReading => {
    const newReading: BloodGlucoseReading = {
      id: generateId(),
      patientId: 'current-patient', // In Produktion: echte Patient-ID
      value,
      timestamp: new Date(),
      measurementContext: context,
      notes,
    };

    setReadings(prev => {
      const updated = [newReading, ...prev];
      persistReadings(updated);
      return updated;
    });

    return newReading;
  }, [persistReadings]);

  const deleteReading = useCallback((id: string) => {
    setReadings(prev => {
      const updated = prev.filter(r => r.id !== id);
      persistReadings(updated);
      return updated;
    });
  }, [persistReadings]);

  const getLatestReading = useCallback((): BloodGlucoseReading | undefined => {
    return readings[0];
  }, [readings]);

  const getReadingsForPeriod = useCallback((days: number): BloodGlucoseReading[] => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return readings.filter(r => new Date(r.timestamp) >= cutoff);
  }, [readings]);

  return {
    readings,
    loading,
    addReading,
    deleteReading,
    getLatestReading,
    getReadingsForPeriod,
  };
}

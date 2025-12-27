import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert } from '@jordan-health/shared';
import { validateBloodGlucose, translateMeasurementContext, type MeasurementContext } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import { useBloodGlucoseStore } from '../hooks/useBloodGlucoseStore';

const MEASUREMENT_CONTEXTS: MeasurementContext[] = [
  'fasting',
  'before_meal',
  'after_meal',
  'before_sleep',
  'random',
  'exercise',
];

/**
 * Formular zum Hinzufügen einer neuen Blutzuckermessung
 * Große Eingabefelder und klare Buttons für geriatrische Patienten
 */
export function AddReading() {
  const { t, locale } = useAppLocale();
  const navigate = useNavigate();
  const { addReading } = useBloodGlucoseStore();

  const [value, setValue] = useState('');
  const [context, setContext] = useState<MeasurementContext>('random');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numValue = parseFloat(value);
    const validation = validateBloodGlucose(numValue);

    if (!validation.valid) {
      setError(validation.error || t.validation.glucoseInvalid);
      return;
    }

    try {
      addReading(numValue, context, notes || undefined);
      setSuccess(true);
      
      // Nach kurzer Verzögerung zur Übersicht navigieren
      setTimeout(() => {
        navigate('/glucose');
      }, 1500);
    } catch (err) {
      setError(locale === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Fehler beim Speichern');
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <Alert type="success" title={t.common.success}>
          {locale === 'ar' 
            ? 'تم حفظ القراءة بنجاح!' 
            : 'Messung erfolgreich gespeichert!'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{t.patient.addReading}</h2>

      <form onSubmit={handleSubmit}>
        <Card>
          {/* Blutzuckerwert */}
          <Input
            label={`${t.patient.value} (mg/dL)`}
            type="number"
            inputMode="decimal"
            min={20}
            max={600}
            step={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={locale === 'ar' ? 'مثال: 120' : 'z.B. 120'}
            required
            size="lg"
            error={error || undefined}
          />

          {/* Messkontext */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              {t.patient.measurementContext}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MEASUREMENT_CONTEXTS.map((ctx) => (
                <button
                  key={ctx}
                  type="button"
                  onClick={() => setContext(ctx)}
                  className={`
                    p-4 rounded-xl text-lg font-medium
                    border-2 transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-blue-300
                    ${context === ctx
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }
                  `}
                >
                  {translateMeasurementContext(ctx, locale)}
                </button>
              ))}
            </div>
          </div>

          {/* Notizen */}
          <div className="mb-6">
            <label 
              htmlFor="notes"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              {t.patient.notes} ({t.common.optional})
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none
                transition-colors duration-200"
              rows={3}
              placeholder={locale === 'ar' ? 'ملاحظات إضافية...' : 'Zusätzliche Notizen...'}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
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
            >
              {t.common.save}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

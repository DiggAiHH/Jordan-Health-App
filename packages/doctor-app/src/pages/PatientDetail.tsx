import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, GlucoseValueDisplay, Alert } from '@jordan-health/shared';
import { 
  calculateTimeInRange, 
  assessRiskLevel, 
  calculateGlucoseTrend,
  formatDateTime,
  translateMeasurementContext,
  type BloodGlucoseReading 
} from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

// Mock-Patientendaten
const mockPatientData = {
  id: '1',
  firstName: 'أحمد',
  lastName: 'محمد',
  age: 72,
  diabetesType: 'type2' as const,
  diagnosisDate: new Date('2015-03-15'),
  phoneNumber: '+962791234567',
  emergencyContact: {
    name: 'محمد أحمد',
    relationship: 'Son',
    phoneNumber: '+962791234568',
  },
};

// Mock-Blutzuckerdaten
const mockReadings: BloodGlucoseReading[] = [
  { id: '1', patientId: '1', value: 185, timestamp: new Date(Date.now() - 3600000), measurementContext: 'after_meal' },
  { id: '2', patientId: '1', value: 142, timestamp: new Date(Date.now() - 7200000), measurementContext: 'fasting' },
  { id: '3', patientId: '1', value: 210, timestamp: new Date(Date.now() - 14400000), measurementContext: 'after_meal' },
  { id: '4', patientId: '1', value: 95, timestamp: new Date(Date.now() - 21600000), measurementContext: 'fasting' },
  { id: '5', patientId: '1', value: 178, timestamp: new Date(Date.now() - 28800000), measurementContext: 'before_sleep' },
  { id: '6', patientId: '1', value: 165, timestamp: new Date(Date.now() - 36000000), measurementContext: 'after_meal' },
  { id: '7', patientId: '1', value: 130, timestamp: new Date(Date.now() - 43200000), measurementContext: 'fasting' },
];

// Mock KI-Vorschläge
const mockAiSuggestions = [
  {
    id: '1',
    content: 'Die postprandialen Werte zeigen einen wiederkehrenden Anstieg über 180 mg/dL. Eine Anpassung der Mahlzeiten-Insulindosis könnte erwogen werden.',
    contentArabic: 'تظهر قراءات ما بعد الوجبة ارتفاعًا متكررًا فوق 180 ملغ/ديسيلتر. يُنصح بمراجعة جرعة الأنسولين مع الوجبات.',
    tone: 'informative' as const,
    confidence: 0.85,
  },
  {
    id: '2',
    content: 'Guten Tag Herr Mohammed, Ihre Werte zeigen eine Verbesserung bei den Nüchternmessungen. Bitte achten Sie weiterhin auf die Kohlenhydratzufuhr bei den Mahlzeiten.',
    contentArabic: 'مرحبًا السيد محمد، تظهر قراءاتك تحسنًا في قياسات الصيام. يرجى الاستمرار في مراقبة تناول الكربوهيدرات مع الوجبات.',
    tone: 'encouraging' as const,
    confidence: 0.92,
  },
  {
    id: '3',
    content: 'WICHTIG: Bitte melden Sie sich zeitnah in der Praxis. Wir müssen Ihre Medikation überprüfen.',
    contentArabic: 'هام: يرجى التواصل مع العيادة في أقرب وقت. نحتاج لمراجعة الأدوية الخاصة بك.',
    tone: 'cautionary' as const,
    confidence: 0.78,
  },
];

/**
 * Patientendetail-Seite mit KI-Analyse und Antwort-Vorschlägen
 */
export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useAppLocale();
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Berechnungen
  const timeInRange = calculateTimeInRange(mockReadings);
  const riskLevel = assessRiskLevel(mockReadings);
  const trend = calculateGlucoseTrend(mockReadings);
  const latestReading = mockReadings[0];

  const handleUseSuggestion = (suggestion: typeof mockAiSuggestions[0]) => {
    setSelectedSuggestion(suggestion.id);
    setCustomMessage(locale === 'ar' ? suggestion.contentArabic : suggestion.content);
  };

  const handleSendMessage = () => {
    if (!customMessage.trim()) return;
    
    // In Produktion: API-Call zum Senden der Nachricht
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
    setCustomMessage('');
    setSelectedSuggestion(null);
  };

  const riskColors = {
    low: 'text-green-600',
    moderate: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  };

  const riskLabels: Record<string, { de: string; ar: string }> = {
    low: { de: 'Niedrig', ar: 'منخفض' },
    moderate: { de: 'Moderat', ar: 'متوسط' },
    high: { de: 'Hoch', ar: 'مرتفع' },
    critical: { de: 'Kritisch', ar: 'حرج' },
  };

  const trendLabels: Record<string, { de: string; ar: string }> = {
    improving: { de: '📈 Verbesserung', ar: '📈 تحسن' },
    stable: { de: '➡️ Stabil', ar: '➡️ مستقر' },
    worsening: { de: '📉 Verschlechterung', ar: '📉 تراجع' },
    highly_variable: { de: '⚠️ Sehr variabel', ar: '⚠️ متغير جداً' },
  };

  const toneLabels: Record<string, { de: string; ar: string }> = {
    informative: { de: 'Informativ', ar: 'إعلامي' },
    encouraging: { de: 'Aufmunternd', ar: 'مشجع' },
    cautionary: { de: 'Warnend', ar: 'تحذيري' },
    urgent: { de: 'Dringend', ar: 'عاجل' },
  };

  return (
    <div className="space-y-6">
      {/* Header mit Zurück-Link */}
      <div className="flex items-center gap-4">
        <Link to="/patients">
          <Button variant="secondary" size="sm">
            ← {t.common.back}
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          {mockPatientData.firstName} {mockPatientData.lastName}
        </h2>
      </div>

      {messageSent && (
        <Alert type="success" title={t.common.success}>
          {locale === 'ar' ? 'تم إرسال الرسالة بنجاح' : 'Nachricht erfolgreich gesendet'}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linke Spalte: Patienteninfo + Letzte Werte */}
        <div className="space-y-6">
          {/* Patienteninfo */}
          <Card title={t.doctor.patientDetails}>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">{locale === 'ar' ? 'العمر' : 'Alter'}:</dt>
                <dd className="font-semibold">{mockPatientData.age} {locale === 'ar' ? 'سنة' : 'Jahre'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">{locale === 'ar' ? 'نوع السكري' : 'Diabetes-Typ'}:</dt>
                <dd className="font-semibold">Typ 2</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">{locale === 'ar' ? 'الهاتف' : 'Telefon'}:</dt>
                <dd className="font-semibold">{mockPatientData.phoneNumber}</dd>
              </div>
            </dl>
          </Card>

          {/* Aktuelle Messung */}
          <Card title={locale === 'ar' ? 'آخر قراءة' : 'Letzte Messung'}>
            <div className="text-center">
              <GlucoseValueDisplay
                value={latestReading.value}
                size="lg"
                locale={locale}
              />
              <p className="text-gray-500 mt-2">
                {formatDateTime(latestReading.timestamp, locale)}
              </p>
            </div>
          </Card>

          {/* Statistiken */}
          <Card title={t.doctor.analysis}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t.patient.timeInRange}:</span>
                <span className="text-2xl font-bold text-blue-600">{timeInRange}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t.doctor.riskLevel}:</span>
                <span className={`text-xl font-bold ${riskColors[riskLevel]}`}>
                  {riskLabels[riskLevel][locale]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t.patient.trend}:</span>
                <span className="text-lg font-semibold">
                  {trendLabels[trend][locale]}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Mittlere + Rechte Spalte: KI-Vorschläge und Nachricht */}
        <div className="lg:col-span-2 space-y-6">
          {/* KI-Analyse & Vorschläge */}
          <Card title={t.doctor.aiSuggestions}>
            <p className="text-gray-600 mb-4">
              {locale === 'ar' 
                ? 'بناءً على تحليل القراءات الأخيرة، إليك اقتراحات للرد:'
                : 'Basierend auf der Analyse der letzten Messungen, hier sind Antwort-Vorschläge:'}
            </p>
            
            <div className="space-y-3">
              {mockAiSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedSuggestion === suggestion.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleUseSuggestion(suggestion)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-gray-800">
                      {locale === 'ar' ? suggestion.contentArabic : suggestion.content}
                    </p>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm text-gray-500">
                        {toneLabels[suggestion.tone][locale]}
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {Math.round(suggestion.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Antwort-Editor */}
          <Card title={t.doctor.respond}>
            <div className="space-y-4">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl
                  focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none
                  min-h-[150px]"
                placeholder={locale === 'ar' ? 'اكتب ردك هنا...' : 'Ihre Antwort hier eingeben...'}
              />
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCustomMessage('');
                    setSelectedSuggestion(null);
                  }}
                >
                  {t.common.cancel}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!customMessage.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {t.doctor.sendResponse}
                </Button>
              </div>
            </div>
          </Card>

          {/* Letzte Messungen */}
          <Card title={locale === 'ar' ? 'آخر القراءات' : 'Letzte Messungen'}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      {locale === 'ar' ? 'التاريخ' : 'Datum'}
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      {locale === 'ar' ? 'القيمة' : 'Wert'}
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      {locale === 'ar' ? 'السياق' : 'Kontext'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockReadings.slice(0, 7).map((reading) => (
                    <tr key={reading.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-600">
                        {formatDateTime(reading.timestamp, locale)}
                      </td>
                      <td className="py-2 px-3">
                        <GlucoseValueDisplay
                          value={reading.value}
                          size="sm"
                          showLabel={false}
                        />
                      </td>
                      <td className="py-2 px-3 text-gray-600">
                        {translateMeasurementContext(reading.measurementContext, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

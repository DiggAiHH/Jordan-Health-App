/**
 * Utility-Funktionen für das Jordan Diabetes Health System
 * Fokus auf medizinische Validierung und Sicherheit
 */

import { format, differenceInYears, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { 
  BloodGlucoseReading, 
  GlucoseTrend, 
  RiskLevel,
  MeasurementContext 
} from '../types';

// ============ Konstanten für medizinische Werte ============

// Medizinisch sinnvolle Grenzen für Blutzuckerwerte in mg/dL
const GLUCOSE_MIN = 20;
const GLUCOSE_MAX = 600;
const GLUCOSE_TARGET_MIN = 70;
const GLUCOSE_TARGET_MAX = 180;
const GLUCOSE_HYPO_THRESHOLD = 70;
const GLUCOSE_HYPER_THRESHOLD = 180;
const GLUCOSE_CRITICAL_LOW = 54;
const GLUCOSE_CRITICAL_HIGH = 250;

// ============ Validierung ============

/**
 * Validiert einen Blutzuckerwert auf medizinische Plausibilität
 * @throws ValidationError wenn Wert außerhalb des gültigen Bereichs
 */
export function validateBloodGlucose(value: number): { valid: boolean; error?: string } {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: 'Blutzuckerwert muss eine Zahl sein' };
  }
  
  if (value < GLUCOSE_MIN) {
    return { valid: false, error: `Blutzuckerwert zu niedrig (Minimum: ${GLUCOSE_MIN} mg/dL)` };
  }
  
  if (value > GLUCOSE_MAX) {
    return { valid: false, error: `Blutzuckerwert zu hoch (Maximum: ${GLUCOSE_MAX} mg/dL)` };
  }
  
  return { valid: true };
}

/**
 * Validiert eine E-Mail-Adresse
 */
export function validateEmail(email: string): boolean {
  // RFC 5322 konformer Regex - nicht zu streng, aber sicher
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validiert eine jordanische Telefonnummer
 * Format: +962XXXXXXXXX oder 07XXXXXXXX
 */
export function validateJordanianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const jordanRegex = /^(\+962|00962|962|0)?7[789]\d{7}$/;
  return jordanRegex.test(cleanPhone);
}

/**
 * Sanitisiert Text-Input gegen XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// ============ Blutzucker-Analyse ============

/**
 * Klassifiziert einen einzelnen Blutzuckerwert
 */
export function classifyGlucoseValue(value: number): {
  status: 'critical_low' | 'low' | 'normal' | 'high' | 'critical_high';
  color: string;
  label: string;
  labelArabic: string;
} {
  if (value < GLUCOSE_CRITICAL_LOW) {
    return { status: 'critical_low', color: '#DC2626', label: 'Kritisch niedrig', labelArabic: 'منخفض جداً' };
  }
  if (value < GLUCOSE_HYPO_THRESHOLD) {
    return { status: 'low', color: '#F59E0B', label: 'Niedrig', labelArabic: 'منخفض' };
  }
  if (value <= GLUCOSE_TARGET_MAX) {
    return { status: 'normal', color: '#10B981', label: 'Im Zielbereich', labelArabic: 'ضمن المعدل' };
  }
  if (value <= GLUCOSE_CRITICAL_HIGH) {
    return { status: 'high', color: '#F59E0B', label: 'Erhöht', labelArabic: 'مرتفع' };
  }
  return { status: 'critical_high', color: '#DC2626', label: 'Kritisch hoch', labelArabic: 'مرتفع جداً' };
}

/**
 * Berechnet Time-in-Range (TIR) für Blutzuckerwerte
 * @param readings Array von Blutzuckermessungen
 * @returns Prozentsatz der Werte im Zielbereich (70-180 mg/dL)
 */
export function calculateTimeInRange(readings: BloodGlucoseReading[]): number {
  if (readings.length === 0) return 0;
  
  const inRangeCount = readings.filter(
    r => r.value >= GLUCOSE_TARGET_MIN && r.value <= GLUCOSE_TARGET_MAX
  ).length;
  
  return Math.round((inRangeCount / readings.length) * 100);
}

/**
 * Bestimmt den Glukose-Trend basierend auf den letzten Messungen
 */
export function calculateGlucoseTrend(readings: BloodGlucoseReading[]): GlucoseTrend {
  if (readings.length < 3) return 'stable';
  
  // Sortiere nach Datum (neueste zuerst)
  const sorted = [...readings].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Nimm die letzten 7 Messungen für die Analyse
  const recent = sorted.slice(0, 7);
  const older = sorted.slice(7, 14);
  
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
  const olderAvg = older.reduce((sum, r) => sum + r.value, 0) / older.length;
  
  // Berechne Variabilität (Standardabweichung)
  const variance = recent.reduce((sum, r) => sum + Math.pow(r.value - recentAvg, 2), 0) / recent.length;
  const stdDev = Math.sqrt(variance);
  
  // Hohe Variabilität wenn Standardabweichung > 50 mg/dL
  if (stdDev > 50) return 'highly_variable';
  
  const difference = recentAvg - olderAvg;
  
  // Signifikante Änderung wenn Unterschied > 15 mg/dL
  if (difference < -15) return 'improving';
  if (difference > 15) return 'worsening';
  
  return 'stable';
}

/**
 * Bestimmt das Risikolevel basierend auf Blutzuckerwerten
 */
export function assessRiskLevel(readings: BloodGlucoseReading[]): RiskLevel {
  if (readings.length === 0) return 'low';
  
  const criticalEvents = readings.filter(
    r => r.value < GLUCOSE_CRITICAL_LOW || r.value > GLUCOSE_CRITICAL_HIGH
  ).length;
  
  const hypoEvents = readings.filter(r => r.value < GLUCOSE_HYPO_THRESHOLD).length;
  const hyperEvents = readings.filter(r => r.value > GLUCOSE_HYPER_THRESHOLD).length;
  
  const timeInRange = calculateTimeInRange(readings);
  
  // Kritisch: Mehrere kritische Events oder sehr niedriger TIR
  if (criticalEvents >= 2 || timeInRange < 30) return 'critical';
  
  // Hoch: Kritische Events oder niedriger TIR
  if (criticalEvents >= 1 || timeInRange < 50) return 'high';
  
  // Moderat: Mehrere Hypo-/Hyper-Events oder mäßiger TIR
  if (hypoEvents + hyperEvents >= 5 || timeInRange < 70) return 'moderate';
  
  return 'low';
}

// ============ Formatierung ============

/**
 * Formatiert ein Datum für die Anzeige
 */
export function formatDate(date: Date | string, locale: 'de' | 'ar' = 'de'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (locale === 'ar') {
    return format(dateObj, 'dd/MM/yyyy', { locale: ar });
  }
  
  return format(dateObj, 'dd.MM.yyyy');
}

/**
 * Formatiert Datum und Zeit für die Anzeige
 */
export function formatDateTime(date: Date | string, locale: 'de' | 'ar' = 'de'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (locale === 'ar') {
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ar });
  }
  
  return format(dateObj, 'dd.MM.yyyy HH:mm');
}

/**
 * Berechnet das Alter aus dem Geburtsdatum
 */
export function calculateAge(birthDate: Date | string): number {
  const dateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  return differenceInYears(new Date(), dateObj);
}

/**
 * Formatiert einen Blutzuckerwert mit Einheit
 */
export function formatGlucoseValue(value: number): string {
  return `${Math.round(value)} mg/dL`;
}

/**
 * Übersetzt den Messkontext
 */
export function translateMeasurementContext(
  context: MeasurementContext, 
  locale: 'de' | 'ar' = 'de'
): string {
  const translations: Record<MeasurementContext, { de: string; ar: string }> = {
    fasting: { de: 'Nüchtern', ar: 'صائم' },
    before_meal: { de: 'Vor dem Essen', ar: 'قبل الأكل' },
    after_meal: { de: 'Nach dem Essen', ar: 'بعد الأكل' },
    before_sleep: { de: 'Vor dem Schlafen', ar: 'قبل النوم' },
    random: { de: 'Zufällig', ar: 'عشوائي' },
    exercise: { de: 'Nach Sport', ar: 'بعد الرياضة' }
  };
  
  return translations[context]?.[locale] ?? context;
}

// ============ ID-Generierung ============

/**
 * Generiert eine einzigartige ID
 * Verwendet crypto.randomUUID wenn verfügbar, sonst Fallback
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback für ältere Browser
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ============ Aggregation ============

/**
 * Gruppiert Blutzuckermessungen nach Tag
 */
export function groupReadingsByDay(
  readings: BloodGlucoseReading[]
): Map<string, BloodGlucoseReading[]> {
  const grouped = new Map<string, BloodGlucoseReading[]>();
  
  readings.forEach(reading => {
    const day = format(new Date(reading.timestamp), 'yyyy-MM-dd');
    const existing = grouped.get(day) || [];
    grouped.set(day, [...existing, reading]);
  });
  
  return grouped;
}

/**
 * Berechnet Tagesstatistiken für Blutzuckerwerte
 */
export function calculateDailyStats(readings: BloodGlucoseReading[]): {
  average: number;
  min: number;
  max: number;
  count: number;
} {
  if (readings.length === 0) {
    return { average: 0, min: 0, max: 0, count: 0 };
  }
  
  const values = readings.map(r => r.value);
  const sum = values.reduce((a, b) => a + b, 0);
  
  return {
    average: Math.round(sum / values.length),
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length
  };
}

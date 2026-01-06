/**
 * Core Types für das Jordan Diabetes Health System
 * Alle medizinischen Werte sind streng typisiert um Fehleingaben zu verhindern
 */

// ============ Benutzer-Typen ============

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  // Arabische Namen für lokale Darstellung
  firstNameArabic?: string;
  lastNameArabic?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: Date;
  diabetesType: DiabetesType;
  diagnosisDate: Date;
  assignedDoctorId: string;
  emergencyContact: EmergencyContact;
  // Geriatrische Patienten-spezifische Felder
  mobilityStatus: MobilityStatus;
  cognitiveStatus: CognitiveStatus;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  clinicAddress: string;
  patientIds: string[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: AdminPermission[];
}

// ============ Medizinische Typen ============

export type DiabetesType = 'type1' | 'type2' | 'gestational' | 'prediabetes';

export type MobilityStatus = 'independent' | 'with_aid' | 'wheelchair' | 'bedridden';

export type CognitiveStatus = 'normal' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';

export type AdminPermission = 'manage_users' | 'manage_doctors' | 'view_analytics' | 'system_settings';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

// ============ Blutzucker-Typen ============

/**
 * Blutzuckerwert in mg/dL
 * Validierungsbereich: 20-600 mg/dL (medizinisch sinnvoller Bereich)
 */
export interface BloodGlucoseReading {
  id: string;
  patientId: string;
  value: number; // mg/dL
  timestamp: Date;
  measurementContext: MeasurementContext;
  notes?: string;
  // Für Trend-Analyse
  deviceId?: string;
}

export type MeasurementContext = 
  | 'fasting'           // Nüchtern
  | 'before_meal'       // Vor dem Essen
  | 'after_meal'        // Nach dem Essen (2h)
  | 'before_sleep'      // Vor dem Schlafen
  | 'random'            // Zufällige Messung
  | 'exercise';         // Nach Sport

export interface BloodGlucoseAnalysis {
  patientId: string;
  period: AnalysisPeriod;
  averageValue: number;
  minValue: number;
  maxValue: number;
  readingsCount: number;
  timeInRange: number; // Prozentsatz im Zielbereich (70-180 mg/dL)
  hypoglycemiaEvents: number; // < 70 mg/dL
  hyperglycemiaEvents: number; // > 180 mg/dL
  trend: GlucoseTrend;
  recommendations: string[];
}

export type AnalysisPeriod = '7days' | '14days' | '30days' | '90days';

export type GlucoseTrend = 'improving' | 'stable' | 'worsening' | 'highly_variable';

// ============ Chat-Typen ============

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  timestamp: Date;
  isRead: boolean;
  // Für KI-generierte Nachrichten
  isAiGenerated?: boolean;
  aiConfidence?: number;
  // Image attachment support
  attachment?: ChatAttachment;
}

/**
 * Chat attachment (image) metadata
 * @security URLs are Firebase Storage signed URLs with expiration
 */
export interface ChatAttachment {
  type: 'image';
  url: string;
  path: string;
  size: number;
  thumbnailUrl?: string;
}

export interface Conversation {
  id: string;
  patientId: string;
  doctorId: string;
  messages: ChatMessage[];
  lastMessageAt: Date;
  status: ConversationStatus;
  // Track unread for doctor inbox
  unreadCount?: number;
  lastMessagePreview?: string;
}

export type ConversationStatus = 'active' | 'waiting_for_doctor' | 'waiting_for_patient' | 'closed';

// ============ Ernährungs-Typen ============

export interface Meal {
  id: string;
  patientId: string;
  timestamp: Date;
  mealType: MealType;
  items: MealItem[];
  totalCarbohydrates: number; // in Gramm
  totalCalories: number;
  photoUrl?: string;
  notes?: string;
  bloodGlucoseBefore?: number;
  bloodGlucoseAfter?: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealItem {
  name: string;
  nameArabic?: string;
  portion: string;
  carbohydrates: number;
  calories: number;
  glycemicIndex?: GlycemicIndexCategory;
}

export type GlycemicIndexCategory = 'low' | 'medium' | 'high';

// ============ KI-Analyse Typen ============

export interface AiAnalysisRequest {
  patientId: string;
  readings: BloodGlucoseReading[];
  meals?: Meal[];
  questionFromPatient?: string;
}

export interface AiAnalysisResponse {
  summary: string;
  summaryArabic: string;
  riskLevel: RiskLevel;
  suggestedResponses: SuggestedResponse[];
  actionItems: ActionItem[];
  alertsForDoctor: DoctorAlert[];
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface SuggestedResponse {
  id: string;
  content: string;
  contentArabic: string;
  tone: ResponseTone;
  confidence: number;
}

export type ResponseTone = 'informative' | 'encouraging' | 'cautionary' | 'urgent';

export interface ActionItem {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export interface DoctorAlert {
  type: AlertType;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  patientId: string;
  createdAt: Date;
}

export type AlertType = 
  | 'hypoglycemia_pattern'
  | 'hyperglycemia_pattern'
  | 'missed_readings'
  | 'high_variability'
  | 'medication_adherence'
  | 'appointment_reminder';

// ============ API Response Typen ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  messageArabic?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

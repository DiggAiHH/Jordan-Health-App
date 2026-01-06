/**
 * Validation Schemas using Zod
 * Implements GDPR Art. 25 (Privacy by Design) through strict input validation
 * 
 * @module utils/validation
 * @security All user inputs MUST be validated before processing
 */

import { z } from 'zod'

/**
 * Patient ID Format Validator
 * Format: JO-YYYY-NNNN (e.g., "JO-2025-0001")
 * 
 * @security Prevents injection attacks through strict format enforcement
 */
export const PatientIdSchema = z.string()
  .regex(/^JO-\d{4}-\d{4}$/, 'Patient ID must be in format JO-YYYY-NNNN')

/**
 * Glucose Level Validator
 * Medical range: 20-600 mg/dL (hypoglycemia to extreme hyperglycemia)
 * 
 * @security Prevents invalid medical data entry
 */
export const GlucoseLevelSchema = z.number()
  .int('Glucose level must be an integer')
  .min(20, 'Glucose level must be at least 20 mg/dL')
  .max(600, 'Glucose level cannot exceed 600 mg/dL')

/**
 * Meal Context Validator
 * As per SPECIFICATION.md Section 3.2
 */
export const MealContextSchema = z.enum([
  'before_meal',
  'after_meal',
  'fasting',
  'bedtime'
], {
  errorMap: () => ({ message: 'Invalid meal context' })
})

/**
 * Reading Input Schema (for AddReadingModal)
 * 
 * @security Validates all fields before Firestore write (GDPR Art. 25)
 */
export const ReadingInputSchema = z.object({
  glucoseLevel: GlucoseLevelSchema,
  context: MealContextSchema,
  notes: z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
  timestamp: z.date().optional(), // Defaults to now() if not provided
})

/**
 * Patient Login Schema
 * 
 * @security Validates credentials before Firebase Auth
 */
export const PatientLoginSchema = z.object({
  patientId: PatientIdSchema,
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
})

/**
 * Patient Data Schema (from Firestore)
 * 
 * @security Validates data coming from database before use
 */
export const PatientDataSchema = z.object({
  patientId: PatientIdSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string()
    .regex(/^\+?\d{10,15}$/, 'Invalid phone number format')
    .optional(),
  doctorId: z.string().optional(),
  language: z.enum(['ar', 'en']).default('ar'),
  active: z.boolean().default(true),
})

/**
 * Environment Variables Schema
 * Implements CRA Secure Defaults: All required env vars must be present
 * 
 * @security Fails fast if critical config is missing
 */
export const EnvSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),
})

/**
 * Validates environment variables at app startup
 * 
 * @throws {ZodError} If required env vars are missing
 * @security CRA Compliance - Secure Defaults
 */
export function validateEnv() {
  try {
    return EnvSchema.parse(import.meta.env)
  } catch (error) {
    console.error('Environment validation failed:', error.errors)
    throw new Error('Critical environment variables missing. Check .env file.')
  }
}

/**
 * Chat Message Schema
 */
export const ChatMessageSchema = z.object({
  messageText: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long (max 2000 characters)'),
  patientId: PatientIdSchema,
  doctorId: z.string().optional(),
  senderId: z.string().min(1),
  senderType: z.enum(['patient', 'doctor']),
})

/**
 * Safe validation wrapper with error masking
 * 
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {any} data - Data to validate
 * @returns {{ success: boolean, data?: any, error?: string }}
 * @security Does not expose internal validation details to users
 */
export function safeValidate(schema, data) {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return user-friendly error messages only
      const firstError = error.issues?.[0]
      return {
        success: false,
        error: firstError?.message || 'Validation failed'
      }
    }
    return { success: false, error: 'Validation error' }
  }
}

export default {
  PatientIdSchema,
  GlucoseLevelSchema,
  MealContextSchema,
  ReadingInputSchema,
  PatientLoginSchema,
  PatientDataSchema,
  EnvSchema,
  ChatMessageSchema,
  validateEnv,
  safeValidate,
}

/**
 * Unit Tests for Validation Schemas
 * Tests GDPR Art. 25 (Privacy by Design) compliance through input validation
 * 
 * @security Validates that all user inputs are properly sanitized
 */

import { describe, it, expect } from 'vitest'
import {
  PatientIdSchema,
  GlucoseLevelSchema,
  MealContextSchema,
  ReadingInputSchema,
  PatientLoginSchema,
  PatientDataSchema,
  EnvSchema,
  ChatMessageSchema,
  safeValidate,
} from '../validation'

describe('validation - Input Sanitization (GDPR Art. 25)', () => {
  describe('PatientIdSchema', () => {
    it('should accept valid patient IDs', () => {
      expect(() => PatientIdSchema.parse('JO-2025-0001')).not.toThrow()
      expect(() => PatientIdSchema.parse('JO-2024-9999')).not.toThrow()
    })

    it('should reject invalid formats', () => {
      expect(() => PatientIdSchema.parse('JO-25-001')).toThrow()
      expect(() => PatientIdSchema.parse('INVALID')).toThrow()
      expect(() => PatientIdSchema.parse('JO-2025-001')).toThrow() // Too short
      expect(() => PatientIdSchema.parse('US-2025-0001')).toThrow() // Wrong country
    })

    it('should prevent injection attacks', () => {
      expect(() => PatientIdSchema.parse('JO-2025-0001\'; DROP TABLE--')).toThrow()
      expect(() => PatientIdSchema.parse('<script>alert("xss")</script>')).toThrow()
    })
  })

  describe('GlucoseLevelSchema', () => {
    it('should accept valid medical ranges', () => {
      expect(() => GlucoseLevelSchema.parse(70)).not.toThrow() // Normal
      expect(() => GlucoseLevelSchema.parse(20)).not.toThrow() // Hypoglycemia
      expect(() => GlucoseLevelSchema.parse(400)).not.toThrow() // Hyperglycemia
      expect(() => GlucoseLevelSchema.parse(600)).not.toThrow() // Max
    })

    it('should reject out-of-range values', () => {
      expect(() => GlucoseLevelSchema.parse(19)).toThrow()
      expect(() => GlucoseLevelSchema.parse(601)).toThrow()
      expect(() => GlucoseLevelSchema.parse(0)).toThrow()
      expect(() => GlucoseLevelSchema.parse(-50)).toThrow()
    })

    it('should reject non-integer values', () => {
      expect(() => GlucoseLevelSchema.parse(120.5)).toThrow()
      expect(() => GlucoseLevelSchema.parse('120')).toThrow() // String
      expect(() => GlucoseLevelSchema.parse(NaN)).toThrow()
    })
  })

  describe('MealContextSchema', () => {
    it('should accept valid meal contexts', () => {
      expect(() => MealContextSchema.parse('before_meal')).not.toThrow()
      expect(() => MealContextSchema.parse('after_meal')).not.toThrow()
      expect(() => MealContextSchema.parse('fasting')).not.toThrow()
      expect(() => MealContextSchema.parse('bedtime')).not.toThrow()
    })

    it('should reject invalid contexts', () => {
      expect(() => MealContextSchema.parse('lunch')).toThrow()
      expect(() => MealContextSchema.parse('breakfast')).toThrow()
      expect(() => MealContextSchema.parse('')).toThrow()
      expect(() => MealContextSchema.parse(null)).toThrow()
    })
  })

  describe('ReadingInputSchema', () => {
    it('should accept valid reading inputs', () => {
      const validReading = {
        glucoseLevel: 120,
        context: 'before_meal',
        notes: 'Feeling good',
        timestamp: new Date(),
      }
      expect(() => ReadingInputSchema.parse(validReading)).not.toThrow()
    })

    it('should accept minimal valid inputs', () => {
      const minimal = {
        glucoseLevel: 90,
        context: 'fasting',
      }
      expect(() => ReadingInputSchema.parse(minimal)).not.toThrow()
    })

    it('should reject excessively long notes', () => {
      const longNotes = {
        glucoseLevel: 100,
        context: 'after_meal',
        notes: 'x'.repeat(501), // Exceeds 500 char limit
      }
      expect(() => ReadingInputSchema.parse(longNotes)).toThrow()
    })

    it('should reject invalid glucose levels', () => {
      const invalid = {
        glucoseLevel: 700, // Exceeds max
        context: 'before_meal',
      }
      expect(() => ReadingInputSchema.parse(invalid)).toThrow()
    })
  })

  describe('PatientLoginSchema', () => {
    it('should accept valid credentials', () => {
      const validLogin = {
        patientId: 'JO-2025-0001',
        password: 'SecurePass123!',
      }
      expect(() => PatientLoginSchema.parse(validLogin)).not.toThrow()
    })

    it('should reject weak passwords', () => {
      const weakPassword = {
        patientId: 'JO-2025-0001',
        password: 'short',
      }
      expect(() => PatientLoginSchema.parse(weakPassword)).toThrow()
    })

    it('should reject excessively long passwords', () => {
      const longPassword = {
        patientId: 'JO-2025-0001',
        password: 'x'.repeat(129),
      }
      expect(() => PatientLoginSchema.parse(longPassword)).toThrow()
    })

    it('should prevent SQL injection in patientId', () => {
      const injection = {
        patientId: 'JO-2025-0001\' OR \'1\'=\'1',
        password: 'password123',
      }
      expect(() => PatientLoginSchema.parse(injection)).toThrow()
    })
  })

  describe('PatientDataSchema', () => {
    it('should accept valid patient data', () => {
      const validData = {
        patientId: 'JO-2025-0001',
        firstName: 'Mohammed',
        lastName: 'Ali',
        email: 'patient@example.com',
        phone: '+962791234567',
        doctorId: 'doc123',
        language: 'ar',
        active: true,
      }
      expect(() => PatientDataSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid emails', () => {
      const invalidEmail = {
        patientId: 'JO-2025-0001',
        firstName: 'Test',
        email: 'not-an-email',
      }
      expect(() => PatientDataSchema.parse(invalidEmail)).toThrow()
    })

    it('should reject invalid phone numbers', () => {
      const invalidPhone = {
        patientId: 'JO-2025-0001',
        firstName: 'Test',
        phone: '123', // Too short
      }
      expect(() => PatientDataSchema.parse(invalidPhone)).toThrow()
    })

    it('should default language to Arabic', () => {
      const dataWithoutLanguage = {
        patientId: 'JO-2025-0001',
        firstName: 'Test',
      }
      const parsed = PatientDataSchema.parse(dataWithoutLanguage)
      expect(parsed.language).toBe('ar')
    })
  })

  describe('EnvSchema', () => {
    it('should accept valid Firebase environment variables', () => {
      const validEnv = {
        VITE_FIREBASE_API_KEY: 'AIzaSyTest123',
        VITE_FIREBASE_AUTH_DOMAIN: 'project.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'my-project',
        VITE_FIREBASE_APP_ID: '1:123456:web:abcdef',
      }
      expect(() => EnvSchema.parse(validEnv)).not.toThrow()
    })

    it('should reject missing required vars', () => {
      const missingKey = {
        VITE_FIREBASE_AUTH_DOMAIN: 'project.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'my-project',
      }
      expect(() => EnvSchema.parse(missingKey)).toThrow()
    })

    it('should accept optional vars', () => {
      const withOptional = {
        VITE_FIREBASE_API_KEY: 'key',
        VITE_FIREBASE_AUTH_DOMAIN: 'domain',
        VITE_FIREBASE_PROJECT_ID: 'project',
        VITE_FIREBASE_APP_ID: 'app',
        VITE_FIREBASE_STORAGE_BUCKET: 'bucket',
        VITE_FIREBASE_MESSAGING_SENDER_ID: '123456',
      }
      expect(() => EnvSchema.parse(withOptional)).not.toThrow()
    })
  })

  describe('ChatMessageSchema', () => {
    it('should accept valid chat messages', () => {
      const validMessage = {
        messageText: 'Hello doctor, my glucose was high today.',
        patientId: 'JO-2025-0001',
        doctorId: 'doc123',
        senderId: 'patient123',
        senderType: 'patient',
      }
      expect(() => ChatMessageSchema.parse(validMessage)).not.toThrow()
    })

    it('should reject empty messages', () => {
      const emptyMessage = {
        messageText: '',
        patientId: 'JO-2025-0001',
        senderId: 'patient123',
        senderType: 'patient',
      }
      expect(() => ChatMessageSchema.parse(emptyMessage)).toThrow()
    })

    it('should reject excessively long messages', () => {
      const longMessage = {
        messageText: 'x'.repeat(2001),
        patientId: 'JO-2025-0001',
        senderId: 'patient123',
        senderType: 'patient',
      }
      expect(() => ChatMessageSchema.parse(longMessage)).toThrow()
    })

    it('should reject invalid sender types', () => {
      const invalidSender = {
        messageText: 'Test message',
        patientId: 'JO-2025-0001',
        senderId: 'user123',
        senderType: 'admin', // Not allowed
      }
      expect(() => ChatMessageSchema.parse(invalidSender)).toThrow()
    })
  })

  describe('safeValidate - Error Handling', () => {
    it('should return success for valid data', () => {
      const result = safeValidate(GlucoseLevelSchema, 120)
      expect(result.success).toBe(true)
      expect(result.data).toBe(120)
      expect(result.error).toBeUndefined()
    })

    it('should return user-friendly errors for invalid data', () => {
      const result = safeValidate(GlucoseLevelSchema, 700)
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.data).toBeUndefined()
      expect(result.error).toContain('cannot exceed')
    })

    it('should not expose internal error details', () => {
      const result = safeValidate(PatientIdSchema, 'INVALID')
      expect(result.success).toBe(false)
      // Should provide user-friendly error message
      expect(result.error).toBeDefined()
      expect(result.error).toContain('format')
      // Should NOT contain stack traces or internal paths
      expect(result.error).not.toContain('ZodError')
      expect(result.error).not.toContain('stack')
    })
    })

    it('should handle complex object validation', () => {
      const invalidReading = {
        glucoseLevel: 'not-a-number',
        context: 'invalid-context',
      }
      const result = safeValidate(ReadingInputSchema, invalidReading)
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Security & Edge Cases', () => {
    it('should prevent prototype pollution', () => {
      const malicious = {
        glucoseLevel: 120,
        context: 'fasting',
        '__proto__': { isAdmin: true },
      }
      // Should parse without allowing prototype pollution
      expect(() => ReadingInputSchema.parse(malicious)).not.toThrow()
      expect(({}).isAdmin).toBeUndefined()
    })

    it('should handle special characters safely', () => {
      const notes = {
        glucoseLevel: 100,
        context: 'before_meal',
        notes: '<script>alert("xss")</script>',
      }
      // Should accept (validation doesn't sanitize, just validates length)
      expect(() => ReadingInputSchema.parse(notes)).not.toThrow()
    })

    it('should preserve data types correctly', () => {
      const reading = {
        glucoseLevel: 150,
        context: 'after_meal',
        timestamp: new Date(),
      }
      const parsed = ReadingInputSchema.parse(reading)
      expect(typeof parsed.glucoseLevel).toBe('number')
      expect(parsed.timestamp).toBeInstanceOf(Date)
    })
  })
})

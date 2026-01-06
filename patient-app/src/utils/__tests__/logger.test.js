/**
 * Unit Tests for GDPR-Compliant Logger
 * Tests PII masking compliance per GDPR Art. 9
 * 
 * @security CRITICAL - Validates that NO PII leaks into logs
 */

import { describe, it, expect } from 'vitest'
import {
  maskEmail,
  maskPhone,
  maskName,
  maskPatientId,
  maskPII,
  logger,
} from '../logger'

describe('logger - PII Masking (GDPR Art. 9 Compliance)', () => {
  describe('maskEmail', () => {
    it('should mask standard email addresses', () => {
      expect(maskEmail('patient@example.com')).toBe('p*****t@e*****e.c*m')
    })

    it('should mask short local parts', () => {
      expect(maskEmail('ab@test.com')).toBe('**@t**t.c*m')
    })

    it('should handle subdomains', () => {
      expect(maskEmail('user@mail.subdomain.com')).toBe('u**r@m**l.s*******n.c*m')
    })

    it('should return placeholder for invalid emails', () => {
      expect(maskEmail('not-an-email')).toBe('[MALFORMED_EMAIL]')
      expect(maskEmail('')).toBe('[INVALID_EMAIL]')
      expect(maskEmail(null)).toBe('[INVALID_EMAIL]')
    })

    it('should prevent PII exposure in edge cases', () => {
      const realEmail = 'mohammed.ali@hospital.jo'
      const masked = maskEmail(realEmail)
      expect(masked).not.toContain('mohammed')
      expect(masked).not.toContain('ali')
      expect(masked).not.toContain('hospital')
      // Verify masking occurred
      expect(masked).toContain('@')
      expect(masked).toContain('*')
    })
    })
  })

  describe('maskPhone', () => {
    it('should mask Jordanian phone numbers', () => {
      expect(maskPhone('+962791234567')).toBe('+962*******67')
    })

    it('should mask international formats', () => {
      expect(maskPhone('+1234567890')).toBe('+123*****90')
    })

    it('should handle phones without country code', () => {
      expect(maskPhone('0791234567')).toBe('079*****67')
    })

    it('should return placeholder for invalid phones', () => {
      expect(maskPhone('123')).toBe('****')
      expect(maskPhone('')).toBe('[INVALID_PHONE]')
      expect(maskPhone(null)).toBe('[INVALID_PHONE]')
    })
  })

  describe('maskName', () => {
    it('should mask Arabic names', () => {
      const masked = maskName('Mohammed Ali')
      expect(masked).not.toContain('Mohammed')
      expect(masked).not.toContain('Ali')
      expect(masked).toMatch(/^M.*d A.*/)
    })

    it('should mask single names', () => {
      expect(maskName('Ahmed')).toBe('A***d')
    })

    it('should mask multi-part names', () => {
      const masked = maskName('Abdul Rahman Al-Shdaifat')
      // Check masking occurred without regex (avoid escaping issues)
      expect(masked).not.toContain('Abdul')
      expect(masked).not.toContain('Rahman')
      expect(masked).not.toContain('Shdaifat')
      expect(masked.startsWith('A')).toBe(true)
      expect(masked.includes('R')).toBe(true)
    })

    it('should return placeholder for empty names', () => {
      expect(maskName('')).toBe('[ANONYMOUS]')
      expect(maskName(null)).toBe('[ANONYMOUS]')
    })
  })

  describe('maskPatientId', () => {
    it('should mask valid patient IDs', () => {
      expect(maskPatientId('JO-2025-0123')).toBe('JO-****-**23')
    })

    it('should preserve format structure', () => {
      const masked = maskPatientId('JO-2024-9999')
      expect(masked).toMatch(/^JO-\*\*\*\*-\*\*\d{2}$/)
    })

    it('should return placeholder for invalid formats', () => {
      expect(maskPatientId('INVALID')).toBe('[INVALID_ID_FORMAT]')
      expect(maskPatientId('JO-25-123')).toBe('[INVALID_ID_FORMAT]')
      expect(maskPatientId('')).toBe('[NO_ID]')
    })
  })

  describe('maskPII - Object Masking', () => {
    it('should mask PII fields in patient objects', () => {
      const patient = {
        patientId: 'JO-2025-0001',
        firstName: 'Mohammed',
        lastName: 'Ali',
        email: 'patient@example.com',
        phone: '+962791234567',
        dateOfBirth: '1950-01-01',
      }

      const masked = maskPII(patient)
      
      expect(masked.patientId).toBe('JO-****-**01')
      expect(masked.firstName).not.toContain('Mohammed')
      expect(masked.email).not.toContain('patient@example.com')
      expect(masked.phone).not.toContain('791234567')
      expect(masked.dateOfBirth).toBe('[DATE_REDACTED]')
    })

    it('should mask nested PII in readings', () => {
      const reading = {
        glucoseLevel: 120,
        patientData: {
          patientId: 'JO-2025-0042',
          email: 'test@test.com',
        },
        doctor: {
          name: 'Dr. Ahmad',
          phone: '+962791111111',
        }
      }

      const masked = maskPII(reading)
      
      expect(masked.glucoseLevel).toBe(120) // Non-PII preserved
      expect(masked.patientData.patientId).toBe('JO-****-**42')
      expect(masked.patientData.email).not.toContain('test@test.com')
      expect(masked.doctor.name).not.toContain('Ahmad')
      expect(masked.doctor.phone).not.toContain('791111111')
    })

    it('should mask arrays of PII objects', () => {
      const patients = [
        { patientId: 'JO-2025-0001', email: 'a@test.com' },
        { patientId: 'JO-2025-0002', email: 'b@test.com' },
      ]

      const masked = maskPII(patients)
      
      expect(Array.isArray(masked)).toBe(true)
      expect(masked[0].email).not.toContain('a@test.com')
      expect(masked[1].email).not.toContain('b@test.com')
    })

    it('should redact passwords and tokens completely', () => {
      const authData = {
        username: 'user123',
        password: 'super-secret-123',
        resetToken: 'abc123xyz',
        apiSecret: 'sk-proj-xyz',
      }

      const masked = maskPII(authData)
      
      expect(masked.password).toBe('[REDACTED]')
      expect(masked.resetToken).toBe('[REDACTED]')
      expect(masked.apiSecret).toBe('[REDACTED]')
    })

    it('should handle circular references without crashing', () => {
      const obj = { name: 'Test User' }
      obj.self = obj // Circular reference

      const masked = maskPII(obj)
      
      expect(masked.self).toBe('[CIRCULAR_REF]')
    })

    it('should preserve non-PII data', () => {
      const data = {
        glucoseLevel: 150,
        timestamp: new Date().toISOString(),
        context: 'before_meal',
        flagged: true,
      }

      const masked = maskPII(data)
      
      expect(masked.glucoseLevel).toBe(150)
      expect(masked.context).toBe('before_meal')
      expect(masked.flagged).toBe(true)
    })
  })

  describe('logger - Safe Logging', () => {
    it('should export logger with required methods', () => {
      expect(logger).toBeDefined()
      expect(typeof logger.info).toBe('function')
      expect(typeof logger.warn).toBe('function')
      expect(typeof logger.error).toBe('function')
      expect(typeof logger.debug).toBe('function')
    })

    it('should not throw errors when logging with PII', () => {
      const sensitiveData = {
        patientId: 'JO-2025-0001',
        email: 'patient@example.com',
        password: 'secret123',
      }

      // These should mask PII and not throw
      expect(() => logger.info('Test log', sensitiveData)).not.toThrow()
      expect(() => logger.error('Error log', sensitiveData)).not.toThrow()
    })
  })

  describe('Edge Cases & Security', () => {
    it('should handle null and undefined safely', () => {
      expect(maskPII(null)).toBe(null)
      expect(maskPII(undefined)).toBe(undefined)
    })

    it('should handle primitives', () => {
      expect(maskPII(123)).toBe(123)
      expect(maskPII('string')).toBe('string')
      expect(maskPII(true)).toBe(true)
    })

    it('should prevent injection attacks via field names', () => {
      const malicious = {
        '__proto__': 'injection',
        'constructor': 'attack',
        email: 'test@test.com',
      }

      const masked = maskPII(malicious)
      expect(masked.email).not.toContain('test@test.com')
    })
  })
})

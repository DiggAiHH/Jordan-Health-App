/**
 * GDPR-Compliant Logger
 * Implements Art. 9 GDPR: No logging of Personally Identifiable Information (PII)
 * 
 * @module utils/logger
 * @security CRITICAL - All logs must pass through maskPII before output
 */

/**
 * Masks email addresses for GDPR compliance
 * Example: "patient@example.com" -> "p***t@e***e.com"
 * 
 * @param {string} email - Email address to mask
 * @returns {string} Masked email
 * @security Prevents PII exposure in logs (GDPR Art. 9)
 */
export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '[INVALID_EMAIL]'
  
  const [local, domain] = email.split('@')
  if (!local || !domain) return '[MALFORMED_EMAIL]'
  
  const maskedLocal = local.length > 2 
    ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
    : '**'
  
  const domainParts = domain.split('.')
  const maskedDomain = domainParts.map(part => 
    part.length > 2 
      ? `${part[0]}${'*'.repeat(part.length - 2)}${part[part.length - 1]}`
      : '**'
  ).join('.')
  
  return `${maskedLocal}@${maskedDomain}`
}

/**
 * Masks phone numbers for GDPR compliance
 * Example: "+962791234567" -> "+962*******67"
 * 
 * @param {string} phone - Phone number to mask
 * @returns {string} Masked phone number
 * @security Prevents PII exposure in logs (GDPR Art. 9)
 */
export function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '[INVALID_PHONE]'
  
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 4) return '****'
  
  const prefix = phone.startsWith('+') ? '+' : ''
  const countryCode = cleaned.slice(0, Math.min(3, cleaned.length - 4))
  const lastDigits = cleaned.slice(-2)
  const maskedLength = cleaned.length - countryCode.length - 2
  
  return `${prefix}${countryCode}${'*'.repeat(maskedLength)}${lastDigits}`
}

/**
 * Masks patient names for GDPR compliance
 * Example: "Mohammed Ali" -> "M******d A**"
 * 
 * @param {string} name - Full name to mask
 * @returns {string} Masked name
 * @security Prevents PII exposure in logs (GDPR Art. 9)
 */
export function maskName(name) {
  if (!name || typeof name !== 'string') return '[ANONYMOUS]'
  
  return name.split(' ').map(part => {
    if (part.length <= 2) return part[0] + '*'
    return `${part[0]}${'*'.repeat(part.length - 2)}${part[part.length - 1]}`
  }).join(' ')
}

/**
 * Masks patient IDs partially (keeps format for debugging)
 * Example: "JO-2025-0123" -> "JO-****-**23"
 * 
 * @param {string} patientId - Patient ID to mask
 * @returns {string} Masked patient ID
 * @security Partial masking for audit trails while protecting identity
 */
export function maskPatientId(patientId) {
  if (!patientId || typeof patientId !== 'string') return '[NO_ID]'
  
  // Format: JO-YYYY-NNNN
  const match = patientId.match(/^([A-Z]{2})-(\d{4})-(\d{4})$/)
  if (!match) return '[INVALID_ID_FORMAT]'
  
  const [, country, year, number] = match
  return `${country}-****-**${number.slice(-2)}`
}

/**
 * Recursively masks PII in objects/arrays for safe logging
 * 
 * @param {any} data - Data to sanitize
 * @param {Set<string>} visited - Circular reference tracker
 * @returns {any} Sanitized data safe for logging
 * @security Core GDPR compliance function - masks all PII fields
 */
export function maskPII(data, visited = new Set()) {
  // Prevent circular reference infinite loops
  if (data && typeof data === 'object') {
    if (visited.has(data)) return '[CIRCULAR_REF]'
    visited.add(data)
  }
  
  // Primitive types - pass through
  if (data === null || data === undefined) return data
  if (typeof data !== 'object') return data
  
  // Arrays - recursively mask
  if (Array.isArray(data)) {
    return data.map(item => maskPII(item, visited))
  }
  
  // Objects - mask PII fields
  const masked = {}
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase()
    
    // Known PII fields
    if (lowerKey.includes('email')) {
      masked[key] = typeof value === 'string' ? maskEmail(value) : '[REDACTED]'
    } else if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
      masked[key] = typeof value === 'string' ? maskPhone(value) : '[REDACTED]'
    } else if (lowerKey.includes('name') && !lowerKey.includes('username')) {
      masked[key] = typeof value === 'string' ? maskName(value) : '[REDACTED]'
    } else if (lowerKey.includes('patientid') || lowerKey.includes('patient_id')) {
      masked[key] = typeof value === 'string' ? maskPatientId(value) : '[REDACTED]'
    } else if (lowerKey.includes('password') || lowerKey.includes('token') || lowerKey.includes('secret')) {
      masked[key] = '[REDACTED]'
    } else if (lowerKey.includes('dob') || lowerKey.includes('dateofbirth') || lowerKey.includes('birthdate')) {
      masked[key] = '[DATE_REDACTED]'
    } else {
      // Recursively process nested objects
      masked[key] = maskPII(value, visited)
    }
  }
  
  return masked
}

/**
 * Safe logger that automatically masks PII before logging
 * USE THIS instead of console.log/error/warn for any user data
 * 
 * @param {string} level - Log level: 'info', 'warn', 'error', 'debug'
 * @param {string} message - Log message
 * @param {any} data - Optional data to log (will be masked)
 * @security MANDATORY for all logging in production (GDPR Art. 9)
 */
export function safeLog(level, message, data = null) {
  const timestamp = new Date().toISOString()
  const maskedData = data ? maskPII(data) : null
  
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(maskedData && { data: maskedData })
  }
  
  // In production, send to logging service (e.g., Sentry, CloudWatch)
  // For now, console output with masking
  if (level === 'error') {
    console.error(JSON.stringify(logEntry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logEntry))
  } else if (level === 'debug' && import.meta.env.DEV) {
    console.debug(JSON.stringify(logEntry))
  } else {
    console.log(JSON.stringify(logEntry))
  }
}

/**
 * Convenience wrappers for safe logging
 */
export const logger = {
  info: (message, data) => safeLog('info', message, data),
  warn: (message, data) => safeLog('warn', message, data),
  error: (message, data) => safeLog('error', message, data),
  debug: (message, data) => safeLog('debug', message, data),
}

export default logger

/**
 * Unit tests for Firebase Storage utilities
 * @module firebase/storage.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateImageFile, compressImage, createImagePreview, revokeImagePreview } from '../firebase/storage'

// Mock browser-image-compression
vi.mock('browser-image-compression', () => ({
  default: vi.fn((file, options) => {
    // Return smaller mock file
    return Promise.resolve(new File(['compressed'], 'compressed.jpg', { type: 'image/jpeg', size: 100000 }))
  })
}))

// Mock Firebase Storage
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn()
}))

vi.mock('../firebase/config', () => ({
  storage: {}
}))

describe('validateImageFile', () => {
  describe('file type validation (1-A: jpg/png/heic only)', () => {
    it('accepts JPEG images', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('accepts PNG images', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('accepts HEIC images', () => {
      const file = new File([''], 'test.heic', { type: 'image/heic' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('accepts HEIF images', () => {
      const file = new File([''], 'test.heif', { type: 'image/heif' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('rejects GIF images', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('INVALID_TYPE')
    })

    it('rejects WebP images', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('INVALID_TYPE')
    })

    it('rejects non-image files', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('INVALID_TYPE')
    })
  })

  describe('file size validation (1-A: <=5MB)', () => {
    it('accepts files under 5MB', () => {
      // Create mock file with size property
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 4 * 1024 * 1024 }) // 4MB
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('accepts files exactly 5MB', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }) // 5MB
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('rejects files over 5MB', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }) // 6MB
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('FILE_TOO_LARGE')
      expect(result.maxSizeMB).toBe(5)
    })
  })

  describe('edge cases', () => {
    it('rejects null file', () => {
      const result = validateImageFile(null)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('NO_FILE')
    })

    it('rejects undefined file', () => {
      const result = validateImageFile(undefined)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('NO_FILE')
    })
  })
})

describe('compressImage (2-B: automatic compression)', () => {
  it('skips compression for small files (<500KB)', async () => {
    const smallFile = new File(['small'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(smallFile, 'size', { value: 400 * 1024 }) // 400KB
    
    const result = await compressImage(smallFile)
    
    // Should return original file
    expect(result).toBe(smallFile)
  })

  it('compresses files larger than 500KB', async () => {
    const largeFile = new File(['large content here'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(largeFile, 'size', { value: 2 * 1024 * 1024 }) // 2MB
    
    const result = await compressImage(largeFile)
    
    // Should return compressed file (from mock)
    expect(result).not.toBe(largeFile)
    expect(result.size).toBeLessThan(largeFile.size)
  })
})

describe('createImagePreview / revokeImagePreview', () => {
  let originalCreateObjectURL
  let originalRevokeObjectURL

  beforeEach(() => {
    originalCreateObjectURL = URL.createObjectURL
    originalRevokeObjectURL = URL.revokeObjectURL
    
    URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  it('creates preview URL from file', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
    const url = createImagePreview(file)
    
    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(url).toBe('blob:mock-url')
  })

  it('revokes preview URL to free memory', () => {
    const previewUrl = 'blob:mock-url'
    revokeImagePreview(previewUrl)
    
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(previewUrl)
  })
})

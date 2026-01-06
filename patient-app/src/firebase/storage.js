/**
 * Firebase Storage utilities for chat image uploads
 * @module firebase/storage
 * @security PII: Images may contain medical data - no metadata logging
 * 
 * Compliance:
 * - DSGVO Art. 25: Data minimization, no PII in logs
 * - CRA: Secure defaults, file type/size validation
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from './config'
import imageCompression from 'browser-image-compression'

/**
 * Allowed image MIME types (1-A: jpg/png/heic only)
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif'
]

/**
 * Maximum file size before compression: 5MB (1-A)
 */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

/**
 * Compression options (2-B: automatic compression)
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,           // Target 1MB after compression
  maxWidthOrHeight: 1920, // Max dimension for elderly readability
  useWebWorker: true,     // Non-blocking compression
  fileType: 'image/jpeg'  // Convert all to JPEG for consistency
}

/**
 * Validates file type and size
 * @param {File} file - The file to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'NO_FILE' }
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'INVALID_TYPE',
      allowedTypes: ['jpg', 'png', 'heic']
    }
  }

  // Check size (5MB limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: 'FILE_TOO_LARGE',
      maxSizeMB: 5
    }
  }

  return { valid: true }
}

/**
 * Compresses image before upload (2-B: automatic compression)
 * @param {File} file - Original image file
 * @returns {Promise<File>} - Compressed image file
 * @security No file content logging
 */
export const compressImage = async (file) => {
  try {
    // Skip compression for small files (<500KB)
    if (file.size < 500 * 1024) {
      return file
    }

    const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)
    
    // Log size reduction (no PII)
    const reduction = Math.round((1 - compressedFile.size / file.size) * 100)
    console.info(`[Storage] Image compressed: ${reduction}% size reduction`)
    
    return compressedFile
  } catch (error) {
    // Fallback to original on compression failure
    console.warn('[Storage] Compression failed, using original')
    return file
  }
}

/**
 * Uploads image to Firebase Storage with progress tracking
 * @param {File} file - Image file to upload
 * @param {string} patientId - Patient identifier for path
 * @param {string} chatId - Chat/conversation identifier
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<{ url: string, path: string }>}
 * @security No PII logging, uses surrogate keys only
 */
export const uploadChatImage = async (file, patientId, chatId, onProgress = () => {}) => {
  // Validate
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Compress (2-B: automatic)
  const compressedFile = await compressImage(file)

  // Generate unique filename (no original filename to prevent PII leakage)
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const extension = 'jpg' // Always JPEG after compression
  const filename = `${timestamp}-${randomId}.${extension}`

  // Storage path: chat_images/{patientId}/{chatId}/{filename}
  const storagePath = `chat_images/${patientId}/${chatId}/${filename}`
  const storageRef = ref(storage, storagePath)

  // Upload with progress
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, compressedFile, {
      contentType: 'image/jpeg',
      customMetadata: {
        uploadedBy: 'patient-app',
        chatId: chatId
      }
    })

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        onProgress(progress)
      },
      (error) => {
        // Log error code only, no sensitive data
        console.error(`[Storage] Upload failed: ${error.code}`)
        reject(new Error('UPLOAD_FAILED'))
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({
            url: downloadURL,
            path: storagePath,
            size: compressedFile.size
          })
        } catch (error) {
          reject(new Error('URL_FETCH_FAILED'))
        }
      }
    )
  })
}

/**
 * Creates a local preview URL for immediate display
 * @param {File} file - Image file
 * @returns {string} - Object URL (must be revoked after use)
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Revokes a preview URL to free memory
 * @param {string} previewUrl - URL to revoke
 */
export const revokeImagePreview = (previewUrl) => {
  URL.revokeObjectURL(previewUrl)
}

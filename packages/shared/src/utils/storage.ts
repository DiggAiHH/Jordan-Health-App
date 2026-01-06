/**
 * Image Storage utilities for chat/meal photo uploads
 * @module utils/storage
 * @security PII: Images may contain medical data - no metadata logging
 * 
 * Compliance:
 * - DSGVO Art. 25: Data minimization, no PII in logs
 * - CRA: Secure defaults, file type/size validation
 */

// ============ Constants ============

/**
 * Allowed image MIME types (jpg/png/heic only)
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif'
] as const;

export type AllowedImageType = typeof ALLOWED_IMAGE_TYPES[number];

/**
 * Maximum file size: 5MB
 */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_FILE_SIZE_MB = 5;

/**
 * Compression target: 1MB
 */
export const COMPRESSION_TARGET_MB = 1;

/**
 * Max dimension for elderly readability
 */
export const MAX_IMAGE_DIMENSION = 1920;

// ============ Types ============

export interface ImageValidationResult {
  valid: boolean;
  error?: 'NO_FILE' | 'INVALID_TYPE' | 'FILE_TOO_LARGE';
  allowedTypes?: string[];
  maxSizeMB?: number;
}

// ChatAttachment is defined in types/index.ts - re-export from there
export type { ChatAttachment } from '../types';

export interface ImageCompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType: string;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
}

// ============ Validation Functions ============

/**
 * Validates file type and size for image uploads
 * @param file - The file to validate
 * @returns Validation result with error details
 * @security No file content logging
 */
export function validateImageFile(file: File | null | undefined): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'NO_FILE' };
  }

  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return { 
      valid: false, 
      error: 'INVALID_TYPE',
      allowedTypes: ['jpg', 'png', 'heic']
    };
  }

  // Check size (5MB limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: 'FILE_TOO_LARGE',
      maxSizeMB: MAX_FILE_SIZE_MB
    };
  }

  return { valid: true };
}

/**
 * Default compression options for elderly-friendly image handling
 */
export const DEFAULT_COMPRESSION_OPTIONS: ImageCompressionOptions = {
  maxSizeMB: COMPRESSION_TARGET_MB,
  maxWidthOrHeight: MAX_IMAGE_DIMENSION,
  useWebWorker: true,
  fileType: 'image/jpeg'
};

/**
 * Generates a unique, privacy-safe filename
 * Uses timestamp + random ID, no original filename (prevents PII leakage)
 * @param extension - File extension (default: 'jpg')
 * @returns Safe filename string
 */
export function generateSafeFilename(extension: string = 'jpg'): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomId}.${extension}`;
}

/**
 * Generates storage path for chat images
 * Format: chat_images/{patientId}/{chatId}/{filename}
 * @param patientId - Patient identifier (UUID)
 * @param chatId - Chat/conversation identifier
 * @param filename - Safe filename from generateSafeFilename
 * @returns Storage path string
 */
export function getChatImagePath(patientId: string, chatId: string, filename: string): string {
  return `chat_images/${patientId}/${chatId}/${filename}`;
}

/**
 * Generates storage path for meal photos
 * Format: meal_photos/{patientId}/{date}/{filename}
 * @param patientId - Patient identifier (UUID)
 * @param date - Date string (YYYY-MM-DD)
 * @param filename - Safe filename from generateSafeFilename
 * @returns Storage path string
 */
export function getMealPhotoPath(patientId: string, date: string, filename: string): string {
  return `meal_photos/${patientId}/${date}/${filename}`;
}

/**
 * Creates a local preview URL for immediate display
 * @param file - Image file
 * @returns Object URL (must be revoked after use)
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a preview URL to free memory
 * @param previewUrl - URL to revoke
 */
export function revokeImagePreview(previewUrl: string): void {
  URL.revokeObjectURL(previewUrl);
}

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Human-readable size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Checks if file needs compression (>500KB)
 * @param file - File to check
 * @returns true if compression recommended
 */
export function needsCompression(file: File): boolean {
  return file.size > 500 * 1024;
}

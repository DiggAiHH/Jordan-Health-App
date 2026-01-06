import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, LoadingSpinner, validateImageFile, createImagePreview, revokeImagePreview } from '@jordan-health/shared';
import type { ChatAttachment } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';
import imageCompression from 'browser-image-compression';

interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
  isAiGenerated?: boolean;
  attachment?: ChatAttachment;
}

/**
 * Chat-Seite für die Kommunikation mit dem Arzt
 * Einfache Nachrichten-Oberfläche für geriatrische Patienten
 * Mit Bild-Upload-Unterstützung für bessere Kommunikation
 */
export function Chat() {
  const { t, locale } = useAppLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: locale === 'ar' 
        ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟'
        : 'Guten Tag! Wie kann ich Ihnen heute helfen?',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fullscreen image view
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      if (validation.error === 'INVALID_TYPE') {
        setErrorMessage(t.patient.errorInvalidType);
      } else if (validation.error === 'FILE_TOO_LARGE') {
        setErrorMessage(t.patient.errorFileTooLarge);
      }
      e.target.value = '';
      return;
    }

    // Clear previous preview
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }

    // Set file and preview
    setSelectedFile(file);
    setImagePreview(createImagePreview(file));
    setUploadProgress(0);
  };

  const clearImagePreview = () => {
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }
    setSelectedFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    // Skip compression for small files
    if (file.size < 500 * 1024) return file;

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg'
      });
      return compressed;
    } catch {
      return file;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasText = newMessage.trim();
    const hasImage = selectedFile;

    if (!hasText && !hasImage) return;
    if (sending || uploading) return;

    setErrorMessage('');
    let attachment: ChatAttachment | undefined;

    try {
      // Upload image if present
      if (hasImage) {
        setUploading(true);
        setUploadProgress(0);

        const compressed = await compressImage(selectedFile);
        
        // Simulate upload progress (replace with real Firebase upload)
        for (let i = 0; i <= 100; i += 20) {
          setUploadProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }

        // Mock attachment (replace with real Firebase Storage URL)
        attachment = {
          type: 'image',
          url: imagePreview!, // In production: Firebase Storage URL
          path: `chat_images/patient/${Date.now()}.jpg`,
          size: compressed.size
        };

        setUploading(false);
      }

      setSending(true);

      const patientMessage: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        sender: 'patient',
        timestamp: new Date(),
        attachment
      };

      setMessages(prev => [...prev, patientMessage]);
      setNewMessage('');
      clearImagePreview();

      // Simulated auto-response
      setTimeout(() => {
        const doctorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: locale === 'ar'
            ? 'شكراً على رسالتك. سيراجع الطبيب رسالتك ويرد عليك قريباً.'
            : 'Vielen Dank für Ihre Nachricht. Der Arzt wird Ihre Nachricht prüfen und sich bald bei Ihnen melden.',
          sender: 'doctor',
          timestamp: new Date(),
          isAiGenerated: true,
        };
        setMessages(prev => [...prev, doctorMessage]);
        setSending(false);
      }, 1500);

    } catch {
      setErrorMessage(t.patient.errorUploadFailed);
      setUploading(false);
      setSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale === 'ar' ? 'ar-JO' : 'de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.patient.chat}</h2>

      {/* Nachrichten */}
      <Card className="flex-1 overflow-hidden flex flex-col" padding="none">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-4 rounded-2xl
                  ${message.sender === 'patient'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }
                `}
              >
                {/* Image Attachment */}
                {message.attachment?.type === 'image' && (
                  <div className="mb-3">
                    <img
                      src={message.attachment.url}
                      alt={t.patient.imageAttachment}
                      className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                      onClick={() => setFullscreenImage(message.attachment!.url)}
                      loading="lazy"
                    />
                  </div>
                )}

                {message.content && <p className="text-lg">{message.content}</p>}
                
                <div className={`
                  flex items-center gap-2 mt-2 text-sm
                  ${message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'}
                `}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.isAiGenerated && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                      {locale === 'ar' ? 'رد تلقائي' : 'Automatische Antwort'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {(sending || uploading) && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                <LoadingSpinner size="sm" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-start gap-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-700">
                  {t.patient.imageReady}
                </p>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>
              <button
                onClick={clearImagePreview}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600"
                disabled={uploading}
                aria-label={t.patient.removeImage}
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="px-4 pb-2">
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          {/* Photo Button - Large for Elderly */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-4 py-4 px-6 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            disabled={uploading}
          >
            <span className="text-2xl">📷</span>
            <span>{t.patient.addPhoto}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />

          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t.patient.typeMessage}
              className="flex-1 p-4 text-lg border-2 border-gray-300 rounded-xl
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none"
              disabled={sending || uploading}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={(!newMessage.trim() && !selectedFile) || sending || uploading}
            >
              {locale === 'ar' ? 'إرسال' : 'Senden'}
            </Button>
          </form>
        </div>
      </Card>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 p-4"
            onClick={() => setFullscreenImage(null)}
            aria-label={t.common.close}
          >
            ✕
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}

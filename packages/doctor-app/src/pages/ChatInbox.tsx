import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@jordan-health/shared';
import type { ChatAttachment } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderRole: 'patient' | 'doctor';
  timestamp: Date;
  isRead: boolean;
  attachment?: ChatAttachment;
}

interface ConversationPreview {
  id: string;
  patientId: string;
  patientName: string;
  patientNameArabic: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  hasImageAttachment: boolean;
}

// Mock data for conversations
const mockConversations: ConversationPreview[] = [
  {
    id: 'conv-1',
    patientId: '1',
    patientName: 'Ahmad Mohammed',
    patientNameArabic: 'أحمد محمد',
    lastMessage: 'Ich habe ein Foto meiner Mahlzeit geschickt',
    lastMessageAt: new Date(Date.now() - 1800000),
    unreadCount: 2,
    hasImageAttachment: true,
  },
  {
    id: 'conv-2',
    patientId: '2',
    patientName: 'Fatima Hassan',
    patientNameArabic: 'فاطمة حسن',
    lastMessage: 'Mein Blutzucker war heute morgen 145 mg/dL',
    lastMessageAt: new Date(Date.now() - 7200000),
    unreadCount: 0,
    hasImageAttachment: false,
  },
  {
    id: 'conv-3',
    patientId: '3',
    patientName: 'Omar Said',
    patientNameArabic: 'عمر سعيد',
    lastMessage: 'شكراً دكتور، سأتبع النصائح',
    lastMessageAt: new Date(Date.now() - 86400000),
    unreadCount: 1,
    hasImageAttachment: false,
  },
];

// Mock messages for selected conversation
const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm1',
      content: 'Guten Tag Herr Mohammed, wie geht es Ihnen heute?',
      senderId: 'doctor-1',
      senderRole: 'doctor',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
    {
      id: 'm2',
      content: 'Mir geht es besser, danke. Hier ist ein Foto meines Frühstücks.',
      senderId: '1',
      senderRole: 'patient',
      timestamp: new Date(Date.now() - 1800000),
      isRead: false,
      attachment: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        path: 'chat_images/1/conv-1/breakfast.jpg',
        size: 245000,
      },
    },
    {
      id: 'm3',
      content: 'Mein Blutzucker war danach 165 mg/dL',
      senderId: '1',
      senderRole: 'patient',
      timestamp: new Date(Date.now() - 900000),
      isRead: false,
    },
  ],
};

/**
 * Chat-Inbox für Ärzte
 * Zeigt alle Patientenkonversationen mit Bildvorschau
 */
export function ChatInbox() {
  const { t, locale } = useAppLocale();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString(locale === 'ar' ? 'ar-JO' : 'de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'de-DE', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;
    // In production: API call to send message
    setReplyText('');
  };

  const selectedMessages = selectedConversation ? mockMessages[selectedConversation] || [] : [];
  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-900">{t.doctor.inbox}</h2>
        {totalUnread > 0 && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-lg font-bold">
            {totalUnread} {t.doctor.unreadMessages}
          </span>
        )}
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Conversation List */}
        <Card className="w-80 flex-shrink-0 overflow-hidden flex flex-col" padding="none">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-700">{t.doctor.conversations}</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">{t.doctor.noConversations}</p>
            ) : (
              mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors
                    ${selectedConversation === conv.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {locale === 'ar' ? conv.patientNameArabic : conv.patientName}
                        </span>
                        {conv.hasImageAttachment && (
                          <span className="text-lg" title={t.doctor.patientSentImage}>📷</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className="text-xs text-gray-500">{formatTime(conv.lastMessageAt)}</span>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Message View */}
        <Card className="flex-1 overflow-hidden flex flex-col" padding="none">
          {selectedConversation && selectedConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {locale === 'ar' ? selectedConv.patientNameArabic : selectedConv.patientName}
                    </h3>
                    <Link
                      to={`/patients/${selectedConv.patientId}`}
                      className="text-sm text-green-600 hover:underline"
                    >
                      {t.doctor.patientDetails} →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderRole === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl
                        ${message.senderRole === 'doctor'
                          ? 'bg-green-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }
                      `}
                    >
                      {/* Image Attachment */}
                      {message.attachment?.type === 'image' && (
                        <div className="mb-3">
                          <img
                            src={message.attachment.url}
                            alt={t.doctor.viewImage}
                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ maxHeight: '250px', objectFit: 'contain' }}
                            onClick={() => setFullscreenImage(message.attachment!.url)}
                            loading="lazy"
                          />
                          <p className="text-xs mt-1 opacity-75">
                            {t.doctor.patientSentImage}
                          </p>
                        </div>
                      )}

                      {message.content && <p className="text-lg">{message.content}</p>}
                      
                      <div className={`flex items-center gap-2 mt-2 text-sm
                        ${message.senderRole === 'doctor' ? 'text-green-100' : 'text-gray-500'}
                      `}>
                        <span>{formatTime(message.timestamp)}</span>
                        {!message.isRead && message.senderRole === 'patient' && (
                          <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded">
                            {locale === 'ar' ? 'جديد' : 'Neu'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={locale === 'ar' ? 'اكتب ردك...' : 'Antwort eingeben...'}
                    className="flex-1 p-3 text-lg border-2 border-gray-300 rounded-xl
                      focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    {t.doctor.sendResponse}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <span className="text-6xl mb-4 block">💬</span>
                <p className="text-xl">{t.doctor.selectPatient}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

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

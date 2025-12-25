import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
  isAiGenerated?: boolean;
}

/**
 * Chat-Seite für die Kommunikation mit dem Arzt
 * Einfache Nachrichten-Oberfläche für geriatrische Patienten
 */
export function Chat() {
  const { t, locale } = useAppLocale();
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const patientMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'patient',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, patientMessage]);
    setNewMessage('');
    setSending(true);

    // Simulierte Antwort (in Produktion: API-Call)
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
                <p className="text-lg">{message.content}</p>
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
          
          {sending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                <LoadingSpinner size="sm" />
              </div>
            </div>
          )}
        </div>

        {/* Eingabefeld */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t.patient.typeMessage}
              className="flex-1 p-4 text-lg border-2 border-gray-300 rounded-xl
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none"
              disabled={sending}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!newMessage.trim() || sending}
            >
              {locale === 'ar' ? 'إرسال' : 'Senden'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

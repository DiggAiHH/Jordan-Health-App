
import { Card } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

interface ConversationStat {
  patientName: string;
  patientNameArabic: string;
  doctorName: string;
  doctorNameArabic: string;
  totalMessages: number;
  unreadCount: number;
  hasImages: boolean;
  lastActivity: Date;
}

// Mock conversation statistics
const mockStats: ConversationStat[] = [
  {
    patientName: 'Ahmad Mohammed',
    patientNameArabic: 'أحمد محمد',
    doctorName: 'Dr. Sara Ali',
    doctorNameArabic: 'د. سارة علي',
    totalMessages: 24,
    unreadCount: 2,
    hasImages: true,
    lastActivity: new Date(Date.now() - 1800000),
  },
  {
    patientName: 'Fatima Hassan',
    patientNameArabic: 'فاطمة حسن',
    doctorName: 'Dr. Sara Ali',
    doctorNameArabic: 'د. سارة علي',
    totalMessages: 15,
    unreadCount: 0,
    hasImages: false,
    lastActivity: new Date(Date.now() - 7200000),
  },
  {
    patientName: 'Omar Said',
    patientNameArabic: 'عمر سعيد',
    doctorName: 'Dr. Khaled Nasser',
    doctorNameArabic: 'د. خالد ناصر',
    totalMessages: 8,
    unreadCount: 1,
    hasImages: true,
    lastActivity: new Date(Date.now() - 86400000),
  },
];

/**
 * Conversations Overview for Admin
 * Read-only view of patient-doctor communications
 * @security Admin can view metadata only, no message content (DSGVO compliance)
 */
export function Conversations() {
  const { t, locale } = useAppLocale();

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

  const totalConversations = mockStats.length;
  const totalUnread = mockStats.reduce((sum, c) => sum + c.unreadCount, 0);
  const conversationsWithImages = mockStats.filter(c => c.hasImages).length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {locale === 'ar' ? 'نظرة عامة على المحادثات' : 'Konversations-Übersicht'}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <div className="text-4xl font-bold text-purple-600">{totalConversations}</div>
          <p className="text-gray-600 mt-1">
            {locale === 'ar' ? 'إجمالي المحادثات' : 'Aktive Konversationen'}
          </p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-red-500">{totalUnread}</div>
          <p className="text-gray-600 mt-1">
            {locale === 'ar' ? 'رسائل غير مقروءة' : 'Ungelesene Nachrichten'}
          </p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-green-600">{conversationsWithImages}</div>
          <p className="text-gray-600 mt-1">
            {locale === 'ar' ? 'مع صور مرفقة' : 'Mit Bildanhängen'}
          </p>
        </Card>
      </div>

      {/* Conversation Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">
                  {t.admin.patients}
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  {t.admin.doctors}
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  {locale === 'ar' ? 'الرسائل' : 'Nachrichten'}
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  {locale === 'ar' ? 'غير مقروءة' : 'Ungelesen'}
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  📷
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  {locale === 'ar' ? 'آخر نشاط' : 'Letzte Aktivität'}
                </th>
              </tr>
            </thead>
            <tbody>
              {mockStats.map((stat, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <span className="font-medium">
                      {locale === 'ar' ? stat.patientNameArabic : stat.patientName}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {locale === 'ar' ? stat.doctorNameArabic : stat.doctorName}
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {stat.totalMessages}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {stat.unreadCount > 0 ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                        {stat.unreadCount}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {stat.hasImages ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">
                    {formatTime(stat.lastActivity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ {locale === 'ar' 
              ? 'ملاحظة: محتوى الرسائل متاح فقط للأطباء المعينين (الامتثال للائحة العامة لحماية البيانات)'
              : 'Hinweis: Nachrichteninhalte sind nur für zugewiesene Ärzte einsehbar (DSGVO-Konformität)'
            }
          </p>
        </div>
      </Card>
    </div>
  );
}

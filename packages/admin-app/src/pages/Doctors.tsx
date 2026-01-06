import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

// Mock-Ärzte-Daten
const mockDoctors = [
  {
    id: '1',
    firstName: 'Dr. Fadi',
    lastName: 'Alshdaifat',
    email: 'dr.alshdaifat@clinic.jo',
    phone: '+962791234500',
    specialization: 'Diabetologie',
    licenseNumber: 'JMC-12345',
    patientCount: 45,
    status: 'active' as const,
  },
  {
    id: '2',
    firstName: 'Dr. Layla',
    lastName: 'Hassan',
    email: 'dr.hassan@clinic.jo',
    phone: '+962791234501',
    specialization: 'Geriatrie',
    licenseNumber: 'JMC-12346',
    patientCount: 32,
    status: 'active' as const,
  },
  {
    id: '3',
    firstName: 'Dr. Omar',
    lastName: 'Khalil',
    email: 'dr.khalil@clinic.jo',
    phone: '+962791234502',
    specialization: 'Innere Medizin',
    licenseNumber: 'JMC-12347',
    patientCount: 28,
    status: 'inactive' as const,
  },
];

/**
 * Ärzte-Verwaltungsseite
 */
export function Doctors() {
  const { t, locale } = useAppLocale();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = mockDoctors.filter((doctor) => {
    return `${doctor.firstName} ${doctor.lastName} ${doctor.email} ${doctor.specialization}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, { de: string; ar: string }> = {
    active: { de: 'Aktiv', ar: 'نشط' },
    inactive: { de: 'Inaktiv', ar: 'غير نشط' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t.admin.doctors}</h2>
        <Link to="/add-user">
          <Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
            ➕ {locale === 'ar' ? 'إضافة طبيب' : 'Arzt hinzufügen'}
          </Button>
        </Link>
      </div>

      {/* Suche */}
      <Card>
        <Input
          label={t.common.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={locale === 'ar' ? 'ابحث عن طبيب...' : 'Arzt suchen...'}
          size="md"
        />
      </Card>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center bg-green-50">
          <div className="text-3xl font-bold text-green-600">{mockDoctors.length}</div>
          <div className="text-gray-600">{locale === 'ar' ? 'الأطباء' : 'Ärzte gesamt'}</div>
        </Card>
        <Card className="text-center bg-blue-50">
          <div className="text-3xl font-bold text-blue-600">
            {mockDoctors.reduce((sum, d) => sum + d.patientCount, 0)}
          </div>
          <div className="text-gray-600">{locale === 'ar' ? 'المرضى المسجلين' : 'Betreute Patienten'}</div>
        </Card>
        <Card className="text-center bg-purple-50">
          <div className="text-3xl font-bold text-purple-600">
            {Math.round(mockDoctors.reduce((sum, d) => sum + d.patientCount, 0) / mockDoctors.length)}
          </div>
          <div className="text-gray-600">{locale === 'ar' ? 'متوسط/طبيب' : 'Ø pro Arzt'}</div>
        </Card>
      </div>

      {/* Ärzte-Karten */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    {doctor.firstName} {doctor.lastName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[doctor.status]}`}>
                    {statusLabels[doctor.status][locale]}
                  </span>
                </div>
                
                <p className="text-purple-600 font-medium">{doctor.specialization}</p>
                
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <span>📧</span>
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>📱</span>
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>🪪</span>
                    <span>{doctor.licenseNumber}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg">
                    <span className="font-bold text-blue-600">{doctor.patientCount}</span>
                    <span className="text-gray-500 ml-2">
                      {locale === 'ar' ? 'مريض' : 'Patienten'}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm">
                    {locale === 'ar' ? 'تعديل' : 'Bearbeiten'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-xl text-gray-500">
            {locale === 'ar' ? 'لا يوجد أطباء مطابقين' : 'Keine passenden Ärzte gefunden'}
          </p>
        </Card>
      )}
    </div>
  );
}

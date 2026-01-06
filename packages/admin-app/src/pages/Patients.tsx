import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

// Mock-Patientendaten
const mockPatients = [
  {
    id: '1',
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phone: '+962791234567',
    age: 72,
    diabetesType: 'type2',
    assignedDoctor: 'Dr. Alshdaifat',
    status: 'active' as const,
    registeredAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    firstName: 'سارة',
    lastName: 'علي',
    email: 'sara@example.com',
    phone: '+962791234568',
    age: 68,
    diabetesType: 'type2',
    assignedDoctor: 'Dr. Alshdaifat',
    status: 'active' as const,
    registeredAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    firstName: 'محمود',
    lastName: 'خالد',
    email: 'mahmoud@example.com',
    phone: '+962791234569',
    age: 75,
    diabetesType: 'type1',
    assignedDoctor: 'Dr. Hassan',
    status: 'inactive' as const,
    registeredAt: new Date('2023-11-10'),
  },
  {
    id: '4',
    firstName: 'فاطمة',
    lastName: 'حسن',
    email: 'fatima@example.com',
    phone: '+962791234570',
    age: 65,
    diabetesType: 'type2',
    assignedDoctor: 'Dr. Alshdaifat',
    status: 'active' as const,
    registeredAt: new Date('2024-03-01'),
  },
];

/**
 * Patienten-Verwaltungsseite
 */
export function Patients() {
  const { t, locale } = useAppLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch = 
      `${patient.firstName} ${patient.lastName} ${patient.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
        <h2 className="text-2xl font-bold text-gray-900">{t.admin.patients}</h2>
        <Link to="/add-user">
          <Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
            ➕ {t.admin.addUser}
          </Button>
        </Link>
      </div>

      {/* Suche und Filter */}
      <Card>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              label={t.common.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={locale === 'ar' ? 'ابحث عن مريض...' : 'Patient suchen...'}
              size="md"
            />
          </div>
          
          <div className="min-w-[150px]">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full p-3 text-lg border-2 border-gray-300 rounded-xl
                focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none"
            >
              <option value="all">{locale === 'ar' ? 'الكل' : 'Alle'}</option>
              <option value="active">{statusLabels.active[locale]}</option>
              <option value="inactive">{statusLabels.inactive[locale]}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center bg-blue-50">
          <div className="text-3xl font-bold text-blue-600">{mockPatients.length}</div>
          <div className="text-gray-600">{locale === 'ar' ? 'الإجمالي' : 'Gesamt'}</div>
        </Card>
        <Card className="text-center bg-green-50">
          <div className="text-3xl font-bold text-green-600">
            {mockPatients.filter(p => p.status === 'active').length}
          </div>
          <div className="text-gray-600">{statusLabels.active[locale]}</div>
        </Card>
        <Card className="text-center bg-gray-50">
          <div className="text-3xl font-bold text-gray-600">
            {mockPatients.filter(p => p.status === 'inactive').length}
          </div>
          <div className="text-gray-600">{statusLabels.inactive[locale]}</div>
        </Card>
      </div>

      {/* Patienten-Tabelle */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  {locale === 'ar' ? 'الاسم' : 'Name'}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  {locale === 'ar' ? 'البريد' : 'E-Mail'}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  {locale === 'ar' ? 'الهاتف' : 'Telefon'}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  {locale === 'ar' ? 'الطبيب' : 'Arzt'}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  {locale === 'ar' ? 'إجراءات' : 'Aktionen'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                        {patient.firstName[0]}
                      </div>
                      <div>
                        <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                        <div className="text-sm text-gray-500">{patient.age} Jahre • Typ {patient.diabetesType === 'type1' ? '1' : '2'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{patient.email}</td>
                  <td className="py-3 px-4 text-gray-600">{patient.phone}</td>
                  <td className="py-3 px-4 text-gray-600">{patient.assignedDoctor}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[patient.status]}`}>
                      {statusLabels[patient.status][locale]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        {locale === 'ar' ? 'تعديل' : 'Bearbeiten'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            {locale === 'ar' ? 'لا يوجد مرضى مطابقين' : 'Keine passenden Patienten gefunden'}
          </p>
        )}
      </Card>
    </div>
  );
}

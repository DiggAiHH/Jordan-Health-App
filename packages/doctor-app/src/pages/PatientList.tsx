import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

// Mock-Patientendaten
const mockPatients = [
  {
    id: '1',
    firstName: 'أحمد',
    lastName: 'محمد',
    age: 72,
    diabetesType: 'type2' as const,
    lastReading: 185,
    lastReadingDate: new Date(Date.now() - 3600000),
    riskLevel: 'high' as const,
  },
  {
    id: '2',
    firstName: 'سارة',
    lastName: 'علي',
    age: 68,
    diabetesType: 'type2' as const,
    lastReading: 142,
    lastReadingDate: new Date(Date.now() - 7200000),
    riskLevel: 'moderate' as const,
  },
  {
    id: '3',
    firstName: 'محمود',
    lastName: 'خالد',
    age: 75,
    diabetesType: 'type1' as const,
    lastReading: 98,
    lastReadingDate: new Date(Date.now() - 10800000),
    riskLevel: 'low' as const,
  },
  {
    id: '4',
    firstName: 'فاطمة',
    lastName: 'حسن',
    age: 65,
    diabetesType: 'type2' as const,
    lastReading: 220,
    lastReadingDate: new Date(Date.now() - 14400000),
    riskLevel: 'critical' as const,
  },
];

/**
 * Patientenliste mit Suchfunktion und Risikofilter
 */
export function PatientList() {
  const { t, locale } = useAppLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch = 
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  const riskColors = {
    low: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const riskLabels: Record<string, { de: string; ar: string }> = {
    low: { de: 'Niedrig', ar: 'منخفض' },
    moderate: { de: 'Moderat', ar: 'متوسط' },
    high: { de: 'Hoch', ar: 'مرتفع' },
    critical: { de: 'Kritisch', ar: 'حرج' },
  };

  const diabetesTypeLabels: Record<string, { de: string; ar: string }> = {
    type1: { de: 'Typ 1', ar: 'النوع 1' },
    type2: { de: 'Typ 2', ar: 'النوع 2' },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.doctor.patients}</h2>

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
              {t.doctor.riskLevel}
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full p-3 text-lg border-2 border-gray-300 rounded-xl
                focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none"
            >
              <option value="all">{locale === 'ar' ? 'الكل' : 'Alle'}</option>
              <option value="critical">{riskLabels.critical[locale]}</option>
              <option value="high">{riskLabels.high[locale]}</option>
              <option value="moderate">{riskLabels.moderate[locale]}</option>
              <option value="low">{riskLabels.low[locale]}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Patientenliste */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-xl text-gray-500">
              {locale === 'ar' ? 'لا يوجد مرضى مطابقين' : 'Keine passenden Patienten gefunden'}
            </p>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Link key={patient.id} to={`/patients/${patient.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-gray-500">
                        {patient.age} {locale === 'ar' ? 'سنة' : 'Jahre'} • {diabetesTypeLabels[patient.diabetesType][locale]}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {patient.lastReading} mg/dL
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${riskColors[patient.riskLevel]}`}>
                      {riskLabels[patient.riskLevel][locale]}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

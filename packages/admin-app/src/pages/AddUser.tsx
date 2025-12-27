import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert } from '@jordan-health/shared';
import { validateEmail, validateJordanianPhone } from '@jordan-health/shared';
import { useAppLocale } from '../hooks/useAppLocale';

type UserRole = 'patient' | 'doctor';

/**
 * Formular zum Hinzufügen neuer Benutzer
 */
export function AddUser() {
  const { t, locale } = useAppLocale();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('patient');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [diabetesType, setDiabetesType] = useState('type2');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = t.validation.requiredField;
    }
    if (!lastName.trim()) {
      newErrors.lastName = t.validation.requiredField;
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = t.validation.emailInvalid;
    }
    if (!phone.trim() || !validateJordanianPhone(phone)) {
      newErrors.phone = t.validation.phoneInvalid;
    }

    if (role === 'patient') {
      if (!dateOfBirth) {
        newErrors.dateOfBirth = t.validation.requiredField;
      }
    }

    if (role === 'doctor') {
      if (!specialization.trim()) {
        newErrors.specialization = t.validation.requiredField;
      }
      if (!licenseNumber.trim()) {
        newErrors.licenseNumber = t.validation.requiredField;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // In Produktion: API-Call zum Erstellen des Benutzers
    setSuccess(true);
    setTimeout(() => {
      navigate(role === 'patient' ? '/patients' : '/doctors');
    }, 1500);
  };

  if (success) {
    return (
      <div className="space-y-6">
        <Alert type="success" title={t.common.success}>
          {locale === 'ar' 
            ? 'تم إنشاء المستخدم بنجاح!'
            : 'Benutzer erfolgreich erstellt!'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.admin.addUser}</h2>

      <form onSubmit={handleSubmit}>
        {/* Rollenauswahl */}
        <Card title={locale === 'ar' ? 'نوع المستخدم' : 'Benutzertyp'}>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`
                p-6 rounded-xl text-lg font-medium
                border-2 transition-all duration-200
                flex flex-col items-center gap-2
                focus:outline-none focus:ring-4 focus:ring-purple-300
                ${role === 'patient'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <span className="text-4xl">👤</span>
              {locale === 'ar' ? 'مريض' : 'Patient'}
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`
                p-6 rounded-xl text-lg font-medium
                border-2 transition-all duration-200
                flex flex-col items-center gap-2
                focus:outline-none focus:ring-4 focus:ring-purple-300
                ${role === 'doctor'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <span className="text-4xl">👨‍⚕️</span>
              {locale === 'ar' ? 'طبيب' : 'Arzt'}
            </button>
          </div>
        </Card>

        {/* Persönliche Daten */}
        <Card title={locale === 'ar' ? 'البيانات الشخصية' : 'Persönliche Daten'} className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={locale === 'ar' ? 'الاسم الأول' : 'Vorname'}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              required
            />
            <Input
              label={locale === 'ar' ? 'الاسم الأخير' : 'Nachname'}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              required
            />
          </div>
          
          <Input
            label={t.auth.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />
          
          <Input
            label={locale === 'ar' ? 'رقم الهاتف' : 'Telefonnummer'}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+962 7X XXX XXXX"
            error={errors.phone}
            required
          />
        </Card>

        {/* Patienten-spezifische Felder */}
        {role === 'patient' && (
          <Card title={locale === 'ar' ? 'بيانات المريض' : 'Patientendaten'} className="mt-6">
            <Input
              label={locale === 'ar' ? 'تاريخ الميلاد' : 'Geburtsdatum'}
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              error={errors.dateOfBirth}
              required
            />
            
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                {locale === 'ar' ? 'نوع السكري' : 'Diabetes-Typ'}
              </label>
              <select
                value={diabetesType}
                onChange={(e) => setDiabetesType(e.target.value)}
                className="w-full p-3 text-lg border-2 border-gray-300 rounded-xl
                  focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none"
              >
                <option value="type1">Typ 1</option>
                <option value="type2">Typ 2</option>
                <option value="gestational">{locale === 'ar' ? 'سكري الحمل' : 'Gestationsdiabetes'}</option>
                <option value="prediabetes">{locale === 'ar' ? 'ما قبل السكري' : 'Prädiabetes'}</option>
              </select>
            </div>
          </Card>
        )}

        {/* Arzt-spezifische Felder */}
        {role === 'doctor' && (
          <Card title={locale === 'ar' ? 'بيانات الطبيب' : 'Arztdaten'} className="mt-6">
            <Input
              label={locale === 'ar' ? 'التخصص' : 'Fachgebiet'}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder={locale === 'ar' ? 'مثال: أمراض السكري' : 'z.B. Diabetologie'}
              error={errors.specialization}
              required
            />
            
            <Input
              label={locale === 'ar' ? 'رقم الترخيص' : 'Approbationsnummer'}
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="JMC-XXXXX"
              error={errors.licenseNumber}
              required
            />
          </Card>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            {t.common.cancel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {t.common.save}
          </Button>
        </div>
      </form>
    </div>
  );
}

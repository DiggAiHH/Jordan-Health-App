/**
 * Internationalisierung für Jordan Health App
 * Unterstützt Deutsch und Arabisch
 */

export type Locale = 'de' | 'ar';

export interface Translations {
  common: {
    appName: string;
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    submit: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    required: string;
    optional: string;
  };
  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    forgotPassword: string;
    rememberMe: string;
    loginButton: string;
    loginError: string;
  };
  patient: {
    dashboard: string;
    bloodGlucose: string;
    addReading: string;
    myReadings: string;
    chat: string;
    sendMessage: string;
    typeMessage: string;
    value: string;
    measurementContext: string;
    notes: string;
    history: string;
    trend: string;
    average: string;
    timeInRange: string;
  };
  doctor: {
    dashboard: string;
    patients: string;
    patientDetails: string;
    analysis: string;
    aiSuggestions: string;
    respond: string;
    riskLevel: string;
    alerts: string;
    noAlerts: string;
    selectPatient: string;
    sendResponse: string;
    editResponse: string;
    useAiSuggestion: string;
  };
  nutrition: {
    dashboard: string;
    meals: string;
    addMeal: string;
    mealType: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    carbohydrates: string;
    calories: string;
    glycemicIndex: string;
    portion: string;
    addItem: string;
    takePhoto: string;
    todaysMeals: string;
    weeklyOverview: string;
  };
  admin: {
    dashboard: string;
    users: string;
    patients: string;
    doctors: string;
    addUser: string;
    editUser: string;
    deleteUser: string;
    assignDoctor: string;
    statistics: string;
    systemSettings: string;
    exportData: string;
  };
  glucose: {
    fasting: string;
    beforeMeal: string;
    afterMeal: string;
    beforeSleep: string;
    random: string;
    exercise: string;
    low: string;
    normal: string;
    high: string;
    criticalLow: string;
    criticalHigh: string;
  };
  validation: {
    emailInvalid: string;
    phoneInvalid: string;
    glucoseInvalid: string;
    requiredField: string;
    minLength: string;
    maxLength: string;
  };
}

export const translations: Record<Locale, Translations> = {
  de: {
    common: {
      appName: 'JoBetes - Diabetes Follow-Up System',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolgreich',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      add: 'Hinzufügen',
      search: 'Suchen',
      submit: 'Absenden',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Vorherige',
      close: 'Schließen',
      confirm: 'Bestätigen',
      yes: 'Ja',
      no: 'Nein',
      required: 'Erforderlich',
      optional: 'Optional',
    },
    auth: {
      login: 'Anmelden',
      logout: 'Abmelden',
      email: 'E-Mail',
      password: 'Passwort',
      forgotPassword: 'Passwort vergessen?',
      rememberMe: 'Angemeldet bleiben',
      loginButton: 'Anmelden',
      loginError: 'Anmeldung fehlgeschlagen',
    },
    patient: {
      dashboard: 'Mein Dashboard',
      bloodGlucose: 'Blutzucker',
      addReading: 'Neue Messung',
      myReadings: 'Meine Messungen',
      chat: 'Chat mit Arzt',
      sendMessage: 'Nachricht senden',
      typeMessage: 'Nachricht eingeben...',
      value: 'Wert',
      measurementContext: 'Messkontext',
      notes: 'Notizen',
      history: 'Verlauf',
      trend: 'Trend',
      average: 'Durchschnitt',
      timeInRange: 'Zeit im Zielbereich',
    },
    doctor: {
      dashboard: 'Arzt-Dashboard',
      patients: 'Patienten',
      patientDetails: 'Patientendetails',
      analysis: 'Analyse',
      aiSuggestions: 'KI-Vorschläge',
      respond: 'Antworten',
      riskLevel: 'Risikolevel',
      alerts: 'Warnungen',
      noAlerts: 'Keine Warnungen',
      selectPatient: 'Patient auswählen',
      sendResponse: 'Antwort senden',
      editResponse: 'Antwort bearbeiten',
      useAiSuggestion: 'KI-Vorschlag verwenden',
    },
    nutrition: {
      dashboard: 'Ernährungs-Dashboard',
      meals: 'Mahlzeiten',
      addMeal: 'Mahlzeit hinzufügen',
      mealType: 'Mahlzeitentyp',
      breakfast: 'Frühstück',
      lunch: 'Mittagessen',
      dinner: 'Abendessen',
      snack: 'Snack',
      carbohydrates: 'Kohlenhydrate',
      calories: 'Kalorien',
      glycemicIndex: 'Glykämischer Index',
      portion: 'Portion',
      addItem: 'Lebensmittel hinzufügen',
      takePhoto: 'Foto aufnehmen',
      todaysMeals: 'Heutige Mahlzeiten',
      weeklyOverview: 'Wochenübersicht',
    },
    admin: {
      dashboard: 'Admin-Dashboard',
      users: 'Benutzer',
      patients: 'Patienten',
      doctors: 'Ärzte',
      addUser: 'Benutzer hinzufügen',
      editUser: 'Benutzer bearbeiten',
      deleteUser: 'Benutzer löschen',
      assignDoctor: 'Arzt zuweisen',
      statistics: 'Statistiken',
      systemSettings: 'Systemeinstellungen',
      exportData: 'Daten exportieren',
    },
    glucose: {
      fasting: 'Nüchtern',
      beforeMeal: 'Vor dem Essen',
      afterMeal: 'Nach dem Essen',
      beforeSleep: 'Vor dem Schlafen',
      random: 'Zufällig',
      exercise: 'Nach Sport',
      low: 'Niedrig',
      normal: 'Normal',
      high: 'Erhöht',
      criticalLow: 'Kritisch niedrig',
      criticalHigh: 'Kritisch hoch',
    },
    validation: {
      emailInvalid: 'Ungültige E-Mail-Adresse',
      phoneInvalid: 'Ungültige Telefonnummer',
      glucoseInvalid: 'Blutzuckerwert außerhalb des gültigen Bereichs (20-600 mg/dL)',
      requiredField: 'Dieses Feld ist erforderlich',
      minLength: 'Mindestlänge: {min} Zeichen',
      maxLength: 'Maximallänge: {max} Zeichen',
    },
  },
  ar: {
    common: {
      appName: 'جوبيتس - نظام متابعة السكري',
      loading: 'جارٍ التحميل...',
      error: 'خطأ',
      success: 'تم بنجاح',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث',
      submit: 'إرسال',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      close: 'إغلاق',
      confirm: 'تأكيد',
      yes: 'نعم',
      no: 'لا',
      required: 'مطلوب',
      optional: 'اختياري',
    },
    auth: {
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',
      loginButton: 'دخول',
      loginError: 'فشل تسجيل الدخول',
    },
    patient: {
      dashboard: 'لوحة التحكم',
      bloodGlucose: 'سكر الدم',
      addReading: 'قراءة جديدة',
      myReadings: 'قراءاتي',
      chat: 'محادثة مع الطبيب',
      sendMessage: 'إرسال رسالة',
      typeMessage: 'اكتب رسالتك...',
      value: 'القيمة',
      measurementContext: 'وقت القياس',
      notes: 'ملاحظات',
      history: 'السجل',
      trend: 'الاتجاه',
      average: 'المعدل',
      timeInRange: 'الوقت ضمن المعدل',
    },
    doctor: {
      dashboard: 'لوحة تحكم الطبيب',
      patients: 'المرضى',
      patientDetails: 'تفاصيل المريض',
      analysis: 'التحليل',
      aiSuggestions: 'اقتراحات الذكاء الاصطناعي',
      respond: 'رد',
      riskLevel: 'مستوى الخطورة',
      alerts: 'التنبيهات',
      noAlerts: 'لا توجد تنبيهات',
      selectPatient: 'اختر مريض',
      sendResponse: 'إرسال الرد',
      editResponse: 'تعديل الرد',
      useAiSuggestion: 'استخدم اقتراح الذكاء الاصطناعي',
    },
    nutrition: {
      dashboard: 'لوحة تحكم التغذية',
      meals: 'الوجبات',
      addMeal: 'إضافة وجبة',
      mealType: 'نوع الوجبة',
      breakfast: 'فطور',
      lunch: 'غداء',
      dinner: 'عشاء',
      snack: 'وجبة خفيفة',
      carbohydrates: 'الكربوهيدرات',
      calories: 'السعرات الحرارية',
      glycemicIndex: 'مؤشر السكر',
      portion: 'الحصة',
      addItem: 'إضافة طعام',
      takePhoto: 'التقاط صورة',
      todaysMeals: 'وجبات اليوم',
      weeklyOverview: 'نظرة أسبوعية',
    },
    admin: {
      dashboard: 'لوحة تحكم المدير',
      users: 'المستخدمون',
      patients: 'المرضى',
      doctors: 'الأطباء',
      addUser: 'إضافة مستخدم',
      editUser: 'تعديل مستخدم',
      deleteUser: 'حذف مستخدم',
      assignDoctor: 'تعيين طبيب',
      statistics: 'الإحصائيات',
      systemSettings: 'إعدادات النظام',
      exportData: 'تصدير البيانات',
    },
    glucose: {
      fasting: 'صائم',
      beforeMeal: 'قبل الأكل',
      afterMeal: 'بعد الأكل',
      beforeSleep: 'قبل النوم',
      random: 'عشوائي',
      exercise: 'بعد الرياضة',
      low: 'منخفض',
      normal: 'طبيعي',
      high: 'مرتفع',
      criticalLow: 'منخفض جداً',
      criticalHigh: 'مرتفع جداً',
    },
    validation: {
      emailInvalid: 'عنوان البريد الإلكتروني غير صالح',
      phoneInvalid: 'رقم الهاتف غير صالح',
      glucoseInvalid: 'قيمة سكر الدم خارج النطاق المسموح (20-600 ملغ/ديسيلتر)',
      requiredField: 'هذا الحقل مطلوب',
      minLength: 'الحد الأدنى للطول: {min} حرف',
      maxLength: 'الحد الأقصى للطول: {max} حرف',
    },
  },
};

/**
 * Gibt die Übersetzungen für die angegebene Sprache zurück
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.de;
}

/**
 * Ersetzt Platzhalter in Übersetzungsstrings
 * Beispiel: interpolate("Mindestlänge: {min}", { min: "5" })
 */
export function interpolate(text: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    text
  );
}

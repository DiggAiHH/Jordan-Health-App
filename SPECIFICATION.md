# Jordan Health Diabetes System - Technische Spezifikation

**Version:** 1.0  
**Letzte Aktualisierung:** 2025-12-22  
**Projekt:** JoBetes - Diabetes Follow-Up System für Dr. Alshdaifat

---

## 1. Projekt-Übersicht

Das Jordan Health Diabetes System (JoBetes) ist eine digitale Plattform für die Betreuung geriatrischer Diabetes-Patienten in Jordanien. Das System ermöglicht Patienten die einfache Erfassung von Blutzuckerwerten und Ernährungsdaten sowie die Kommunikation mit ihrem Arzt. KI-gestützte Analysen unterstützen den Arzt bei der Auswertung der Daten und der Erstellung von Behandlungsempfehlungen.

### 1.1 Hauptziele

- **Patientenorientiert:** Einfache, barrierefreie Bedienung für ältere Menschen
- **Mehrsprachigkeit:** Primär Arabisch, mit Unterstützung für Englisch
- **KI-Unterstützung:** Automatische Analyse von Blutzuckerwerten und Ernährungsgewohnheiten
- **Kulturelle Anpassung:** Berücksichtigung jordanischer Essgewohnheiten (Mansaf, etc.)
- **Datenschutz:** Sichere Verwaltung sensibler Gesundheitsdaten

---

## 2. Architektur-Übersicht

Das System besteht aus **4 Single Web Applications**, die unabhängig voneinander entwickelt und bereitgestellt werden:

### 2.1 Patient-App (`/patient-app`)

**Zielgruppe:** Diabetes-Patienten (vorwiegend geriatrisch)

**Kernfunktionen:**
- Login mit PatientID + Passwort
- Blutzuckerwerte eingeben und anzeigen
- Chat-Funktion zum Arzt
- Einfache, große Bedienelemente
- Arabische Sprachunterstützung

**Technologie-Stack:**
- Frontend: HTML, CSS, JavaScript (Progressive Web App)
- Framework: Vue.js oder React (leichtgewichtig)
- UI-Framework: Tailwind CSS oder Bootstrap (mit großen Touch-Targets)

### 2.2 Arzt-KI-App (`/doctor-app`)

**Zielgruppe:** Behandelnde Ärzte

**Kernfunktionen:**
- Dashboard mit Patientenübersicht
- KI-gestützte Analyse von Blutzuckerwerten
- Trendanalysen und Warnungen
- Chat mit Patienten (mit KI-generierten Antwortvorschlägen)
- Behandlungsempfehlungen

**Technologie-Stack:**
- Frontend: React oder Vue.js
- Charts: Chart.js oder Recharts
- KI-Integration: OpenAI API oder lokales Modell

### 2.3 Ernährungs-App (`/nutrition-app`)

**Zielgruppe:** Patienten und Ernährungsberater

**Kernfunktionen:**
- Mahlzeiten-Tracking
- Datenbank jordanischer Gerichte
- Nährwertinformationen
- KI-Analyse der Ernährungsgewohnheiten
- Empfehlungen basierend auf Blutzuckerwerten

**Technologie-Stack:**
- Frontend: React oder Vue.js
- Mahlzeiten-Datenbank: Firestore Collection

### 2.4 Admin-App (`/admin-app`)

**Zielgruppe:** Systemadministratoren

**Kernfunktionen:**
- Patienten-Verwaltung (Anlegen, Bearbeiten, Löschen)
- Passwort-Resets
- Systemüberwachung
- Benutzerrechte-Verwaltung

**Technologie-Stack:**
- Frontend: React oder Vue.js
- Admin-Dashboard: Material-UI oder Ant Design

---

## 3. Datenbank-Schema (NoSQL/Firestore)

### 3.1 Collection: `patients`

Speichert alle Patientendaten und Authentifizierungsinformationen.

```javascript
{
  "patientId": "string",           // Eindeutige Patienten-ID (z.B. "JO-2025-0001")
  "passwordHash": "string",        // Gehashtes Passwort (bcrypt)
  "firstName": "string",           // Vorname
  "lastName": "string",            // Nachname
  "dateOfBirth": "timestamp",      // Geburtsdatum
  "email": "string",               // E-Mail (optional)
  "phone": "string",               // Telefonnummer
  "doctorId": "string",            // Zugewiesener Arzt (Referenz)
  "createdAt": "timestamp",        // Erstellungsdatum
  "updatedAt": "timestamp",        // Letztes Update
  "language": "string",            // Bevorzugte Sprache ("ar" oder "en")
  "resetToken": "string",          // Token für Passwort-Reset (temporär)
  "resetTokenExpiry": "timestamp", // Ablaufzeit des Reset-Tokens
  "active": "boolean"              // Account aktiv/deaktiviert
}
```

### 3.2 Collection: `readings`

Speichert alle Blutzuckermessungen der Patienten.

```javascript
{
  "readingId": "string",           // Eindeutige Messungs-ID (auto-generated)
  "patientId": "string",           // Referenz auf Patient
  "glucoseLevel": "number",        // Blutzuckerwert in mg/dL
  "timestamp": "timestamp",        // Zeitpunkt der Messung
  "mealContext": "string",         // "before_meal", "after_meal", "fasting", "bedtime"
  "notes": "string",               // Optionale Notizen des Patienten
  "flagged": "boolean",            // Markiert für ärztliche Überprüfung
  "aiAnalysis": {                  // KI-Analyse (Sub-Objekt)
    "risk": "string",              // "low", "medium", "high"
    "recommendation": "string",    // KI-generierte Empfehlung
    "analyzedAt": "timestamp"      // Zeitpunkt der Analyse
  }
}
```

**Indizes:**
- `patientId` + `timestamp` (zusammengesetzt, für schnelle Abfragen)

### 3.3 Collection: `chat_messages`

Speichert die Kommunikation zwischen Patienten und Ärzten.

```javascript
{
  "messageId": "string",           // Eindeutige Nachrichten-ID (auto-generated)
  "patientId": "string",           // Referenz auf Patient
  "doctorId": "string",            // Referenz auf Arzt
  "senderId": "string",            // ID des Absenders (Patient oder Arzt)
  "senderType": "string",          // "patient" oder "doctor"
  "messageText": "string",         // Nachrichteninhalt
  "timestamp": "timestamp",        // Sendezeitpunkt
  "read": "boolean",               // Gelesen/ungelesen
  "aiSuggested": "boolean",        // Wurde von KI vorgeschlagen
  "attachments": [                 // Optional: Dateien/Bilder
    {
      "url": "string",
      "type": "string"
    }
  ]
}
```

**Indizes:**
- `patientId` + `timestamp` (für Chat-Historie)

### 3.4 Collection: `nutrition_logs`

Speichert Mahlzeiten-Einträge der Patienten.

```javascript
{
  "logId": "string",               // Eindeutige Log-ID (auto-generated)
  "patientId": "string",           // Referenz auf Patient
  "mealType": "string",            // "breakfast", "lunch", "dinner", "snack"
  "foods": [                       // Array von Lebensmitteln
    {
      "foodId": "string",          // Referenz auf Lebensmittel-DB
      "foodName": "string",        // Name (z.B. "Mansaf")
      "portion": "number",         // Portionsgröße
      "unit": "string",            // Einheit (z.B. "g", "Teller")
      "carbs": "number",           // Kohlenhydrate in g
      "calories": "number"         // Kalorien
    }
  ],
  "timestamp": "timestamp",        // Zeitpunkt der Mahlzeit
  "bloodGlucoseBefore": "number",  // BZ vor der Mahlzeit (optional)
  "bloodGlucoseAfter": "number",   // BZ nach der Mahlzeit (optional)
  "aiAnalysis": {                  // KI-Analyse
    "impact": "string",            // "low", "medium", "high" (Einfluss auf BZ)
    "recommendation": "string"
  }
}
```

**Indizes:**
- `patientId` + `timestamp`

### 3.5 Collection: `jordanian_foods`

Referenzdatenbank jordanischer Gerichte und Lebensmittel.

```javascript
{
  "foodId": "string",              // Eindeutige Lebensmittel-ID
  "nameAr": "string",              // Name auf Arabisch (z.B. "منسف")
  "nameEn": "string",              // Name auf Englisch ("Mansaf")
  "category": "string",            // "main_dish", "side", "dessert", "beverage"
  "carbs": "number",               // Kohlenhydrate pro 100g
  "protein": "number",             // Protein pro 100g
  "fat": "number",                 // Fett pro 100g
  "calories": "number",            // Kalorien pro 100g
  "glycemicIndex": "number",       // Glykämischer Index (optional)
  "commonPortion": "string",       // Übliche Portion (z.B. "1 Teller = 300g")
  "ingredients": ["string"],       // Hauptzutaten
  "culturalNotes": "string"        // Kulturelle Besonderheiten
}
```

---

## 4. Authentifizierungs-Flow

### 4.1 Login-Prozess

**Patient-Login:**

1. Patient gibt `PatientID` und `Passwort` ein
2. System validiert Eingabe (Format-Prüfung)
3. Firestore-Abfrage: `patients.where("patientId", "==", eingabe)`
4. Passwort-Vergleich: `bcrypt.compare(eingabe, passwordHash)`
5. Bei Erfolg: JWT-Token generieren und zurückgeben
6. Bei Fehler: Fehlermeldung mit max. 3 Versuchen, dann temporäre Sperre

**Token-Struktur (JWT):**
```javascript
{
  "patientId": "string",
  "role": "patient",
  "iat": timestamp,
  "exp": timestamp  // 24 Stunden Gültigkeit
}
```

### 4.2 Passwort-Reset-Flow

1. Patient klickt auf "Passwort vergessen"
2. Eingabe: `PatientID` + `Geburtsdatum`
3. System validiert: Existiert Patient mit dieser ID und diesem Geburtsdatum?
4. Generierung eines Reset-Tokens (6-stelliger Code)
5. Token wird per SMS an hinterlegte Telefonnummer gesendet
6. Token + `resetTokenExpiry` (15 Minuten) in Firestore speichern
7. Patient gibt Token ein + neues Passwort
8. System validiert Token und Ablaufzeit
9. Passwort wird aktualisiert, Token gelöscht

**Sicherheitsmaßnahmen:**
- Rate-Limiting: Max. 3 Reset-Versuche pro Stunde
- Token-Expiry: 15 Minuten
- SMS-Verifizierung erforderlich

### 4.3 Session-Management

- JWT-Tokens mit 24 Stunden Gültigkeit
- Refresh-Token für 7 Tage (optional)
- Logout: Token-Invalidierung im Frontend
- Inaktivitäts-Timeout: 30 Minuten

---

## 5. KI-Strategie

### 5.1 Blutzucker-Analyse

**Ziel:** Automatische Bewertung von Blutzuckerwerten und Erkennung von Mustern.

**Prompt-Template für OpenAI API:**

```text
Du bist ein medizinischer KI-Assistent, spezialisiert auf Diabetes-Management.

Patient-Kontext:
- Alter: {age}
- Diabetes-Typ: {diabetesType}
- Medikation: {medication}

Aktuelle Messung:
- Blutzucker: {glucoseLevel} mg/dL
- Kontext: {mealContext} (before_meal/after_meal/fasting/bedtime)
- Zeitpunkt: {timestamp}

Historische Daten (letzte 7 Tage):
{historicalReadings}

Aufgabe:
1. Bewerte den aktuellen Blutzuckerwert (low/medium/high risk)
2. Identifiziere Trends und Muster
3. Gib eine kurze, verständliche Empfehlung in Arabisch

Antwort-Format (JSON):
{
  "risk": "low|medium|high",
  "trend": "stable|increasing|decreasing",
  "recommendation": "Kurze Empfehlung in Arabisch",
  "alertDoctor": true|false
}
```

**Auslöser:**
- Neue Blutzuckermessung wird eingegeben
- Tägliche Batch-Analyse aller Patienten

### 5.2 Ernährungs-Analyse

**Ziel:** Bewertung von Mahlzeiten und deren Einfluss auf Blutzucker.

**Prompt-Template für jordanisches Essen:**

```text
Du bist ein Ernährungsberater mit Expertise in jordanischer Küche und Diabetes-Management.

Patient-Profil:
- Blutzucker-Zielbereich: {targetRange} mg/dL
- Kohlenhydrat-Budget: {carbBudget} g pro Mahlzeit

Mahlzeit:
- Typ: {mealType}
- Gerichte: {foods}
- Gesamte Kohlenhydrate: {totalCarbs} g
- Kalorien: {totalCalories}

Blutzucker:
- Vor Mahlzeit: {bgBefore} mg/dL
- Nach Mahlzeit: {bgAfter} mg/dL (falls verfügbar)

Jordanische Gerichte-Kontext:
- Mansaf: Hoher Kohlenhydrat-Gehalt (Reis + Joghurt), ca. 80g Kohlenhydrate pro Portion
- Maqluba: Mittel (Reis + Gemüse), ca. 60g Kohlenhydrate
- Kunafa: Sehr hoch (Dessert), ca. 90g Kohlenhydrate pro Stück

Aufgabe:
1. Bewerte den Einfluss der Mahlzeit auf den Blutzucker (low/medium/high impact)
2. Gib kulturell angepasste Empfehlungen in Arabisch
3. Schlage gesündere Alternativen vor (falls nötig)

Antwort-Format (JSON):
{
  "impact": "low|medium|high",
  "recommendation": "Empfehlung in Arabisch",
  "alternatives": ["Alternative 1", "Alternative 2"]
}
```

### 5.3 Chat-Antwortvorschläge für Ärzte

**Ziel:** KI-generierte Antwortvorschläge basierend auf Patienten-Nachrichten.

**Prompt-Template:**

```text
Du bist Dr. Alshdaifat, ein Diabetologe in Jordanien. Ein Patient hat dir eine Nachricht geschickt.

Patient-Nachricht: "{patientMessage}"

Patient-Kontext:
- Aktuelle Blutzuckerwerte: {recentReadings}
- Medikation: {medication}
- Letzte Mahlzeiten: {recentMeals}

Aufgabe:
Erstelle 2-3 professionelle, einfühlsame Antwortvorschläge in Arabisch. 
Die Antworten sollen:
- Verständlich für ältere Menschen sein
- Konkrete medizinische Ratschläge enthalten (falls nötig)
- Kulturell angemessen sein

Antwort-Format (JSON):
{
  "suggestions": [
    "Antwort 1 in Arabisch",
    "Antwort 2 in Arabisch",
    "Antwort 3 in Arabisch"
  ]
}
```

### 5.4 KI-Modell-Empfehlungen

**Option 1: OpenAI API (GPT-4 oder GPT-3.5-turbo)**
- Vorteile: Hochwertige Ausgaben, Mehrsprachigkeit
- Nachteile: Kosten, Abhängigkeit von Drittanbieter

**Option 2: Lokales Modell (z.B. Llama 2 mit arabischem Fine-Tuning)**
- Vorteile: Datenschutz, keine laufenden API-Kosten
- Nachteile: Höhere Infrastruktur-Anforderungen

**Empfehlung:** Start mit OpenAI API, später Migration zu lokalem Modell bei Bedarf.

---

## 6. UI/UX-Vorgaben

### 6.1 Barrierefreiheit (Geriatrie)

**Design-Prinzipien:**

1. **Große Schriftarten:**
   - Minimum: 18px für Fließtext
   - Überschriften: Minimum 24px
   - Wichtige Buttons: Minimum 20px

2. **Hoher Kontrast:**
   - WCAG AA-Standard: Mindestens 4.5:1 für normalen Text
   - WCAG AAA-Standard: 7:1 für wichtige Elemente
   - Primärfarbe: Dunkelblau (#1E3A8A) auf Weiß
   - Fehler/Warnungen: Rot (#DC2626) mit hohem Kontrast

3. **Touch-Targets:**
   - Minimum: 48x48px für alle klickbaren Elemente
   - Abstand zwischen Buttons: Mindestens 8px

4. **Einfache Navigation:**
   - Maximal 3 Ebenen tief
   - Große, deutliche Icons
   - Breadcrumbs für Orientierung

5. **Fehlertoleranz:**
   - Bestätigungsdialoge für kritische Aktionen
   - Rückgängig-Funktion für Dateneingaben
   - Klare Fehlermeldungen mit Lösungsvorschlägen

### 6.2 Arabische Sprache

**Technische Umsetzung:**

1. **RTL (Right-to-Left) Layout:**
   - CSS: `direction: rtl;`
   - Alle UI-Elemente gespiegelt
   - Text-Alignment: `text-align: right;`

2. **Schriftarten:**
   - Empfohlen: Noto Sans Arabic, Cairo, Tajawal
   - Web-Fonts über Google Fonts einbinden
   - Fallback: `sans-serif`

3. **Zahlen:**
   - Verwendung von Eastern Arabic Numerals (٠ ١ ٢ ٣...) optional
   - Standard: Western Arabic Numerals (0 1 2 3...)

4. **Übersetzungen:**
   - i18n-Framework: `vue-i18n` oder `react-i18next`
   - Übersetzungs-Dateien: `/locales/ar.json`, `/locales/en.json`

**Beispiel-Übersetzungen (Kerntexte):**

```json
{
  "login": {
    "title": "تسجيل الدخول",
    "patientId": "رقم المريض",
    "password": "كلمة المرور",
    "submit": "تسجيل الدخول",
    "forgotPassword": "نسيت كلمة المرور؟"
  },
  "dashboard": {
    "bloodSugar": "مستوى السكر في الدم",
    "addReading": "إضافة قراءة",
    "chat": "المحادثة مع الطبيب",
    "nutrition": "التغذية"
  },
  "readings": {
    "beforeMeal": "قبل الوجبة",
    "afterMeal": "بعد الوجبة",
    "fasting": "صائم",
    "bedtime": "قبل النوم"
  }
}
```

### 6.3 Farbschema

**Primärfarben:**
- Hauptfarbe: #1E3A8A (Dunkelblau) - Vertrauen, Medizin
- Akzentfarbe: #10B981 (Grün) - Erfolg, Gesundheit
- Warnfarbe: #F59E0B (Orange) - Vorsicht
- Fehlerfarbe: #DC2626 (Rot) - Gefahr
- Hintergrund: #F9FAFB (Hellgrau)

**Blutzucker-Ampel:**
- Niedrig (<70 mg/dL): #DC2626 (Rot)
- Normal (70-180 mg/dL): #10B981 (Grün)
- Erhöht (180-250 mg/dL): #F59E0B (Orange)
- Hoch (>250 mg/dL): #DC2626 (Rot)

### 6.4 Komponenten-Bibliothek

**Wiederverwendbare UI-Komponenten:**

1. **LoginForm**
   - PatientID-Input (Validierung: Format JO-YYYY-NNNN)
   - Passwort-Input (mit Show/Hide-Toggle)
   - Login-Button (groß, deutlich)
   - "Passwort vergessen?"-Link

2. **ReadingCard**
   - Blutzuckerwert (große Zahl)
   - Kontext-Icon (Mahlzeit/Fasten/etc.)
   - Zeitstempel
   - Farbcodierung basierend auf Wert

3. **ChatBubble**
   - Nachrichtentext
   - Zeitstempel
   - Sender-Indikator (Patient/Arzt)
   - RTL-Layout für Arabisch

4. **MealLogForm**
   - Mahlzeit-Typ-Auswahl
   - Lebensmittel-Suche (Autocomplete)
   - Portionsangabe
   - Blutzucker-vor/nach-Eingabe

---

## 7. Sicherheit und Datenschutz

### 7.1 Datenschutz-Grundsätze

- **DSGVO-Compliance:** Auch wenn in Jordanien, Best Practices einhalten
- **Datenminimierung:** Nur notwendige Daten sammeln
- **Verschlüsselung:** 
  - Transport: TLS 1.3
  - Datenbank: Firestore-native Verschlüsselung
  - Passwörter: bcrypt mit Salting

### 7.2 Zugriffskontrolle

**Firestore Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Patienten können nur ihre eigenen Daten lesen/schreiben
    match /patients/{patientId} {
      allow read: if request.auth.uid == patientId;
      allow update: if request.auth.uid == patientId 
                    && !request.resource.data.diff(resource.data).affectedKeys()
                        .hasAny(['role', 'doctorId']);
    }
    
    match /readings/{readingId} {
      allow read: if request.auth.uid == resource.data.patientId 
                  || hasRole('doctor');
      allow create: if request.auth.uid == request.resource.data.patientId;
    }
    
    match /chat_messages/{messageId} {
      allow read: if request.auth.uid == resource.data.patientId 
                  || request.auth.uid == resource.data.doctorId;
      allow create: if request.auth.uid == request.resource.data.senderId;
    }
    
    match /nutrition_logs/{logId} {
      allow read: if request.auth.uid == resource.data.patientId 
                  || hasRole('doctor');
      allow create: if request.auth.uid == request.resource.data.patientId;
    }
    
    // Admin-Zugriff
    match /{document=**} {
      allow read, write: if hasRole('admin');
    }
    
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
  }
}
```

### 7.3 Audit-Logging

- Alle kritischen Aktionen protokollieren (Login, Passwort-Änderung, Datenexport)
- Log-Retention: 90 Tage
- Zugriff nur für Administratoren

---

## 8. Deployment und Infrastruktur

### 8.1 Hosting-Empfehlungen

**Option 1: Firebase Hosting (empfohlen für MVP)**
- Vorteile: Einfaches Deployment, integriert mit Firestore
- Kosten: Spark (kostenlos) oder Blaze (Pay-as-you-go)

**Option 2: Vercel/Netlify**
- Vorteile: Gute CI/CD-Integration
- Firestore über Firebase Admin SDK

### 8.2 CI/CD-Pipeline

**GitHub Actions Workflow:**

```yaml
name: Deploy Jordan Health Apps

on:
  push:
    branches: [main]

jobs:
  deploy-patient-app:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Firebase
        run: |
          cd patient-app
          npm install
          npm run build
          firebase deploy --only hosting:patient-app
```

### 8.3 Monitoring

- **Uptime-Monitoring:** UptimeRobot oder Firebase Performance Monitoring
- **Error-Tracking:** Sentry oder Firebase Crashlytics
- **Analytics:** Google Analytics 4 (Privacy-konform konfiguriert)

---

## 9. Entwicklungs-Roadmap

### Phase 1: MVP (4-6 Wochen)
- [ ] Patient-App: Login, Blutzucker-Eingabe, Chat
- [ ] Arzt-App: Dashboard, Patientenübersicht, Chat
- [ ] Firestore-Setup mit Collections
- [ ] Basis-KI-Integration (Blutzucker-Analyse)

### Phase 2: Erweiterte Funktionen (4 Wochen)
- [ ] Ernährungs-App: Mahlzeiten-Tracking
- [ ] Jordanische Gerichte-Datenbank
- [ ] KI-Ernährungsanalyse
- [ ] Admin-App: Patientenverwaltung

### Phase 3: Optimierung (2 Wochen)
- [ ] UI/UX-Testing mit Zielgruppe
- [ ] Performance-Optimierung
- [ ] Arabische Übersetzungen finalisieren
- [ ] Accessibility-Audit

### Phase 4: Go-Live (1 Woche)
- [ ] Pilot mit 10-20 Patienten
- [ ] Feedback-Integration
- [ ] Produktiv-Deployment

---

## 10. Anhang

### 10.1 Glossar

- **BZ:** Blutzucker
- **mg/dL:** Milligramm pro Deziliter (Maßeinheit für Blutzucker)
- **Mansaf:** Traditionelles jordanisches Gericht (Reis mit Lamm und Joghurt)
- **PatientID:** Eindeutige Identifikationsnummer (Format: JO-YYYY-NNNN)
- **RTL:** Right-to-Left (Schreibrichtung für Arabisch)

### 10.2 Externe Ressourcen

- Firebase Dokumentation: https://firebase.google.com/docs
- OpenAI API: https://platform.openai.com/docs
- WCAG-Richtlinien: https://www.w3.org/WAI/WCAG21/quickref/
- Noto Sans Arabic Font: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic

### 10.3 Kontakte

- **Projekt-Lead:** Dr. Alshdaifat
- **Entwicklung:** Jordan Health Dev Team
- **Technische Fragen:** [Repository Issues](https://github.com/DiggAiHH/Jordan-Health-App/issues)

---

**Dokumentstatus:** ✅ Genehmigt  
**Nächste Review:** Nach Abschluss Phase 1

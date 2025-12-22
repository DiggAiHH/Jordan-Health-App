# Jordan Health App - JoBetes

**Diabetes Follow-Up System für Dr. Alshdaifat (Jordanien)**

Ein digitales Gesundheitssystem zur Betreuung geriatrischer Diabetes-Patienten mit KI-Unterstützung, kultureller Anpassung (jordanische Essgewohnheiten) und Barrierefreiheit.

---

## 📋 Projekt-Übersicht

Das **Jordan Health Diabetes System (JoBetes)** ist eine umfassende Plattform bestehend aus **4 Single Web Applications**, die Patienten, Ärzte, Ernährungsberater und Administratoren unterstützt:

### 🏥 Die vier Anwendungen

#### 1. 📱 Patient-App ([`/patient-app`](./patient-app))
Mobile Web Application für Diabetes-Patienten.
- Blutzuckerwerte eingeben und anzeigen
- Chat mit behandelndem Arzt
- Arabische Sprachunterstützung
- Barrierefreie Bedienung (große Buttons, hoher Kontrast)

#### 2. 👨‍⚕️ Arzt-KI-App ([`/doctor-app`](./doctor-app))
Dashboard mit KI-gestützter Analyse für Ärzte.
- Patientenübersicht mit Blutzucker-Trends
- Automatische KI-Analyse und Warnungen
- Chat mit Patienten (inkl. KI-Antwortvorschläge)
- Behandlungsempfehlungen

#### 3. 🍽️ Ernährungs-App ([`/nutrition-app`](./nutrition-app))
Mahlzeiten-Tracking mit jordanischer Gerichte-Datenbank.
- Tracking von Mahlzeiten (Mansaf, Maqluba, etc.)
- Nährwertinformationen
- KI-Analyse: Einfluss von Essen auf Blutzucker
- Ernährungsempfehlungen

#### 4. ⚙️ Admin-App ([`/admin-app`](./admin-app))
Systemverwaltung für Administratoren.
- Patienten-Verwaltung (Anlegen, Bearbeiten, Löschen)
- Passwort-Resets
- Systemüberwachung und Analytics

---

## 📖 Dokumentation

**🎯 [Technische Spezifikation](./SPECIFICATION.md)** - Vollständige technische Dokumentation ("Single Source of Truth"):
- Architektur-Übersicht
- Datenbank-Schema (Firestore/NoSQL)
- Authentifizierungs-Flow (PatientID + Passwort)
- KI-Strategie mit Prompt-Templates
- UI/UX-Vorgaben (Barrierefreiheit, Arabisch, RTL)
- Sicherheit und Datenschutz
- Deployment-Strategie

---

## 🛠️ Technologie-Stack

- **Frontend:** Vue.js oder React (Progressive Web Apps)
- **Datenbank:** Firebase Firestore (NoSQL)
- **Authentifizierung:** Firebase Auth mit Custom Logic
- **KI:** OpenAI API (GPT-4/GPT-3.5-turbo)
- **Hosting:** Firebase Hosting oder Vercel
- **Styling:** Tailwind CSS (mit RTL-Support für Arabisch)
- **Internationalisierung:** vue-i18n / react-i18next

---

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+ und npm
- Firebase-Projekt (für Firestore und Hosting)
- OpenAI API-Key (für KI-Funktionen)

### Installation

```bash
# Repository klonen
git clone https://github.com/DiggAiHH/Jordan-Health-App.git
cd Jordan-Health-App

# Eine der Apps auswählen und installieren
cd patient-app  # oder doctor-app, nutrition-app, admin-app
npm install

# Entwicklungsserver starten
npm run dev
```

---

## 🗂️ Projektstruktur

```
Jordan-Health-App/
├── SPECIFICATION.md          # Technische Spezifikation (Single Source of Truth)
├── README.md                 # Diese Datei
├── patient-app/              # Patient Web App
│   └── README.md
├── doctor-app/               # Arzt-Dashboard mit KI
│   └── README.md
├── nutrition-app/            # Ernährungs-Tracking
│   └── README.md
└── admin-app/                # Admin-Panel
    └── README.md
```

---

## 🎯 Entwicklungs-Roadmap

### ✅ Phase 0: Projektsetup (Aktuell)
- [x] Projektstruktur erstellt
- [x] Technische Spezifikation dokumentiert
- [x] README-Dateien für alle Apps

### 🚧 Phase 1: MVP (4-6 Wochen)
- [ ] Patient-App: Login, Blutzucker-Eingabe, Chat
- [ ] Arzt-App: Dashboard, Patientenübersicht, Chat
- [ ] Firestore-Setup mit Collections
- [ ] Basis-KI-Integration (Blutzucker-Analyse)

### 📅 Phase 2: Erweiterte Funktionen (4 Wochen)
- [ ] Ernährungs-App: Mahlzeiten-Tracking
- [ ] Jordanische Gerichte-Datenbank
- [ ] KI-Ernährungsanalyse
- [ ] Admin-App: Patientenverwaltung

### 📅 Phase 3: Optimierung & Launch
- [ ] UI/UX-Testing mit Zielgruppe
- [ ] Arabische Übersetzungen finalisieren
- [ ] Performance & Accessibility-Audit
- [ ] Pilot-Phase mit 10-20 Patienten

---

## 🌟 Besonderheiten

### ♿ Barrierefreiheit
- Große Schriftarten (min. 18px)
- Hoher Kontrast (WCAG AA/AAA)
- Touch-Targets min. 48x48px
- Einfache, intuitive Navigation

### 🌐 Kulturelle Anpassung
- Arabische Sprachunterstützung (RTL-Layout)
- Jordanische Gerichte-Datenbank (Mansaf, Maqluba, Kunafa, etc.)
- KI-Prompts berücksichtigen lokale Essgewohnheiten

### 🤖 KI-Integration
- Automatische Blutzucker-Analyse
- Ernährungsempfehlungen
- Chat-Antwortvorschläge für Ärzte
- Trend-Erkennung und Warnungen

---

## 🔒 Sicherheit & Datenschutz

- **Verschlüsselung:** TLS 1.3 für Transport, Firestore-native für Daten
- **Authentifizierung:** Sichere PatientID + bcrypt-Passwörter
- **Zugriffskontrolle:** Firestore Security Rules (Patienten sehen nur eigene Daten)
- **DSGVO-konform:** Best Practices für Datenschutz
- **Audit-Logging:** Protokollierung kritischer Aktionen

---

## 🤝 Mitarbeit

Dieses Projekt wird von einem Agent-basierten Entwicklungsteam entwickelt. 

Für Fragen oder Vorschläge bitte [Issues](https://github.com/DiggAiHH/Jordan-Health-App/issues) erstellen.

---

## 📄 Lizenz

Siehe [LICENSE](./LICENSE) (falls vorhanden)

---

## 📞 Kontakt

- **Projekt-Lead:** Dr. Alshdaifat
- **Repository:** [DiggAiHH/Jordan-Health-App](https://github.com/DiggAiHH/Jordan-Health-App)
- **Technische Fragen:** [Issues](https://github.com/DiggAiHH/Jordan-Health-App/issues)

---

**Status:** 🚧 In aktiver Entwicklung  
**Letzte Aktualisierung:** 2025-12-22
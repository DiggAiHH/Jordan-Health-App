# Jordan Health App - JoBetes 🏥

**Diabetes Follow-Up System für Dr. Alshdaifat (Jordanien)**

<Ein digitales Gesundheitssystem zur Betreuung geriatrischer Diabetes-Patienten mit KI-Unterstützung, kultureller Anpassung (jordanische Essgewohnheiten) und Barrierefreiheit.

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
Ein umfassendes, produktionsreifes Gesundheitssystem für geriatrische Diabetes-Patienten in Jordanien. Das System unterstützt Deutsch und Arabisch (RTL) und wurde speziell für ältere Patienten mit großen Schriften, klaren Kontrasten und einfacher Bedienung entwickelt.

---

## 📱 Apps

Das System besteht aus 4 unabhängigen Single Web Applications:

### 1. Patient-App (Port 3001)
- 💉 Blutzucker-Upload mit Validierung (20-600 mg/dL)
- 💬 Chat mit Arzt
- 📊 Verlaufsanzeige und Trend-Analyse
- 🎯 Zeit-im-Zielbereich (Time-in-Range) Berechnung

### 2. Arzt-KI-App (Port 3002)
- 🤖 Automatische Blutzucker-Analyse
- 💡 KI-gestützte Antwort-Vorschläge mit Konfidenzwerten
- 🔔 Patienten-Warnungen und Alerts
- 📈 Risiko-Assessment

### 3. Ernährungs-App (Port 3003)
- 🥗 Mahlzeiten-Tracking
- 🧮 Kohlenhydrat- und Kalorienzähler
- 📊 Glykämischer Index Anzeige
- 🇯🇴 Vordefinierte jordanische/nahöstliche Lebensmittel

### 4. Admin-App (Port 3004)
- 👥 Patienten-Verwaltung
- 👨‍⚕️ Ärzte-Verwaltung
- 📊 System-Statistiken
- ➕ Benutzer hinzufügen/bearbeiten

---

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 6
- **Monorepo**: npm Workspaces
- **Internationalisierung**: Eigene i18n-Lösung (DE/AR)

---

## 📁 Projektstruktur

```
Jordan-Health-App/
├── packages/
│   ├── shared/           # Gemeinsame Types, Utils, Components
│   │   ├── src/
│   │   │   ├── types/        # TypeScript-Interfaces
│   │   │   ├── utils/        # Validierung, Berechnungen
│   │   │   ├── components/   # UI-Komponenten
│   │   │   ├── hooks/        # React Hooks
│   │   │   └── i18n/         # Übersetzungen (DE/AR)
│   │   └── package.json
│   │
│   ├── patient-app/      # Patienten-Frontend
│   ├── doctor-app/       # Arzt-KI-Frontend
│   ├── nutrition-app/    # Ernährungs-Frontend
│   └── admin-app/        # Admin-Frontend
│
├── package.json          # Workspace Root
└── README.md
```

---

## 🚀 Installation & Start

### Voraussetzungen
- Node.js >= 18.0.0
- npm >= 9.0.0

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
# Abhängigkeiten installieren
npm install

# Shared-Paket bauen (erforderlich vor dem Start)
npm run build:shared
```

### Apps starten

```bash
# Patient-App (http://localhost:3001)
npm run dev:patient

# Arzt-App (http://localhost:3002)
npm run dev:doctor

# Ernährungs-App (http://localhost:3003)
npm run dev:nutrition

# Admin-App (http://localhost:3004)
npm run dev:admin
```

### Alle Apps bauen

```bash
npm run build
```

---

## 🌍 Internationalisierung

Das System unterstützt zwei Sprachen:

| Sprache | Code | Richtung |
|---------|------|----------|
| Deutsch | `de` | LTR |
| Arabisch | `ar` | RTL |

Die Sprachauswahl wird im localStorage gespeichert und ist pro Browser persistent.

---

## 🔒 Sicherheitsfeatures

- ✅ Strenge Blutzucker-Validierung (20-600 mg/dL)
- ✅ E-Mail-Validierung
- ✅ Jordanische Telefonnummer-Validierung
- ✅ XSS-Schutz durch Input-Sanitisierung
- ✅ TypeScript für Typsicherheit
- ✅ Keine externen Datenübertragung (lokale Demo)

---

## ♿ Barrierefreiheit

Speziell für geriatrische Patienten optimiert:

- 📏 Große Schriftgrößen (18px Basis)
- 👆 Große Touch-Targets (min. 44x44px)
- 🎨 Hohe Kontraste (WCAG 2.1 konform)
- ⌨️ Vollständige Tastaturnavigation
- 📖 Screen-Reader-Unterstützung
- 🎭 Reduzierte Bewegung wird respektiert

---

## 📊 Medizinische Logik

### Blutzucker-Klassifizierung

| Bereich | Status | Farbe |
|---------|--------|-------|
| < 54 mg/dL | Kritisch niedrig | Rot |
| 54-70 mg/dL | Niedrig | Orange |
| 70-180 mg/dL | Zielbereich | Grün |
| 180-250 mg/dL | Erhöht | Orange |
| > 250 mg/dL | Kritisch hoch | Rot |

### Risiko-Assessment

- **Niedrig**: TIR ≥ 70%, keine kritischen Events
- **Moderat**: TIR 50-70%, mehrere Abweichungen
- **Hoch**: TIR 30-50% oder kritische Events
- **Kritisch**: TIR < 30% oder mehrfache kritische Events

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
MIT License

---

## 👨‍⚕️ Entwickelt für

**Dr. Alshdaifat** - Jordanien

Für geriatrische Diabetes-Patienten in Jordanien und dem Nahen Osten.

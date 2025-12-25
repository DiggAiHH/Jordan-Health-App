# Jordan Health App - JoBetes 🏥

**Diabetes Follow-Up System für Dr. Alshdaifat (Jordanien)**

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

MIT License

---

## 👨‍⚕️ Entwickelt für

**Dr. Alshdaifat** - Jordanien

Für geriatrische Diabetes-Patienten in Jordanien und dem Nahen Osten.
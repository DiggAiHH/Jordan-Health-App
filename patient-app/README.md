# Patient-App

Mobile Web Application für Diabetes-Patienten.

## Funktionen

- ✅ Login mit PatientID + Passwort
- 🌐 Arabische Sprachunterstützung (RTL-Layout)
- 🌍 Mehrsprachigkeit (Arabisch/Englisch)
- ♿ Barrierefreie Bedienung für ältere Menschen
- 🎨 Tailwind CSS mit großen Touch-Targets
- 📱 Progressive Web App (PWA-ready)

## Status: Phase 1 MVP (In Development)

### ✅ Implementiert
- [x] Vue.js 3 + Vite Setup
- [x] Tailwind CSS v4 Integration
- [x] vue-i18n (Arabisch/Englisch)
- [x] Login-Komponente mit RTL-Support
- [x] Firebase Configuration (Template)
- [x] Accessibility Features (große Schrift, hoher Kontrast)

### 🚧 In Arbeit
- [ ] Blutzuckerwerte-Eingabe
- [ ] Dashboard
- [ ] Chat-Funktion
- [ ] Firebase Authentication Integration
- [ ] Firestore Datenbank-Integration

## Technologie-Stack

- **Frontend:** Vue.js 3 (Composition API)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **i18n:** vue-i18n
- **Backend:** Firebase (Firestore + Auth)
- **Router:** Vue Router (geplant)

## Entwicklung

### Voraussetzungen
- Node.js 18+
- npm oder yarn

### Installation

```bash
# In das Verzeichnis wechseln
cd patient-app

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Firebase Konfiguration

1. Erstelle ein Firebase-Projekt auf https://console.firebase.google.com
2. Kopiere `.env.example` zu `.env`
3. Füge deine Firebase-Credentials ein:

```bash
cp .env.example .env
# Dann .env bearbeiten und Credentials einfügen
```

### Build für Produktion

```bash
# Production Build
npm run build

# Preview des Production Builds
npm run preview
```

## Projektstruktur

```
patient-app/
├── src/
│   ├── components/       # Vue-Komponenten
│   │   └── LoginForm.vue
│   ├── firebase/         # Firebase-Konfiguration
│   │   └── config.js
│   ├── i18n/            # Internationalisierung
│   │   ├── index.js
│   │   └── locales/
│   │       ├── ar.json  # Arabisch
│   │       └── en.json  # Englisch
│   ├── App.vue          # Haupt-App-Komponente
│   ├── main.js          # App-Einstiegspunkt
│   └── style.css        # Tailwind + Custom Styles
├── .env.example         # Beispiel Environment Variables
├── package.json
└── vite.config.js
```

## Barrierefreiheit

- **Schriftgröße:** Minimum 18px (text-lg)
- **Touch-Targets:** Minimum 48x48px
- **Kontrast:** WCAG AA-Standard
- **Tastaturnavigation:** Vollständig unterstützt
- **Screen Reader:** Semantisches HTML

## Screenshots

### Arabisch (RTL)
![Arabic Login](https://github.com/user-attachments/assets/1aeaa47e-fdf1-41f5-bcd1-b67d92f0d6c5)

### Englisch (LTR)
![English Login](https://github.com/user-attachments/assets/2a4cb0fd-ba39-47f3-97a9-a91e13b89110)

## Siehe auch

- [Technische Spezifikation](../SPECIFICATION.md)
- [Root README](../README.md)


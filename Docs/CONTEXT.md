Empfohlene Ordnerstruktur (Expo Router)

Diese Struktur trennt Logik (Business Logic) von der Anzeige (UI), was für Copilot einfacher zu verstehen ist.

/
├── app/                    # Routing (Screens & Navigation)
│   ├── _layout.tsx         # Root Layout (Provider, Fonts, etc.)
│   ├── index.tsx           # Redirect Logic (Auth check)
│   ├── (auth)/             # Login/Register Stack (versteckt Tabs)
│   │   ├── _layout.tsx     # Stack Navigator für Auth
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/             # Hauptbereich der App
│       ├── _layout.tsx     # Tab Navigator (Unten)
│       ├── home.tsx
│       ├── profile.tsx
│       └── settings.tsx
├── components/             # Wiederverwendbare UI Bausteine
│   ├── ui/                 # Buttons, Inputs, Cards (Dumm)
│   └── domain/             # UserAvatar, FeedItem (Schlau)
├── constants/              # Farben, Strings, Config
│   └── Colors.ts
├── hooks/                  # Custom React Hooks
│   └── useAuth.ts
├── services/               # API Calls & Firebase/Supabase
└── assets/                 # Bilder & Fonts

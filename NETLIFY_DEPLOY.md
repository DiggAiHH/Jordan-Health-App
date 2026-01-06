# Netlify Deployment Guide

## Voraussetzungen

1. Netlify Account: https://app.netlify.com/signup
2. Alle Apps gebaut

## Schnelle Methode: Drag & Drop

1. Baue alle Apps:
```bash
npm run build --workspaces
```

2. Gehe zu https://app.netlify.com/drop

3. Ziehe jeden `dist`-Ordner einzeln auf die Seite:
   - `packages/patient-app/dist` → Patient-App
   - `packages/doctor-app/dist` → Doctor-App
   - `packages/nutrition-app/dist` → Nutrition-App
   - `packages/admin-app/dist` → Admin-App

4. Netlify generiert automatisch URLs wie:
   - `random-name-123.netlify.app`

5. Optional: Custom Domains in Site Settings → Domain Management hinzufügen

## CLI Methode (nach Installation)

```bash
# Einloggen (öffnet Browser)
npx netlify login

# Patient-App deployen
cd packages/patient-app
npx netlify deploy --prod --dir=dist --site-name=jordan-patient-app

# Doctor-App deployen
cd ../doctor-app
npx netlify deploy --prod --dir=dist --site-name=jordan-doctor-app

# Nutrition-App deployen
cd ../nutrition-app
npx netlify deploy --prod --dir=dist --site-name=jordan-nutrition-app

# Admin-App deployen
cd ../admin-app
npx netlify deploy --prod --dir=dist --site-name=jordan-admin-app
```

## GitHub Integration (automatisches Deploy)

1. Pushe zu GitHub:
```bash
git add .
git commit -m "Add Netlify config"
git push origin main
```

2. Gehe zu https://app.netlify.com/start

3. Für jede App:
   - Wähle das Repository `DiggAiHH/Jordan-Health-App`
   - Base directory: `packages/patient-app` (oder doctor-app, etc.)
   - Build command: `npm run build`
   - Publish directory: `dist`
   
4. Netlify deployed automatisch bei jedem Push

## URLs nach Deployment

| App | Vorgeschlagene URL |
|-----|-------------------|
| Patient | jordan-patient-app.netlify.app |
| Doctor | jordan-doctor-app.netlify.app |
| Nutrition | jordan-nutrition-app.netlify.app |
| Admin | jordan-admin-app.netlify.app |

## Wichtig

- Alle Apps nutzen Client-Side Routing → `netlify.toml` mit Redirect-Regel ist bereits konfiguriert
- Firebase-Konfiguration muss als Environment Variables in Netlify gesetzt werden (Site Settings → Environment Variables)

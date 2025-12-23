# Firebase Setup Guide

This guide explains how to set up Firebase for the Jordan Health Diabetes System Patient-App.

## Prerequisites

- Firebase account (https://firebase.google.com)
- Node.js 18+ installed
- Access to Firebase Console

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name your project: "Jordan Health Diabetes"
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (we'll add security rules later)
4. Select a location close to Jordan (e.g., europe-west3)
5. Click "Enable"

## Step 4: Add Web App to Firebase Project

1. In Firebase Console, click the gear icon → **Project settings**
2. Scroll to "Your apps" section
3. Click the **</>** (Web) button
4. Register app with nickname: "patient-app"
5. Copy the Firebase configuration object

## Step 5: Configure Patient-App

1. In the `patient-app` directory, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 6: Set up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Patients collection
    match /patients/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow write: if false; // Only admin can write via backend
    }
    
    // Readings collection
    match /readings/{readingId} {
      allow read: if isAuthenticated() && isOwner(resource.data.patientId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.patientId);
      allow update, delete: if false; // Readings are immutable
    }
    
    // Chat messages collection
    match /chat_messages/{messageId} {
      allow read: if isAuthenticated() && 
                  (isOwner(resource.data.patientId) || 
                   isOwner(resource.data.doctorId));
      allow create: if isAuthenticated() && isOwner(request.resource.data.senderId);
      allow update: if isAuthenticated() && 
                    (isOwner(resource.data.patientId) || 
                     isOwner(resource.data.doctorId));
    }
    
    // Nutrition logs collection
    match /nutrition_logs/{logId} {
      allow read: if isAuthenticated() && isOwner(resource.data.patientId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.patientId);
    }
    
    // Jordanian foods collection (read-only for all authenticated users)
    match /jordanian_foods/{foodId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admin can write
    }
  }
}
```

3. Click "Publish"

## Step 7: Create Test Patient Account

Since we need Firebase Admin SDK to create proper patient accounts, you can temporarily use the Firebase Console:

### Using Firebase Console:

1. Go to **Build** → **Authentication** → **Users**
2. Click "Add user"
3. Email: `jo-2025-0001@patient.jobetes.app`
4. Password: Create a strong password (remember this for testing)
5. Click "Add user"
6. Note the **User UID**

### Create Patient Document:

1. Go to **Firestore Database** → **Data**
2. Click "Start collection"
3. Collection ID: `patients`
4. Document ID: Use the **User UID** from step 2
5. Add fields:
   - `patientId` (string): `JO-2025-0001`
   - `firstName` (string): `أحمد`
   - `lastName` (string): `محمد`
   - `dateOfBirth` (timestamp): Select a date
   - `phone` (string): `+962791234567`
   - `doctorId` (string): `doctor-001`
   - `language` (string): `ar`
   - `active` (boolean): `true`
   - `createdAt` (timestamp): Now
   - `updatedAt` (timestamp): Now
6. Click "Save"

## Step 8: Test the Application

1. Start the development server:
   ```bash
   cd patient-app
   npm run dev
   ```

2. Open http://localhost:5173

3. Login with:
   - Patient ID: `JO-2025-0001`
   - Password: (the password you set in step 7)

4. You should now be logged in and see the dashboard!

## Step 9: Add Sample Data (Optional)

### Add Sample Blood Glucose Reading:

1. In Firestore Console, add to collection `readings`:
   - `patientId` (string): Your user UID
   - `glucoseLevel` (number): `120`
   - `context` (string): `beforeMeal`
   - `notes` (string): ``
   - `timestamp` (timestamp): Now
   - `flagged` (boolean): `false`

### Add Sample Chat Message:

1. In Firestore Console, add to collection `chat_messages`:
   - `patientId` (string): Your user UID
   - `doctorId` (string): `doctor-001`
   - `senderId` (string): Your user UID
   - `senderType` (string): `patient`
   - `messageText` (string): `مرحباً دكتور`
   - `timestamp` (timestamp): Now
   - `read` (boolean): `false`
   - `aiSuggested` (boolean): `false`

## Troubleshooting

### "Permission denied" errors
- Check that Firestore Security Rules are published
- Verify that you're using the correct User UID in patient document
- Ensure the user is authenticated

### "Firebase not initialized" errors
- Verify `.env` file exists and contains correct credentials
- Restart the development server after changing `.env`

### Cannot login
- Check that email format is correct: `patientid@patient.jobetes.app`
- Verify password is correct
- Check Firebase Console Authentication tab for the user

## Production Deployment

For production deployment, you should:

1. Create a Firebase Admin SDK service account
2. Create a backend API for user registration
3. Use Firebase Cloud Functions for AI integration
4. Enable Firebase Hosting for deployment
5. Set up proper monitoring and alerts

## Security Notes

- Never commit `.env` file to version control
- Use Firebase Admin SDK for user management in production
- Implement rate limiting for authentication attempts
- Enable App Check for additional security
- Regularly review Firestore Security Rules

## Next Steps

- Set up Firebase Cloud Functions for AI integration
- Implement password reset via SMS
- Add Firebase Analytics
- Set up Firebase Performance Monitoring
- Create admin panel for patient management

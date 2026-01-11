import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// These values come from your Firebase Console > Project Settings
// Vercel and Vite use import.meta.env to access variables prefixed with VITE_
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  databaseURL: (import.meta as any).env.VITE_FIREBASE_DB_URL,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("CRITICAL: Firebase API Key is missing! Check your Vercel Environment Variables.");
}

// Only initialize if we have the config
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
export const db = app ? getDatabase(app) : null;

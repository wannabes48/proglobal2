import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase safely
let app;
try {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key') {
    console.warn("Firebase API Key is missing or invalid. Check your .env file.");
    // We still initialize with whatever we have or mock it to avoid top-level crashes
    app = getApps().length > 0 ? getApp() : initializeApp({ ...firebaseConfig, apiKey: "dummy-key-to-prevent-crash" });
  } else {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Create a minimal app object to prevent export errors
  app = {} as any;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

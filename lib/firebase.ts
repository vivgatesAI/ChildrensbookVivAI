import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC3NZmlqTzTi3cqccS8UBzyXHeZP_k7PV4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "children-book-1983.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "children-book-1983",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "children-book-1983.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "762271824298",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:762271824298:web:2cf0c21434c549e58393d3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PNFRWHFE1S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (client-side only) - gracefully handle tracking prevention
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        // Silently fail if analytics is blocked (tracking prevention)
        console.debug('Firebase Analytics initialization skipped (tracking prevention may be enabled)');
      }
    }
  }).catch(() => {
    // Silently fail if analytics is not supported or blocked
    console.debug('Firebase Analytics not supported or blocked');
  });
}

export { app, auth, db, analytics };

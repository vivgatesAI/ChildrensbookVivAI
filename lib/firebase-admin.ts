import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK Setup
 * 
 * Required Environment Variables in Railway:
 * - NEXT_PUBLIC_FIREBASE_PROJECT_ID: Your Firebase project ID
 * - FIREBASE_CLIENT_EMAIL: Service account email (from JSON key file)
 * - FIREBASE_PRIVATE_KEY: Private key (with \n for newlines, see instructions below)
 * 
 * IMPORTANT: The FIREBASE_PRIVATE_KEY must have literal \n characters for newlines.
 * When copying from the JSON file, replace actual newlines with \n
 */

function getServiceAccount() {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Check if all required values are present
    if (!projectId || !clientEmail || !privateKey) {
        console.log('Firebase Admin: Missing credentials, using in-memory storage');
        return null;
    }
    
    // Replace literal \n with actual newlines
    const formattedKey = privateKey.replace(/\\n/g, '\n');
    
    return {
        projectId,
        clientEmail,
        privateKey: formattedKey,
    };
}

export function getAdminApp() {
    // Return existing app if already initialized
    if (getApps().length) {
        return getApp();
    }

    const serviceAccount = getServiceAccount();
    
    // Return null if credentials are missing - app will use in-memory storage
    if (!serviceAccount) {
        return null;
    }

    try {
        const app = initializeApp({
            credential: cert(serviceAccount),
        });
        console.log('Firebase Admin: Initialized successfully');
        return app;
    } catch (error) {
        console.error('Firebase Admin: Failed to initialize -', error);
        return null;
    }
}

export function getAdminDb() {
    const app = getAdminApp();
    if (!app) {
        return null;
    }
    return getFirestore(app);
}

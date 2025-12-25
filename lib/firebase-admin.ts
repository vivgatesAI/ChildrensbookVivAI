import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export function getAdminApp() {
    if (getApps().length) {
        return getApp();
    }

    // Only initialize if we have credentials
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        // Return null if credentials are missing - caller should handle this gracefully
        return null;
    }

    return initializeApp({
        credential: cert(serviceAccount),
    });
}

export function getAdminDb() {
    const app = getAdminApp();
    if (!app) {
        return null;
    }
    return getFirestore(app);
}

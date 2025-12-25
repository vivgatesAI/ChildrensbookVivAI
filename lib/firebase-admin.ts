import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getServiceAccount() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey) return null;
    
    // Handle different formats of the private key
    let formattedKey = privateKey;
    
    // If the key contains literal \n (escaped), replace with actual newlines
    if (privateKey.includes('\\n')) {
        formattedKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // If the key is JSON-encoded (has quotes), parse it
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        try {
            formattedKey = JSON.parse(privateKey);
        } catch (e) {
            // If parsing fails, use as-is
        }
    }
    
    // If the key is all on one line (no newlines), fix it
    // This handles keys pasted without proper formatting
    if (!formattedKey.includes('\n') && formattedKey.includes('-----BEGIN')) {
        // Extract the base64 content between the markers
        const match = formattedKey.match(/-----BEGIN PRIVATE KEY-----(.*?)-----END PRIVATE KEY-----/);
        if (match && match[1]) {
            const base64Content = match[1];
            // Split into 64-character lines (standard PEM format)
            const lines = base64Content.match(/.{1,64}/g) || [];
            formattedKey = `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
        }
    }
    
    return {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
    };
}

export function getAdminApp() {
    if (getApps().length) {
        return getApp();
    }

    const serviceAccount = getServiceAccount();
    
    // Only initialize if we have credentials
    if (!serviceAccount || !serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        // Return null if credentials are missing - caller should handle this gracefully
        return null;
    }

    try {
        return initializeApp({
            credential: cert(serviceAccount),
        });
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
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

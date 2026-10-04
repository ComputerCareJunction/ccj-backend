import { cert, deleteApp, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

interface FirebaseAdminCredentials {
    projectId: string;
    clientEmail: string;
    privateKey: string;
}

export const withFirebaseAdminAuth = async <Result>(
    credentials: FirebaseAdminCredentials,
    operation: (auth: Auth) => Promise<Result>
): Promise<Result> => {
    let privateKey = credentials.privateKey.trim();
    if (privateKey.startsWith('{')) {
        const serviceAccount = JSON.parse(privateKey) as {
            project_id?: string;
            client_email?: string;
            private_key?: string;
        };
        if (serviceAccount.client_email && serviceAccount.client_email !== credentials.clientEmail) {
            throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_MISMATCH');
        }
        if (serviceAccount.project_id && serviceAccount.project_id !== credentials.projectId) {
            throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_MISMATCH');
        }
        privateKey = serviceAccount.private_key || '';
    }

    const app = initializeApp({
        credential: cert({
            projectId: credentials.projectId,
            clientEmail: credentials.clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        projectId: credentials.projectId,
    }, `ccj-admin-${crypto.randomUUID()}`);

    try {
        return await operation(getAuth(app));
    } finally {
        await deleteApp(app);
    }
};
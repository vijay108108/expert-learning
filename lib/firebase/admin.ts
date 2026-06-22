import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { env, hasFirebaseAdminEnv } from "@/lib/env";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function getAdminApp() {
  if (!hasFirebaseAdminEnv) {
    return null;
  }

  if (adminApp) {
    return adminApp;
  }

  const serviceAccount = JSON.parse(env.firebaseServiceAccountKey) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };

  adminApp = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
        }),
        projectId: env.nextPublicFirebaseProjectId,
      });

  return adminApp;
}

/**
 * Firestore client backed by the Firebase Admin SDK, which authenticates
 * with a service account and bypasses security rules. Required for writes
 * issued from trusted server contexts (API routes, webhooks) where there is
 * no signed-in user request.auth context for the rules engine to check.
 */
export function getAdminDb() {
  if (adminDb) {
    return adminDb;
  }

  const app = getAdminApp();
  if (!app) {
    return null;
  }

  adminDb = getFirestore(app);
  return adminDb;
}

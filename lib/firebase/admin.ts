import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { env, hasFirebaseAdminEnv } from "@/lib/env";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function parseServiceAccountKey(rawValue: string) {
  const trimmed = rawValue.trim();
  const unwrapped =
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("\"") && trimmed.endsWith("\""))
      ? trimmed.slice(1, -1)
      : trimmed;

  const parsed = JSON.parse(unwrapped) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };

  return {
    ...parsed,
    private_key: parsed.private_key?.replace(/\\n/g, "\n") || "",
  };
}

function getAdminApp() {
  if (!hasFirebaseAdminEnv) {
    return null;
  }

  if (adminApp) {
    return adminApp;
  }

  let serviceAccount: {
    project_id: string;
    client_email: string;
    private_key: string;
  };

  try {
    serviceAccount = parseServiceAccountKey(env.firebaseServiceAccountKey);
  } catch (error) {
    console.error("[Firebase Admin] Invalid FIREBASE_SERVICE_ACCOUNT_KEY", error);
    return null;
  }

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

/**
 * Firebase Auth backed by the Admin SDK — required for operations a
 * signed-in user can never perform on another account through the client
 * SDK, such as deleting a user or setting their password without knowing
 * the old one.
 */
export function getAdminAuth() {
  if (adminAuth) {
    return adminAuth;
  }

  const app = getAdminApp();
  if (!app) {
    return null;
  }

  adminAuth = getAuth(app);
  return adminAuth;
}

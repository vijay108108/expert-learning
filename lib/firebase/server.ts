import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, limit, query, type Firestore, where } from "firebase/firestore";
import { env, hasFirebaseEnv } from "@/lib/env";
import { getPhoneLookupCandidates, normalizePhoneForAuth } from "./phone-utils";

function getFirebaseConfig() {
  if (!hasFirebaseEnv) {
    return null;
  }

  return {
    apiKey: env.nextPublicFirebaseApiKey,
    authDomain: env.nextPublicFirebaseAuthDomain,
    projectId: env.nextPublicFirebaseProjectId,
    storageBucket: env.nextPublicFirebaseStorageBucket,
    messagingSenderId: env.nextPublicFirebaseMessagingSenderId,
    appId: env.nextPublicFirebaseAppId,
    measurementId: env.nextPublicFirebaseMeasurementId,
  };
}

let firebaseApp: FirebaseApp | null = null;
let firebaseDb: Firestore | null = null;

export function getServerFirebaseApp() {
  const firebaseConfig = getFirebaseConfig();

  if (!firebaseConfig) {
    return null;
  }

  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return firebaseApp;
}

export function getServerFirebaseDb() {
  if (!hasFirebaseEnv) {
    return null;
  }

  if (firebaseDb) {
    return firebaseDb;
  }

  const app = getServerFirebaseApp();
  if (!app) {
    return null;
  }

  firebaseDb = getFirestore(app);
  return firebaseDb;
}

export async function checkSignupPhoneExists(phone: string) {
  const db = getServerFirebaseDb();

  if (!db) {
    return { exists: false, source: "unavailable" as const, normalizedPhone: normalizePhoneForAuth(phone) };
  }

  const normalizedPhone = normalizePhoneForAuth(phone);
  const candidates = getPhoneLookupCandidates(phone);

  if (normalizedPhone) {
    const claimSnapshot = await getDoc(doc(db, "phone-signup-claims", normalizedPhone));

    if (claimSnapshot.exists()) {
      return {
        exists: true,
        source: "phone-signup-claims" as const,
        normalizedPhone,
      };
    }
  }

  if (candidates.length) {
    const legacyClaimSnapshot = await getDocs(
      query(collection(db, "phone-signup-claims"), where("phone", "in", candidates.slice(0, 10)), limit(1)),
    );

    if (!legacyClaimSnapshot.empty) {
      return {
        exists: true,
        source: "phone-signup-claims" as const,
        normalizedPhone,
      };
    }
  }

  if (!candidates.length) {
    return { exists: false, source: "users" as const, normalizedPhone };
  }

  const userSnapshot = await getDocs(
    query(collection(db, "users"), where("phone", "in", candidates.slice(0, 10)), limit(1)),
  );

  return userSnapshot.empty
    ? { exists: false, source: "users" as const, normalizedPhone }
    : { exists: true, source: "users" as const, normalizedPhone };
}

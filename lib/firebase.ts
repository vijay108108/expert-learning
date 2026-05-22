import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

const hasFirebaseEnv = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;

export function isFirebaseConfigured() {
  return hasFirebaseEnv;
}

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return firebaseApp;
}

export function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (firebaseAuth) {
    return firebaseAuth;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  firebaseAuth = getAuth(app);
  firebaseAuth.languageCode = "en";
  firebaseAuth.useDeviceLanguage();
  return firebaseAuth;
}

export function getFirebaseDb() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (firebaseDb) {
    return firebaseDb;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  firebaseDb = getFirestore(app);
  return firebaseDb;
}

export * from "./firebase/auth-errors";
export * from "./firebase/enrollments";
export * from "./firebase/lms-activity";
export * from "./firebase/phone-auth";
export * from "./firebase/user-profiles";

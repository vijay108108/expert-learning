import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { env, hasFirebaseEnv } from "@/lib/env";

const firebaseConfig = {
  apiKey: env.nextPublicFirebaseApiKey,
  authDomain: env.nextPublicFirebaseAuthDomain,
  projectId: env.nextPublicFirebaseProjectId,
  storageBucket: env.nextPublicFirebaseStorageBucket,
  messagingSenderId: env.nextPublicFirebaseMessagingSenderId,
  appId: env.nextPublicFirebaseAppId,
  measurementId: env.nextPublicFirebaseMeasurementId,
};

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

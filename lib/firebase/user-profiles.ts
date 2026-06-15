"use client";

import { type User } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, query, runTransaction, setDoc, updateDoc, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { normalizePhoneForAuth } from "./phone-auth";

export type AppUserProfile = {
  uid: string;
  name?: string;
  email?: string;
  photo?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  authMethod?: "google" | "otp" | "password";
  role?: "admin" | "student";
};

const phoneSignupClaimsCollection = "phone-signup-claims";

function getNormalizedPhoneKey(phone: string) {
  return normalizePhoneForAuth(phone);
}

function duplicatePhoneError() {
  const error = new Error("An account already exists with this phone number. Please log in instead.");
  (error as Error & { code?: string }).code = "auth/phone-number-already-in-use";
  return error;
}

export async function getUserProfile(uid: string) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data() as AppUserProfile) : null;
}

export async function getUserProfileByPhone(phone: string) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  const normalizedPhone = getNormalizedPhoneKey(phone);
  if (!normalizedPhone) {
    return null;
  }

  const snapshot = await getDocs(
    query(collection(db, "users"), where("phone", "==", normalizedPhone), limit(1)),
  );

  return snapshot.empty ? null : (snapshot.docs[0]?.data() as AppUserProfile);
}

export async function reservePhoneSignup(phone: string, uid: string) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  const normalizedPhone = getNormalizedPhoneKey(phone);
  if (!normalizedPhone) {
    throw new Error("Enter a valid phone number to continue.");
  }

  const existingProfile = await getUserProfileByPhone(normalizedPhone);
  if (existingProfile) {
    throw duplicatePhoneError();
  }

  const claimRef = doc(db, phoneSignupClaimsCollection, normalizedPhone);

  await runTransaction(db, async (transaction) => {
    const claimSnapshot = await transaction.get(claimRef);

    if (claimSnapshot.exists()) {
      throw duplicatePhoneError();
    }

    transaction.set(claimRef, {
      phone: normalizedPhone,
      uid,
      status: "reserved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  return normalizedPhone;
}

export async function releasePhoneSignupReservation(phone: string) {
  const db = getFirebaseDb();

  if (!db) {
    return;
  }

  const normalizedPhone = getNormalizedPhoneKey(phone);
  if (!normalizedPhone) {
    return;
  }

  await deleteDoc(doc(db, phoneSignupClaimsCollection, normalizedPhone));
}

export async function upsertGoogleUserProfile(user: User) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const existing = snapshot.exists() ? (snapshot.data() as AppUserProfile) : null;

  const mergedProfile: AppUserProfile = {
    uid: user.uid,
    name: user.displayName || existing?.name || "",
    email: user.email || existing?.email || "",
    photo: user.photoURL || existing?.photo || "",
    phone: existing?.phone || user.phoneNumber || "",
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authMethod: "google",
  };

  await setDoc(userRef, mergedProfile, { merge: true });
  return mergedProfile;
}

export async function ensurePhoneUserProfile(user: User, enteredName?: string) {
  const db = getFirebaseDb();

  if (!db) {
    return null;
  }

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data() as AppUserProfile;
  }

  const profile: AppUserProfile = {
    uid: user.uid,
    name: enteredName?.trim() || user.displayName?.trim() || "",
    phone: user.phoneNumber || "",
    createdAt: new Date().toISOString(),
    authMethod: "otp",
  };

  await setDoc(userRef, profile);
  return profile;
}

export async function saveUserWhatsappNumber(uid: string, phone: string) {
  const db = getFirebaseDb();

  if (!db) {
    return;
  }

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(
      userRef,
      {
        uid,
        phone,
        updatedAt: new Date().toISOString(),
      } satisfies Partial<AppUserProfile>,
      { merge: true },
    );
    return;
  }

  await updateDoc(userRef, {
    phone,
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppUserProfile>);
}

export async function listUserProfiles() {
  const db = getFirebaseDb();
  if (!db) {
    return [] as Array<AppUserProfile & { id: string }>;
  }

  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as AppUserProfile),
  }));
}

export async function updateUserRole(uid: string, role: "admin" | "student") {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase Firestore is not configured for users.");
  }

  await updateDoc(doc(db, "users", uid), {
    role,
    updatedAt: new Date().toISOString(),
  } satisfies Partial<AppUserProfile>);
}

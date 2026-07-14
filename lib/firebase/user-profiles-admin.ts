import "server-only";
import { getAdminDb } from "./admin";
import type { AppUserProfile } from "./user-profiles";

function inferServerAuthMethod(existing: AppUserProfile | null, input: { email?: string; phone?: string }) {
  if (existing?.authMethod) {
    return existing.authMethod;
  }

  if (input.phone && !input.email) {
    return "otp" as const;
  }

  return input.email ? ("password" as const) : undefined;
}

export async function upsertUserProfileAdminFromPayment(input: {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  gstNumber?: string;
  createdAt?: string;
}) {
  const db = getAdminDb();

  if (!db) {
    throw new Error("Firebase Admin Firestore is not configured for user profiles.");
  }

  const userRef = db.collection("users").doc(input.uid);
  const snapshot = await userRef.get();
  const existing = snapshot.exists ? (snapshot.data() as AppUserProfile) : null;
  const timestamp = new Date().toISOString();

  const payload: AppUserProfile = {
    uid: input.uid,
    name: input.name?.trim() || existing?.name || "",
    email: input.email?.trim() || existing?.email || "",
    photo: existing?.photo || "",
    phone: input.phone?.trim() || existing?.phone || "",
    createdAt: existing?.createdAt || input.createdAt || timestamp,
    updatedAt: timestamp,
    authMethod: inferServerAuthMethod(existing, input),
    role: existing?.role || "student",
    ...(input.companyName?.trim() ? { companyName: input.companyName.trim() } : existing?.companyName ? { companyName: existing.companyName } : {}),
    ...(input.gstNumber?.trim() ? { gstNumber: input.gstNumber.trim().toUpperCase() } : existing?.gstNumber ? { gstNumber: existing.gstNumber } : {}),
  };

  await userRef.set(payload, { merge: true });
}

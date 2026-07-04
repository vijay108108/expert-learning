import { getAdminAuth, getAdminDb } from "./admin";
import { getPhoneLookupCandidates, normalizePhoneForAuth } from "./phone-utils";

export type SignupPhoneLookupResult = {
  exists: boolean;
  normalizedPhone: string;
  passwordEnabled: boolean;
  uid?: string;
  source:
    | "unavailable"
    | "auth-phone"
    | "auth-email"
    | "auth-only"
    | "phone-signup-claims"
    | "users";
};

/**
 * Uses the Firebase Admin SDK (not the client SDK) because this runs in a
 * server context with no signed-in request.auth — the client SDK would be
 * blocked by Firestore security rules that require an authenticated user.
 */
export async function checkSignupPhoneExists(phone: string) {
  const db = getAdminDb();
  const auth = getAdminAuth();
  const normalizedPhone = normalizePhoneForAuth(phone);
  const normalizedPhoneWithPlus = normalizedPhone ? `+${normalizedPhone}` : "";
  const fakeEmail = normalizedPhone ? `${normalizedPhone}@genznext.app` : "";

  if (!db && !auth) {
    return { exists: false, source: "unavailable" as const, normalizedPhone, passwordEnabled: false } satisfies SignupPhoneLookupResult;
  }

  if (auth && normalizedPhoneWithPlus) {
    try {
      const user = await auth.getUserByPhoneNumber(normalizedPhoneWithPlus);
      return {
        exists: true,
        source: "auth-phone" as const,
        normalizedPhone,
        passwordEnabled: user.providerData.some((provider) => provider.providerId === "password"),
        uid: user.uid,
      };
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
      if (code !== "auth/user-not-found") {
        throw error;
      }
    }
  }

  if (auth && fakeEmail) {
    try {
      const user = await auth.getUserByEmail(fakeEmail);
      return {
        exists: true,
        source: "auth-email" as const,
        normalizedPhone,
        passwordEnabled: true,
        uid: user.uid,
      };
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
      if (code !== "auth/user-not-found") {
        throw error;
      }
    }
  }

  if (!db) {
    return { exists: false, source: "auth-only" as const, normalizedPhone, passwordEnabled: false } satisfies SignupPhoneLookupResult;
  }

  const candidates = getPhoneLookupCandidates(phone);

  if (normalizedPhone) {
    const claimSnapshot = await db.collection("phone-signup-claims").doc(normalizedPhone).get();

    if (claimSnapshot.exists) {
      return {
        exists: true,
        source: "phone-signup-claims" as const,
        normalizedPhone,
        passwordEnabled: true,
        uid: claimSnapshot.id,
      };
    }
  }

  if (candidates.length) {
    const legacyClaimSnapshot = await db
      .collection("phone-signup-claims")
      .where("phone", "in", candidates.slice(0, 10))
      .limit(1)
      .get();

    if (!legacyClaimSnapshot.empty) {
      return {
        exists: true,
        source: "phone-signup-claims" as const,
        normalizedPhone,
        passwordEnabled: true,
        uid: legacyClaimSnapshot.docs[0]?.id,
      };
    }
  }

  if (!candidates.length) {
    return { exists: false, source: "users" as const, normalizedPhone, passwordEnabled: false } satisfies SignupPhoneLookupResult;
  }

  const userSnapshot = await db
    .collection("users")
    .where("phone", "in", candidates.slice(0, 10))
    .limit(1)
    .get();

  return userSnapshot.empty
    ? { exists: false, source: "users" as const, normalizedPhone, passwordEnabled: false }
    : {
        exists: true,
        source: "users" as const,
        normalizedPhone,
        passwordEnabled: userSnapshot.docs.some((doc) => doc.data().authMethod === "password"),
        uid: userSnapshot.docs[0]?.id,
      };
}

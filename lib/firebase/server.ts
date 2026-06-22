import { getAdminDb } from "./admin";
import { getPhoneLookupCandidates, normalizePhoneForAuth } from "./phone-utils";

/**
 * Uses the Firebase Admin SDK (not the client SDK) because this runs in a
 * server context with no signed-in request.auth — the client SDK would be
 * blocked by Firestore security rules that require an authenticated user.
 */
export async function checkSignupPhoneExists(phone: string) {
  const db = getAdminDb();
  const normalizedPhone = normalizePhoneForAuth(phone);

  if (!db) {
    return { exists: false, source: "unavailable" as const, normalizedPhone };
  }

  const candidates = getPhoneLookupCandidates(phone);

  if (normalizedPhone) {
    const claimSnapshot = await db.collection("phone-signup-claims").doc(normalizedPhone).get();

    if (claimSnapshot.exists) {
      return {
        exists: true,
        source: "phone-signup-claims" as const,
        normalizedPhone,
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
      };
    }
  }

  if (!candidates.length) {
    return { exists: false, source: "users" as const, normalizedPhone };
  }

  const userSnapshot = await db
    .collection("users")
    .where("phone", "in", candidates.slice(0, 10))
    .limit(1)
    .get();

  return userSnapshot.empty
    ? { exists: false, source: "users" as const, normalizedPhone }
    : { exists: true, source: "users" as const, normalizedPhone };
}

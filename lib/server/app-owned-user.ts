import "server-only";
import type { Firestore } from "firebase-admin/firestore";

/**
 * The `users` and `phone-signup-claims` collections live in a Firestore
 * project shared with sibling apps, so a Firestore profile existing is not
 * proof this app owns the account. An enrollment record is one proof of
 * ownership, but most users sign up long before they buy anything, so an
 * account with zero purchases must not be treated as "not ours" — that
 * incorrectly locks admins out of managing/deleting fresh signups. A
 * phone-signup-claim is written at signup time by this app's phone/OTP
 * flow, before any purchase, so it is the second, purchase-independent
 * ownership signal.
 */
export async function isAppOwnedUser(db: Firestore, uid: string) {
  const [enrollmentsSnapshot, claimSnapshot] = await Promise.all([
    db.collection("enrollments").where("userId", "==", uid).limit(1).get(),
    db.collection("phone-signup-claims").where("uid", "==", uid).limit(1).get(),
  ]);

  return !enrollmentsSnapshot.empty || !claimSnapshot.empty;
}

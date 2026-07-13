import { env } from "@/lib/env";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export type VerifiedFirebaseUser = {
  uid: string;
  email: string;
  phoneNumber: string;
  role?: "admin" | "student";
};

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme.toLowerCase() !== "bearer" || !token?.trim()) {
    return "";
  }

  return token.trim();
}

async function fetchUserProfileRole(uid: string) {
  const db = getAdminDb();
  if (!db) {
    return undefined;
  }

  try {
    const snapshot = await db.collection("users").doc(uid).get();
    const role = snapshot.exists ? (snapshot.data()?.role as string | undefined) : undefined;
    return role === "admin" || role === "student" ? role : undefined;
  } catch {
    return undefined;
  }
}

export async function verifyFirebaseBearerToken(request: Request) {
  const idToken = getBearerToken(request);
  const auth = getAdminAuth();

  if (!idToken || !auth) {
    return null;
  }

  try {
    const decoded = await auth.verifyIdToken(idToken, true);
    const role = await fetchUserProfileRole(decoded.uid);

    return {
      uid: decoded.uid,
      email: (decoded.email || "").trim().toLowerCase(),
      phoneNumber: (decoded.phone_number || "").trim(),
      role,
    } satisfies VerifiedFirebaseUser;
  } catch {
    return null;
  }
}

export function isConfiguredAdminUser(user: VerifiedFirebaseUser) {
  if (user.role === "admin") {
    return true;
  }

  return Boolean(user.email && env.adminEmails.includes(user.email));
}

export async function requireAdmin(request: Request) {
  const authUser = await verifyFirebaseBearerToken(request);

  if (!authUser || !isConfiguredAdminUser(authUser)) {
    return null;
  }

  return authUser;
}

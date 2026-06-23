import { env } from "@/lib/env";

type FirebaseLookupResponse = {
  users?: Array<{
    localId?: string;
    email?: string;
    phoneNumber?: string;
  }>;
  error?: {
    message?: string;
  };
};

type FirestoreValue = {
  stringValue?: string;
};

type FirestoreDocument = {
  fields?: Record<string, FirestoreValue>;
};

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

function readFirestoreString(document: FirestoreDocument | null, key: string) {
  return document?.fields?.[key]?.stringValue || "";
}

async function fetchUserProfileRole(uid: string, idToken: string) {
  if (!env.nextPublicFirebaseProjectId) {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${env.nextPublicFirebaseProjectId}/databases/(default)/documents/users/${encodeURIComponent(uid)}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const profile = (await response.json()) as FirestoreDocument;
    const role = readFirestoreString(profile, "role");
    return role === "admin" || role === "student" ? role : undefined;
  } catch {
    return undefined;
  }
}

export async function verifyFirebaseBearerToken(request: Request) {
  const idToken = getBearerToken(request);

  if (!idToken || !env.nextPublicFirebaseApiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.nextPublicFirebaseApiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as FirebaseLookupResponse;
    const firebaseUser = payload.users?.[0];

    if (!firebaseUser?.localId) {
      return null;
    }

    const role = await fetchUserProfileRole(firebaseUser.localId, idToken);

    return {
      uid: firebaseUser.localId,
      email: firebaseUser.email?.trim().toLowerCase() || "",
      phoneNumber: firebaseUser.phoneNumber?.trim() || "",
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

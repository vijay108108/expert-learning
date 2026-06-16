/**
 * POST /api/admin/seed
 *
 * One-time route that creates the admin Firebase account and sets
 * role = "admin" in Firestore — using only the Firebase REST API
 * (no Admin SDK / service account needed).
 *
 * Protected by ADMIN_SETUP_KEY env var. Call once, then it's done.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/admin/seed \
 *     -H "Content-Type: application/json" \
 *     -d '{"key":"your-setup-key"}'
 *
 * Or just open: http://localhost:3000/api/admin/seed?key=your-setup-key
 */

import { NextResponse } from "next/server";
import { env } from "@/lib/env";

const ADMIN_PHONE    = "8817659208";
const ADMIN_NAME     = "Jay Vishwakarma";
const ADMIN_PASSWORD = "123456789";
/* Phone → fake email (same pattern as phone-auth-flow.tsx) */
const ADMIN_EMAIL    = `91${ADMIN_PHONE}@genznext.app`;

/* ── Firebase REST helpers ───────────────────────────────── */

async function createFirebaseUser(email: string, password: string, apiKey: string) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Firebase signup failed");
  }
  return data as { localId: string; idToken: string; email: string };
}

async function updateDisplayName(idToken: string, displayName: string, apiKey: string) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, displayName, returnSecureToken: false }),
    },
  );
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error?.message || "Display name update failed");
  }
}

async function writeFirestoreProfile(
  uid: string,
  idToken: string,
  projectId: string,
  data: Record<string, unknown>,
) {
  /* Convert to Firestore REST value format */
  function toValue(v: unknown): unknown {
    if (typeof v === "string")  return { stringValue: v };
    if (typeof v === "boolean") return { booleanValue: v };
    if (typeof v === "number")  return { integerValue: String(v) };
    return { nullValue: null };
  }

  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = toValue(v);
  }

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fields }),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Firestore write failed");
  }
}

/* ── Route handler ───────────────────────────────────────── */

export async function POST(request: Request) {
  let key = "";
  try {
    const body = await request.json();
    key = body?.key || "";
  } catch { /* ignore */ }
  return handler(key);
}

async function handler(providedKey: string) {
  const setupKey  = process.env.ADMIN_SETUP_KEY || "";
  const apiKey    = env.nextPublicFirebaseApiKey || "";
  const projectId = env.nextPublicFirebaseProjectId || "";

  /* ── Disabled in production — remove ADMIN_SETUP_KEY after first use ── */
  if (!setupKey) {
    return NextResponse.json(
      { error: "Setup route is disabled. Add ADMIN_SETUP_KEY to .env.local to re-enable." },
      { status: 404 },
    );
  }

  if (providedKey !== setupKey) {
    return NextResponse.json(
      { error: "Invalid setup key." },
      { status: 401 },
    );
  }

  if (!apiKey || !projectId) {
    return NextResponse.json(
      { error: "Firebase is not configured (missing API key or project ID)." },
      { status: 500 },
    );
  }

  const results: string[] = [];

  try {
    /* Step 1 — Create Firebase Auth user */
    results.push(`Creating Firebase account for ${ADMIN_EMAIL}…`);
    let uid: string;
    let idToken: string;

    try {
      const created = await createFirebaseUser(ADMIN_EMAIL, ADMIN_PASSWORD, apiKey);
      uid     = created.localId;
      idToken = created.idToken;
      results.push(`✓ Firebase account created — UID: ${uid}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("EMAIL_EXISTS")) {
        results.push("ℹ Account already exists — signing in to get token…");
        /* Sign in instead */
        const signInRes = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true }),
          },
        );
        const signInData = await signInRes.json();
        if (!signInRes.ok) throw new Error(signInData?.error?.message || "Sign-in failed");
        uid     = signInData.localId;
        idToken = signInData.idToken;
        results.push(`✓ Signed in to existing account — UID: ${uid}`);
      } else {
        throw err;
      }
    }

    /* Step 2 — Set display name */
    try {
      await updateDisplayName(idToken, ADMIN_NAME, apiKey);
      results.push(`✓ Display name set to "${ADMIN_NAME}"`);
    } catch (err) {
      results.push(`⚠ Could not set display name: ${err instanceof Error ? err.message : err}`);
    }

    /* Step 3 — Write Firestore profile with role: admin */
    results.push("Writing admin profile to Firestore…");
    await writeFirestoreProfile(uid, idToken, projectId, {
      uid,
      name:       ADMIN_NAME,
      phone:      ADMIN_PHONE,
      email:      ADMIN_EMAIL,
      role:       "admin",
      authMethod: "password",
      createdAt:  new Date().toISOString(),
    });
    results.push("✓ Firestore profile written with role: admin");

    /* Done */
    return NextResponse.json({
      success: true,
      message: "Admin account ready. You can now login at /admin.",
      steps: results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error:   err instanceof Error ? err.message : String(err),
        steps:   results,
      },
      { status: 500 },
    );
  }
}

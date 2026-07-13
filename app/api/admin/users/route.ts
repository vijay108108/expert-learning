import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/firebase-auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { normalizePhoneForAuth } from "@/lib/firebase/phone-utils";

type AdminListUser = {
  id: string;
  uid: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: "admin" | "student";
  authMethod?: "google" | "otp" | "password";
  createdAt?: string;
};

function normalizePhoneForDisplay(phone: string | undefined) {
  if (!phone) {
    return "";
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return digits;
  }

  return normalizePhoneForAuth(phone);
}

export async function GET(request: Request) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const auth = getAdminAuth();
  const db = getAdminDb();

  if (!auth || !db) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  try {
    const [profileSnapshot, listedUsers] = await Promise.all([
      db.collection("users").get(),
      auth.listUsers(1000),
    ]);

    const byUid = new Map<string, AdminListUser>();

    for (const doc of profileSnapshot.docs) {
      const data = doc.data() as Partial<AdminListUser>;
      const uid = String(data.uid || doc.id);
      byUid.set(uid, {
        id: uid,
        uid,
        name: data.name || "",
        phone: normalizePhoneForDisplay(data.phone),
        email: data.email || "",
        role: data.role === "admin" ? "admin" : "student",
        authMethod: data.authMethod,
        createdAt: data.createdAt || "",
      });
    }

    for (const userRecord of listedUsers.users) {
      const uid = userRecord.uid;
      const existing = byUid.get(uid);
      const providerIds = new Set((userRecord.providerData || []).map((provider) => provider.providerId));

      let authMethod: AdminListUser["authMethod"] = existing?.authMethod;
      if (!authMethod) {
        if (providerIds.has("google.com")) {
          authMethod = "google";
        } else if (providerIds.has("password")) {
          authMethod = "password";
        } else if (providerIds.has("phone")) {
          authMethod = "otp";
        }
      }

      const merged: AdminListUser = {
        id: uid,
        uid,
        name: existing?.name || userRecord.displayName || "",
        phone: existing?.phone || normalizePhoneForDisplay(userRecord.phoneNumber || undefined),
        email: existing?.email || userRecord.email || "",
        role: existing?.role || "student",
        authMethod,
        createdAt: existing?.createdAt || userRecord.metadata.creationTime || "",
      };

      byUid.set(uid, merged);
    }

    const users = Array.from(byUid.values()).sort(
      (left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime(),
    );

    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load users.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  let name = "";
  let phone = "";
  let email = "";
  let password = "";
  let role: "admin" | "student" = "student";

  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? body.name.trim() : "";
    phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body?.password === "string" ? body.password : "";
    role = body?.role === "admin" ? "admin" : "student";
  } catch {
    // Missing/invalid body handled by the validation below.
  }

  if (!name) {
    return NextResponse.json({ success: false, message: "Name is required." }, { status: 400 });
  }

  if (!phone && !email) {
    return NextResponse.json(
      { success: false, message: "Provide a phone number or an email address." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, message: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const normalizedPhone = phone ? normalizePhoneForAuth(phone) : "";

  /* Must match exactly /^91\d{10}$/ — the same shape the login form's
     normalizePhoneForAuth(phone) always produces for a real 10-digit
     Indian number. Anything else (leading zeros, stray punctuation,
     double country codes, non-Indian numbers) falls through this
     function's fallback branch and silently returns the wrong digit
     string, generating a synthetic email no login attempt can ever
     reach — the account becomes permanently unreachable with no error
     at creation time. */
  if (phone && !/^91\d{10}$/.test(normalizedPhone)) {
    return NextResponse.json(
      { success: false, message: "Enter a valid 10-digit Indian mobile number." },
      { status: 400 },
    );
  }

  const auth = getAdminAuth();
  const db = getAdminDb();

  if (!auth || !db) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  const finalEmail = email || `${normalizedPhone}@genznext.app`;

  try {
    const created = await auth.createUser({
      email: finalEmail,
      password,
      displayName: name,
      ...(normalizedPhone ? { phoneNumber: `+${normalizedPhone}` } : {}),
    });

    await db.collection("users").doc(created.uid).set({
      uid: created.uid,
      name,
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
      ...(email ? { email } : {}),
      role,
      authMethod: "password",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, uid: created.uid });
  } catch (error) {
    const code = (error as { code?: string })?.code || "";
    const message =
      code === "auth/email-already-exists" || code === "auth/phone-number-already-exists"
        ? "An account with this phone number or email already exists."
        : error instanceof Error
          ? error.message
          : "Unable to create user.";

    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

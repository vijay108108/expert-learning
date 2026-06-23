import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/firebase-auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { normalizePhoneForAuth } from "@/lib/firebase/phone-utils";

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

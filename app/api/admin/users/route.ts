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

type EnrollmentUserHint = {
  userId: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  enrolledAt?: string;
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
    const [enrollmentSnapshot, phoneClaimSnapshot] = await Promise.all([
      db.collection("enrollments").get(),
      db.collection("phone-signup-claims").get(),
    ]);

    /* App ownership can't rely on enrollments alone — most users sign up
       before ever buying anything. phone-signup-claims is written at
       signup time by this app's phone/OTP flow, so it covers those too. */
    const appOwnedUids = new Set<string>();
    for (const doc of enrollmentSnapshot.docs) {
      const userId = doc.data()?.userId;
      if (typeof userId === "string" && userId) {
        appOwnedUids.add(userId);
      }
    }
    for (const doc of phoneClaimSnapshot.docs) {
      const uid = doc.data()?.uid;
      if (typeof uid === "string" && uid) {
        appOwnedUids.add(uid);
      }
    }

    const profileSnapshot = await db.collection("users").get();

    const byUid = new Map<string, AdminListUser>();
    const enrollmentHints = new Map<string, EnrollmentUserHint>();

    for (const doc of profileSnapshot.docs) {
      const data = doc.data() as Partial<AdminListUser>;
      const uid = String(data.uid || doc.id);
      if (!appOwnedUids.has(uid)) {
        continue;
      }
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

    for (const doc of enrollmentSnapshot.docs) {
      const data = doc.data() as Partial<EnrollmentUserHint>;
      const userId = typeof data.userId === "string" ? data.userId : "";
      if (!userId) {
        continue;
      }

      const current = enrollmentHints.get(userId);
      const currentTs = new Date(current?.enrolledAt || 0).getTime();
      const nextTs = new Date(data.enrolledAt || 0).getTime();

      if (!current || nextTs >= currentTs) {
        enrollmentHints.set(userId, {
          userId,
          userName: typeof data.userName === "string" ? data.userName : "",
          userPhone: typeof data.userPhone === "string" ? data.userPhone : "",
          userEmail: typeof data.userEmail === "string" ? data.userEmail : "",
          enrolledAt: typeof data.enrolledAt === "string" ? data.enrolledAt : "",
        });
      }

      if (!byUid.has(userId)) {
        byUid.set(userId, {
          id: userId,
          uid: userId,
          name: "",
          phone: "",
          email: "",
          role: "student",
          createdAt: "",
        });
      }
    }

    const scopedUids = Array.from(byUid.keys());

    for (let index = 0; index < scopedUids.length; index += 100) {
      const chunk = scopedUids.slice(index, index + 100);
      const authUsers = await auth.getUsers(chunk.map((uid) => ({ uid })));

      for (const userRecord of authUsers.users) {
        const uid = userRecord.uid;
        const existing = byUid.get(uid);
        if (!existing) {
          continue;
        }

        const providerIds = new Set((userRecord.providerData || []).map((provider) => provider.providerId));
        let authMethod: AdminListUser["authMethod"] = existing.authMethod;
        if (!authMethod) {
          if (providerIds.has("google.com")) {
            authMethod = "google";
          } else if (providerIds.has("password")) {
            authMethod = "password";
          } else if (providerIds.has("phone")) {
            authMethod = "otp";
          }
        }

        byUid.set(uid, {
          ...existing,
          name: existing.name || userRecord.displayName || "",
          phone: existing.phone || normalizePhoneForDisplay(userRecord.phoneNumber || undefined),
          email: existing.email || userRecord.email || "",
          authMethod,
          createdAt: existing.createdAt || userRecord.metadata.creationTime || "",
        });
      }
    }

    for (const [uid, hint] of enrollmentHints.entries()) {
      const existing = byUid.get(uid);
      if (!existing) {
        continue;
      }

      byUid.set(uid, {
        ...existing,
        name: existing.name || hint.userName || "",
        phone: existing.phone || normalizePhoneForDisplay(hint.userPhone),
        email: existing.email || hint.userEmail || "",
        createdAt: existing.createdAt || hint.enrolledAt || "",
      });
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

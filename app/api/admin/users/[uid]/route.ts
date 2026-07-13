import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/firebase-auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { getPhoneLookupCandidates, normalizePhoneForAuth } from "@/lib/firebase/phone-utils";

type RouteContext = {
  params: Promise<{ uid: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { uid } = await context.params;
  const auth = getAdminAuth();
  const db = getAdminDb();

  if (!auth || !db) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  let payload: {
    name?: string;
    phone?: string;
    email?: string;
    role?: "admin" | "student";
    companyName?: string;
    gstNumber?: string;
    billingAddress?: string;
  } = {};

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const role = payload.role === "admin" ? "admin" : payload.role === "student" ? "student" : undefined;
  const companyName = typeof payload.companyName === "string" ? payload.companyName.trim() : "";
  const gstNumber = typeof payload.gstNumber === "string" ? payload.gstNumber.trim().toUpperCase() : "";
  const billingAddress = typeof payload.billingAddress === "string" ? payload.billingAddress.trim() : "";

  if (!name) {
    return NextResponse.json({ success: false, message: "Name is required." }, { status: 400 });
  }

  const normalizedPhone = phone ? normalizePhoneForAuth(phone) : "";
  if (phone && !/^91\d{10}$/.test(normalizedPhone)) {
    return NextResponse.json(
      { success: false, message: "Enter a valid 10-digit Indian mobile number." },
      { status: 400 },
    );
  }

  try {
    const userDocRef = db.collection("users").doc(uid);
    const [userDocSnapshot, enrollmentsSnapshot] = await Promise.all([
      userDocRef.get(),
      db.collection("enrollments").where("userId", "==", uid).limit(1).get(),
    ]);

    if (!userDocSnapshot.exists && enrollmentsSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "This user does not belong to this app." },
        { status: 404 },
      );
    }

    const existingAuthUser = await auth.getUser(uid).catch((error) => {
      if (error?.code === "auth/user-not-found") {
        return null;
      }
      throw error;
    });

    if (!existingAuthUser) {
      return NextResponse.json({ success: false, message: "Auth user not found." }, { status: 404 });
    }

    const authUpdate: Parameters<typeof auth.updateUser>[1] = {
      displayName: name,
    };

    if (email) {
      authUpdate.email = email;
    }

    if (normalizedPhone) {
      authUpdate.phoneNumber = `+${normalizedPhone}`;
    }

    await auth.updateUser(uid, authUpdate);

    await userDocRef.set(
      {
        uid,
        name,
        ...(email ? { email } : {}),
        ...(normalizedPhone ? { phone: normalizedPhone } : {}),
        ...(role ? { role } : {}),
        ...(companyName ? { companyName } : {}),
        ...(gstNumber ? { gstNumber } : {}),
        ...(billingAddress ? { billingAddress } : {}),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
    const message =
      code === "auth/email-already-exists" || code === "auth/phone-number-already-exists"
        ? "Another user already uses this email or phone number."
        : error instanceof Error
          ? error.message
          : "Unable to update user details.";

    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { uid } = await context.params;

  if (uid === authUser.uid) {
    return NextResponse.json(
      { success: false, message: "You cannot delete your own account." },
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

  try {
    const userDocRef = db.collection("users").doc(uid);
    const userDocSnapshot = await userDocRef.get();
    const userData = userDocSnapshot.exists ? userDocSnapshot.data() as { phone?: string } : null;

    const enrollmentsSnapshot = await db.collection("enrollments").where("userId", "==", uid).get();
    if (!userDocSnapshot.exists && enrollmentsSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "This user does not belong to this app." },
        { status: 404 },
      );
    }

    await auth.deleteUser(uid).catch((error) => {
      if (error?.code !== "auth/user-not-found") {
        throw error;
      }
    });

    const phoneClaimByUidSnapshot = await db
      .collection("phone-signup-claims")
      .where("uid", "==", uid)
      .get();

    const batch = db.batch();
    enrollmentsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    phoneClaimByUidSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    const phoneCandidates = userData?.phone ? getPhoneLookupCandidates(userData.phone) : [];
    phoneCandidates.forEach((phoneKey) => {
      batch.delete(db.collection("phone-signup-claims").doc(phoneKey));
    });

    batch.delete(userDocRef);
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to delete user." },
      { status: 500 },
    );
  }
}

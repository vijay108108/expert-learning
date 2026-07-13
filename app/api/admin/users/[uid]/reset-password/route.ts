import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/firebase-auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

type RouteContext = {
  params: Promise<{ uid: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { uid } = await context.params;

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    // Missing/invalid body handled by the validation below.
  }

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, message: "Password must be at least 8 characters." },
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
    const [userDocSnapshot, enrollmentSnapshot] = await Promise.all([
      db.collection("users").doc(uid).get(),
      db.collection("enrollments").where("userId", "==", uid).limit(1).get(),
    ]);

    if (!userDocSnapshot.exists && enrollmentSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "This user does not belong to this app." },
        { status: 404 },
      );
    }

    await auth.updateUser(uid, { password });
    await db.collection("users").doc(uid).set(
      { passwordUpdatedAt: new Date().toISOString() },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to reset password." },
      { status: 500 },
    );
  }
}

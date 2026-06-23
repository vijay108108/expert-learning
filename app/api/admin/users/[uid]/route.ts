import { NextResponse } from "next/server";
import { isConfiguredAdminUser, verifyFirebaseBearerToken } from "@/lib/server/firebase-auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

type RouteContext = {
  params: Promise<{ uid: string }>;
};

async function requireAdmin(request: Request) {
  const authUser = await verifyFirebaseBearerToken(request);

  if (!authUser || !isConfiguredAdminUser(authUser)) {
    return null;
  }

  return authUser;
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
    await auth.deleteUser(uid).catch((error) => {
      if (error?.code !== "auth/user-not-found") {
        throw error;
      }
    });

    const enrollmentsSnapshot = await db.collection("enrollments").where("userId", "==", uid).get();
    const batch = db.batch();
    enrollmentsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection("users").doc(uid));
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to delete user." },
      { status: 500 },
    );
  }
}

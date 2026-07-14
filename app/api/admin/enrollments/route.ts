import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/firebase-auth";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const db = getAdminDb();

  if (!db) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  try {
    const snapshot = await db.collection("enrollments").get();
    const enrollments = snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Record<string, unknown>),
    }));

    return NextResponse.json({ success: true, enrollments });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load enrollments.",
      },
      { status: 500 },
    );
  }
}

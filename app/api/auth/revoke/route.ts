import { NextResponse } from "next/server";
import { verifyFirebaseBearerToken } from "@/lib/server/firebase-auth";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  const authUser = await verifyFirebaseBearerToken(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const auth = getAdminAuth();

  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  try {
    await auth.revokeRefreshTokens(authUser.uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to revoke session." },
      { status: 500 },
    );
  }
}

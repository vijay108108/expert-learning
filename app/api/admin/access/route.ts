import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/firebase-auth";

export async function GET(request: Request) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, uid: authUser.uid, role: authUser.role || null });
}

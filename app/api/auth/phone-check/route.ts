import { NextResponse } from "next/server";
import { checkSignupPhoneExists } from "@/lib/firebase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: unknown };
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required.", exists: false },
        { status: 400 },
      );
    }

    const result = await checkSignupPhoneExists(phone);

    return NextResponse.json({
      success: true,
      exists: result.exists,
      normalizedPhone: result.normalizedPhone,
      source: result.source,
    });
  } catch (error) {
    console.error("[Auth Phone Check] lookup failed", error);

    return NextResponse.json(
      {
        success: false,
        exists: false,
        message: error instanceof Error ? error.message : "Unable to validate the phone number right now.",
      },
      { status: 503 },
    );
  }
}

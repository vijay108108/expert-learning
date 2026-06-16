import { NextResponse } from "next/server";
import { checkSignupPhoneExists } from "@/lib/firebase/server";

export const runtime = "nodejs";

async function readPhoneFromRequest(request: Request) {
  if (request.method === "GET") {
    const url = new URL(request.url);
    return url.searchParams.get("phone")?.trim() || "";
  }

  const body = (await request.json().catch(() => null)) as { phone?: unknown } | null;
  return typeof body?.phone === "string" ? body.phone.trim() : "";
}

async function handleRequest(request: Request) {
  try {
    const phone = await readPhoneFromRequest(request);

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
    console.error("[Auth Check Phone Exists] lookup failed", error);

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

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}

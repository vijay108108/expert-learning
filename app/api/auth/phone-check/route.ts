import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { normalizePhoneForAuth } from "@/lib/firebase/phone-utils";
import { checkSignupPhoneExists } from "@/lib/firebase/server";

export const runtime = "nodejs";

const lookupWindowMs = 10 * 60 * 1000;
const maxLookupRequestsPerWindow = 8;
const lookupBuckets = new Map<string, { count: number; resetAt: number }>();

function jsonNoStore(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getLookupBucketKey(request: Request, phone: string) {
  const normalizedPhone = normalizePhoneForAuth(phone) || phone.trim();
  return crypto.createHash("sha256").update(`${getClientIp(request)}:${normalizedPhone}`).digest("hex");
}

function takeLookupToken(bucketKey: string) {
  const now = Date.now();

  for (const [key, bucket] of lookupBuckets.entries()) {
    if (bucket.resetAt <= now) {
      lookupBuckets.delete(key);
    }
  }

  const current = lookupBuckets.get(bucketKey);

  if (!current || current.resetAt <= now) {
    lookupBuckets.set(bucketKey, { count: 1, resetAt: now + lookupWindowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= maxLookupRequestsPerWindow) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  lookupBuckets.set(bucketKey, current);

  return { allowed: true, retryAfterSeconds: 0 };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { phone?: unknown } | null;
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

    if (!phone) {
      return jsonNoStore({ success: false, message: "Phone number is required." }, 400);
    }

    const rateLimit = takeLookupToken(getLookupBucketKey(request, phone));

    if (!rateLimit.allowed) {
      return jsonNoStore(
        {
          success: false,
          message: "Please wait before trying again.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        429,
      );
    }

    const result = await checkSignupPhoneExists(phone);

    return jsonNoStore({
      success: true,
      canProceed: !result.exists,
    });
  } catch (error) {
    console.error("[Auth Phone Check] lookup failed", error);

    return jsonNoStore(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to validate the phone number right now.",
      },
      503,
    );
  }
}

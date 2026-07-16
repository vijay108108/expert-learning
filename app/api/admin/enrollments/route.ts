import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/firebase-auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

const placeholderNames = new Set(["learner", "genznext learner", "student", "user", "-"]);

function sanitizeName(value: unknown) {
  const normalized = typeof value === "string" ? value.trim() : "";

  if (normalized.length < 2) {
    return "";
  }

  return placeholderNames.has(normalized.toLowerCase()) ? "" : normalized;
}

type EnrollmentRow = Record<string, unknown> & {
  id: string;
  userId?: string;
  userName?: string;
};

export async function GET(request: Request) {
  const authUser = await requireAdmin(request);

  if (!authUser) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const db = getAdminDb();
  const auth = getAdminAuth();

  if (!db || !auth) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  const adminDb = db;
  const adminAuth = auth;

  try {
    const [enrollmentSnapshot, usersSnapshot, invoiceSnapshot, paymentSnapshot] = await Promise.all([
      adminDb.collection("enrollments").get(),
      adminDb.collection("users").get(),
      adminDb.collection("invoices").get(),
      adminDb.collection("payments").get(),
    ]);

    const nameByUserId = new Map<string, string>();
    const nameByPhone = new Map<string, string>();

    const normalizePhone = (value: unknown) => {
      const digits = String(value || "").replace(/\D/g, "");
      if (!digits) return "";
      return digits.length > 10 ? digits.slice(-10) : digits;
    };

    const setHints = (userId: string, phone: string, name: string) => {
      const sanitized = sanitizeName(name);
      if (!sanitized) {
        return;
      }

      if (userId && !nameByUserId.has(userId)) {
        nameByUserId.set(userId, sanitized);
      }

      if (phone && !nameByPhone.has(phone)) {
        nameByPhone.set(phone, sanitized);
      }
    };

    for (const doc of usersSnapshot.docs) {
      const data = doc.data() as { uid?: string; phone?: string; name?: string };
      const userId = String(data.uid || doc.id || "");
      setHints(userId, normalizePhone(data.phone), String(data.name || ""));
    }

    for (const doc of invoiceSnapshot.docs) {
      const data = doc.data() as {
        userId?: string;
        userPhone?: string;
        userName?: string;
        customer?: { name?: string; phone?: string };
      };
      const userId = String(data.userId || "");
      const phone = normalizePhone(data.userPhone || data.customer?.phone || "");
      const name = String(data.customer?.name || data.userName || "");
      setHints(userId, phone, name);
    }

    for (const doc of paymentSnapshot.docs) {
      const data = doc.data() as { userId?: string; userPhone?: string; userName?: string };
      setHints(String(data.userId || ""), normalizePhone(data.userPhone || ""), String(data.userName || ""));
    }

    const scopedUids = Array.from(
      new Set(
        enrollmentSnapshot.docs
          .map((doc) => String((doc.data() as { userId?: string }).userId || ""))
          .filter(Boolean),
      ),
    );

    for (let index = 0; index < scopedUids.length; index += 100) {
      const chunk = scopedUids.slice(index, index + 100);
      const authUsers = await adminAuth.getUsers(chunk.map((uid) => ({ uid })));

      for (const userRecord of authUsers.users) {
        const userId = userRecord.uid;
        const phone = normalizePhone(userRecord.phoneNumber || "");
        const name = sanitizeName(userRecord.displayName || "");
        if (name) {
          setHints(userId, phone, name);
        }
      }
    }

    const enrollments: EnrollmentRow[] = enrollmentSnapshot.docs.map((item) => {
      const data = item.data() as Record<string, unknown>;
      const userId = String(data.userId || "");
      const phoneKey = normalizePhone(data.userPhone || "");
      const existingName = sanitizeName(data.userName);
      const resolvedName = existingName || nameByUserId.get(userId) || nameByPhone.get(phoneKey) || "";

      return {
        id: item.id,
        ...data,
        userName: resolvedName || String(data.userName || ""),
      };
    });

    let writeBatch = adminDb.batch();
    let writeCount = 0;

    async function flushBatch() {
      if (writeCount === 0) {
        return;
      }

      await writeBatch.commit();
      writeBatch = adminDb.batch();
      writeCount = 0;
    }

    for (const enrollment of enrollments) {
      const userId = String(enrollment.userId || "");
      const existingName = sanitizeName(enrollment.userName);
      if (!existingName) {
        continue;
      }

      writeBatch.set(
        adminDb.collection("enrollments").doc(String(enrollment.id)),
        { userName: existingName, updatedAt: new Date().toISOString() },
        { merge: true },
      );
      writeCount += 1;

      if (userId) {
        writeBatch.set(
          adminDb.collection("users").doc(userId),
          { uid: userId, name: existingName, updatedAt: new Date().toISOString() },
          { merge: true },
        );
        writeCount += 1;
      }

      if (writeCount >= 400) {
        await flushBatch();
      }
    }

    await flushBatch();

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

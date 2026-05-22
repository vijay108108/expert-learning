import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { captureServerEvent } from "@/lib/services/analytics";
import { pushLeadToAirtable } from "@/lib/services/airtable";
import { sendLeadEmails } from "@/lib/services/email";
import { leadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = leadSchema.parse(await request.json());
    const supabase = createSupabaseAdminClient();

    if (supabase) {
      const { error } = await supabase.from("leads").insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        course: body.course,
        message: body.message || "",
      });

      if (error) {
        throw new Error("Unable to save lead in Supabase.");
      }
    }

    await sendLeadEmails(body);

    const sideEffects = await Promise.allSettled([
      pushLeadToAirtable({
        name: body.name,
        email: body.email || "",
        phone: body.phone,
        course: body.course,
        message: body.message || "",
      }),
      captureServerEvent(body.email || body.phone, "lead_submitted", {
        course: body.course,
        source: body.source,
      }),
    ]);

    sideEffects.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error("[Lead API] non-blocking side effect failed", {
          target: index === 0 ? "airtable" : "analytics",
          error: result.reason,
          source: body.source,
          course: body.course,
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Your request has been submitted and emailed successfully.",
      mode: supabase ? "live" : "mock",
    });
  } catch (error) {
    console.error("[Lead API] submission failed", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields correctly before submitting.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit lead. Email delivery could not be completed.",
      },
      { status: 502 },
    );
  }
}

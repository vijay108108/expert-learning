import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function upsertStudent(payload: {
  name: string;
  email: string;
  phone: string;
}) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const normalizedEmail = payload.email.trim();
  const normalizedPhone = payload.phone.trim();

  const { data: existing } = await supabase
    .from("students")
    .select("id")
    .eq(normalizedEmail ? "email" : "phone", normalizedEmail || normalizedPhone)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("students")
      .update({
        name: payload.name,
        phone: normalizedPhone,
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
      })
      .eq("id", existing.id);

    return existing.id;
  }

  const { data, error } = await supabase
    .from("students")
    .insert({
      name: payload.name,
      email: normalizedEmail || null,
      phone: normalizedPhone,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error("Unable to create student record.");
  }

  return data.id;
}

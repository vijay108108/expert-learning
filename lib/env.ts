import { siteConfig } from "@/lib/site-config";

export const env = {
  nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url,
  nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  nextPublicSupabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  nextPublicRazorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFromEmail: process.env.RESEND_FROM_EMAIL || "Netseems Website <onboarding@resend.dev>",
  admissionsEmail: process.env.ADMISSIONS_EMAIL || siteConfig.email,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioWhatsappFrom: process.env.TWILIO_WHATSAPP_FROM || "",
  posthogKey: process.env.POSTHOG_KEY || "",
  posthogHost: process.env.POSTHOG_HOST || "https://app.posthog.com",
  airtableApiKey: process.env.AIRTABLE_API_KEY || "",
  airtableBaseId: process.env.AIRTABLE_BASE_ID || "",
  airtableTableName: process.env.AIRTABLE_TABLE_NAME || "Leads",
};

export const hasSupabaseEnv = Boolean(
  env.nextPublicSupabaseUrl && env.supabaseServiceRoleKey,
);

export const hasPublicSupabaseEnv = Boolean(
  env.nextPublicSupabaseUrl && env.nextPublicSupabaseAnonKey,
);

export const hasRazorpayEnv = Boolean(
  env.nextPublicRazorpayKeyId && env.razorpayKeySecret,
);

export const hasResendEnv = Boolean(env.resendApiKey);
export const hasTwilioEnv = Boolean(
  env.twilioAccountSid && env.twilioAuthToken && env.twilioWhatsappFrom,
);
export const hasPosthogEnv = Boolean(env.posthogKey);
export const hasAirtableEnv = Boolean(env.airtableApiKey && env.airtableBaseId);

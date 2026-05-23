import { siteConfig } from "@/lib/site-config";

function readEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function readBooleanEnvValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

export const env = {
  nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url,
  nextPublicFirebaseApiKey: readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  nextPublicFirebaseAuthDomain: readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  nextPublicFirebaseProjectId: readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  nextPublicFirebaseStorageBucket: readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  nextPublicFirebaseMessagingSenderId: readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  nextPublicFirebaseAppId: readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  nextPublicFirebaseMeasurementId: readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
  nextPublicFirebasePhoneAuthTestMode: readBooleanEnvValue(
    process.env.NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE,
  ),
  nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  nextPublicSupabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  nextPublicRazorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFromEmail: process.env.RESEND_FROM_EMAIL || "GenZNext <onboarding@resend.dev>",
  admissionsEmail: process.env.ADMISSIONS_EMAIL || siteConfig.admissionsEmail,
  gmailUser: process.env.GMAIL_USER || "",
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || "",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioWhatsappFrom: process.env.TWILIO_WHATSAPP_FROM || "",
  posthogKey: process.env.POSTHOG_KEY || "",
  posthogHost: process.env.POSTHOG_HOST || "https://app.posthog.com",
  airtableApiKey: process.env.AIRTABLE_API_KEY || "",
  airtableBaseId: process.env.AIRTABLE_BASE_ID || "",
  airtableTableName: process.env.AIRTABLE_TABLE_NAME || "Leads",
};

export const hasFirebaseEnv = Boolean(
  env.nextPublicFirebaseApiKey &&
    env.nextPublicFirebaseAuthDomain &&
    env.nextPublicFirebaseProjectId &&
    env.nextPublicFirebaseStorageBucket &&
    env.nextPublicFirebaseMessagingSenderId &&
    env.nextPublicFirebaseAppId,
);

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
export const hasGmailEmailEnv = Boolean(env.gmailUser && env.gmailAppPassword);
export const hasTwilioEnv = Boolean(
  env.twilioAccountSid && env.twilioAuthToken && env.twilioWhatsappFrom,
);
export const hasPosthogEnv = Boolean(env.posthogKey);
export const hasAirtableEnv = Boolean(env.airtableApiKey && env.airtableBaseId);

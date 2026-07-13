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

function readCsvEnvValues(value: string | undefined) {
  if (!value) {
    return [] as string[];
  }

  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function readFirstDefinedEnvValue(...values: Array<string | undefined>) {
  for (const value of values) {
    const normalized = readEnvValue(value);
    if (normalized) {
      return normalized;
    }
  }

  return undefined;
}

export const env = {
  nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url,
  nextPublicGaMeasurementId: readEnvValue(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    || readEnvValue(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)
    || "",
  nextPublicMetaPixelId: readEnvValue(process.env.NEXT_PUBLIC_META_PIXEL_ID) || "",
  nextPublicWorkshopWhatsappUrl: readEnvValue(process.env.NEXT_PUBLIC_WORKSHOP_WHATSAPP_URL) || "",
  nextPublicWorkshopMeetingUrl: readEnvValue(process.env.NEXT_PUBLIC_WORKSHOP_MEETING_URL) || "",
  nextPublicFirebaseApiKey: readFirstDefinedEnvValue(
    process.env.NEXT_PUBLIC_APP_FIREBASE_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  ),
  nextPublicFirebaseAuthDomain: readFirstDefinedEnvValue(
    process.env.NEXT_PUBLIC_APP_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  ),
  nextPublicFirebaseProjectId: readFirstDefinedEnvValue(
    process.env.NEXT_PUBLIC_APP_FIREBASE_PROJECT_ID,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  ),
  nextPublicFirebaseStorageBucket: readFirstDefinedEnvValue(
    process.env.NEXT_PUBLIC_APP_FIREBASE_STORAGE_BUCKET,
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  ),
  nextPublicFirebaseMessagingSenderId: readFirstDefinedEnvValue(
    process.env.NEXT_PUBLIC_APP_FIREBASE_MESSAGING_SENDER_ID,
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  ),
  nextPublicFirebaseAppId: readFirstDefinedEnvValue(
    process.env.NEXT_PUBLIC_APP_FIREBASE_APP_ID,
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ),
  nextPublicFirebaseMeasurementId: readFirstDefinedEnvValue(
    process.env.NEXT_PUBLIC_APP_FIREBASE_MEASUREMENT_ID,
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  ),
  nextPublicFirebasePhoneAuthTestMode: readBooleanEnvValue(
    process.env.NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE,
  ),
  firebaseServiceAccountKey:
    process.env.APP_FIREBASE_SERVICE_ACCOUNT_KEY
    || process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    || "",
  nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  nextPublicSupabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  nextPublicRazorpayKeyId: readEnvValue(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) || "",
  razorpayKeySecret: readEnvValue(process.env.RAZORPAY_KEY_SECRET) || "",
  razorpayWebhookSecret: readEnvValue(process.env.RAZORPAY_WEBHOOK_SECRET) || "",
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
  adminEmails:  readCsvEnvValues(process.env.ADMIN_EMAILS),
  adminPhones:  readCsvEnvValues(process.env.ADMIN_PHONES),
};

export const hasFirebaseEnv = Boolean(
  env.nextPublicFirebaseApiKey &&
    env.nextPublicFirebaseAuthDomain &&
    env.nextPublicFirebaseProjectId &&
    env.nextPublicFirebaseStorageBucket &&
    env.nextPublicFirebaseMessagingSenderId &&
    env.nextPublicFirebaseAppId,
);

export const hasFirebaseAdminEnv = Boolean(
  env.firebaseServiceAccountKey && env.nextPublicFirebaseProjectId,
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

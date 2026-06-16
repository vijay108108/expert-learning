import crypto from "node:crypto";
import Razorpay from "razorpay";
import { env, hasRazorpayEnv } from "@/lib/env";

let razorpayClient: Razorpay | null = null;

export function getRazorpayClient() {
  if (!hasRazorpayEnv) {
    return null;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: env.nextPublicRazorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }

  return razorpayClient;
}

export function verifyRazorpaySignature(payload: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  if (!env.razorpayKeySecret) {
    return false;
  }

  const generated = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${payload.orderId}|${payload.paymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(generated, "hex"), Buffer.from(payload.signature, "hex"));
  } catch {
    return false;
  }
}

export async function getRazorpayPaymentDetails(paymentId: string) {
  const razorpay = getRazorpayClient();

  if (!razorpay) {
    return null;
  }

  try {
    return await razorpay.payments.fetch(paymentId);
  } catch (error) {
    console.error("[Razorpay] Unable to fetch payment details", { paymentId, error });
    return null;
  }
}

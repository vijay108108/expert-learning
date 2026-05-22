import { z } from "zod";

const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const gstField = z
  .string()
  .trim()
  .optional()
  .default("")
  .transform((value) => value.toUpperCase())
  .refine((value) => !value || gstPattern.test(value), {
    message: "Invalid GST number format",
  });

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().or(z.literal("")).optional().default(""),
  phone: z.string().min(8),
  course: z.string().min(2),
  message: z.string().optional().default(""),
  source: z.string().min(2).optional().default("Website Inquiry"),
});

export const paymentCreateSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email().or(z.literal("")).optional().default(""),
    phone: z.string().min(8),
    courseSlug: z.string().min(2).optional(),
    courseSlugs: z.array(z.string().min(2)).min(1).optional(),
    gstNumber: gstField,
    companyName: z.string().trim().optional().default(""),
  })
  .refine((value) => Boolean(value.courseSlug || value.courseSlugs?.length), {
    message: "At least one course selection is required.",
  });

export const paymentVerifySchema = z
  .object({
    razorpay_order_id: z.string().min(2),
    razorpay_payment_id: z.string().min(2),
    razorpay_signature: z.string().min(2),
    courseSlug: z.string().min(2).optional(),
    courseSlugs: z.array(z.string().min(2)).min(1).optional(),
    name: z.string().min(2),
    email: z.string().email().or(z.literal("")).optional().default(""),
    phone: z.string().min(8),
    gstNumber: gstField,
    companyName: z.string().trim().optional().default(""),
  })
  .refine((value) => Boolean(value.courseSlug || value.courseSlugs?.length), {
    message: "At least one course selection is required.",
  });

export const enrollmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  courseSlug: z.string().min(2),
  amount: z.number().int().positive().optional(),
  paymentId: z.string().optional(),
  status: z.string().default("active"),
});

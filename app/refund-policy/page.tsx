import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Refund & Cancellation Policy | GenZNext Research & Training",
  description: "Refund and cancellation terms for courses and workshops purchased on GenZNext Research & Training.",
  path: "/refund-policy",
});

const lastUpdated = "13 July 2026";

export default function RefundPolicyPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">Refund &amp; Cancellation Policy</h1>
        <p className="mt-2 text-sm text-[#64748B]">Last updated: {lastUpdated}</p>

        <div className="prose-legal mt-8 space-y-8 text-[15px] leading-7 text-[#334155]">
          <p>
            This Refund &amp; Cancellation Policy applies to all courses, workshops, and programs purchased on{" "}
            {siteConfig.name}, operated by {siteConfig.legalName}. By enrolling, you agree to the terms below.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">1. Eligibility for Refund</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Refund requests must be raised within <strong>7 calendar days</strong> of the date of purchase, and before you have accessed more than one module or lesson of the paid course.</li>
              <li>Live workshops and cohort-based programs with a fixed start date are non-refundable once the session or cohort has commenced.</li>
              <li>Coupon-based or fully discounted (₹0) enrollments are not eligible for a cash refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">2. Non-Refundable Situations</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Requests made after the 7-day window or after significant course content has been accessed.</li>
              <li>Change of mind after a live workshop or cohort has started.</li>
              <li>Issues arising from the learner&apos;s own device, internet connectivity, or availability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">3. How to Request a Refund</h2>
            <p className="mt-3">
              Email <a href={`mailto:${siteConfig.supportEmail}`} className="text-brand-blue-light underline">{siteConfig.supportEmail}</a>{" "}
              with your registered phone number/email, the course name, and your invoice number. We may ask for
              additional details to verify your enrollment before processing a request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">4. Refund Processing</h2>
            <p className="mt-3">
              Approved refunds are processed to the original payment method via Razorpay within 7–10 business days
              of approval. Processing times beyond this may depend on your bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">5. Cancellations by GenZNext</h2>
            <p className="mt-3">
              If we cancel or indefinitely postpone a workshop, cohort, or course before it starts, you will
              receive a full refund or, at your option, a credit toward another program of equal or lesser value.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">6. Contact Us</h2>
            <p className="mt-3">
              {siteConfig.legalName}
              <br />
              {siteConfig.address}
              <br />
              Email: <a href={`mailto:${siteConfig.supportEmail}`} className="text-brand-blue-light underline">{siteConfig.supportEmail}</a>
              {" "}| Phone: <a href={`tel:${siteConfig.phone}`} className="text-brand-blue-light underline">{siteConfig.phone}</a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

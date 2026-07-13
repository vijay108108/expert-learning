import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Terms of Service | GenZNext Research & Training",
  description: "Terms and conditions governing use of the GenZNext Research & Training platform.",
  path: "/terms-of-service",
});

const lastUpdated = "13 July 2026";

export default function TermsOfServicePage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-[#64748B]">Last updated: {lastUpdated}</p>

        <div className="prose-legal mt-8 space-y-8 text-[15px] leading-7 text-[#334155]">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of {siteConfig.name}, operated by{" "}
            {siteConfig.legalName} (&ldquo;{siteConfig.company}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), including our website, learning
            dashboard, and any courses, workshops, or programs offered through it (the &ldquo;Platform&rdquo;). By creating an
            account, enrolling in a course, or otherwise using the Platform, you agree to these Terms.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">1. Eligibility and Account Registration</h2>
            <p className="mt-3">
              You must provide accurate registration information, including a valid mobile phone number, which we
              verify via one-time password (OTP) as our primary identity verification method. You are responsible
              for maintaining the confidentiality of your account credentials and for all activity under your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">2. Enrollment and Payments</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Course and workshop fees are as displayed on the Platform at the time of checkout, inclusive of any applicable taxes unless stated otherwise.</li>
              <li>Payments are processed securely through Razorpay. Enrollment is confirmed only after successful payment verification.</li>
              <li>Coupon codes, where applicable, are subject to their own eligibility terms and may be withdrawn or modified at our discretion.</li>
              <li>Invoices are issued electronically to the email/phone associated with your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">3. Access to Course Content</h2>
            <p className="mt-3">
              Access to paid course content, live sessions, and learning resources is granted only for courses you
              have successfully enrolled in and paid for (or received free access to via a valid coupon). Content
              is licensed for your personal, non-commercial learning use only and may not be shared, redistributed,
              downloaded in bulk, or resold.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">4. Refunds and Cancellations</h2>
            <p className="mt-3">
              Refund and cancellation terms are set out separately in our{" "}
              <a href="/refund-policy" className="text-brand-blue-light underline">Refund &amp; Cancellation Policy</a>,
              which forms part of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">5. Code of Conduct</h2>
            <p className="mt-3">
              You agree not to misuse the Platform, including attempting to access content you have not paid for,
              interfering with the security or integrity of the Platform, or engaging in abusive conduct toward
              staff, mentors, or other learners. We reserve the right to suspend or terminate accounts that violate
              these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">6. Intellectual Property</h2>
            <p className="mt-3">
              All course materials, videos, assessments, and platform content are the intellectual property of{" "}
              {siteConfig.legalName} or its licensors and are protected by applicable copyright and intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">7. Limitation of Liability</h2>
            <p className="mt-3">
              The Platform and its content are provided &ldquo;as is.&rdquo; To the maximum extent permitted by law, we are
              not liable for indirect, incidental, or consequential damages arising from your use of the Platform,
              including but not limited to loss of data, employment outcomes, or certification recognition by
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">8. Changes to These Terms</h2>
            <p className="mt-3">
              We may update these Terms from time to time. Continued use of the Platform after changes are posted
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">9. Governing Law</h2>
            <p className="mt-3">
              These Terms are governed by the laws of India, and any disputes will be subject to the exclusive
              jurisdiction of the courts in Pune, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">10. Contact Us</h2>
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

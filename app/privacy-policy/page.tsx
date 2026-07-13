import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Privacy Policy | GenZNext Research & Training",
  description: "How GenZNext Research & Training (Netseems Ventures Pvt Ltd) collects, uses, and protects your personal data.",
  path: "/privacy-policy",
});

const lastUpdated = "13 July 2026";

export default function PrivacyPolicyPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#0F172A] sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#64748B]">Last updated: {lastUpdated}</p>

        <div className="prose-legal mt-8 space-y-8 text-[15px] leading-7 text-[#334155]">
          <p>
            {siteConfig.legalName} (&ldquo;{siteConfig.company}&rdquo;, &ldquo;GenZNext&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates{" "}
            {siteConfig.name} and the associated website, learning dashboard, and admin systems (the &ldquo;Platform&rdquo;).
            This Privacy Policy explains what personal data we collect, why we collect it, and how it is used,
            stored, and protected when you use the Platform.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">1. Information We Collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong>Account and KYC data:</strong> full name, email address, and mobile phone number, verified via one-time password (OTP) through Firebase Authentication.</li>
              <li><strong>Payment data:</strong> billing name, company/GST details where provided, and transaction records processed through Razorpay. We do not store your card, UPI, or net-banking credentials — these are handled entirely by Razorpay.</li>
              <li><strong>Course and learning activity:</strong> enrollment records, lesson progress, quiz/assignment submissions, notes, and certificate data.</li>
              <li><strong>Communications:</strong> messages sent via contact forms, career applications, or WhatsApp/email support.</li>
              <li><strong>Usage data:</strong> pages visited, device/browser information, and analytics events, collected via cookies and analytics tools (e.g. Google Analytics, Meta Pixel, PostHog) where enabled.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">2. How We Use Your Information</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To verify your identity and secure your account (phone OTP is our primary KYC mechanism).</li>
              <li>To create and manage your enrollment, process payments, and issue invoices.</li>
              <li>To deliver course content, track progress, and issue certificates.</li>
              <li>To respond to support, admissions, and career enquiries.</li>
              <li>To send transactional communications (OTPs, payment confirmations, course updates) via email, SMS, or WhatsApp.</li>
              <li>To improve the Platform through aggregated, anonymized usage analytics.</li>
              <li>To comply with legal, tax, and regulatory obligations in India.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">3. How We Protect Your Information</h2>
            <p className="mt-3">
              Phone numbers are verified through Firebase Authentication before an account can transact on the
              Platform. Payment transactions are processed by Razorpay under PCI-DSS compliant infrastructure; we
              never see or store your full payment instrument details. Access to administrative systems is
              restricted to authorized personnel and protected by role-based access controls.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">4. Sharing of Information</h2>
            <p className="mt-3">
              We do not sell your personal data. We share data only with service providers necessary to operate
              the Platform — payment processing (Razorpay), authentication and data storage (Google Firebase),
              transactional email/SMS delivery (Resend, Twilio), and analytics providers — each bound by their own
              data protection obligations. We may disclose information where required by law, court order, or to
              protect the rights, safety, or property of GenZNext or its users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">5. Data Retention</h2>
            <p className="mt-3">
              We retain account, enrollment, and transaction records for as long as your account is active and
              thereafter as required to meet tax, accounting, and legal obligations under Indian law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">6. Your Rights</h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of your personal data by writing to us at{" "}
              <a href={`mailto:${siteConfig.supportEmail}`} className="text-brand-blue-light underline">{siteConfig.supportEmail}</a>.
              We will respond within a reasonable timeframe, subject to our legal and contractual obligations
              (for example, we may need to retain invoice records for statutory periods even after account
              deletion is requested).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">7. Cookies</h2>
            <p className="mt-3">
              We use cookies and similar technologies for authentication, session management, and analytics. You
              can control cookies through your browser settings; disabling them may affect Platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">8. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Material changes will be reflected by updating
              the &ldquo;Last updated&rdquo; date above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0F172A]">9. Contact Us</h2>
            <p className="mt-3">
              {siteConfig.legalName}
              <br />
              {siteConfig.address}
              <br />
              Email: <a href={`mailto:${siteConfig.supportEmail}`} className="text-brand-blue-light underline">{siteConfig.supportEmail}</a>
              {" "}| Phone: <a href={`tel:${siteConfig.phone}`} className="text-brand-blue-light underline">{siteConfig.phone}</a>
              <br />
              GSTIN: {siteConfig.gstNumber} | CIN: {siteConfig.cin}
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

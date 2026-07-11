import { ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { CourseCheckoutGuard } from "@/components/enroll/course-checkout-guard";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { getCheckoutOfferingBySlug } from "@/lib/offering-catalog";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export default async function CourseCheckoutPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = getCheckoutOfferingBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  return (
    <>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <aside className="surface-card p-5 sm:p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue-light/25 bg-brand-blue/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-blue-light">
              <span className="h-2 w-2 rounded-full bg-[#0B2E6B]" />
              {course.tagLabel}
            </div>
            <h2 className="mt-3 text-[28px] font-bold leading-tight text-brand-text">{course.title}</h2>
            <p className="mt-3 text-sm leading-7 text-brand-muted">{course.overview}</p>

            <div className="mt-5 rounded-[18px] border border-brand-blue-light/18 bg-brand-surface/80 p-4 sm:p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-blue-light">
                Course Summary
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="surface-form p-4">
                  <div className="form-label">Price</div>
                  <div className="mono-meta text-base text-brand-text">{course.price}</div>
                </div>
                <div className="surface-form p-4">
                  <div className="form-label">Duration</div>
                  <div className="mono-meta text-base text-brand-text">{course.duration}</div>
                </div>
                <div className="surface-form p-4">
                  <div className="form-label">Level</div>
                  <div className="mono-meta text-base text-brand-text">{course.level}</div>
                </div>
                <div className="surface-form p-4">
                  <div className="form-label">Badge</div>
                  <div className="mono-meta text-base text-brand-text">{course.highlight}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-emerald-400/15 bg-emerald-400/5 px-4 py-3 text-sm text-brand-muted">
              <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-300" />
              <p>Secure payment powered by Razorpay. Your enrollment details stay protected throughout checkout.</p>
            </div>
          </aside>

          <CourseCheckoutGuard courseSlug={course.slug}>
            <EnrollmentForm
              course={course}
              eyebrow="Enrollment Form"
              heading="Enter your details to continue"
              submitLabel="Proceed to Payment"
              compact
            />
          </CourseCheckoutGuard>
        </div>
      </section>
    </>
  );
}

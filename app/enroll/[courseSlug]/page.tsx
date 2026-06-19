import { notFound } from "next/navigation";
import { CourseEnrollmentAction } from "@/components/enroll/course-enrollment-action";
import { PageHero } from "@/components/ui/page-hero";
import { getMergedCourseBySlug } from "@/lib/firebase";
import { AzureSummerTrainingPage } from "@/sections/enroll/azure-summer-training-page";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export default async function EnrollPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = await getMergedCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  if (course.slug === "azure-administrator") {
    return <AzureSummerTrainingPage course={course} />;
  }

  return (
    <>
      <PageHero
        eyebrow="Program Details"
        title={course.title}
        description={course.subtitle}
        showCtas={false}
      />
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="surface-card p-6">
            <div className="section-label">Program Snapshot</div>
            <h2 className="mt-2 text-[26px] font-bold text-brand-text">{course.title}</h2>
            <p className="mt-4 text-sm leading-7 text-brand-muted">{course.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono-tag rounded-[4px] border border-brand-blue-light/25 bg-brand-blue/5 px-[10px] py-1 text-[11px] text-brand-blue-light"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="surface-form p-4">
                <div className="form-label">Duration</div>
                <div className="mono-meta text-sm text-brand-text">{course.duration}</div>
              </div>
              <div className="surface-form p-4">
                <div className="form-label">Level</div>
                <div className="mono-meta text-sm text-brand-text">{course.level}</div>
              </div>
              <div className="surface-form p-4">
                <div className="form-label">Rating</div>
                <div className="mono-meta text-sm text-brand-text">{course.rating}</div>
              </div>
            </div>
          </div>
          <aside className="surface-card flex h-full flex-col p-6">
            <div className="section-label">Enrollment</div>
            <h2 className="mt-2 text-[24px] font-bold text-brand-text">Start your checkout in one clean step</h2>
            <p className="mt-4 text-sm leading-7 text-brand-muted">
              Continue to a dedicated checkout page to enter your details and complete payment securely for this program.
            </p>
            <div className="mt-6 rounded-[16px] border border-brand-blue-light/18 bg-brand-surface/80 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-blue-light">
                Current Price
              </div>
              <div className="mt-2 text-[32px] font-bold leading-none tracking-[-0.04em] text-brand-text">
                {course.price}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="mono-tag rounded-[4px] border border-brand-blue-light/25 bg-brand-blue/5 px-[10px] py-1 text-[11px] text-brand-blue-light">
                  {course.tagLabel}
                </span>
                <span className="mono-tag rounded-[4px] border border-brand-blue-light/25 bg-brand-blue/5 px-[10px] py-1 text-[11px] text-brand-blue-light">
                  {course.certificate}
                </span>
              </div>
            </div>
            <CourseEnrollmentAction
              courseSlug={course.slug}
              checkoutButtonClassName="mt-6"
              enrolledButtonClassName="mt-6"
            />
          </aside>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import type { Course } from "@/data/courses";

type TrackLandingPageProps = {
  title: string;
  subtitle: string;
  overview: string;
  outcomes: string[];
  certifications: string[];
  faqs: Array<{ question: string; answer: string }>;
  courses: Course[];
  lmsPreviewLabel: string;
  ctaLabel: string;
  ctaHref: string;
};

export function TrackLandingPage({
  title,
  subtitle,
  overview,
  outcomes,
  certifications,
  faqs,
  courses,
  lmsPreviewLabel,
  ctaLabel,
  ctaHref,
}: TrackLandingPageProps) {
  const featured = courses.slice(0, 4);

  return (
    <section className="bg-[#0D1117] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.82)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B2E6B]">Learning Track</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#B7C3D9]">{subtitle}</p>
        </header>

        <article className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.78)] p-5">
          <h2 className="text-xl font-semibold">Track Overview</h2>
          <p className="mt-2 text-sm leading-7 text-[#B7C3D9]">{overview}</p>
        </article>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.78)] p-5">
            <h2 className="text-xl font-semibold">Learning Outcomes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#B7C3D9]">
              {outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.78)] p-5">
            <h2 className="text-xl font-semibold">Certification & Career Outcomes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#B7C3D9]">
              {certifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.78)] p-5">
          <h2 className="text-xl font-semibold">Featured Courses</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featured.map((course) => (
              <div key={course.slug} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-base font-semibold">{course.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#B7C3D9]">{course.shortDescription}</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#94A3B8]">
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.mode}</span>
                </div>
                <p className="mt-2 text-[11px] text-[#94A3B8]">Certification: {course.certification}</p>
                <p className="mt-1 text-[11px] text-[#94A3B8]">Project: {course.projects[0]}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {course.syllabusModules.slice(0, 3).map((module) => (
                    <span key={`${course.slug}-${module}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-[#B7C3D9]">
                      {module}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-3">
                  <Link href={`/checkout/${course.slug}`} className="inline-flex text-sm font-semibold text-[#0B2E6B]">
                    Enroll Now
                  </Link>
                  <Link href={`/lms/course/${course.slug}`} className="inline-flex text-sm font-semibold text-[#93C5FD]">
                    LMS Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.78)] p-5">
          <h2 className="text-xl font-semibold">LMS Learning Resources Preview</h2>
          <p className="mt-2 text-sm text-[#B7C3D9]">{lmsPreviewLabel}</p>
          <Link href="/lms/resources" className="mt-3 inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-[#D8E1F0]">
            Open LMS Resources
          </Link>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.78)] p-5">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-3 space-y-3">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <h3 className="text-sm font-semibold">{item.question}</h3>
                <p className="mt-1 text-sm text-[#B7C3D9]">{item.answer}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.86)] p-6 text-center">
          <h2 className="text-2xl font-semibold">Ready to start with {title}?</h2>
          <p className="mt-2 text-sm text-[#B7C3D9]">Talk to admissions and choose the right role-focused learning path.</p>
          <Link href={ctaHref} className="mt-4 inline-flex rounded-lg bg-[#0B2E6B] px-4 py-2.5 text-sm font-semibold text-white">
            {ctaLabel}
          </Link>
        </article>
      </div>
    </section>
  );
}

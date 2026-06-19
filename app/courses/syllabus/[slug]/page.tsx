import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Clock3, FolderKanban, GraduationCap, Layers, Star } from "lucide-react";
import { getMergedCourseBySlug } from "@/lib/firebase";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = await getMergedCourseBySlug(slug);

  if (!course) {
    return buildMetadata({
      title: "Course Syllabus | GenZNext",
      description: "Browse the course syllabus and learning modules.",
      path: `/courses/syllabus/${slug}`,
    });
  }

  return buildMetadata({
    title: `${course.title} Syllabus | GenZNext`,
    description: course.shortDescription,
    path: `/courses/syllabus/${course.slug}`,
  });
}

export default async function CourseSyllabusPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getMergedCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Course Syllabus"
        title={course.title}
        description={course.shortDescription}
        primaryCta={{ label: "Enroll Now", href: `/enroll/${course.slug}` }}
        secondaryCta={{ label: "Talk to Admissions", href: "/contact" }}
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.75fr]">

          {/* ── Main content ── */}
          <div className="space-y-8">

            {/* Overview */}
            <div className="surface-card p-6">
              <div className="section-label">Overview</div>
              <h2 className="mt-2 text-[22px] font-bold text-brand-text">{course.title}</h2>
              <p className="mt-3 text-sm leading-7 text-brand-muted">{course.overview}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[11px] font-medium text-[#475569]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Syllabus modules */}
            <div className="surface-card p-6">
              <div className="section-label">Syllabus &amp; Modules</div>
              <h2 className="mt-2 text-[20px] font-bold text-brand-text">What you&apos;ll learn, module by module</h2>
              <p className="mt-1 text-[12px] text-[#94A3B8]">Updated June 2026</p>
              <ol className="mt-5 space-y-4">
                {course.syllabusModules.map((module, index) => (
                  <li key={module} className="flex gap-3 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-[12px] font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium leading-6 text-[#1F2937]">{module}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Skills you'll learn */}
            <div className="surface-card p-6">
              <div className="section-label">Skills You&apos;ll Learn</div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {course.skillsYouWillLearn.map((skill) => (
                  <p key={skill} className="flex items-start gap-2 text-sm leading-6 text-[#374151]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4F46E5]" />
                    {skill}
                  </p>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="surface-card p-6">
              <div className="section-label">Hands-on Projects</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.projects.map((project) => (
                  <div key={project} className="flex items-start gap-2 rounded-[12px] border border-[#E2E8F0] bg-white p-3">
                    <FolderKanban className="mt-0.5 h-4 w-4 shrink-0 text-[#4F46E5]" />
                    <p className="text-sm leading-6 text-[#374151]">{project}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools covered */}
            <div className="surface-card p-6">
              <div className="section-label">Tools &amp; Technologies</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.toolsCovered.map((tool) => (
                  <span key={tool} className="rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-1.5 text-[12px] font-semibold text-[#4338CA]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="surface-card p-6">
              <div className="section-label">Frequently Asked Questions</div>
              <div className="mt-4 space-y-4">
                {course.faqs.map((faq) => (
                  <div key={faq.question} className="border-b border-[#F1F5F9] pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-[#0F172A]">{faq.question}</p>
                    <p className="mt-1.5 text-sm leading-6 text-[#64748B]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-24">
            <div className="surface-card p-6">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-sm font-semibold text-[#0F172A]">{course.rating}</span>
                <span className="text-[12px] text-[#94A3B8]">rating</span>
              </div>
              <p className="mt-4 text-[28px] font-bold tracking-[-0.03em] text-[#0F172A]">
                {course.price.replace("INR", "₹")}
              </p>
              {course.originalPrice !== course.price && (
                <p className="mt-0.5 text-sm text-[#94A3B8] line-through">
                  {course.originalPrice.replace("INR", "₹")}
                </p>
              )}
              <div className="mt-5 space-y-2.5 text-sm text-[#475569]">
                <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#4F46E5]" />{course.duration} · Self-Paced</p>
                <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[#4F46E5]" />{course.level}</p>
                <p className="flex items-center gap-2"><Layers className="h-4 w-4 text-[#4F46E5]" />{course.syllabusModules.length} Modules</p>
                <p className="flex items-center gap-2"><Award className="h-4 w-4 text-[#4F46E5]" />{course.certificate}</p>
              </div>
              <div className="mt-6 space-y-3">
                <Link
                  href={`/enroll/${course.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#9333EA,#4F46E5)] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.3)] transition hover:scale-[1.02]"
                >
                  Enroll Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#475569] transition hover:border-[#C7D2FE] hover:text-[#4F46E5]"
                >
                  Talk to Admissions
                </Link>
              </div>
            </div>

            <div className="surface-card mt-5 p-6">
              <div className="section-label">Who This Is For</div>
              <ul className="mt-3 space-y-2">
                {course.targetAudience.map((audience) => (
                  <li key={audience} className="flex items-start gap-2 text-sm leading-6 text-[#374151]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4F46E5]" />
                    {audience}
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card mt-5 p-6">
              <div className="section-label">Prerequisites</div>
              <ul className="mt-3 space-y-2">
                {course.prerequisites.map((pre) => (
                  <li key={pre} className="flex items-start gap-2 text-sm leading-6 text-[#374151]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                    {pre}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

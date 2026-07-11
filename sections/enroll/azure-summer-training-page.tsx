import { ShieldCheck } from "lucide-react";
import { AzureSummerEnrollmentFlow } from "@/components/enroll/azure-summer-enrollment-flow";
import { Reveal } from "@/components/ui/reveal";
import type { Course } from "@/data/courses";

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

export function AzureSummerTrainingPage({ course }: { course: Course }) {
  const savings = course.originalPriceValue - course.priceValue;
  const savingsLabel = formatPrice(savings);

  return (
    <section className="bg-[#F8FAFC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.32fr)_minmax(300px,0.68fr)] lg:items-start">
          <Reveal>
            <div className="rounded-[26px] border border-[#E5E7EB] bg-white px-6 py-6 shadow-[0_14px_34px_rgba(15,23,42,0.08)] sm:px-8 sm:py-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C8D7EE] bg-[#EAF0FA] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#092552]">
                <span className="h-2 w-2 rounded-full bg-[#0B2E6B]" />
                AZ-104 Summer Training 2026
              </div>

              <h1 className="mt-5 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-[#111827] sm:text-[40px] lg:text-[52px]">
                Azure Administrator Industrial Training
              </h1>

              <p className="mt-5 max-w-[68ch] text-[15px] leading-7 text-[#374151]">
                8-week Azure admin training with live labs, internship support, guided projects, mentor feedback, and certification preparation.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Live Labs", "Internship Support", "Project Based", "Certification Ready"].map((item) => (
                  <span key={item} className="inline-flex rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1 text-[11px] font-medium text-[#374151]">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2 text-[#0B2E6B]">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-semibold">Course Summary</span>
                </div>
                <div className="mt-4 grid gap-2.5 text-sm text-[#374151] sm:grid-cols-2">
                  <p><span className="text-[#6B7280]">Duration:</span> {course.duration}</p>
                  <p><span className="text-[#6B7280]">Level:</span> {course.level}</p>
                  <p><span className="text-[#6B7280]">Price:</span> {course.price}</p>
                  <p><span className="text-[#6B7280]">Saved:</span> {savingsLabel}</p>
                </div>
                <div className="mt-4 border-t border-[#E5E7EB] pt-3">
                  <a
                    href={course.officialSyllabusUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-[#0B2E6B] transition hover:text-[#092552] hover:underline"
                  >
                    Official Microsoft AZ-104 Syllabus
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <AzureSummerEnrollmentFlow course={course} savingsLabel={savingsLabel} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

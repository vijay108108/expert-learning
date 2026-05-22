import { ArrowRight } from "lucide-react";
import { DemoModalTrigger } from "@/components/demo/demo-modal-trigger";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { getHeroStats } from "@/lib/hero-stats";

const techPills = ["AWS", "Azure", "AI", "DevOps", "Python"];

export async function HeroSection() {
  const stats = await getHeroStats();

  return (
    <section className="relative overflow-hidden bg-[#111827] px-4 py-[52px] sm:px-6 lg:px-9 lg:pt-[52px] lg:pb-[56px]">
      <div
        className="pointer-events-none absolute top-[-60px] right-[-60px] h-[280px] w-[280px] rounded-full bg-[rgba(249,115,22,0.06)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-[540px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.18)] bg-[rgba(249,115,22,0.08)] px-3 py-1 text-[12px] text-[#FB923C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
              Shopping Cart
            </div>

            <h1 className="mt-5 max-w-[500px] text-[30px] font-semibold leading-[1.28] text-[#F1F5F9]">
              Choose the right Cloud, AI and DevOps path for your next{" "}
              <span className="text-[#F97316]">certification</span>.
            </h1>

            <p className="mt-4 max-w-[440px] text-[14px] leading-[1.7] text-[#64748B]">
              Explore industry-ready training programs, compare paths quickly, and move from interest to enrollment with a cleaner, faster learning experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {techPills.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-[rgba(249,115,22,0.28)] bg-[rgba(255,255,255,0.06)] px-[12px] py-[5px] text-[11px] text-[#E2E8F0] transition-all duration-150 ease-in-out hover:bg-[#F97316] hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink
                href="/courses"
                className="rounded-[8px] border-0 bg-[#F97316] px-[22px] py-[10px] text-[13px] font-medium text-white shadow-[0_14px_30px_rgba(249,115,22,0.18)] hover:bg-[#EA580C]"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>

              <DemoModalTrigger
                variant="secondary"
                className="rounded-[8px] border border-[rgba(255,255,255,0.12)] bg-transparent px-[22px] py-[10px] text-[13px] text-[#94A3B8] hover:border-[rgba(255,255,255,0.25)] hover:text-[#F1F5F9]"
                source="Homepage Hero Admissions"
                title="Talk to admissions"
                description="Share your preferred course and we will help you pick the right learning and certification path."
              >
                Talk to Admissions
              </DemoModalTrigger>
            </div>

            {stats ? (
              <div className="mt-9 border-t border-[rgba(255,255,255,0.06)] pt-7">
                <div className="flex flex-wrap gap-7">
                  {stats.map((item) => (
                    <div key={item.label}>
                      <div className="text-[20px] font-semibold text-[#F1F5F9]">{item.value}</div>
                      <div className="mt-1 text-[12px] text-[#475569]">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

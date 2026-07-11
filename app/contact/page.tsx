import { Mail, MapPin, PhoneCall } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = buildMetadata({
  title: "Contact Us | GenZNext Research & Training",
  description:
    "Contact GenZNext Research & Training for admissions, career consultation, corporate training, and program guidance.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="hero-home px-4 pt-14 pb-9 sm:px-6 sm:pt-16 sm:pb-10 lg:px-8 lg:pt-18 lg:pb-12">
        <div className="relative mx-auto max-w-7xl">
          <Reveal className="glass-panel-dark relative overflow-hidden rounded-[22px] px-5 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-[-78px] right-[-38px] h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(251,146,60,0.28)_0%,_rgba(251,146,60,0.10)_42%,_transparent_74%)] blur-2xl sm:h-60 sm:w-60" />
              <div className="absolute bottom-[-96px] left-[10%] h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.16)_0%,_rgba(59,130,246,0.04)_46%,_transparent_72%)] blur-2xl sm:h-56 sm:w-56" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_42%,rgba(251,146,60,0.06)_100%)]" />
            </div>
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-[14px] py-1 text-[11px] font-medium text-[#64748B]">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-bright" />
                Contact GenZNext
              </div>
              <h1 className="mt-4 max-w-[13ch] text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-[#0F172A] sm:text-[42px] lg:text-5xl">
                Connect with our admissions team
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#475569] sm:text-[17px] sm:leading-8 lg:text-lg">
                Whether you&apos;re exploring Cloud, AI, DevOps, or enterprise
                training, we&apos;ll help you choose the right path based on your
                goals, timeline, and current experience.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Reach Us"
              title="Prefer direct support?"
              description="Reach us via phone, email, or WhatsApp for quick answers and personalized guidance."
            />
            <div className="mt-8 space-y-4">
              {[
                { icon: PhoneCall, label: siteConfig.phone },
                { icon: Mail, label: siteConfig.email },
                { icon: MapPin, label: siteConfig.addressLines },
              ].map((item) => (
                <div key={Array.isArray(item.label) ? item.label.join(" | ") : item.label} className="surface-card rounded-[10px] p-4">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="pt-0.5 text-sm font-medium leading-6 text-brand-text">
                      {Array.isArray(item.label) ? (
                        item.label.map((line) => <div key={line}>{line}</div>)
                      ) : (
                        item.label
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="surface-form p-5 sm:p-7">
              <LeadForm
                includeMessage
                submitLabel="Book Free Career Consultation"
                source="Admissions Inquiry"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

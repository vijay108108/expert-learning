import { Mail, MapPin, PhoneCall } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = buildMetadata({
  title: "Contact Us | Expert Learning",
  description:
    "Contact Expert Learning for admissions, career consultation, corporate training, and program guidance.",
  path: "/contact",
});

const inputClassName =
  "h-12 rounded-2xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand-blue/40";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Talk to admissions, mentors, or our corporate learning team"
        description="Whether you are choosing your first certification or planning a team upskilling initiative, we are here to help."
      />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Reach Us"
              title="Prefer direct support?"
              description="Connect with our team through phone, email, or WhatsApp for quick answers and personalized guidance."
            />
            <div className="mt-8 space-y-4">
              {[
                { icon: PhoneCall, label: siteConfig.phone },
                { icon: Mail, label: siteConfig.email },
                { icon: MapPin, label: siteConfig.address },
              ].map((item) => (
                <div key={item.label} className="glass-panel flex items-center gap-4 rounded-[26px] border border-border p-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <form className="glass-panel grid gap-4 rounded-[32px] border border-border p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputClassName} type="text" placeholder="Name" />
                <input className={inputClassName} type="email" placeholder="Email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputClassName} type="tel" placeholder="Phone" />
                <select className={inputClassName} defaultValue="">
                  <option value="" disabled>
                    Interested Course
                  </option>
                  <option>AWS</option>
                  <option>Azure</option>
                  <option>AI & GenAI</option>
                  <option>DevOps</option>
                  <option>Corporate Training</option>
                </select>
              </div>
              <textarea
                className="min-h-36 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand-blue/40"
                placeholder="Tell us about your goal"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-blue to-brand-cyan text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                Get Free Career Consultation
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

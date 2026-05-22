import { Mail, MapPin, PhoneCall } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { PageHero } from "@/components/ui/page-hero";
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
      <PageHero
        eyebrow="Contact Us"
        title="Talk to admissions, mentors, or our corporate learning team"
        description="Whether you are choosing your first certification or planning a team upskilling initiative, we are here to help."
      />
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
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
                submitLabel="Get Free Career Consultation"
                source="Contact Form Inquiry"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

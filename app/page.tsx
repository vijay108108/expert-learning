import { CertificationSection } from "@/sections/home/certification-section";
import { FaqSection } from "@/sections/home/faq-section";
import { FeaturedCoursesSection } from "@/sections/home/featured-courses-section";
import { HeroSection } from "@/sections/home/hero-section";
import { JourneySection } from "@/sections/home/journey-section";
import { LeadCaptureSection } from "@/sections/home/lead-capture-section";
import { PartnersSection } from "@/sections/home/partners-section";
import { PricingSection } from "@/sections/home/pricing-section";
import { SuccessSection } from "@/sections/home/success-section";
import { WhyChooseSection } from "@/sections/home/why-choose-section";
import { getCourseListSchema, getFaqSchema, getOrganizationSchema } from "@/lib/schema";

export default function Home() {
  const schemas = [getOrganizationSchema(), getCourseListSchema(), getFaqSchema()];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <HeroSection />
      <FeaturedCoursesSection />
      <WhyChooseSection />
      <JourneySection />
      <SuccessSection />
      <PartnersSection />
      <CertificationSection />
      <PricingSection />
      <FaqSection />
      <LeadCaptureSection />
    </>
  );
}

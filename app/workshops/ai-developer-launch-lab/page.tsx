import { AiDeveloperLaunchLabPage } from "@/components/workshops/ai-developer-launch-lab-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Build, Launch & Host Your First AI-Generated Website on Azure | Live Workshop | GenZNext",
  description:
    "Join GenZNext Live Workshop on 18 July, 6 PM - 8 PM. Build an AI-generated website, provision Microsoft Azure VM, deploy live, and get recording + certificate. Reserve your seat for Rs. 99.",
  path: "/workshops/ai-developer-launch-lab",
});

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Build, Launch & Host Your First AI-Generated Website on Microsoft Azure",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  startDate: "2026-07-18T18:00:00+05:30",
  endDate: "2026-07-18T20:00:00+05:30",
  location: {
    "@type": "VirtualLocation",
    url: "https://www.genznext.com/workshops/ai-developer-launch-lab",
  },
  image: [
    "https://www.genznext.com/opengraph-image",
  ],
  description:
    "Learn how modern developers use AI to build websites, provision Microsoft Azure cloud servers and deploy applications in two hours.",
  offers: {
    "@type": "Offer",
    url: "https://www.genznext.com/workshops/ai-developer-launch-lab",
    price: "99",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    validFrom: "2026-07-12T00:00:00+05:30",
  },
  organizer: {
    "@type": "Organization",
    name: "GenZNext Research & Training",
    url: "https://www.genznext.com",
  },
};

export default function AiDeveloperLaunchLabWorkshopPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <AiDeveloperLaunchLabPage />
    </>
  );
}

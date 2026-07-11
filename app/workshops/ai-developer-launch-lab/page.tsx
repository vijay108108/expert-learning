import type { Metadata } from "next";
import { AiDeveloperLaunchLabPage } from "@/components/workshops/ai-developer-launch-lab-page";
import { getWorkshopConfigBySlug } from "@/lib/firebase";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const defaultWorkshopTitle = "AI Developer Launch Lab";
const defaultWorkshopStartIso = "2026-07-18T18:00:00+05:30";
const defaultWorkshopEndIso = "2026-07-18T20:00:00+05:30";
const workshopDescription = "Create AI-powered websites and deploy them live on Microsoft Azure in this hands-on workshop.";

async function getWorkshopSeoState() {
  try {
    const config = await getWorkshopConfigBySlug("ai-developer-launch-lab");
    return {
      title: config.title?.trim() || defaultWorkshopTitle,
      status: config.status || "published",
      startDate: config.startAtIso || defaultWorkshopStartIso,
      endDate: config.endAtIso || defaultWorkshopEndIso,
      config,
    };
  } catch {
    return {
      title: defaultWorkshopTitle,
      status: "published" as const,
      startDate: defaultWorkshopStartIso,
      endDate: defaultWorkshopEndIso,
      config: null,
    };
  }
}

function mapEventStatus(status: string) {
  if (status === "archived") {
    return "https://schema.org/EventCancelled";
  }

  if (status === "draft") {
    return "https://schema.org/EventPostponed";
  }

  return "https://schema.org/EventScheduled";
}

function mapOfferAvailability(status: string) {
  if (status === "archived") {
    return "https://schema.org/SoldOut";
  }

  if (status === "draft") {
    return "https://schema.org/PreOrder";
  }

  return "https://schema.org/InStock";
}

export async function generateMetadata(): Promise<Metadata> {
  const workshop = await getWorkshopSeoState();

  return buildMetadata({
    title: `${workshop.title} | GenZNext`,
    description: workshopDescription,
    path: "/workshops/ai-developer-launch-lab",
  });
}

export default async function AiDeveloperLaunchLabWorkshopPage() {
  const workshop = await getWorkshopSeoState();
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: workshop.title,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: mapEventStatus(workshop.status),
    startDate: workshop.startDate,
    endDate: workshop.endDate,
    location: {
      "@type": "VirtualLocation",
      url: `${siteConfig.url}/workshops/ai-developer-launch-lab`,
    },
    image: [`${siteConfig.url}/opengraph-image`],
    description: workshopDescription,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/workshops/ai-developer-launch-lab`,
      price: "99",
      priceCurrency: "INR",
      availability: mapOfferAvailability(workshop.status),
      validFrom: new Date().toISOString(),
    },
    organizer: {
      "@type": "Organization",
      name: "GenZNext Research & Training",
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <AiDeveloperLaunchLabPage initialWorkshopConfig={workshop.config} />
    </>
  );
}

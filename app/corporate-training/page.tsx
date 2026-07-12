import { buildMetadata } from "@/lib/metadata";
import { CorporateProgramsSection } from "@/components/corporate/corporate-programs-section";

export const metadata = buildMetadata({
  title: "Enterprise Builder Programs | GenZNext Research & Training",
  description:
    "Mission-led cloud, AI, and DevOps capability programs for enterprise teams building long-term technical strength.",
  path: "/corporate-training",
});

export default function CorporateTrainingPage() {
  return (
    <>
      <CorporateProgramsSection />
    </>
  );
}

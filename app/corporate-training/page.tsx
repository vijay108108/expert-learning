import { buildMetadata } from "@/lib/metadata";
import { CorporateProgramsSection } from "@/components/corporate/corporate-programs-section";

export const metadata = buildMetadata({
  title: "Corporate Training | GenZNext Research & Training",
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

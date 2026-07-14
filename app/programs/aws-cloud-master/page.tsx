import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Programs | GenZNext Research & Training",
  description: "Explore active cloud, DevOps, and AI programs at GenZNext.",
  path: "/programs/aws-cloud-master",
});

export default function AwsCloudMasterProgramPage() {
  redirect("/programs");
}

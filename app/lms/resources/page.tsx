import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "LMS | GenZNext Research & Training",
  description: "Continue your current learning programs.",
  path: "/lms/resources",
});

export default function LmsResourcesPage() {
  redirect("/lms/my-learning");
}

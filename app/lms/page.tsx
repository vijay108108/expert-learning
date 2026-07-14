import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "LMS Portal | GenZNext Research & Training",
  description:
    "Access your enrolled courses and workshops with progress tracking in the LMS portal.",
  path: "/lms",
});

export default function LmsPage() {
  redirect("/lms/my-learning");
}

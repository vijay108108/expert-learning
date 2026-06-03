import { AdminShell } from "@/components/admin/admin-shell";
import { PreviewCards } from "@/components/admin/preview-cards";
import { adminMockCourses, adminMockLessons, adminMockResources } from "@/data/admin-lms-mock";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin — LMS | GenZNext", description: "", path: "/admin/lms" });

export default function AdminLmsPage() {
  return (
    <AdminShell title="LMS Manager" subtitle="Manage modules, lessons, YouTube assets and resource metadata.">
      <PreviewCards courses={adminMockCourses} lessons={adminMockLessons} resources={adminMockResources} />
    </AdminShell>
  );
}

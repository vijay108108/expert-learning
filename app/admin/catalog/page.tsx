import { AdminShell } from "@/components/admin/admin-shell";
import { CatalogCourseManager } from "@/components/admin/catalog-course-manager";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Admin — Course Catalog | GenZNext",
  description: "Manage the public course catalog: pricing, syllabus, and content.",
  path: "/admin/catalog",
});

export default function AdminCatalogPage() {
  return (
    <AdminShell
      title="Course Catalog"
      subtitle="Manage pricing, syllabus modules, and content for every course shown on the public site."
    >
      <CatalogCourseManager />
    </AdminShell>
  );
}

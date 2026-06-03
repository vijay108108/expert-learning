import { AdminShell } from "@/components/admin/admin-shell";
import { CmsBlogManager } from "@/components/admin/cms-blog-manager";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "CMS — Blog Posts | GenZNext Admin", description: "", path: "/admin/cms/blog" });

export default function AdminCmsBlogPage() {
  return (
    <AdminShell title="Blog Posts" subtitle="Create, edit and publish blog articles.">
      <CmsBlogManager />
    </AdminShell>
  );
}

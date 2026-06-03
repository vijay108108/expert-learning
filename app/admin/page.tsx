import { AdminShell } from "@/components/admin/admin-shell";
import { AdminOverview } from "@/components/admin/admin-overview";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Admin — Overview | GenZNext",
  description: "Admin dashboard overview.",
  path: "/admin",
});

export default function AdminPage() {
  return (
    <AdminShell title="Overview" subtitle="Platform metrics and recent activity.">
      <AdminOverview />
    </AdminShell>
  );
}

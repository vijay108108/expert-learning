import { AdminShell } from "@/components/admin/admin-shell";
import { WorkshopConfigManager } from "@/components/admin/workshop-config-manager";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Admin - Workshops | GenZNext",
  description: "Manage workshop launch settings, links, seat capacity, and certificate template.",
  path: "/admin/workshops",
});

export default function AdminWorkshopsPage() {
  return (
    <AdminShell
      title="Workshops"
      subtitle="Configure workshop launch metadata, meeting links, seat limits, and certificate template."
    >
      <WorkshopConfigManager />
    </AdminShell>
  );
}

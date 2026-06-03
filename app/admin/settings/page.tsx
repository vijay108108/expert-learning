import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSettings } from "@/components/admin/admin-settings";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin — Settings | GenZNext", description: "", path: "/admin/settings" });

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="Site configuration, admin access and platform preferences.">
      <AdminSettings />
    </AdminShell>
  );
}

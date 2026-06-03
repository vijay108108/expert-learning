import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLeadsTable } from "@/components/admin/admin-leads-table";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin — Leads | GenZNext", description: "", path: "/admin/leads" });

export default function AdminLeadsPage() {
  return (
    <AdminShell title="Leads" subtitle="Manage and track all incoming admission enquiries.">
      <AdminLeadsTable />
    </AdminShell>
  );
}

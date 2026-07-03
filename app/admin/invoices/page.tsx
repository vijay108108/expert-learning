import { AdminInvoicesTable } from "@/components/admin/admin-invoices-table";
import { AdminShell } from "@/components/admin/admin-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin - Invoices | GenZNext", description: "", path: "/admin/invoices" });

export default function AdminInvoicesPage() {
  return (
    <AdminShell title="Invoices" subtitle="Review invoice history, export finance data and open detailed invoice records.">
      <AdminInvoicesTable />
    </AdminShell>
  );
}

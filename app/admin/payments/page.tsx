import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPaymentsTable } from "@/components/admin/admin-payments-table";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin — Payments | GenZNext", description: "", path: "/admin/payments" });

export default function AdminPaymentsPage() {
  return (
    <AdminShell title="Payments" subtitle="All Razorpay transactions and payment records.">
      <AdminPaymentsTable />
    </AdminShell>
  );
}

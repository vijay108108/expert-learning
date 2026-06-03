import { AdminShell } from "@/components/admin/admin-shell";
import { AdminEnrollmentsTable } from "@/components/admin/admin-enrollments-table";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin — Enrollments | GenZNext", description: "", path: "/admin/enrollments" });

export default function AdminEnrollmentsPage() {
  return (
    <AdminShell title="Enrollments" subtitle="All course and program enrollments across the platform.">
      <AdminEnrollmentsTable />
    </AdminShell>
  );
}

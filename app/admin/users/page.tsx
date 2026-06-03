import { AdminShell } from "@/components/admin/admin-shell";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin — Users | GenZNext", description: "", path: "/admin/users" });

export default function AdminUsersPage() {
  return (
    <AdminShell title="Users" subtitle="Manage learner accounts, roles and profiles.">
      <AdminUsersTable />
    </AdminShell>
  );
}

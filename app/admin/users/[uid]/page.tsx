import { AdminShell } from "@/components/admin/admin-shell";
import { AdminUserDetail } from "@/components/admin/admin-user-detail";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  return (
    <AdminShell title="User Details" subtitle="View enrollments, payments and invoice history for one learner.">
      <AdminUserDetail uid={uid} />
    </AdminShell>
  );
}

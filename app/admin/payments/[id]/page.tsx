import { AdminPaymentDetail } from "@/components/admin/admin-payment-detail";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminShell title="Payment Details" subtitle="Trace one payment record, learner details and invoice links.">
      <AdminPaymentDetail id={id} />
    </AdminShell>
  );
}

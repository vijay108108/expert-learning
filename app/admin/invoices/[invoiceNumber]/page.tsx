import { AdminInvoiceDetail } from "@/components/admin/admin-invoice-detail";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceNumber: string }>;
}) {
  const { invoiceNumber } = await params;

  return (
    <AdminShell title="Invoice Details" subtitle="Open invoice line items, customer details and export options.">
      <AdminInvoiceDetail invoiceNumber={decodeURIComponent(invoiceNumber)} />
    </AdminShell>
  );
}

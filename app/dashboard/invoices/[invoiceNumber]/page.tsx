import { InvoiceViewer } from "@/components/dashboard/invoice-viewer";

type DashboardInvoicePageProps = {
  params: Promise<{ invoiceNumber: string }>;
};

export default async function DashboardInvoicePage({ params }: DashboardInvoicePageProps) {
  const { invoiceNumber } = await params;

  return <InvoiceViewer invoiceNumber={decodeURIComponent(invoiceNumber)} />;
}

import { ProtectedRouteGuard } from "@/components/auth/protected-route-guard";
import { DashboardPanel } from "@/components/auth/dashboard-panel";

type DashboardPageProps = {
  searchParams: Promise<{
    payment?: string | string[];
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const paymentCompleted = Array.isArray(resolvedSearchParams.payment)
    ? resolvedSearchParams.payment.includes("success")
    : resolvedSearchParams.payment === "success";

  return (
    <ProtectedRouteGuard>
      <DashboardPanel paymentCompleted={paymentCompleted} />
    </ProtectedRouteGuard>
  );
}

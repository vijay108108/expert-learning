import { ProtectedRouteGuard } from "@/components/auth/protected-route-guard";
import { DashboardPanel } from "@/components/auth/dashboard-panel";

type CourseDashboardPageProps = {
  params: Promise<{
    courseId: string;
  }>;
  searchParams: Promise<{
    payment?: string | string[];
  }>;
};

export default async function CourseDashboardPage({ params, searchParams }: CourseDashboardPageProps) {
  const { courseId } = await params;
  const resolvedSearchParams = await searchParams;
  const paymentCompleted = Array.isArray(resolvedSearchParams.payment)
    ? resolvedSearchParams.payment.includes("success")
    : resolvedSearchParams.payment === "success";

  return (
    <ProtectedRouteGuard>
      <DashboardPanel initialCourseSlug={courseId} paymentCompleted={paymentCompleted} />
    </ProtectedRouteGuard>
  );
}

import { ProtectedRouteGuard } from "@/components/auth/protected-route-guard";
import { DashboardPanel } from "@/components/auth/dashboard-panel";

type CourseDashboardPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseDashboardPage({ params }: CourseDashboardPageProps) {
  const { courseId } = await params;

  return (
    <ProtectedRouteGuard>
      <DashboardPanel initialCourseSlug={courseId} />
    </ProtectedRouteGuard>
  );
}

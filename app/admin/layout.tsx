import { AdminRouteGuard } from "@/components/auth/admin-route-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRouteGuard>
      <div className="h-screen overflow-hidden">
        {children}
      </div>
    </AdminRouteGuard>
  );
}

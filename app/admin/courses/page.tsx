import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { FirebaseCourseManager } from "@/components/admin/firebase-course-manager";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin — Courses | GenZNext", description: "", path: "/admin/courses" });

export default function AdminCoursesPage() {
  return (
    <AdminShell
      title="Courses"
      subtitle="Create, edit and manage LMS course records in Firestore."
      actions={
        <Link href="/admin/courses/new" className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4338CA]">
          <Plus className="h-4 w-4" /> New Course
        </Link>
      }
    >
      <FirebaseCourseManager />
    </AdminShell>
  );
}

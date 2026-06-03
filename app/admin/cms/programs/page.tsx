import { AdminShell } from "@/components/admin/admin-shell";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata = buildMetadata({ title: "CMS — Programs | GenZNext Admin", description: "", path: "/admin/cms/programs" });

const programs = [
  { title: "Microsoft Cloud & AI DevOps Master",  href: "/programs/microsoft-cloud-ai-devops-master", edit: "/admin/lms" },
  { title: "AI & Generative AI Master",            href: "/programs/ai-generative-ai-master",          edit: "/admin/lms" },
  { title: "AWS Cloud Master",                     href: "/programs/aws-cloud-master",                 edit: "/admin/lms" },
  { title: "Microsoft Cloud Master",               href: "/programs/microsoft-cloud-master",           edit: "/admin/lms" },
  { title: "DevOps Master",                        href: "/programs/devops-master",                    edit: "/admin/lms" },
];

export default function AdminCmsProgramsPage() {
  return (
    <AdminShell title="Programs (CMS)" subtitle="Manage program content. Edit page data in the source files under /app/programs/.">
      <div className="space-y-3">
        <div className="rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/8 px-4 py-3 text-[13px] text-[#F59E0B]">
          Program content is stored in code (<code className="font-mono text-[12px]">/app/programs/*/page.tsx</code>). Edit the data objects to update syllabus, pricing and content. Use the links below to preview each program page.
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
              <p className="text-[14px] font-semibold text-white">{p.title}</p>
              <div className="mt-4 flex gap-2">
                <Link href={p.href} target="_blank"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-[#64748B] hover:text-white">
                  <ExternalLink className="h-3.5 w-3.5" /> Preview
                </Link>
                <Link href={p.edit}
                  className="flex items-center gap-1.5 rounded-xl bg-[#4F46E5]/20 px-3 py-2 text-[12px] font-semibold text-[#818CF8] hover:bg-[#4F46E5]/30">
                  Manage LMS →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

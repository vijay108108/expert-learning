import Link from "next/link";
import { lmsResourceLibrary } from "@/data/lms-portal-mock";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "LMS Resources | GenZNext Research & Training",
  description:
    "Browse LMS resource library including PDFs, notes, assignments, certification guides, and official links.",
  path: "/lms/resources",
});

export default function LmsResourcesPage() {
  const groups = [
    { key: "youtube", label: "YouTube Lessons" },
    { key: "official-docs", label: "Official Docs" },
    { key: "pdf-notes", label: "PDF Notes" },
    { key: "assignments", label: "Assignments" },
    { key: "certification-guides", label: "Certification Guides" },
  ] as const;

  return (
    <section className="bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-semibold">Resource Library</h1>
          <p className="mt-2 text-sm text-[#475569]">
            Access course PDFs, notes, assignments, certification guides, and trusted official learning references.
          </p>
        </header>
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((group) => (
            <article key={group.key} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold">{group.label}</h2>
              <div className="mt-3 space-y-2">
                {lmsResourceLibrary[group.key].length ? (
                  lmsResourceLibrary[group.key].map((item) =>
                    group.key === "official-docs" || group.key === "youtube" ? (
                      <a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#0F172A] transition hover:border-[#0B2E6B]/30 hover:bg-white"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link key={item.id} href={item.href} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#0F172A] transition hover:bg-white">
                        <span>{item.title}</span>
                        <span className="text-xs text-[#64748B]">{item.source}</span>
                      </Link>
                    ),
                  )
                ) : (
                  <p className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-4 text-sm text-[#64748B]">
                    No resources added yet for this section.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

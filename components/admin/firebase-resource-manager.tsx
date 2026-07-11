"use client";

import { useEffect, useState } from "react";
import { createResource, deleteResource, listResourcesByCourse, updateResource, type FirestoreResource } from "@/lib/firebase";

export function FirebaseResourceManager() {
  const [courseSlug, setCourseSlug] = useState("azure-administrator");
  const [resources, setResources] = useState<Array<FirestoreResource & { id: string }>>([]);
  const [form, setForm] = useState<FirestoreResource>({
    courseSlug: "",
    title: "",
    description: "",
    resourceType: "official-docs",
    source: "",
    url: "",
    locked: false,
    status: "draft",
  });

  async function load() {
    const next = await listResourcesByCourse(courseSlug);
    setResources(next as Array<FirestoreResource & { id: string }>);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await listResourcesByCourse(courseSlug);
      if (!cancelled) {
        setResources(next as Array<FirestoreResource & { id: string }>);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)] p-5">
        <input value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} placeholder="Course slug" className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
      </div>
      <form onSubmit={async (e) => {
        e.preventDefault();
        await createResource({ ...form, courseSlug });
        setForm({ courseSlug: "", title: "", description: "", resourceType: "official-docs", source: "", url: "", locked: false, status: "draft" });
        await load();
      }} className="grid gap-3 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)] p-5 sm:grid-cols-3">
        <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} placeholder="Title" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
        <input value={form.resourceType} onChange={(e) => setForm((c) => ({ ...c, resourceType: e.target.value as FirestoreResource["resourceType"] }))} placeholder="Type" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        <input value={form.source} onChange={(e) => setForm((c) => ({ ...c, source: e.target.value }))} placeholder="Provider/source" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        <input value={form.url} onChange={(e) => setForm((c) => ({ ...c, url: e.target.value }))} placeholder="URL" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
        <input value={form.description} onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} placeholder="Description" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white sm:col-span-2" />
        <button type="submit" className="rounded-md bg-[#0B2E6B] px-4 py-2 text-sm font-semibold text-white sm:col-span-3">Add Resource</button>
      </form>
      <div className="space-y-2 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)] p-5">
        {resources.map((resource) => (
          <article key={resource.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-medium text-white">{resource.title}</p>
            <p className="mt-1 text-xs text-[#94A3B8]">{resource.resourceType} • {resource.source}</p>
            <a href={resource.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-xs text-[#0B2E6B]">{resource.url}</a>
            <div className="mt-2 flex gap-3 text-xs">
              <button type="button" onClick={async () => { await updateResource(resource.id, { locked: !resource.locked }); await load(); }} className="text-[#0B2E6B]">{resource.locked ? "Unlock" : "Lock"}</button>
              <button type="button" onClick={async () => { await deleteResource(resource.id); await load(); }} className="text-rose-400">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

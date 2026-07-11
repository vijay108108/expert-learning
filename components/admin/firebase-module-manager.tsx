"use client";

import { useEffect, useState } from "react";
import { createModule, deleteModule, listCourses, listModulesByCourse, updateModule, type FirestoreModule } from "@/lib/firebase";

export function FirebaseModuleManager() {
  const [courseSlug, setCourseSlug] = useState("");
  const [courses, setCourses] = useState<Array<{ slug: string; title: string }>>([]);
  const [modules, setModules] = useState<Array<FirestoreModule & { id: string }>>([]);
  const [form, setForm] = useState<FirestoreModule>({ courseSlug: "", title: "", description: "", order: 1, status: "draft" });

  async function loadModules(slug: string) {
    if (!slug) return;
    const next = await listModulesByCourse(slug);
    setModules(next as Array<FirestoreModule & { id: string }>);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await listCourses();
      const list = (next as Array<{ slug: string; title: string }>).map((c) => ({ slug: c.slug, title: c.title }));
      if (cancelled) return;
      setCourses(list);
      if (!courseSlug && list[0]?.slug) {
        setCourseSlug(list[0].slug);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!courseSlug) return;
      const next = await listModulesByCourse(courseSlug);
      if (!cancelled) {
        setModules(next as Array<FirestoreModule & { id: string }>);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)] p-5">
        <label className="text-sm text-[#D8E1F0]">Course</label>
        <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
          {courses.map((course) => <option key={course.slug} value={course.slug}>{course.title}</option>)}
        </select>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createModule({ ...form, courseSlug });
          setForm({ courseSlug: "", title: "", description: "", order: 1, status: "draft" });
          await loadModules(courseSlug);
        }}
        className="grid gap-3 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)] p-5 sm:grid-cols-4"
      >
        <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} placeholder="Module title" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
        <input value={form.description} onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} placeholder="Description" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
        <input type="number" value={form.order} onChange={(e) => setForm((c) => ({ ...c, order: Number(e.target.value) }))} placeholder="Order" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        <button type="submit" className="rounded-md bg-[#0B2E6B] px-4 py-2 text-sm font-semibold text-white">Add Module</button>
      </form>
      <div className="space-y-2 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)] p-5">
        {modules.map((module) => (
          <article key={module.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-medium text-white">{module.order}. {module.title}</p>
            <p className="mt-1 text-xs text-[#94A3B8]">{module.description}</p>
            <div className="mt-2 flex gap-3 text-xs">
              <button type="button" onClick={async () => { await updateModule(module.id, { status: module.status === "published" ? "draft" : "published" }); await loadModules(courseSlug); }} className="text-[#0B2E6B]">Toggle Status</button>
              <button type="button" onClick={async () => { await deleteModule(module.id); await loadModules(courseSlug); }} className="text-rose-400">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

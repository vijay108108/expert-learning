"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  createCourse,
  deleteCourse,
  listCourses,
  updateCourse,
  type FirestoreCourse,
} from "@/lib/firebase";

const initialForm: FirestoreCourse = {
  slug: "",
  title: "",
  track: "ai",
  category: "ai",
  level: "Beginner",
  mode: "recorded",
  certification: "",
  duration: "",
  shortDescription: "",
  longDescription: "",
  status: "draft",
};

export function FirebaseCourseManager() {
  const [courses, setCourses] = useState<Array<FirestoreCourse & { id: string }>>([]);
  const [form, setForm] = useState<FirestoreCourse>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const next = await listCourses();
    setCourses(next as Array<FirestoreCourse & { id: string }>);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await listCourses();
      if (!cancelled) {
        setCourses(next as Array<FirestoreCourse & { id: string }>);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (editingId) {
      await updateCourse(editingId, form);
      setEditingId(null);
    } else {
      await createCourse(form);
    }
    setForm(initialForm);
    await load();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)] p-5">
        <h2 className="text-lg font-semibold text-white">{editingId ? "Edit Course" : "Create Course"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} placeholder="Title" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
          <input value={form.slug} onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))} placeholder="Slug" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <input value={form.track} onChange={(e) => setForm((c) => ({ ...c, track: e.target.value }))} placeholder="Track" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
          <input value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))} placeholder="Category" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" required />
          <input value={form.certification} onChange={(e) => setForm((c) => ({ ...c, certification: e.target.value }))} placeholder="Certification" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <input value={form.level} onChange={(e) => setForm((c) => ({ ...c, level: e.target.value as FirestoreCourse["level"] }))} placeholder="Level" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={form.mode} onChange={(e) => setForm((c) => ({ ...c, mode: e.target.value as FirestoreCourse["mode"] }))} placeholder="Mode" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={form.duration} onChange={(e) => setForm((c) => ({ ...c, duration: e.target.value }))} placeholder="Duration" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        </div>
        <input value={form.shortDescription} onChange={(e) => setForm((c) => ({ ...c, shortDescription: e.target.value }))} placeholder="Short description" className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        <textarea value={form.longDescription} onChange={(e) => setForm((c) => ({ ...c, longDescription: e.target.value }))} placeholder="Long description" className="min-h-24 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
        <button type="submit" className="rounded-md bg-[#0B2E6B] px-4 py-2 text-sm font-semibold text-white">{editingId ? "Update" : "Create"}</button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.8)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-[#94A3B8]">
            <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Track</th><th className="px-4 py-3">Action</th></tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-white/5 text-[#D8E1F0]">
                <td className="px-4 py-3">{course.title}</td>
                <td className="px-4 py-3">{course.track}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setEditingId(course.id); setForm(course); }} className="text-[#0B2E6B]">Edit</button>
                    <button type="button" onClick={async () => { await deleteCourse(course.id); await load(); }} className="text-rose-400">Delete</button>
                    <Link href={`/courses/${course.category}`} className="text-cyan-300">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

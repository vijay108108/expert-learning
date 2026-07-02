"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Course, CourseCategoryKey, CourseMode, CourseTrackKey } from "@/data/courses";
import {
  deleteCatalogCourse,
  getMergedCourses,
  hideCatalogCourse,
  listCatalogOverrides,
  restoreCatalogCourse,
  upsertCatalogCourse,
} from "@/lib/firebase";

type EditableCourse = Course & { __isOverridden?: boolean; __isNew?: boolean; __hidden?: boolean };

const trackOptions: CourseTrackKey[] = [
  "ai",
  "generative-ai",
  "agentic-ai",
  "devsecops",
  "aws-certifications",
  "azure-certifications",
];

const categoryOptions: CourseCategoryKey[] = ["aws", "azure", "ai", "devops"];
const levelOptions: Course["level"][] = ["Beginner", "Intermediate", "Advanced"];
const modeOptions: CourseMode[] = ["self-paced", "live", "recorded", "hybrid"];

function linesToArray(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(arr: string[] | undefined) {
  return (arr ?? []).join("\n");
}

function emptyForm(): Course {
  return {
    title: "",
    slug: "",
    track: "ai",
    category: "ai",
    shortDescription: "",
    longDescription: "",
    level: "Beginner",
    duration: "",
    mode: "self-paced",
    priceType: "one-time",
    certification: "",
    toolsCovered: [],
    skillsYouWillLearn: [],
    learningOutcomes: [],
    targetAudience: [],
    prerequisites: [],
    syllabusModules: [],
    projects: [],
    officialResources: [],
    youtubeLessons: [],
    lmsResources: [],
    faqs: [],
    subtitle: "",
    overview: "",
    rating: 4.7,
    priceValue: 8999,
    originalPriceValue: 12999,
    price: "INR 8,999",
    originalPrice: "INR 12,999",
    highlight: "",
    tagLabel: "",
    tagTone: "blue",
    certificate: "",
    icon: "sparkles",
    tags: [],
    officialSyllabusUrl: "",
    roadmap: [],
    outcomes: [],
  };
}

export function CatalogCourseManager() {
  const [courses, setCourses] = useState<EditableCourse[]>([]);
  const [overriddenSlugs, setOverriddenSlugs] = useState<Set<string>>(new Set());
  const [hiddenSlugs, setHiddenSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<Course>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [merged, overrides] = await Promise.all([getMergedCourses(), listCatalogOverrides()]);
      const overriddenSet = new Set(Object.keys(overrides).filter((slug) => !overrides[slug].hidden));
      const hiddenSet = new Set(Object.keys(overrides).filter((slug) => overrides[slug].hidden));
      setOverriddenSlugs(overriddenSet);
      setHiddenSlugs(hiddenSet);
      setCourses(merged);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || c.category.toLowerCase().includes(q),
    );
  }, [courses, search]);

  function openCreate() {
    setForm(emptyForm());
    setEditingSlug(null);
    setShowForm(true);
  }

  function openEdit(course: Course) {
    setForm(course);
    setEditingSlug(course.slug);
    setShowForm(true);
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form.slug.trim() || !form.title.trim()) return;

    setSaving(true);
    try {
      const isNew = !editingSlug;
      await upsertCatalogCourse(form.slug.trim(), form, { isNew });
      setShowForm(false);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save course.");
    } finally {
      setSaving(false);
    }
  }

  async function onHide(slug: string) {
    if (!confirm(`Hide "${slug}" from the public catalog? This can be restored later.`)) return;
    await hideCatalogCourse(slug);
    await load();
  }

  async function onRestore(slug: string) {
    await restoreCatalogCourse(slug);
    await load();
  }

  async function onDeleteNew(slug: string) {
    if (!confirm(`Permanently delete "${slug}"? This cannot be undone.`)) return;
    await deleteCatalogCourse(slug);
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading course catalog...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="h-9 w-64 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-[#475569] outline-none focus:border-[#4F46E5]"
        />
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4338CA]"
        >
          <Plus className="h-4 w-4" /> New Course
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[11px] uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Level</th>
              <th className="px-4 py-2.5">Price</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((course) => {
              const isOverridden = overriddenSlugs.has(course.slug);
              return (
                <tr key={course.slug} className="text-[#CBD5E1]">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-white">{course.title}</div>
                    <div className="text-[11px] text-[#64748B]">{course.slug}</div>
                  </td>
                  <td className="px-4 py-2.5 uppercase text-[12px]">{course.category}</td>
                  <td className="px-4 py-2.5 text-[12px]">{course.level}</td>
                  <td className="px-4 py-2.5 text-[12px]">{course.price.replace("INR", "₹")}</td>
                  <td className="px-4 py-2.5 text-[12px]">
                    {isOverridden ? (
                      <span className="rounded-full bg-[#4F46E5]/20 px-2 py-0.5 text-[#818CF8]">Customized</span>
                    ) : (
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[#64748B]">Default</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(course)} className="rounded-lg p-1.5 text-[#64748B] hover:bg-white/5 hover:text-white" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => void onHide(course.slug)} className="rounded-lg p-1.5 text-[#64748B] hover:bg-white/5 hover:text-amber-400" title="Hide from catalog">
                        <EyeOff className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#475569]">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hiddenSlugs.size > 0 && (
        <div className="rounded-xl border border-white/10 p-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">Hidden Courses</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(hiddenSlugs).map((slug) => (
              <span key={slug} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-[#94A3B8]">
                {slug}
                <button onClick={() => void onRestore(slug)} className="text-[#4F46E5] hover:text-[#818CF8]" title="Restore">
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => void onDeleteNew(slug)} className="text-[#EF4444] hover:text-red-400" title="Delete permanently">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0D1117] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editingSlug ? "Edit Course" : "New Course"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#64748B] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSave} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title">
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} required />
                </Field>
                <Field label="Slug (unique, no spaces)">
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                    className={inputClass}
                    disabled={Boolean(editingSlug)}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Category">
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as CourseCategoryKey }))} className={inputClass}>
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Track">
                  <select value={form.track} onChange={(e) => setForm((f) => ({ ...f, track: e.target.value as CourseTrackKey }))} className={inputClass}>
                    {trackOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Level">
                  <select
                    value={form.level}
                    onChange={(e) => {
                      const level = e.target.value as Course["level"];
                      const priceByLevel = { Beginner: 8999, Intermediate: 12999, Advanced: 18999 }[level];
                      setForm((f) => ({ ...f, level, priceValue: priceByLevel, originalPriceValue: priceByLevel + 4000 }));
                    }}
                    className={inputClass}
                  >
                    {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Mode">
                  <select value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value as CourseMode }))} className={inputClass}>
                    {modeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Duration">
                  <input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 6 Weeks" className={inputClass} />
                </Field>
                <Field label="Price (INR)">
                  <input
                    type="number"
                    value={form.priceValue}
                    onChange={(e) => setForm((f) => ({ ...f, priceValue: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Original Price (INR)">
                  <input
                    type="number"
                    value={form.originalPriceValue}
                    onChange={(e) => setForm((f) => ({ ...f, originalPriceValue: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Short Description">
                <input value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} className={inputClass} />
              </Field>

              <Field label="Long Description / Overview">
                <textarea value={form.longDescription} onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))} className={`${inputClass} h-20`} />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Certification / Credential Name">
                  <input value={form.certification} onChange={(e) => setForm((f) => ({ ...f, certification: e.target.value }))} className={inputClass} />
                </Field>
                <Field label="Certificate (on completion)">
                  <input value={form.certificate} onChange={(e) => setForm((f) => ({ ...f, certificate: e.target.value }))} className={inputClass} />
                </Field>
              </div>

              <Field label="Tags (comma separated)">
                <input
                  value={form.tags.join(", ")}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                  className={inputClass}
                />
              </Field>

              <Field label="Tools Covered (comma separated)">
                <input
                  value={form.toolsCovered.join(", ")}
                  onChange={(e) => setForm((f) => ({ ...f, toolsCovered: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                  className={inputClass}
                />
              </Field>

              <Field label="Syllabus Modules (one per line)">
                <textarea
                  value={arrayToLines(form.syllabusModules)}
                  onChange={(e) => setForm((f) => ({ ...f, syllabusModules: linesToArray(e.target.value) }))}
                  className={`${inputClass} h-32 font-mono text-[12px]`}
                  placeholder={"Module 1: ...\nModule 2: ..."}
                />
              </Field>

              <Field label="Skills You'll Learn (one per line)">
                <textarea
                  value={arrayToLines(form.skillsYouWillLearn)}
                  onChange={(e) => setForm((f) => ({ ...f, skillsYouWillLearn: linesToArray(e.target.value) }))}
                  className={`${inputClass} h-20`}
                />
              </Field>

              <Field label="Projects (one per line)">
                <textarea
                  value={arrayToLines(form.projects)}
                  onChange={(e) => setForm((f) => ({ ...f, projects: linesToArray(e.target.value) }))}
                  className={`${inputClass} h-20`}
                />
              </Field>

              <Field label="Target Audience (one per line)">
                <textarea
                  value={arrayToLines(form.targetAudience)}
                  onChange={(e) => setForm((f) => ({ ...f, targetAudience: linesToArray(e.target.value) }))}
                  className={`${inputClass} h-16`}
                />
              </Field>

              <Field label="Prerequisites (one per line)">
                <textarea
                  value={arrayToLines(form.prerequisites)}
                  onChange={(e) => setForm((f) => ({ ...f, prerequisites: linesToArray(e.target.value) }))}
                  className={`${inputClass} h-16`}
                />
              </Field>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#94A3B8] hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingSlug ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-[#64748B]">{label}</span>
      {children}
    </label>
  );
}

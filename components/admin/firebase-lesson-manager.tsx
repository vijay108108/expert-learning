"use client";

import { useEffect, useState } from "react";
import {
  Edit2, ExternalLink, Lock, Plus, RefreshCw,
  Trash2, Unlock, Video, FileText, Radio, BookOpen, X, Save,
} from "lucide-react";
import {
  createLesson, deleteLesson, listCourses,
  listLessonsByCourse, listModulesByCourse,
  updateLesson, type FirestoreLesson,
} from "@/lib/firebase";

type Lesson = FirestoreLesson & { id: string };
type LessonForm = FirestoreLesson & { scheduledAt?: string };

const LESSON_TYPES: Array<{ value: FirestoreLesson["lessonType"]; label: string; icon: React.ElementType; color: string }> = [
  { value: "live",     label: "Live Class",      icon: Radio,     color: "text-[#EF4444]" },
  { value: "youtube",  label: "Recorded Video",  icon: Video,     color: "text-[#FF0000]" },
  { value: "pdf",      label: "PDF / Notes",     icon: FileText,  color: "text-[#3B82F6]" },
  { value: "lab",      label: "Practice Lab",    icon: BookOpen,  color: "text-[#10B981]" },
  { value: "quiz",     label: "Quiz",            icon: BookOpen,  color: "text-[#F59E0B]" },
];

const emptyForm: LessonForm = {
  courseSlug:  "",
  moduleId:    "",
  title:       "",
  description: "",
  order:       1,
  lessonType:  "youtube",
  url:         "",
  duration:    "",
  locked:      false,
  status:      "draft",
};

export function FirebaseLessonManager() {
  const [courses,    setCourses]    = useState<Array<{ slug: string; title: string }>>([]);
  const [courseSlug, setCourseSlug] = useState("");
  const [modules,    setModules]    = useState<Array<{ id: string; title: string }>>([]);
  const [moduleId,   setModuleId]   = useState("");
  const [lessons,    setLessons]    = useState<Lesson[]>([]);
  const [form,       setForm]       = useState<LessonForm>(emptyForm);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [showForm,   setShowForm]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  /* Load courses on mount */
  useEffect(() => {
    void (async () => {
      try {
        const list = (await listCourses()) as Array<{ slug: string; title: string }>;
        setCourses(list);
        if (list[0]?.slug) setCourseSlug(list[0].slug);
      } catch { /* ignore */ }
    })();
  }, []);

  /* Load modules + lessons when course changes */
  useEffect(() => {
    if (!courseSlug) return;
    let active = true;
    void (async () => {
      try {
        const mods = (await listModulesByCourse(courseSlug)) as Array<{ id: string; title: string }>;
        if (!active) return;
        setModules(mods);
        if (mods[0]?.id) setModuleId(mods[0].id);
        const ls = (await listLessonsByCourse(courseSlug)) as Lesson[];
        if (!active) return;
        setLessons(ls.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch {
        if (active) setError("Firestore permission error â€” check Firebase security rules.");
      }
    })();
    return () => { active = false; };
  }, [courseSlug]);

  async function reload() {
    try {
      const mods = (await listModulesByCourse(courseSlug)) as Array<{ id: string; title: string }>;
      setModules(mods);
      const ls = (await listLessonsByCourse(courseSlug)) as Lesson[];
      setLessons(ls.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setError(null);
    } catch {
      setError("Permission denied. Set Firestore rules to allow read/write.");
    }
  }

  function openNew() {
    setForm({ ...emptyForm, courseSlug, moduleId });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(lesson: Lesson) {
    const { id, ...rest } = lesson;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateLesson(editingId, { ...form, courseSlug, moduleId });
      } else {
        await createLesson({ ...form, courseSlug, moduleId });
      }
      setShowForm(false);
      setEditingId(null);
      await reload();
    } catch {
      setError("Save failed â€” check Firestore rules.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleLock(lesson: Lesson) {
    try {
      await updateLesson(lesson.id, { locked: !lesson.locked });
      await reload();
    } catch { setError("Permission denied."); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this lesson?")) return;
    try {
      await deleteLesson(id);
      await reload();
    } catch { setError("Permission denied."); }
  }

  const moduleMap = Object.fromEntries(modules.map(m => [m.id, m.title]));
  const filteredLessons = moduleId
    ? lessons.filter(l => l.moduleId === moduleId)
    : lessons;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-[#EF4444]/30 bg-[#FEF2F2]/10 px-4 py-3 text-[12px] text-[#EF4444]">
          <span>âš  {error}</span>
          <button onClick={() => setError(null)}><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Course selector */}
        <select value={courseSlug} onChange={e => setCourseSlug(e.target.value)}
          className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white outline-none">
          {courses.map(c => <option key={c.slug} value={c.slug}>{c.title || c.slug}</option>)}
        </select>

        {/* Module selector */}
        <select value={moduleId} onChange={e => setModuleId(e.target.value)}
          className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white outline-none">
          <option value="">All Modules</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>

        <button onClick={reload}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] hover:text-white">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>

        <button onClick={openNew}
          className="flex h-9 items-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[13px] font-semibold text-white hover:bg-[#4338CA]">
          <Plus className="h-4 w-4" /> Add Lesson
        </button>

        <span className="text-[12px] text-[#334155]">{filteredLessons.length} lessons</span>
      </div>

      {/* Lesson form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/12 bg-[#0D1117] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">
                {editingId ? "Edit Lesson" : "Add New Lesson"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[#475569] hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-4 overflow-y-auto px-5 py-5">
              {/* Lesson type selector */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#475569]">Lesson Type</label>
                <div className="flex flex-wrap gap-2">
                  {LESSON_TYPES.map(t => (
                    <button key={t.value} type="button"
                      onClick={() => setForm(p => ({ ...p, lessonType: t.value }))}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-semibold transition ${
                        form.lessonType === t.value
                          ? "border-[#4F46E5] bg-[#4F46E5]/20 text-[#818CF8]"
                          : "border-white/10 bg-white/5 text-[#64748B] hover:text-white"
                      }`}>
                      <t.icon className={`h-3.5 w-3.5 ${form.lessonType === t.value ? "text-[#818CF8]" : t.color}`} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Module selector */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#475569]">Module</label>
                <select value={form.moduleId || moduleId}
                  onChange={e => setForm(p => ({ ...p, moduleId: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] text-white outline-none">
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>

              {/* Title */}
              <Field label="Lesson Title *" value={form.title}
                onChange={v => setForm(p => ({ ...p, title: v }))}
                placeholder="e.g. Introduction to Azure VMs" />

              {/* Description */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#475569]">Description</label>
                <textarea rows={2} value={form.description || ""}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of what this lesson covers"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#4F46E5]/50" />
              </div>

              {/* URL field â€” label changes by type */}
              {form.lessonType === "live" ? (
                <Field label="ðŸ”´ Live Class Meeting Link (Zoom / Google Meet / Teams)"
                  value={form.url || ""}
                  onChange={v => setForm(p => ({ ...p, url: v }))}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx" />
              ) : form.lessonType === "youtube" ? (
                <Field label="â–¶ YouTube Video URL"
                  value={form.url || ""}
                  onChange={v => setForm(p => ({ ...p, url: v }))}
                  placeholder="https://www.youtube.com/watch?v=xxxxx" />
              ) : form.lessonType === "pdf" ? (
                <Field label="ðŸ“„ PDF / Notes URL (Google Drive, Dropbox, Direct link)"
                  value={form.url || ""}
                  onChange={v => setForm(p => ({ ...p, url: v }))}
                  placeholder="https://drive.google.com/file/d/xxxx/view" />
              ) : form.lessonType === "lab" ? (
                <Field label="ðŸ§ª Lab / Assignment URL"
                  value={form.url || ""}
                  onChange={v => setForm(p => ({ ...p, url: v }))}
                  placeholder="https://github.com/your-org/lab-repo or assignment link" />
              ) : (
                <Field label="ðŸ”— Resource URL"
                  value={form.url || ""}
                  onChange={v => setForm(p => ({ ...p, url: v }))}
                  placeholder="https://..." />
              )}

              {/* Live class scheduled time */}
              {form.lessonType === "live" && (
                <Field label="ðŸ“… Scheduled Date & Time (e.g. Sat 15 Jun, 7:00 PM IST)"
                  value={form.scheduledAt || ""}
                  onChange={v => setForm(p => ({ ...p, scheduledAt: v }))}
                  placeholder="Sat 15 Jun 2026, 7:00 PM IST" />
              )}

              {/* Duration + Order */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration (e.g. 45 mins)" value={form.duration || ""}
                  onChange={v => setForm(p => ({ ...p, duration: v }))}
                  placeholder="45 mins" />
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#475569]">Order</label>
                  <input type="number" min={1} value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white outline-none focus:border-[#4F46E5]/50" />
                </div>
              </div>

              {/* Status + Lock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#475569]">Status</label>
                  <select value={form.status || "draft"}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as FirestoreLesson["status"] }))}
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white outline-none">
                    <option value="draft">Draft (hidden)</option>
                    <option value="published">Published (visible)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#475569]">Access</label>
                  <select value={form.locked ? "locked" : "unlocked"}
                    onChange={e => setForm(p => ({ ...p, locked: e.target.value === "locked" }))}
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white outline-none">
                    <option value="unlocked">ðŸ”“ Unlocked (free)</option>
                    <option value="locked">ðŸ”’ Locked (enrolled only)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/8 px-5 py-4">
              <button onClick={() => setShowForm(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-[#64748B] hover:text-white">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#4338CA] disabled:opacity-60">
                <Save className="h-4 w-4" />
                {saving ? "Savingâ€¦" : editingId ? "Update Lesson" : "Add Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        {filteredLessons.length === 0 ? (
          <div className="px-4 py-8 text-center text-[#334155]">
            No lessons yet. Click <strong className="text-[#4F46E5]">Add Lesson</strong> to create the first one.
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/8 bg-white/4 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLessons.map(lesson => {
                const typeInfo = LESSON_TYPES.find(t => t.value === lesson.lessonType);
                return (
                  <tr key={lesson.id} className="border-b border-white/6 bg-[#0D1117] transition hover:bg-white/3">
                    <td className="px-4 py-3 text-[#475569]">{lesson.order}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{lesson.title}</p>
                      {lesson.url && (
                        <a href={lesson.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-[#4F46E5] hover:underline">
                          <ExternalLink className="h-3 w-3" />
                          {lesson.lessonType === "live" ? "Meeting Link" : "Open Link"}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">{moduleMap[lesson.moduleId] || lesson.moduleId}</td>
                    <td className="px-4 py-3">
                      {typeInfo && (
                        <span className={`flex items-center gap-1.5 text-[12px] font-semibold ${typeInfo.color}`}>
                          <typeInfo.icon className="h-3.5 w-3.5" />{typeInfo.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">{lesson.duration || "â€”"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        lesson.status === "published"
                          ? "bg-[#34D399]/15 text-[#34D399]"
                          : "bg-white/8 text-[#475569]"
                      }`}>{lesson.status || "draft"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(lesson)}
                          className="rounded-lg p-1.5 text-[#64748B] hover:bg-white/8 hover:text-[#4F46E5]">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => toggleLock(lesson)}
                          className="rounded-lg p-1.5 text-[#64748B] hover:bg-white/8 hover:text-[#F59E0B]"
                          title={lesson.locked ? "Unlock" : "Lock"}>
                          {lesson.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => remove(lesson.id)}
                          className="rounded-lg p-1.5 text-[#64748B] hover:bg-red-900/20 hover:text-[#EF4444]">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload guide */}
      <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-[12px] text-[#475569]">
        <p className="font-semibold text-[#64748B]">ðŸ“Ž How to add PDFs & Documents</p>
        <p className="mt-1">Upload your file to <strong className="text-[#94A3B8]">Google Drive</strong> â†’ right-click â†’ Share â†’ Anyone with link â†’ Copy link. Paste the link in the PDF/Notes URL field above.</p>
        <p className="mt-1">For <strong className="text-[#94A3B8]">live classes</strong>: Create a Zoom/Meet recurring session and paste the joining link. Students see it on the lesson page before the class starts.</p>
      </div>
    </div>
  );
}

/* Simple field component */
function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#475569]">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#4F46E5]/50" />
    </div>
  );
}


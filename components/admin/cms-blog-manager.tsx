"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, orderBy, query,
} from "firebase/firestore";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: "draft" | "published";
  tags: string;
  createdAt: string;
  updatedAt: string;
};

type PostFieldKey = keyof Omit<Post, "id">;

const emptyPost: Omit<Post, "id"> = {
  title: "", slug: "", excerpt: "", content: "", author: "",
  status: "draft", tags: "", createdAt: "", updatedAt: "",
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CmsBlogManager() {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<Omit<Post, "id">>(emptyPost);
  const [editId, setEditId]   = useState<string | null>(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);

  async function load() {
    setLoading(true);
    const db = getFirebaseDb();
    if (!db) { setLoading(false); return; }
    try {
      const snap = await getDocs(query(collection(db, "blog_posts"), orderBy("createdAt", "desc")));
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post)));
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  function openNew() {
    setForm(emptyPost);
    setEditId(null);
    setOpen(true);
  }

  function openEdit(post: Post) {
    const { id, ...rest } = post;
    setForm(rest);
    setEditId(id);
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    const db = getFirebaseDb();
    if (!db) { setSaving(false); return; }
    try {
      const now = new Date().toISOString();
      const data = {
        ...form,
        slug: form.slug || toSlug(form.title),
        updatedAt: now,
        createdAt: editId ? form.createdAt : now,
      };
      if (editId) {
        await updateDoc(doc(db, "blog_posts", editId), data);
      } else {
        await addDoc(collection(db, "blog_posts"), data);
      }
      setOpen(false);
      await load();
    } catch { /* ignore */ } finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const db = getFirebaseDb();
    if (!db) return;
    await deleteDoc(doc(db, "blog_posts", id));
    await load();
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[#334155]">{posts.length} posts</span>
        <div className="flex gap-2">
          <button onClick={load} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] hover:text-white">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button onClick={openNew} className="flex h-9 items-center gap-2 rounded-xl bg-[#0B2E6B] px-4 text-[13px] font-semibold text-white transition hover:bg-[#092552]">
            <Plus className="h-4 w-4" /> New Post
          </button>
        </div>
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-white/5" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-[#334155]">No blog posts yet.</p>
          <button onClick={openNew} className="mt-3 text-[13px] text-[#0B2E6B] hover:underline">Create your first post →</button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="group rounded-2xl border border-white/8 bg-[#0D1117] p-4 transition hover:border-white/14">
              <div className="flex items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  post.status === "published" ? "bg-[#34D399]/15 text-[#34D399]" : "bg-white/8 text-[#475569]"
                }`}>{post.status}</span>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => openEdit(post)} className="rounded-lg p-1.5 text-[#64748B] hover:bg-white/8 hover:text-white">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(post.id)} className="rounded-lg p-1.5 text-[#64748B] hover:bg-red-900/20 hover:text-[#EF4444]">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-[14px] font-semibold text-white line-clamp-2">{post.title}</p>
              <p className="mt-1 text-[12px] text-[#475569] line-clamp-2">{post.excerpt}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#334155]">
                <span>{post.author || "—"}</span>
                <span>{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString("en-IN") : "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer / modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/12 bg-[#0D1117] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <h2 className="text-[15px] font-bold text-white">{editId ? "Edit Post" : "New Blog Post"}</h2>
              <button onClick={() => setOpen(false)} className="text-[#475569] hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {/* Form */}
            <div className="max-h-[70vh] overflow-y-auto px-5 py-5 space-y-4">
              {([
                { label: "Title", key: "title", placeholder: "Post title…", type: "text" },
                { label: "Slug", key: "slug", placeholder: "auto-generated-if-empty", type: "text" },
                { label: "Author", key: "author", placeholder: "Author name", type: "text" },
              ] as Array<{ label: string; key: PostFieldKey; placeholder: string; type: string }>).map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#475569]">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Short description shown on listing page…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50 resize-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Content (Markdown)</label>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Full post content in Markdown…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-[12px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50 resize-y"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Tags (comma-separated)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="aws, cloud, devops"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Post["status"] }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#0B2E6B]/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-white/8 px-5 py-4">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-[#64748B] hover:text-white">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="rounded-xl bg-[#0B2E6B] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#092552] disabled:opacity-60">
                {saving ? "Saving…" : editId ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


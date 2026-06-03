"use client";

import { useEffect, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { listUserProfiles, updateUserRole, type AppUserProfile } from "@/lib/firebase";

type User = AppUserProfile & { id: string };

export function AdminUsersTable() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [saving, setSaving]   = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const next = await listUserProfiles();
      setUsers(next as User[]);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || (u.name || "").toLowerCase().includes(q) || (u.phone || "").includes(q) || (u.email || "").toLowerCase().includes(q);
  });

  async function changeRole(uid: string, role: "admin" | "student") {
    setSaving(uid);
    try {
      await updateUserRole(uid, role);
      setUsers((prev) => prev.map((u) => (u.uid === uid || u.id === uid) ? { ...u, role } : u));
    } catch { /* ignore */ } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#475569]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email…"
            className="h-9 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#4F46E5]/50"
          />
        </div>
        <button onClick={load} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] transition hover:text-white">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
        <span className="text-[12px] text-[#334155]">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/4 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone / Email</th>
              <th className="px-4 py-3">Auth Method</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-white/6">
                  {[...Array(5)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3.5 animate-pulse rounded bg-white/8" style={{ width: `${60 + (j * 10) % 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#334155]">No users found.</td>
              </tr>
            ) : filtered.map((user) => (
              <tr key={user.id} className="border-b border-white/6 bg-[#0D1117] transition hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-white">{user.name || "—"}</td>
                <td className="px-4 py-3 text-[#64748B]">{user.phone || user.email || user.uid}</td>
                <td className="px-4 py-3 text-[#64748B]">{user.authMethod || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role || "student"}
                    disabled={saving === (user.uid || user.id)}
                    onChange={(e) => changeRole(user.uid || user.id, e.target.value as "admin" | "student")}
                    className={`rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] text-white outline-none transition ${
                      saving === (user.uid || user.id) ? "opacity-50" : "hover:border-[#4F46E5]/40"
                    }`}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-[#475569]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, KeyRound, RefreshCw, Search, Trash2, UserPlus, X } from "lucide-react";
import { getFirebaseAuth, listAllEnrollments, listUserProfiles, updateUserRole, type AppUserProfile, type FirestoreEnrollment } from "@/lib/firebase";
import { downloadCsv, formatAdminDate } from "@/lib/admin/reporting";

type User = AppUserProfile & { id: string; totalPaid?: number; lastPurchaseAt?: string };
type Enrollment = FirestoreEnrollment & { id: string };

async function getAdminAuthHeader() {
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();
  if (!token) {
    throw new Error("Not signed in.");
  }
  return { Authorization: `Bearer ${token}` };
}

function AddUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "student">("student");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit() {
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError("Provide a phone number or an email address.");
      return;
    }
    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      setError("Phone number must be exactly 10 digits (without the country code).");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setPending(true);
    try {
      const headers = await getAdminAuthHeader();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim(), password, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Unable to create user.");
        return;
      }
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create user.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0D1117] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-white">Add User</h3>
          <button onClick={onClose} className="text-[#475569] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            disabled={pending}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
          />
          <div className="flex h-10 overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-[#0B2E6B]/50">
            <span className="inline-flex items-center border-r border-white/10 px-3 text-[13px] text-[#64748B]">+91</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210"
              inputMode="numeric"
              maxLength={10}
              disabled={pending}
              className="min-w-0 flex-1 bg-transparent px-3 text-[13px] text-white placeholder:text-[#334155] outline-none"
            />
          </div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional if phone is set)"
            disabled={pending}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            type="text"
            disabled={pending}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "student")}
            disabled={pending}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white outline-none focus:border-[#0B2E6B]/50"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          {error ? <p className="text-[12px] text-rose-400">{error}</p> : null}

          <button
            onClick={() => void submit()}
            disabled={pending}
            className="h-10 w-full rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setPending(true);
    try {
      const headers = await getAdminAuthHeader();
      const res = await fetch(`/api/admin/users/${user.uid || user.id}/reset-password`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Unable to reset password.");
        return;
      }
      setSuccess(true);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0D1117] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-white">Reset Password</h3>
          <button onClick={onClose} className="text-[#475569] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-[12px] text-[#64748B]">{user.name || user.phone || user.email || user.uid}</p>

        {success ? (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[13px] text-emerald-300">
            Password updated. Share it with the user securely.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
              type="text"
              disabled={pending}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
            />
            {error ? <p className="text-[12px] text-rose-400">{error}</p> : null}
            <button
              onClick={() => void submit()}
              disabled={pending}
              className="h-10 w-full rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [actionError, setActionError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [nextUsers, nextEnrollments] = await Promise.all([listUserProfiles(), listAllEnrollments()]);
      const enrollments = nextEnrollments as Enrollment[];
      const enrollmentsByUser = new Map<string, Enrollment[]>();

      for (const enrollment of enrollments) {
        const current = enrollmentsByUser.get(enrollment.userId) || [];
        current.push(enrollment);
        enrollmentsByUser.set(enrollment.userId, current);
      }

      const mergedUsers = (nextUsers as User[]).map((user) => {
        const userId = user.uid || user.id;
        const linkedEnrollments = (enrollmentsByUser.get(userId) || []).sort(
          (left, right) => new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime(),
        );
        const latestEnrollment = linkedEnrollments[0];
        const earliestEnrollment = linkedEnrollments.at(-1);

        return {
          ...user,
          name: user.name || latestEnrollment?.userName || "",
          phone: user.phone || latestEnrollment?.userPhone || "",
          email: user.email || latestEnrollment?.userEmail || "",
          createdAt: user.createdAt || earliestEnrollment?.enrolledAt || "",
          totalPaid: linkedEnrollments.reduce((sum, item) => sum + (item.amountPaid || 0), 0),
          lastPurchaseAt: latestEnrollment?.enrolledAt || "",
        } satisfies User;
      });

      setUsers(mergedUsers);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || (u.name || "").toLowerCase().includes(q) || (u.phone || "").includes(q) || (u.email || "").toLowerCase().includes(q);
  });

  function exportCsv() {
    downloadCsv(
      "genznext-users.csv",
      ["Name", "Phone", "Email", "Role", "Auth Method", "Created At", "User ID"],
      filtered.map((user) => [
        user.name || "",
        user.phone || "",
        user.email || "",
        user.role || "student",
        user.authMethod || "",
        user.createdAt || "",
        user.uid || user.id,
      ]),
    );
  }

  async function changeRole(uid: string, role: "admin" | "student") {
    setSaving(uid);
    try {
      await updateUserRole(uid, role);
      setUsers((prev) => prev.map((u) => (u.uid === uid || u.id === uid ? { ...u, role } : u)));
    } finally {
      setSaving(null);
    }
  }

  async function deleteUser(user: User) {
    const uid = user.uid || user.id;
    if (!window.confirm(`Delete ${user.name || user.phone || user.email || uid}? This cannot be undone.`)) {
      return;
    }

    setActionError("");
    setDeleting(uid);
    try {
      const headers = await getAdminAuthHeader();
      const res = await fetch(`/api/admin/users/${uid}`, { method: "DELETE", headers });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.message || "Unable to delete user.");
        return;
      }
      setUsers((prev) => prev.filter((u) => (u.uid || u.id) !== uid));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to delete user.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#475569]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="h-9 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#0B2E6B]/50"
          />
        </div>
        <button onClick={load} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] transition hover:text-white">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
        <button onClick={exportCsv} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] transition hover:text-white">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex h-9 items-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-3 text-[12px] font-semibold text-white transition hover:scale-[1.02]"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add User
        </button>
        <span className="text-[12px] text-[#334155]">{filtered.length} users</span>
      </div>

      {actionError ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-300">
          {actionError}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/4 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone / Email</th>
              <th className="px-4 py-3">Auth Method</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-white/6">
                  {[...Array(6)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3.5 animate-pulse rounded bg-white/8" style={{ width: `${60 + (j * 10) % 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#334155]">No users found.</td>
              </tr>
            ) : (
              filtered.map((user) => {
                const uid = user.uid || user.id;
                return (
                  <tr key={user.id} className="border-b border-white/6 bg-[#0D1117] transition hover:bg-white/3">
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${uid}`} className="font-medium text-white hover:text-[#818CF8]">
                        {user.name || "-"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">{user.phone || user.email || user.uid}</td>
                    <td className="px-4 py-3 text-[#64748B]">{user.authMethod || "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role || "student"}
                        disabled={saving === uid}
                        onChange={(e) => changeRole(uid, e.target.value as "admin" | "student")}
                        className={`rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] text-white outline-none transition ${
                          saving === uid ? "opacity-50" : "hover:border-[#0B2E6B]/40"
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-[#475569]">{formatAdminDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setResetTarget(user)}
                          title="Reset password"
                          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-[#64748B] transition hover:border-[#0B2E6B]/40 hover:text-white"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => void deleteUser(user)}
                          disabled={deleting === uid}
                          title="Delete user"
                          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-[#64748B] transition hover:border-rose-500/40 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAddUser ? <AddUserModal onClose={() => setShowAddUser(false)} onCreated={load} /> : null}
      {resetTarget ? <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} onDone={() => {}} /> : null}
    </div>
  );
}

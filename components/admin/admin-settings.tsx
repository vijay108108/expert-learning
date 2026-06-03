"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getFirebaseDb } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";

/* ── Config ─────────────────────────────────────────────── */

const readonlyFields = [
  { label: "Site Name",      value: siteConfig.name },
  { label: "Company",        value: siteConfig.company },
  { label: "Site URL",       value: siteConfig.url },
  { label: "Support Email",  value: siteConfig.email },
  { label: "Phone",          value: siteConfig.phone },
  { label: "GST Number",     value: siteConfig.gstNumber },
  { label: "Address",        value: siteConfig.addressLines.join(", ") },
];

const envLinks = [
  { label: "Firebase Console",       href: "https://console.firebase.google.com", desc: "Auth, Firestore, Storage" },
  { label: "Razorpay Dashboard",     href: "https://dashboard.razorpay.com",       desc: "Payments & Orders" },
  { label: "Vercel Dashboard",       href: "https://vercel.com/dashboard",          desc: "Deployments & Env vars" },
  { label: "Google Search Console",  href: "https://search.google.com/search-console", desc: "SEO & Indexing" },
];

const adminChecklist = [
  "ADMIN_EMAILS env var set in .env.local",
  "Firebase Auth — Phone enabled",
  "Firebase Auth — localhost in authorized domains",
  "NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE=false for real OTP",
  "Razorpay webhook secret set",
  "Firestore security rules deployed",
];

/* Collections to wipe — label + Firestore collection name */
const WIPE_COLLECTIONS = [
  { label: "Users",        col: "users" },
  { label: "Enrollments",  col: "enrollments" },
  { label: "Payments",     col: "payments" },
  { label: "Leads",        col: "leads" },
  { label: "Blog Posts",   col: "blog_posts" },
  { label: "Courses",      col: "courses" },
  { label: "Modules",      col: "modules" },
  { label: "Lessons",      col: "lessons" },
  { label: "Progress",     col: "progress" },
  { label: "Resources",    col: "resources" },
];

type WipeResult = { col: string; label: string; deleted: number; error?: string };

async function wipeCollection(db: ReturnType<typeof getFirebaseDb>, colName: string): Promise<number> {
  if (!db) return 0;
  const snap = await getDocs(collection(db, colName));
  if (snap.empty) return 0;

  // Firestore batch max = 500 ops
  const chunks: typeof snap.docs[number][][] = [];
  for (let i = 0; i < snap.docs.length; i += 499) {
    chunks.push(snap.docs.slice(i, i + 499));
  }
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  return snap.size;
}

/* ── Wipe panel component ────────────────────────────────── */
function DataWipePanel() {
  const [confirm, setConfirm]       = useState("");
  const [running, setRunning]       = useState(false);
  const [results, setResults]       = useState<WipeResult[] | null>(null);
  const [selected, setSelected]     = useState<Record<string, boolean>>(
    Object.fromEntries(WIPE_COLLECTIONS.map((c) => [c.col, false]))
  );

  const CONFIRM_PHRASE = "DELETE ALL DATA";
  const anySelected    = Object.values(selected).some(Boolean);
  const canRun         = confirm === CONFIRM_PHRASE && anySelected && !running;

  function toggleAll(val: boolean) {
    setSelected(Object.fromEntries(WIPE_COLLECTIONS.map((c) => [c.col, val])));
  }

  async function runWipe() {
    if (!canRun) return;
    setRunning(true);
    setResults(null);

    const db = getFirebaseDb();
    const out: WipeResult[] = [];

    for (const { col, label } of WIPE_COLLECTIONS) {
      if (!selected[col]) continue;
      try {
        const deleted = await wipeCollection(db, col);
        out.push({ col, label, deleted });
      } catch (err) {
        out.push({ col, label, deleted: 0, error: err instanceof Error ? err.message : "Failed" });
      }
    }

    setResults(out);
    setRunning(false);
    setConfirm("");
  }

  const totalDeleted = results?.reduce((s, r) => s + r.deleted, 0) ?? 0;

  return (
    <div className="rounded-2xl border border-[#EF4444]/30 bg-[#FEF2F2] p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#EF4444]" />
        <div>
          <p className="text-[13px] font-bold text-[#991B1B]">Danger Zone — Permanent Data Wipe</p>
          <p className="mt-1 text-[12px] text-[#B91C1C]">
            This deletes Firestore records permanently. Firebase Authentication users are NOT deleted here — do that separately in Firebase Console → Authentication → Users.
          </p>
        </div>
      </div>

      {/* Collection checkboxes */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#991B1B]">Select collections to wipe</p>
          <div className="flex gap-3 text-[11px] font-medium">
            <button onClick={() => toggleAll(true)}  className="text-[#EF4444] hover:underline">Select all</button>
            <button onClick={() => toggleAll(false)} className="text-[#64748B] hover:underline">Clear</button>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {WIPE_COLLECTIONS.map(({ col, label }) => (
            <label key={col} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#FECACA] bg-white px-3 py-2.5 transition hover:border-[#EF4444]/40">
              <input
                type="checkbox"
                checked={selected[col]}
                onChange={(e) => setSelected((prev) => ({ ...prev, [col]: e.target.checked }))}
                className="h-4 w-4 rounded accent-[#EF4444]"
              />
              <span className="text-[13px] font-medium text-[#374151]">{label}</span>
              <span className="ml-auto font-mono text-[10px] text-[#94A3B8]">{col}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Confirmation input */}
      <div className="mt-5">
        <p className="mb-2 text-[12px] text-[#991B1B]">
          Type <code className="rounded bg-[#FEE2E2] px-1.5 py-0.5 font-mono font-bold text-[#DC2626]">DELETE ALL DATA</code> to confirm
        </p>
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type the phrase to unlock..."
          disabled={running}
          className="w-full rounded-xl border border-[#FECACA] bg-white px-4 py-2.5 font-mono text-[13px] text-[#991B1B] placeholder:text-[#FCA5A5] outline-none focus:border-[#EF4444] disabled:opacity-50"
        />
      </div>

      {/* Action button */}
      <button
        onClick={runWipe}
        disabled={!canRun}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#EF4444] px-4 py-3 text-[13px] font-bold text-white transition hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {running ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Wiping data...</>
        ) : (
          <><Trash2 className="h-4 w-4" /> Wipe Selected Collections</>
        )}
      </button>

      {/* Results */}
      {results && (
        <div className="mt-4 rounded-xl border border-[#FECACA] bg-white p-4">
          <p className="mb-3 text-[12px] font-bold text-[#16A34A]">
            ✓ Wipe complete — {totalDeleted} total records deleted
          </p>
          <div className="space-y-1.5">
            {results.map((r) => (
              <div key={r.col} className="flex items-center justify-between text-[12px]">
                <span className="text-[#374151]">{r.label}</span>
                {r.error ? (
                  <span className="text-[#EF4444]">Error: {r.error}</span>
                ) : (
                  <span className="font-semibold text-[#16A34A]">{r.deleted} deleted</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[#94A3B8]">
            ⚠️ To delete Firebase Auth accounts: Firebase Console → Authentication → Users → Select all → Delete
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────── */
export function AdminSettings() {
  return (
    <div className="space-y-6">

      {/* Site config */}
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-6">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#475569]">Site Configuration</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {readonlyFields.map((f) => (
            <div key={f.label} className="rounded-xl border border-white/6 bg-white/4 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#334155]">{f.label}</p>
              <p className="mt-1 text-[13px] text-[#94A3B8]">{f.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[#334155]">
          To change: edit <code className="font-mono text-[#475569]">lib/site-config.ts</code>
        </p>
      </div>

      {/* Admin access */}
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#475569]">Admin Access</p>
        <p className="mb-3 text-[13px] text-[#64748B]">
          Set <code className="rounded bg-white/8 px-1 font-mono text-[12px] text-[#94A3B8]">ADMIN_EMAILS</code> in <code className="rounded bg-white/8 px-1 font-mono text-[12px] text-[#94A3B8]">.env.local</code> (comma-separated),
          or set <code className="rounded bg-white/8 px-1 font-mono text-[12px] text-[#94A3B8]">role: "admin"</code> in Firestore <code className="rounded bg-white/8 px-1 font-mono text-[12px] text-[#94A3B8]">users</code> collection.
        </p>
      </div>

      {/* External links */}
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-6">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#475569]">External Services</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {envLinks.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition hover:border-[#4F46E5]/30 hover:bg-[#4F46E5]/8">
              <div>
                <p className="text-[13px] font-semibold text-white">{l.label}</p>
                <p className="text-[11px] text-[#475569]">{l.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-[#334155] transition group-hover:text-[#818CF8]" />
            </a>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-6">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#475569]">Production Checklist</p>
        <ul className="space-y-2">
          {adminChecklist.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#64748B]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#334155]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Danger zone */}
      <DataWipePanel />

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { listLeads, updateLeadStatus, type FirestoreLead } from "@/lib/firebase";

type Lead = FirestoreLead & { id: string };

const STATUS_OPTIONS = ["new", "contacted", "enrolled", "closed", "lost"] as const;
const statusColor: Record<string, string> = {
  new:       "bg-[#F59E0B]/15 text-[#F59E0B]",
  contacted: "bg-[#60A5FA]/15 text-[#60A5FA]",
  enrolled:  "bg-[#34D399]/15 text-[#34D399]",
  closed:    "bg-[#818CF8]/15 text-[#818CF8]",
  lost:      "bg-white/8 text-[#475569]",
};

export function AdminLeadsTable() {
  const [leads, setLeads]     = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [saving, setSaving]   = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const next = await listLeads();
      setLeads((next as Lead[]).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name?.toLowerCase().includes(q) || l.phone?.includes(q) || l.course?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || l.status === filter;
    return matchSearch && matchFilter;
  });

  async function changeStatus(id: string, status: FirestoreLead["status"]) {
    setSaving(id);
    try {
      await updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    } catch { /* ignore */ } finally { setSaving(null); }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#475569]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, phone or course…"
            className="h-9 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#334155] outline-none focus:border-[#4F46E5]/50" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-[13px] text-white outline-none">
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button onClick={load} className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-[#64748B] hover:text-white">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
        <span className="text-[12px] text-[#334155]">{filtered.length} leads</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/4 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Course Interest</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-white/6">
                  {[...Array(5)].map((__, j) => <td key={j} className="px-4 py-3"><div className="h-3.5 animate-pulse rounded bg-white/8 w-3/4" /></td>)}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#334155]">No leads found.</td></tr>
            ) : filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-white/6 bg-[#0D1117] transition hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-white">{lead.name || "—"}</td>
                <td className="px-4 py-3 text-[#64748B]">{lead.phone || "—"}</td>
                <td className="px-4 py-3 text-[#94A3B8]">{lead.course || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status || "new"}
                    disabled={saving === lead.id}
                    onChange={(e) => changeStatus(lead.id, e.target.value as FirestoreLead["status"])}
                    className={`rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-white outline-none ${saving === lead.id ? "opacity-50" : ""} ${statusColor[lead.status || "new"]}`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-[#475569]">
                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-IN") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

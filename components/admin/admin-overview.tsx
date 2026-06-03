"use client";

import Link from "next/link";
import {
  ArrowUpRight, BookOpenCheck, CreditCard,
  GraduationCap, MessageSquare, TrendingUp, Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  listAllEnrollments, listCourses, listLeads,
  listUserProfiles, type AppUserProfile,
} from "@/lib/firebase";

type Metric = { label: string; value: number | string; icon: React.ElementType; href: string; color: string };

const quickLinks = [
  { label: "Add Course",       href: "/admin/courses/new",  },
  { label: "View Users",       href: "/admin/users",        },
  { label: "View Leads",       href: "/admin/leads",        },
  { label: "View Payments",    href: "/admin/payments",     },
  { label: "Blog Posts",       href: "/admin/cms/blog",     },
  { label: "LMS Modules",      href: "/admin/lms/modules",  },
];

export function AdminOverview() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "Total Users",      value: "—", icon: Users,          href: "/admin/users",       color: "text-[#818CF8]" },
    { label: "Active Courses",   value: "—", icon: BookOpenCheck,  href: "/admin/courses",     color: "text-[#34D399]" },
    { label: "Enrollments",      value: "—", icon: GraduationCap,  href: "/admin/enrollments", color: "text-[#60A5FA]" },
    { label: "Leads",            value: "—", icon: MessageSquare,  href: "/admin/leads",       color: "text-[#F59E0B]" },
  ]);
  const [recentLeads, setRecentLeads]   = useState<any[]>([]);
  const [recentUsers, setRecentUsers]   = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [users, courses, enrollments, leads] = await Promise.all([
          listUserProfiles(),
          listCourses(),
          listAllEnrollments(),
          listLeads(),
        ]);
        if (!active) return;
        setMetrics([
          { label: "Total Users",    value: users.length,       icon: Users,         href: "/admin/users",       color: "text-[#818CF8]" },
          { label: "Active Courses", value: courses.length,     icon: BookOpenCheck, href: "/admin/courses",     color: "text-[#34D399]" },
          { label: "Enrollments",    value: enrollments.length, icon: GraduationCap, href: "/admin/enrollments", color: "text-[#60A5FA]" },
          { label: "Leads",          value: leads.length,       icon: MessageSquare, href: "/admin/leads",       color: "text-[#F59E0B]" },
        ]);
        setRecentLeads((leads as any[]).slice(0, 5));
        setRecentUsers((users as any[]).slice(0, 5));
      } catch { /* ignore */ } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Link key={m.label} href={m.href} className="group rounded-2xl border border-white/8 bg-[#0D1117] p-5 transition hover:border-white/14">
            <div className="flex items-center justify-between">
              <m.icon className={`h-5 w-5 ${m.color}`} />
              <ArrowUpRight className="h-4 w-4 text-[#334155] transition group-hover:text-[#64748B]" />
            </div>
            <p className={`mt-4 text-3xl font-bold ${loading ? "animate-pulse text-[#1E293B]" : "text-white"}`}>
              {m.value}
            </p>
            <p className="mt-1 text-[12px] text-[#475569]">{m.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#475569]">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-[12px] font-medium text-[#94A3B8] transition hover:border-[#4F46E5]/40 hover:bg-[#4F46E5]/10 hover:text-[#818CF8]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent leads */}
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent Leads</p>
            <Link href="/admin/leads" className="text-[11px] text-[#4F46E5] hover:underline">View all →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-[13px] text-[#334155]">{loading ? "Loading…" : "No leads yet."}</p>
          ) : (
            <div className="space-y-2">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between rounded-xl bg-white/4 px-3 py-2">
                  <div>
                    <p className="text-[13px] font-medium text-white">{lead.name || "—"}</p>
                    <p className="text-[11px] text-[#475569]">{lead.phone} · {lead.course}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    lead.status === "closed" ? "bg-[#34D399]/15 text-[#34D399]" :
                    lead.status === "contacted" ? "bg-[#60A5FA]/15 text-[#60A5FA]" :
                    "bg-[#F59E0B]/15 text-[#F59E0B]"
                  }`}>{lead.status || "new"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent users */}
        <div className="rounded-2xl border border-white/8 bg-[#0D1117] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent Users</p>
            <Link href="/admin/users" className="text-[11px] text-[#4F46E5] hover:underline">View all →</Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-[13px] text-[#334155]">{loading ? "Loading…" : "No users yet."}</p>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-xl bg-white/4 px-3 py-2">
                  <div>
                    <p className="text-[13px] font-medium text-white">{user.name || user.email || "—"}</p>
                    <p className="text-[11px] text-[#475569]">{user.phone || user.email || user.uid}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    user.role === "admin" ? "bg-[#818CF8]/15 text-[#818CF8]" : "bg-white/8 text-[#64748B]"
                  }`}>{user.role || "student"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

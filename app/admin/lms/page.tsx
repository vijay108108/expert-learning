"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { FirebaseModuleManager } from "@/components/admin/firebase-module-manager";
import { FirebaseLessonManager } from "@/components/admin/firebase-lesson-manager";
import { FirebaseResourceManager } from "@/components/admin/firebase-resource-manager";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "modules", label: "Modules" },
  { key: "lessons", label: "Lessons" },
  { key: "resources", label: "Resources" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AdminLmsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("modules");

  return (
    <AdminShell
      title="LMS Content"
      subtitle="Manage modules, lessons, and resources for your LMS courses — all in one place."
    >
      <div className="mb-5 flex gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-[13px] font-semibold transition",
              activeTab === tab.key
                ? "bg-[#0B2E6B] text-white"
                : "text-[#94A3B8] hover:bg-white/5 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "modules" && <FirebaseModuleManager />}
      {activeTab === "lessons" && <FirebaseLessonManager />}
      {activeTab === "resources" && <FirebaseResourceManager />}
    </AdminShell>
  );
}

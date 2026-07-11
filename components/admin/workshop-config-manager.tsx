"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { getWorkshopConfigBySlug, upsertWorkshopConfig, type WorkshopConfig } from "@/lib/firebase";

const WORKSHOP_SLUG = "ai-developer-launch-lab";

const inputClass = "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-[#475569] outline-none focus:border-[#0B2E6B]";

export function WorkshopConfigManager() {
  const [form, setForm] = useState<WorkshopConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const config = await getWorkshopConfigBySlug(WORKSHOP_SLUG);
        setForm(config);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load workshop config.");
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await upsertWorkshopConfig(WORKSHOP_SLUG, form);
      setMessage("Workshop config saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save workshop config.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading workshop configuration...
      </div>
    );
  }

  if (!form) {
    return <p className="text-sm text-red-400">Unable to load workshop configuration.</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-white/8 bg-[#0D1117] p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Workshop Title">
          <input value={form.title} onChange={(e) => setForm((prev) => prev ? ({ ...prev, title: e.target.value }) : prev)} className={inputClass} />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => setForm((prev) => prev ? ({ ...prev, status: e.target.value as WorkshopConfig["status"] }) : prev)} className={inputClass}>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Poster URL">
          <input value={form.posterUrl} onChange={(e) => setForm((prev) => prev ? ({ ...prev, posterUrl: e.target.value }) : prev)} className={inputClass} placeholder="https://..." />
        </Field>
        <Field label="Instructor Name">
          <input value={form.instructorName} onChange={(e) => setForm((prev) => prev ? ({ ...prev, instructorName: e.target.value }) : prev)} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Capacity">
          <input type="number" min={1} value={form.capacity} onChange={(e) => setForm((prev) => prev ? ({ ...prev, capacity: Number(e.target.value || 0) }) : prev)} className={inputClass} />
        </Field>
        <Field label="Start ISO">
          <input value={form.startAtIso} onChange={(e) => setForm((prev) => prev ? ({ ...prev, startAtIso: e.target.value }) : prev)} className={inputClass} />
        </Field>
        <Field label="End ISO">
          <input value={form.endAtIso} onChange={(e) => setForm((prev) => prev ? ({ ...prev, endAtIso: e.target.value }) : prev)} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Meeting URL">
          <input value={form.meetingUrl} onChange={(e) => setForm((prev) => prev ? ({ ...prev, meetingUrl: e.target.value }) : prev)} className={inputClass} placeholder="https://..." />
        </Field>
        <Field label="WhatsApp URL">
          <input value={form.whatsappUrl} onChange={(e) => setForm((prev) => prev ? ({ ...prev, whatsappUrl: e.target.value }) : prev)} className={inputClass} placeholder="https://chat.whatsapp.com/..." />
        </Field>
      </div>

      <Field label="Certificate Template Name">
        <input value={form.certificateTemplate} onChange={(e) => setForm((prev) => prev ? ({ ...prev, certificateTemplate: e.target.value }) : prev)} className={inputClass} />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[#64748B]">Slug: {WORKSHOP_SLUG}</p>
        <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0B2E6B] px-4 text-sm font-semibold text-white hover:bg-[#092552] disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Config
        </button>
      </div>

      {message ? <p className="text-sm text-[#94A3B8]">{message}</p> : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</span>
      {children}
    </label>
  );
}

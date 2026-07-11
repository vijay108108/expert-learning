"use client";

import Link from "next/link";
import { Award, BookOpen, PlayCircle, Video } from "lucide-react";
import { cn } from "@/lib/utils";

type MyLearningCardAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  disabled?: boolean;
  tone?: "primary" | "secondary" | "ghost";
  icon?: "course" | "syllabus" | "classes" | "certificate";
};

type MyLearningCardProps = {
  badge: string;
  title: string;
  status: string;
  progress: number;
  progressLabel: string;
  meta: string[];
  enrolledLabel?: string;
  actions: MyLearningCardAction[];
};

function getActionIcon(icon?: MyLearningCardAction["icon"]) {
  if (icon === "course") {
    return <PlayCircle className="h-4 w-4" />;
  }

  if (icon === "classes") {
    return <Video className="h-4 w-4" />;
  }

  if (icon === "certificate") {
    return <Award className="h-4 w-4" />;
  }

  return <BookOpen className="h-4 w-4" />;
}

function actionClassName(tone: MyLearningCardAction["tone"] = "ghost", disabled?: boolean) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px] font-medium transition",
    tone === "primary" &&
      "bg-[linear-gradient(135deg,#0B2E6B,#15407E)] text-white shadow-[0_12px_30px_rgba(249,115,22,0.22)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(249,115,22,0.28)]",
    tone === "secondary" &&
      "border border-[rgba(249,115,22,0.22)] bg-[rgba(249,115,22,0.08)] text-[#E56F12] hover:border-[rgba(249,115,22,0.34)] hover:bg-[rgba(249,115,22,0.12)]",
    tone === "ghost" &&
      "border border-white/10 bg-white/6 text-[#D9E2F2] hover:border-white/15 hover:bg-white/10",
    disabled && "cursor-not-allowed opacity-55 hover:translate-y-0 hover:shadow-none",
  );
}

export function MyLearningCard({
  badge,
  title,
  status,
  progress,
  progressLabel,
  meta,
  enrolledLabel,
  actions,
}: MyLearningCardProps) {
  return (
    <article className="group rounded-[24px] border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.74))] p-5 shadow-[0_18px_42px_rgba(2,6,23,0.34)] transition hover:border-[rgba(249,115,22,0.24)] hover:shadow-[0_22px_48px_rgba(15,23,42,0.44),0_0_32px_rgba(249,115,22,0.08)]">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(249,115,22,0.22)] bg-[rgba(249,115,22,0.12)] text-[12px] font-bold tracking-[0.08em] text-[#E56F12]">
          {badge}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[18px] font-semibold leading-[1.25] text-white">{title}</h2>
          <p className="mt-1 text-sm text-[#D4DCEE]">{status}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#8FA1BF]">
            {meta.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 ? <span className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.18)]" /> : null}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[12px]">
          <span className="text-[#8FA1BF]">Progress</span>
          <span className="font-semibold text-[#E56F12]">{progressLabel}</span>
        </div>
        <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#0B2E6B,#E56F12)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {actions.map((action) => {
          if (action.disabled) {
            return (
              <button
                key={action.label}
                type="button"
                disabled
                className={actionClassName(action.tone, true)}
              >
                {getActionIcon(action.icon)}
                {action.label}
              </button>
            );
          }

          if (action.href) {
            return (
              <Link
                key={action.label}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noreferrer" : undefined}
                className={actionClassName(action.tone)}
              >
                {getActionIcon(action.icon)}
                {action.label}
              </Link>
            );
          }

          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={actionClassName(action.tone)}
            >
              {getActionIcon(action.icon)}
              {action.label}
            </button>
          );
        })}
      </div>

      {enrolledLabel ? <div className="mt-4 text-[11px] text-[#7C8CA8]">{enrolledLabel}</div> : null}
    </article>
  );
}

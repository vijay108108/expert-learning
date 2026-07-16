"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Code2,
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  Laptop,
  Layers,
  Lightbulb,
  Monitor,
  MessageCircle,
  Rocket,
  Server,
  Sparkles,
  Terminal,
  Trophy,
  WandSparkles,
} from "lucide-react";

type WorkshopResource = {
  id: string;
  title: string;
  url: string;
};

type LaunchLabWorkshopExperienceProps = {
  courseName: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  resources: WorkshopResource[];
};

type Module = {
  id: string;
  title: string;
  duration: string;
  lessons: string[];
};

type TechGroup = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Array<{ label: string; icon: React.ComponentType<{ className?: string }> }>;
};

const modules: Module[] = [
  {
    id: "module-1",
    title: "Welcome & Workshop Overview",
    duration: "10 Minutes",
    lessons: ["Welcome", "Workshop Roadmap", "What You'll Build", "Architecture Overview"],
  },
  {
    id: "module-2",
    title: "AI Development with Claude",
    duration: "20 Minutes",
    lessons: ["Introduction to Claude AI", "Prompt Engineering", "AI Pair Programming", "AI Code Generation"],
  },
  {
    id: "module-3",
    title: "Build Your AI Application",
    duration: "40 Minutes",
    lessons: ["Project Setup", "React Frontend", "Node.js Backend", "REST APIs", "Testing"],
  },
  {
    id: "module-4",
    title: "Microsoft Azure Deployment",
    duration: "30 Minutes",
    lessons: ["Azure Portal", "Azure App Service", "Deploy Application", "Verify Live Website"],
  },
  {
    id: "module-5",
    title: "Launch & Next Steps",
    duration: "20 Minutes",
    lessons: ["Demo", "Career Roadmap", "Q&A", "Wrap-up"],
  },
];

const techGroups: TechGroup[] = [
  {
    title: "AI",
    icon: WandSparkles,
    items: [
      { label: "Claude AI", icon: Sparkles },
      { label: "Prompt Engineering", icon: Lightbulb },
      { label: "AI Pair Programming", icon: Code2 },
    ],
  },
  {
    title: "Development",
    icon: Code2,
    items: [
      { label: "Visual Studio Code", icon: Monitor },
      { label: "React.js", icon: FileCode2 },
      { label: "Node.js", icon: Server },
      { label: "REST APIs", icon: Layers },
    ],
  },
  {
    title: "Microsoft Azure",
    icon: Cloud,
    items: [
      { label: "Azure Portal", icon: Cloud },
      { label: "Azure App Service", icon: Globe },
      { label: "Azure Deployment", icon: Rocket },
    ],
  },
  {
    title: "Developer Tools",
    icon: Terminal,
    items: [
      { label: "Git", icon: GitBranch },
      { label: "GitHub", icon: Briefcase },
      { label: "npm", icon: Terminal },
    ],
  },
];

const defaultResourceCards: Array<{ key: string; title: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "slides", title: "Presentation Slides", icon: FileText },
  { key: "source-code", title: "Complete Source Code", icon: FileCode2 },
  { key: "architecture", title: "Architecture Diagram", icon: Layers },
  { key: "azure-guide", title: "Azure Deployment Guide", icon: Cloud },
  { key: "prompt-sheet", title: "Prompt Engineering Cheat Sheet", icon: WandSparkles },
  { key: "vscode-guide", title: "VS Code Setup Guide", icon: Monitor },
  { key: "github", title: "GitHub Repository", icon: GitBranch },
  { key: "azure-learning", title: "Azure Learning Resources", icon: GraduationCap },
];

const architectureFlow = [
  { label: "Claude AI", icon: Sparkles },
  { label: "Visual Studio Code", icon: Monitor },
  { label: "React Frontend", icon: FileCode2 },
  { label: "Node.js Backend", icon: Server },
  { label: "REST APIs", icon: Layers },
  { label: "Microsoft Azure", icon: Cloud },
  { label: "Live Website", icon: Globe },
];

const workshopWhatsappInviteUrl = "https://chat.whatsapp.com/BWcKwVALARiDtPnlRNDewk?s=cl&p=a&ilr=1";

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ChecklistRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#FF8A00]" />
      <span>{text}</span>
    </li>
  );
}

function OutcomeItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#0A66D6]" />
      <span>{text}</span>
    </li>
  );
}

export function LaunchLabWorkshopExperience({
  courseName,
  completedLessons,
  totalLessons,
  progressPercent,
  resources,
}: LaunchLabWorkshopExperienceProps) {
  const [openModuleId, setOpenModuleId] = useState<string>(modules[0]?.id || "");

  const resourceCards = useMemo(() => {
    return defaultResourceCards.map((card) => {
      const matched = resources.find((item) => item.title.toLowerCase().includes(card.title.toLowerCase().split(" ")[0]));
      return {
        ...card,
        url: matched?.url || "",
      };
    });
  }, [resources]);

  const normalizedProgress = Math.max(0, Math.min(progressPercent || 0, 100));

  return (
    <section className="bg-[radial-gradient(circle_at_top_left,rgba(10,102,214,0.10),transparent_40%),radial-gradient(circle_at_top_right,rgba(255,138,0,0.13),transparent_38%),#f8fbff] px-4 py-6 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(10,102,214,0.25),transparent_40%),radial-gradient(circle_at_top_right,rgba(255,138,0,0.22),transparent_38%),#020617] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-[#0A66D6]/15 bg-gradient-to-r from-[#0A66D6] via-[#0A4EA3] to-[#0A295C] p-6 text-white shadow-[0_22px_44px_rgba(10,41,92,0.28)] sm:p-8">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#FF8A00]/25 blur-2xl" aria-hidden />
          <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-sky-300/20 blur-xl" aria-hidden />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
              <Rocket className="h-3.5 w-3.5" />
              AI DEVELOPER LAUNCH LAB WORKSHOP
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
              {courseName || "AI Developer Launch Lab Workshop"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-blue-100 sm:text-base">
              Build, Deploy & Launch Your First AI Web Application on Microsoft Azure
            </p>
            <p className="mt-3 max-w-4xl text-sm text-blue-100/95">
              Welcome to the AI Developer Launch Lab. In this hands-on workshop, you will learn how professional developers use Claude AI to build modern web applications and deploy them live on Microsoft Azure.
              By the end of this workshop, you will have a production-ready AI web application running in the cloud.
            </p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#FFFFFF,#FFDDB6)] shadow-[0_0_18px_rgba(255,255,255,0.6)] transition-all duration-700"
                style={{ width: `${normalizedProgress}%` }}
                aria-label={`Progress ${normalizedProgress}%`}
              />
            </div>
            <p className="mt-2 text-xs text-blue-100/90">
              {completedLessons}/{Math.max(totalLessons, 1)} lessons complete ({normalizedProgress}%)
            </p>

            <div className="mt-5 grid gap-2 text-xs sm:grid-cols-3 lg:grid-cols-6">
              {[
                "Duration: 2 Hours",
                "Level: Beginner",
                "Format: Live Workshop",
                "Certificate Included",
                "Hands-on Coding",
                "Live Deployment",
              ].map((item) => (
                <span key={item} className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-center font-medium backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-[#25D366]/30 bg-[linear-gradient(135deg,#ecfdf5,#ffffff)] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-[#25D366]/50 dark:bg-[linear-gradient(135deg,#052e1f,#0f172a)]">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                Workshop WhatsApp Group
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Join the official group to receive class updates, joining instructions, and workshop support.
              </p>
            </div>
            <a
              href={workshopWhatsappInviteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#25D366,#1FA855)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              Join WhatsApp Group
            </a>
          </div>
        </section>

        <SectionCard title="Before You Join" subtitle="Get your setup ready before the workshop begins.">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "Laptop/Desktop (Windows, macOS or Linux)",
                "Stable Internet Connection",
                "Google Chrome or Microsoft Edge",
                "Visual Studio Code Installed",
                "Node.js LTS Installed",
                "Git Installed",
                "GitHub Account",
                "Microsoft Azure Free Account",
                "Claude AI Account",
              ].map((item) => (
                <ChecklistRow key={item} text={item} />
              ))}
            </ul>

            <div className="rounded-2xl border border-[#0A66D6]/20 bg-gradient-to-b from-sky-50 to-white p-5 dark:border-[#0A66D6]/40 dark:from-slate-800 dark:to-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recommended</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#0A66D6]" />Basic HTML & JavaScript Knowledge</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#0A66D6]" />Basic Command Line Knowledge</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#0A66D6]" />Second Monitor (Optional)</li>
              </ul>

              <div className="mt-4 rounded-xl border border-[#FF8A00]/30 bg-[#FFF6EC] px-4 py-3 text-sm text-[#7a3f00] dark:bg-[#321d08] dark:text-orange-200">
                No prior AI experience required. We will guide you step-by-step throughout the workshop.
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Workshop Roadmap" subtitle="Five guided modules with collapsible lesson details.">
          <div className="space-y-3">
            {modules.map((module, index) => {
              const open = openModuleId === module.id;
              return (
                <article key={module.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setOpenModuleId(open ? "" : module.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    aria-expanded={open}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66D6]/10 text-sm font-semibold text-[#0A66D6] dark:bg-[#0A66D6]/25">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold sm:text-base">{module.title}</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{module.duration}</p>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
                  </button>

                  {open ? (
                    <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {module.lessons.map((lesson) => (
                          <li key={lesson} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Tools & Technologies" subtitle="Core stack for AI-powered application development.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {techGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article key={group.title} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66D6]/10 text-[#0A66D6] dark:bg-[#0A66D6]/25">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-semibold">{group.title}</h3>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.label} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <ItemIcon className="h-3.5 w-3.5 text-[#FF8A00]" />
                          {item.label}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="End-to-End AI Application Development Workflow">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {architectureFlow.map((node, index) => {
              const Icon = node.icon;
              return (
                <div key={node.label} className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A66D6]/10 text-[#0A66D6] dark:bg-[#0A66D6]/25">
                      <Icon className="h-4 w-4" />
                    </span>
                    {node.label}
                  </div>
                  {index < architectureFlow.length - 1 ? (
                    <div className="pointer-events-none absolute -bottom-3 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-slate-300 lg:block" aria-hidden />
                  ) : null}
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Workshop Outcome">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-700/60 dark:bg-emerald-950/30">
            <h3 className="flex items-center gap-2 text-base font-semibold text-emerald-900 dark:text-emerald-100">
              <Trophy className="h-5 w-5" />
              By the End of This Workshop You Will
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Build your first AI Web Application",
                "Use Claude AI professionally",
                "Write effective AI prompts",
                "Build React Frontend",
                "Build Node.js Backend",
                "Integrate REST APIs",
                "Deploy on Microsoft Azure",
                "Publish a Live Website",
              ].map((item) => (
                <OutcomeItem key={item} text={item} />
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Resources" subtitle="Downloadable materials and references.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {resourceCards.map((resource) => {
              const Icon = resource.icon;
              const hasUrl = Boolean(resource.url);

              return (
                <article key={resource.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66D6]/10 text-[#0A66D6] dark:bg-[#0A66D6]/25">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${hasUrl ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200" : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200"}`}>
                      {hasUrl ? "Ready" : "Soon"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-100">{resource.title}</p>
                  {hasUrl ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#0A66D6] hover:text-[#0A66D6] dark:border-slate-700 dark:text-slate-200"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-3 inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Upload pending
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Assignment">
          <article className="rounded-2xl border border-[#0A66D6]/20 bg-gradient-to-r from-sky-50 to-white p-5 dark:border-[#0A66D6]/40 dark:from-slate-800 dark:to-slate-900">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Rocket className="h-4 w-4 text-[#FF8A00]" />
              Build & Deploy Your Own AI Application
            </h3>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
              Using everything learned during this workshop, create your own AI-powered web application and deploy it to Microsoft Azure.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Use Claude AI",
                "Build Responsive UI",
                "Create REST APIs",
                "Push Code to GitHub",
                "Deploy to Azure",
                "Share Live Website URL",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-[#0A66D6]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </SectionCard>

        <section className="rounded-3xl border border-[#0A66D6]/20 bg-gradient-to-r from-[#0A66D6] via-[#0B3D87] to-[#0A295C] p-8 text-center text-white shadow-[0_20px_50px_rgba(10,41,92,0.35)]">
          <h2 className="text-2xl font-bold sm:text-3xl">Congratulations!</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
            You now have the skills to build, deploy and launch AI-powered applications on Microsoft Azure.
          </p>
          <p className="mt-5 text-sm font-semibold tracking-wide text-orange-200 sm:text-base">Learn. Build. Deploy. Launch.</p>
          <p className="mt-1 text-sm text-blue-100">Welcome to the GenZNext AI Developer Community.</p>
          <a
            href="/lms/my-learning"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            <BookOpen className="h-4 w-4" />
            Continue My Learning
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </div>
    </section>
  );
}

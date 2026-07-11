import { buildMetadata } from "@/lib/metadata";
import { PrintButton } from "./PrintButton";

export const metadata = buildMetadata({
  title: "Syllabus — Cloud, DevOps & AI Engineering Program | GenZNext",
  description: "Complete 8-week syllabus for the Cloud, DevOps & AI Engineering Professional Program. Azure, Terraform, GitHub, Azure DevOps, AI tools.",
  path: "/syllabus/cloud-devops-ai-summer-2026",
});

const weekdaySchedule = [
  { week: "Week 1", days: "Tue–Fri 6–9 PM", title: "Cloud Foundations, Azure & GitHub" },
  { week: "Week 2", days: "Tue–Fri 6–9 PM", title: "Azure Virtual Machines & Terraform IaC" },
  { week: "Week 3", days: "Tue–Fri 6–9 PM", title: "Azure Networking & Connectivity" },
  { week: "Week 4", days: "Tue–Fri 6–9 PM", title: "Azure Security (NSG, Firewall, RBAC, Entra ID)" },
  { week: "Week 5", days: "Tue–Fri 6–9 PM", title: "Storage, App Services & Application Hosting" },
  { week: "Week 6", days: "Tue–Fri 6–9 PM", title: "Monitoring, Backup & Governance" },
  { week: "Week 7", days: "Tue–Fri 6–9 PM", title: "Advanced Terraform & Azure DevOps Pipelines" },
  { week: "Week 8", days: "Tue–Fri 6–9 PM", title: "AI for Cloud Engineers + Capstone Project" },
];

const weekendSchedule = [
  { week: "Week 1", days: "Sat–Sun 10AM–1PM", title: "Cloud Foundations, Azure & GitHub" },
  { week: "Week 2", days: "Sat–Sun 10AM–1PM", title: "Azure Virtual Machines & Terraform IaC" },
  { week: "Week 3", days: "Sat–Sun 10AM–1PM", title: "Azure Networking & Connectivity" },
  { week: "Week 4", days: "Sat–Sun 10AM–1PM", title: "Azure Security (NSG, Firewall, RBAC, Entra ID)" },
  { week: "Week 5", days: "Sat–Sun 10AM–1PM", title: "Storage, App Services & Application Hosting" },
  { week: "Week 6", days: "Sat–Sun 10AM–1PM", title: "Monitoring, Backup & Governance" },
  { week: "Week 7", days: "Sat–Sun 10AM–1PM", title: "Advanced Terraform & Azure DevOps Pipelines" },
  { week: "Week 8", days: "Sat–Sun 10AM–1PM", title: "AI for Cloud Engineers + Capstone Project" },
];

const modules = [
  {
    week: "Week 1",
    title: "Cloud Foundations, Azure Architecture & GitHub",
    topics: [
      "Cloud Computing: IaaS, PaaS, SaaS — deploying your own infrastructure from scratch",
      "Azure Global Infrastructure: Regions, Availability Zones, Edge Locations",
      "Azure Portal, CLI & Resource Groups",
      "Azure Subscription Management & Cost Basics",
      "Git Fundamentals: init, commit, push, pull, branching",
      "GitHub Repository setup and collaboration",
      "Terraform Installation, Providers, Workflow",
      "First Terraform Deployment: Resource Group & Storage Account",
    ],
    lab: "Setup Azure Account → Create GitHub Repo → Deploy first Azure resource with Terraform",
  },
  {
    week: "Week 2",
    title: "Azure Virtual Machines & Terraform IaC",
    topics: [
      "Windows & Linux VM deployment using IaC (not UI-clicking)",
      "VM Extensions, SSH Key Authentication, Bastion Host",
      "Availability Sets & Availability Zones (99.95% → 99.99% SLA)",
      "Virtual Machine Scale Sets (VMSS)",
      "Terraform: Variables, Outputs, Data Sources",
      "Terraform State management basics",
      "AI-assisted Terraform code generation with GitHub Copilot",
    ],
    lab: "Deploy Windows + Linux VM using Terraform, configure SSH, test HA with Availability Set",
  },
  {
    week: "Week 3",
    title: "Azure Networking & Connectivity",
    topics: [
      "Virtual Networks (VNet) and Subnet design",
      "Public vs Private IP, Network Interfaces",
      "DNS Concepts and Azure DNS",
      "VNet Peering — connecting cloud environments",
      "VPN Gateway concepts and Route Tables",
      "User Defined Routes (UDR)",
      "Terraform: Network resource deployment",
    ],
    lab: "Deploy complete 3-tier network (web, app, DB subnets) using Terraform, configure VNet Peering",
  },
  {
    week: "Week 4",
    title: "Azure Security Engineering",
    topics: [
      "Network Security Groups (NSG) — rule priority and stateful filtering",
      "Application Security Groups (ASG) — tag-based rules",
      "Azure Firewall — centralized enterprise traffic control",
      "Service Endpoints and Private Endpoints",
      "Microsoft Entra ID (Azure AD) — Users, Groups, App Registrations",
      "Role-Based Access Control (RBAC) — Least Privilege principle",
      "Multi-Factor Authentication (MFA)",
      "AI for security: detecting misconfigurations with Copilot",
    ],
    lab: "Deploy NSG + ASG rules, configure Azure Firewall, set up RBAC roles via Terraform",
  },
  {
    week: "Week 5",
    title: "Azure Storage & Application Hosting",
    topics: [
      "Storage Accounts: Blob, File Share, Queue, Table",
      "Storage redundancy: LRS, ZRS, GRS, GZRS",
      "Lifecycle Management and Access Tiers (Hot, Cool, Archive)",
      "Shared Access Signatures (SAS)",
      "Azure App Services and App Service Plans",
      "Web Application deployment (Node, Python, .NET)",
      "Custom Domains and SSL/TLS certificates",
    ],
    lab: "Deploy Storage Account + App Service using Terraform, upload a web app, configure SAS token",
  },
  {
    week: "Week 6",
    title: "Monitoring, Backup & Governance",
    topics: [
      "Azure Monitor: Metrics, Logs, Diagnostic Settings",
      "Log Analytics Workspace and KQL basics",
      "Alerts and Action Groups (email/webhook)",
      "Recovery Services Vault — VM Backup and Restore",
      "Azure Policy: compliance enforcement and drift detection",
      "Management Groups and resource tagging strategy",
      "Cost Management and budget alerts",
    ],
    lab: "Deploy full monitoring stack via Terraform, configure VM backup, write 5 Azure Policy rules",
  },
  {
    week: "Week 7",
    title: "Advanced Terraform & Azure DevOps",
    topics: [
      "Terraform Remote State with Azure Storage Backend",
      "Terraform Modules: reusable, version-controlled infrastructure",
      "Terraform Workspaces for multi-environment management",
      "Azure DevOps: Repos, Pipelines, Artifacts, Boards",
      "CI/CD Pipeline: Terraform Plan & Apply automation",
      "Terraform validation in pipelines (fmt, validate, plan)",
      "Multi-environment deployment (dev → staging → prod)",
    ],
    lab: "Build Azure DevOps pipeline that runs Terraform Plan on PR and Apply on merge to main",
  },
  {
    week: "Week 8",
    title: "AI for Cloud Engineers + Capstone Project",
    topics: [
      "GitHub Copilot for Terraform and Azure CLI generation",
      "AI for Azure Administration: diagnostic and fix suggestions",
      "Prompt Engineering for cloud engineers",
      "AI-assisted documentation and runbook generation",
      "Azure AI Studio overview for cloud engineers",
      "Capstone: Deploy production-ready Azure environment using Terraform + Azure DevOps",
      "AZ-104 Certification roadmap and exam strategy",
      "Resume building, LinkedIn optimization, interview preparation",
    ],
    lab: "Full capstone: VNet + VMs + NSG + Storage + App Service + Monitor + Backup + RBAC — 100% via Terraform, deployed via Azure DevOps CI/CD",
  },
];

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print button */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-3 print:hidden">
        <div>
          <p className="text-[13px] font-bold text-[#0F172A]">Cloud, DevOps & AI Engineering Professional Program</p>
          <p className="text-[11px] text-[#64748B]">GenZNext Research & Training · Summer 2026</p>
        </div>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 print:px-8 print:py-6">

        {/* Header */}
        <div className="border-b-2 border-[#0B2E6B] pb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#F58220]">GenZNext Research & Training</p>
              <h1 className="mt-2 text-[26px] font-extrabold leading-tight text-[#0F172A]">
                Cloud, DevOps & AI Engineering<br />Professional Program
              </h1>
              <p className="mt-2 text-[14px] text-[#475569]">
                Azure (AZ-104 Concepts) · Terraform · GitHub · Azure DevOps · AI-Powered Cloud Operations
              </p>
            </div>
            <div className="text-right text-[12px] text-[#64748B]">
              <p className="font-bold text-[#DC2626]">Summer 2026</p>
              <p>Batch: 1 July 2026</p>
              <p className="mt-1 font-bold text-[#0F172A]">₹25,000</p>
              <p className="text-[#94A3B8] line-through">₹75,000</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Duration", "8 Weeks"],
              ["Certificate", "Included"],
              ["Approach", "IaaS + AI + Hands-On"],
              ["Batch", "1 July 2026"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">{label}</p>
                <p className="mt-0.5 text-[12px] font-bold text-[#0F172A]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Batch schedules */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Weekday */}
          <div className="rounded-xl border-2 border-[#0B2E6B] p-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#0B2E6B]">⚡ Weekday Batch</p>
            <p className="mt-1 text-[13px] font-bold text-[#0F172A]">Tuesday – Friday · 6:00 PM – 9:00 PM IST</p>
            <p className="mt-1 text-[11px] text-[#64748B]">3 hours/day · 4 days/week · 8 weeks</p>
            <div className="mt-3 space-y-1">
              {weekdaySchedule.map((s) => (
                <div key={s.week} className="flex gap-2 text-[11px]">
                  <span className="w-14 shrink-0 font-bold text-[#0B2E6B]">{s.week}</span>
                  <span className="text-[#475569]">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekend */}
          <div className="rounded-xl border-2 border-[#F58220] p-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#F58220]">🗓 Weekend Batch</p>
            <p className="mt-1 text-[13px] font-bold text-[#0F172A]">Saturday – Sunday · 10:00 AM – 1:00 PM IST</p>
            <p className="mt-1 text-[11px] text-[#64748B]">3 hours/day · 2 days/week · 8 weeks</p>
            <div className="mt-3 space-y-1">
              {weekendSchedule.map((s) => (
                <div key={s.week} className="flex gap-2 text-[11px]">
                  <span className="w-14 shrink-0 font-bold text-[#F58220]">{s.week}</span>
                  <span className="text-[#475569]">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed modules */}
        <div className="mt-8">
          <h2 className="text-[18px] font-extrabold text-[#0F172A]">Detailed Week-by-Week Curriculum</h2>
          <div className="mt-4 space-y-6">
            {modules.map((mod) => (
              <div key={mod.week} className="rounded-xl border border-[#E2E8F0] p-5 print:break-inside-avoid">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-lg bg-[#EAF0FA] px-2.5 py-1 text-[11px] font-bold text-[#0B2E6B]">{mod.week}</span>
                  <h3 className="text-[15px] font-bold text-[#0F172A]">{mod.title}</h3>
                </div>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {mod.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[12px] text-[#475569]">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B2E6B]" />{t}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 rounded-lg border border-[#DBEAFE] bg-[#EEF4FB] px-3 py-2 text-[12px] font-medium text-[#1E40AF]">
                  🧪 Lab: {mod.lab}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="mt-8 rounded-xl border border-[#E2E8F0] p-5">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Technologies Covered</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Microsoft Azure", "Terraform", "Git", "GitHub", "Azure DevOps", "Microsoft Entra ID", "Azure Monitor", "Azure Backup", "Azure Networking", "Azure Security", "AI Tools for Cloud"].map((t) => (
              <span key={t} className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[12px] font-semibold text-[#0F172A]">
                ✅ {t}
              </span>
            ))}
          </div>
        </div>

        {/* Certificate + Career */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4">
            <p className="text-[13px] font-bold text-[#0F172A]">🏆 Certificate</p>
            <p className="mt-1 text-[12px] text-[#64748B]">GenZNext Professional Certificate — Industry recognized, valid for internship & job applications, can be listed on LinkedIn & resume.</p>
          </div>
          <div className="rounded-xl border border-[#E8DCCF] bg-[#FFF3E8] p-4">
            <p className="text-[13px] font-bold text-[#0F172A]">💼 Career Outcomes</p>
            <ul className="mt-1.5 space-y-1 text-[12px] text-[#64748B]">
              {["Azure Administrator", "Cloud Engineer", "Infrastructure Engineer", "Junior DevOps Engineer", "Platform Operations Engineer", "Cloud Support Engineer"].map(o => (
                <li key={o}>→ {o}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-[#E2E8F0] pt-5 text-center text-[11px] text-[#94A3B8]">
          <p className="font-semibold text-[#0F172A]">GenZNext Research & Training · NETSEEMS VENTURES PRIVATE LIMITED</p>
          <p>A19, Bungalow, Sai Jyot Park, Rahatani, Pune, Maharashtra – 411017</p>
          <p>📞 +91 8421056291 · ✉ info@genznext.com · 🌐 expertlearning.in</p>
          <p className="mt-1">GST: 27AAHCN4778J1ZU</p>
        </div>
      </div>

      <style>{`
        @media print {
          body { font-size: 12px; }
          .print\\:hidden { display: none !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}

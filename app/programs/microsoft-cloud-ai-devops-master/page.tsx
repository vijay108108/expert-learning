import {
  Award,
  Briefcase,
  Clock3,
  FolderKanban,
  GraduationCap,
  Layers,
  Server,
  Terminal,
  Users2,
  Zap,
} from "lucide-react";
import { ProgramPageLayout, type ProgramPageData } from "@/components/programs/program-page-layout";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Microsoft Cloud & AI DevOps Master Program | GenZNext",
  description:
    "Focused master track for AZ-104, AZ-400 and AIOps Engineering. Learn Azure administration, delivery pipelines, observability and incident automation in one job-ready path.",
  path: "/programs/microsoft-cloud-ai-devops-master",
});

const data: ProgramPageData = {
  badge: "AZ-104 + AZ-400 + AIOps",
  badgeColor: "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412]",
  tag: "Focused Master Track",
  tagline: "AZ-104 → AZ-400 → AIOps Engineering",
  title: "Microsoft Cloud & AI DevOps Master Program",
  description:
    "This master program is built around one clear journey: Azure administration, DevOps delivery, and AIOps-led operations. You first learn to run Microsoft Azure environments through AZ-104, then build modern CI/CD and platform workflows through AZ-400, and finally move into AIOps Engineering with observability, incident response, automation and reliability practices.",
  chips: [
    "Live Instructor-Led Sessions",
    "AZ-104 Azure Administrator",
    "AZ-400 DevOps Engineer",
    "AIOps Engineering",
    "Azure Monitor + KQL",
    "Automation Playbooks",
    "LMS Access",
    "Placement Support",
  ],
  stats: [
    { icon: Clock3, label: "24 Weeks" },
    { icon: Layers, label: "3 Phases" },
    { icon: FolderKanban, label: "3 Capstones" },
    { icon: Award, label: "AZ-104 + AZ-400" },
  ],
  price: "₹79,000",
  originalPrice: "₹90,000",
  priceLabel: "Bundle offer: join all 3 tracks together and save ₹11,000",
  enrollSlug: "microsoft-cloud-ai-devops-master-program",
  enrollFeatures: [
    { icon: Clock3, text: "24 Weeks (3 focused phases)" },
    { icon: GraduationCap, text: "Beginner to Advanced" },
    { icon: Award, text: "AZ-104 + AZ-400 exam-aligned prep" },
    { icon: Layers, text: "Azure Admin → DevOps → AIOps journey" },
    { icon: FolderKanban, text: "3 capstones + guided labs" },
    { icon: Users2, text: "Live sessions + LMS access for life" },
  ],
  roadmap: [
    "AZ-104 – Microsoft Azure Administrator",
    "AZ-400 – Microsoft DevOps Engineer",
    "AIOps Engineering",
  ],
  phases: [
    {
      label: "Phase 1",
      title: "AZ-104 – Microsoft Azure Administrator",
      duration: "8 Weeks",
      cert: "₹20,000",
      color: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
      icon: Server,
      objective:
        "Phase 1 builds your Azure operations foundation. You learn how to provision, secure, monitor and support Azure resources so you can confidently handle the responsibilities covered in AZ-104 and work like a real Azure administrator from day one.",
      modules: [
        {
          title: "Azure Identity, Governance & Resource Management",
          week: "Week 1-2",
          topics: [
            "Microsoft Entra ID users, groups and role assignments",
            "Subscriptions, resource groups, tags and locks",
            "RBAC, policies and access reviews",
            "Azure Portal, Azure CLI and Cloud Shell workflows",
          ],
          tools: ["Microsoft Entra ID", "Azure Portal", "Azure CLI", "Cloud Shell"],
          lab: "Set up a multi-environment Azure tenant with users, groups, resource groups and governance policies.",
          labOutcome: "A role-based Azure environment ready for day-to-day administration tasks.",
        },
        {
          title: "Compute, Storage & Networking Administration",
          week: "Week 3-4",
          topics: [
            "Azure VMs, availability options and scaling basics",
            "Storage accounts, blobs, file shares and access controls",
            "VNets, subnets, NSGs, public IPs and load balancing basics",
            "Backup, recovery and business continuity foundations",
          ],
          tools: ["Azure VMs", "Azure Storage", "Azure VNet", "Azure Backup"],
          lab: "Deploy and secure a small production-style workload with compute, storage and networking components.",
          labOutcome: "A working Azure workload with controlled access, backup and network segmentation.",
        },
        {
          title: "Monitoring, Security & Operations",
          week: "Week 5-6",
          topics: [
            "Azure Monitor metrics, alerts and dashboards",
            "Log Analytics workspace setup and basic KQL",
            "Application Insights for workload visibility",
            "Routine admin workflows: incident triage, backup checks and access audits",
          ],
          tools: ["Azure Monitor", "Log Analytics", "Application Insights", "KQL"],
          lab: "Create an operations dashboard with alerts for CPU, storage, service health and failed sign-ins.",
          labOutcome: "A practical admin monitoring setup for Azure day-2 operations.",
        },
        {
          title: "AZ-104 Administrator Capstone",
          week: "Week 7-8",
          topics: [
            "End-to-end Azure environment review",
            "Exam objective revision and scenario-based practice",
            "Admin troubleshooting playbooks",
            "Operational documentation for handover",
          ],
          tools: ["Azure Portal", "Azure CLI", "Azure Monitor", "Microsoft Entra ID"],
          lab: "Build and document an Azure admin environment that covers identity, compute, storage, networking and monitoring.",
          labOutcome: "A portfolio-ready Azure administration capstone mapped to AZ-104 outcomes.",
        },
      ],
      capstone: {
        title: "Phase 1 Capstone – Azure Administration Environment",
        deliverables: [
          "Governed Azure subscription structure with RBAC and policies",
          "Provisioned compute, storage and networking resources",
          "Admin dashboard with alerts and logs",
          "Operational runbook for routine Azure support tasks",
        ],
      },
    },
    {
      label: "Phase 2",
      title: "AZ-400 – Microsoft DevOps Engineer",
      duration: "8 Weeks",
      cert: "₹30,000",
      color: "bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]",
      icon: Layers,
      objective:
        "Phase 2 takes you from administration into delivery engineering. You learn how teams plan work, manage code, automate builds, ship releases and standardize environments across Azure using modern DevOps practices aligned with AZ-400.",
      modules: [
        {
          title: "Planning, Repos & Collaboration Workflows",
          week: "Week 9-10",
          topics: [
            "Azure Boards, backlogs, sprints and work tracking",
            "Git workflows, pull requests and branch policies",
            "Repo security, code review expectations and release traceability",
            "Azure DevOps vs GitHub Actions delivery models",
          ],
          tools: ["Azure Boards", "Azure Repos", "GitHub", "Pull Requests"],
          lab: "Set up a team delivery workflow with work items, repo permissions, pull request rules and sprint tracking.",
          labOutcome: "A structured DevOps project flow that mirrors real engineering teams.",
        },
        {
          title: "CI/CD Pipelines & Release Automation",
          week: "Week 11-12",
          topics: [
            "Build pipelines and artifact publishing",
            "Multi-stage release pipelines for dev, test and production",
            "Approvals, checks and environment-specific deployments",
            "Rollback planning and release verification",
          ],
          tools: ["Azure Pipelines", "GitHub Actions", "Artifacts", "Environments"],
          lab: "Create a multi-stage pipeline that builds, tests and deploys an application across three environments.",
          labOutcome: "A repeatable CI/CD workflow with approvals and controlled production release.",
        },
        {
          title: "Infrastructure, Containers & Platform Delivery",
          week: "Week 13-14",
          topics: [
            "Infrastructure as code with Bicep and Terraform",
            "Container build, image storage and release flow",
            "AKS deployment basics for DevOps teams",
            "Configuration management and reusable pipeline templates",
          ],
          tools: ["Bicep", "Terraform", "ACR", "AKS"],
          lab: "Provision delivery infrastructure as code and ship a containerized app through a release pipeline.",
          labOutcome: "A cloud delivery platform that combines IaC, containers and automated deployment.",
        },
        {
          title: "AZ-400 DevOps Capstone",
          week: "Week 15-16",
          topics: [
            "Pipeline optimization and governance",
            "DevOps metric review: deployment frequency, change failure rate and lead time",
            "Exam scenario revision and troubleshooting practice",
            "Documentation for engineering handoff",
          ],
          tools: ["Azure DevOps", "GitHub Actions", "Bicep", "Terraform"],
          lab: "Build a complete Azure DevOps delivery workflow from planning to production deployment.",
          labOutcome: "A capstone pipeline mapped to AZ-400 delivery and collaboration outcomes.",
        },
      ],
      capstone: {
        title: "Phase 2 Capstone – Azure DevOps Delivery Platform",
        deliverables: [
          "Sprint and work-item workflow for an engineering team",
          "Multi-stage CI/CD pipeline with approvals",
          "Infrastructure as code for deployment environments",
          "Container release workflow for Azure-hosted applications",
        ],
      },
    },
    {
      label: "Phase 3",
      title: "AIOps Engineering",
      duration: "8 Weeks",
      cert: "₹40,000",
      color: "bg-[#FEF3C7] text-[#92400E] border-[#FED7AA]",
      icon: Zap,
      objective:
        "Phase 3 focuses on intelligent operations. You learn how to observe live systems, correlate operational signals, automate responses and improve reliability using Azure-native monitoring, logging and incident automation patterns that define AIOps Engineering.",
      modules: [
        {
          title: "Observability Foundations for Cloud Platforms",
          week: "Week 17-18",
          topics: [
            "Metrics, logs and traces in Azure operations",
            "Azure Monitor workbooks, dashboards and alert strategy",
            "Application Insights for service-level visibility",
            "Log Analytics queries and KQL for operations analysis",
          ],
          tools: ["Azure Monitor", "Application Insights", "Log Analytics", "KQL"],
          lab: "Design an observability stack for an Azure application with actionable dashboards and alert rules.",
          labOutcome: "A complete monitoring baseline for real platform operations.",
        },
        {
          title: "Incident Intelligence & Operational Automation",
          week: "Week 19-20",
          topics: [
            "Alert correlation, triage patterns and incident routing",
            "Azure Automation runbooks for repeatable remediation",
            "Logic Apps for alert-to-action workflows",
            "Operational handoff between admin, DevOps and support teams",
          ],
          tools: ["Azure Automation", "Logic Apps", "Azure Monitor Alerts", "Runbooks"],
          lab: "Automate a common production incident flow from alert creation to remediation and notification.",
          labOutcome: "A functioning alert-to-action playbook for day-2 cloud operations.",
        },
        {
          title: "Reliability, Capacity & Predictive Operations",
          week: "Week 21-22",
          topics: [
            "SLOs, SLIs and reliability reviews",
            "Trend analysis with KQL and operational baselines",
            "Capacity planning using historical platform data",
            "Runbook-driven response for recurring failure patterns",
          ],
          tools: ["KQL", "Azure Monitor", "Log Analytics", "Operational Dashboards"],
          lab: "Build a reliability review pack that tracks health, trends and recurring incidents for a production workload.",
          labOutcome: "A data-driven operations model for scaling support and improving uptime.",
        },
        {
          title: "AIOps Engineering Capstone",
          week: "Week 23-24",
          topics: [
            "Observability architecture review",
            "Incident automation refinement",
            "Reliability reporting and stakeholder communication",
            "Portfolio presentation and mentor review",
          ],
          tools: ["Azure Monitor", "Application Insights", "Azure Automation", "Logic Apps"],
          lab: "Create an AIOps operating model that detects, analyzes and automates response for real service incidents.",
          labOutcome: "A production-style AIOps capstone demonstrating monitoring, analysis and remediation.",
        },
      ],
      capstone: {
        title: "Phase 3 Capstone – AIOps Operations Hub",
        deliverables: [
          "Cloud observability dashboard with meaningful alerting",
          "KQL-based incident analysis workflows",
          "Automation runbooks for common remediation paths",
          "AIOps portfolio case study showing improved operational response",
        ],
      },
    },
  ],
  bonusTracks: [
    {
      icon: Server,
      title: "AZ-104 Practice Labs",
      topics: [
        "Identity and RBAC revision tasks",
        "Networking and storage admin drills",
        "Monitoring and backup troubleshooting scenarios",
        "Hands-on AZ-104 style challenge exercises",
      ],
    },
    {
      icon: Terminal,
      title: "AZ-400 Pipeline Templates",
      topics: [
        "Reusable Azure Pipeline starter templates",
        "GitHub Actions workflow patterns for Azure delivery",
        "IaC deployment templates with Bicep and Terraform",
        "Release governance and approval checklist practice",
      ],
    },
    {
      icon: Zap,
      title: "AIOps KQL & Runbook Practice",
      topics: [
        "KQL query drills for operations teams",
        "Alert tuning and dashboard refinement exercises",
        "Automation runbook scenarios for common incidents",
        "Operational reporting templates for reliability reviews",
      ],
    },
  ],
  certifications: [
    { code: "AZ-104", title: "Microsoft Azure Administrator Associate", emoji: "🔧" },
    { code: "AZ-400", title: "Microsoft DevOps Engineer Expert", emoji: "⚙️" },
    { code: "AIOps", title: "AIOps Engineering Capstone Portfolio", emoji: "📈" },
  ],
  projects: [
    {
      title: "Azure Administration Landing Zone",
      desc: "Identity, governance, compute, storage and networking setup aligned to AZ-104 administration tasks.",
    },
    {
      title: "Operations Monitoring Workspace",
      desc: "Azure Monitor, Application Insights and Log Analytics setup for daily platform administration.",
    },
    {
      title: "Azure DevOps Team Workflow",
      desc: "Boards, repos, pull requests and release controls for a real project team.",
    },
    {
      title: "Multi-Stage CI/CD Pipeline",
      desc: "Build, test and deploy through Azure DevOps and GitHub Actions across multiple environments.",
    },
    {
      title: "Infrastructure-as-Code Release Platform",
      desc: "Provision Azure delivery environments with Bicep and Terraform and connect them to pipelines.",
    },
    {
      title: "AIOps Operations Hub",
      desc: "Observability, KQL analysis, incident dashboards and automation playbooks for production-style support.",
    },
  ],
  technologies: [
    "Microsoft Azure",
    "Azure Portal",
    "Azure CLI",
    "Microsoft Entra ID",
    "Azure VMs",
    "Azure Storage",
    "Azure Networking",
    "Azure Monitor",
    "Log Analytics",
    "Application Insights",
    "KQL",
    "Azure DevOps",
    "Azure Boards",
    "Azure Repos",
    "Azure Pipelines",
    "GitHub Actions",
    "Bicep",
    "Terraform",
    "ACR",
    "AKS",
    "Azure Automation",
    "Logic Apps",
  ],
  careerTiers: [
    {
      level: "Entry-Level (0-1 yr) · ₹4-7 LPA",
      roles: ["Azure Administrator", "Cloud Operations Engineer", "Junior DevOps Engineer", "Azure Support Engineer"],
      color: "border-[#BFDBFE] bg-[#EFF6FF]",
    },
    {
      level: "Mid-Level (1-3 yr) · ₹8-16 LPA",
      roles: ["Azure DevOps Engineer", "Release Engineer", "Platform Engineer", "Cloud Reliability Engineer"],
      color: "border-[#BBF7D0] bg-[#F0FDF4]",
    },
    {
      level: "Advanced (3+ yr) · ₹18-30 LPA",
      roles: ["AIOps Engineer", "Site Reliability Engineer", "Cloud Operations Lead", "Platform Operations Architect"],
      color: "border-[#FED7AA] bg-[#FFF7ED]",
    },
  ],
  idealFor: [
    {
      icon: GraduationCap,
      title: "Students & Fresh Graduates",
      desc: "A clear Microsoft cloud path for learners who want Azure administration first, DevOps second, and operations engineering as the final specialization.",
      color: "text-[#4F46E5]",
      bg: "bg-[#EEF2FF]",
    },
    {
      icon: Briefcase,
      title: "IT Support & System Admins",
      desc: "Ideal if you already support infrastructure and want to move into Azure administration, release engineering and cloud operations leadership.",
      color: "text-[#059669]",
      bg: "bg-[#ECFDF5]",
    },
    {
      icon: Users2,
      title: "Developers & DevOps Aspirants",
      desc: "Useful for engineers who want structured exposure to Azure delivery pipelines and then want to specialize in monitoring, incident response and reliability.",
      color: "text-[#D97706]",
      bg: "bg-[#FFFBEB]",
    },
  ],
  faqs: [
    {
      q: "What is the exact learning path in this program?",
      a: "The program follows one fixed path: AZ-104 first, AZ-400 second, and AIOps Engineering last. You begin with Azure administration, move into DevOps delivery, and then learn observability, incident automation and reliability engineering.",
    },
    {
      q: "Can I join if I am new to Azure and DevOps?",
      a: "Yes. Phase 1 starts with Azure administration fundamentals and builds upward. The path is designed so that Phase 2 and Phase 3 make sense only after the Azure base from AZ-104 is in place.",
    },
    {
      q: "Are AZ-104 and AZ-400 both covered properly?",
      a: "Yes. The first two phases are aligned specifically to the responsibilities and scenarios behind AZ-104 and AZ-400. Labs, projects and revision modules are structured around those outcomes.",
    },
    {
      q: "What does the AIOps Engineering phase include?",
      a: "It covers Azure Monitor, Application Insights, Log Analytics, KQL, alerting, automation runbooks, Logic Apps and reliability workflows so you can operate cloud platforms intelligently instead of just monitoring them passively.",
    },
    {
      q: "How is the fee structured?",
      a: "The full value of the three tracks is ₹90,000: ₹20,000 for AZ-104, ₹30,000 for AZ-400 and ₹40,000 for AIOps Engineering. The master bundle is offered at ₹79,000.",
    },
    {
      q: "What will I have at the end of the program?",
      a: "You will finish with three aligned capstones: an Azure administration environment, a DevOps delivery platform and an AIOps operations hub, along with guided preparation for AZ-104 and AZ-400.",
    },
  ],
};

export default function MicrosoftCloudAiDevOpsMasterPage() {
  return <ProgramPageLayout data={data} />;
}

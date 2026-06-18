import { Award, Briefcase, Clock3, Code2, FolderKanban, GraduationCap, Layers, Server, Shield, Sparkles, Users2 } from "lucide-react";
import { ProgramPageLayout, type ProgramPageData } from "@/components/programs/program-page-layout";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Microsoft Cloud Master Program | GenZNext Research & Training",
  description:
    "20-week Microsoft Azure program: AZ-900, AZ-104, AZ-204/AI-200 & AZ-305 certification prep. Note: AZ-204 retires July 31 2026 — program updated to include AI-200 Azure AI Cloud Developer.",
  path: "/programs/microsoft-cloud-master",
});

const data: ProgramPageData = {
  badge: "Microsoft Azure Track",
  badgeColor: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1E40AF]",
  tagline: "Become a Job-Ready Azure Cloud Professional",
  title: "Microsoft Cloud Master Program",
  description:
    "A 20-week, mentor-led program covering the complete Microsoft Azure career path — from AZ-900 fundamentals to AZ-305 Solutions Architect — with live labs, enterprise projects, LMS access, and placement support.",
  chips: ["Live Instructor-Led", "AZ-900 Prep", "AZ-104 Prep", "AZ-204 Prep", "AZ-305 Prep", "10+ Projects", "LMS Access"],
  stats: [
    { icon: Clock3, label: "20 Weeks" },
    { icon: Award, label: "4 Certifications" },
    { icon: FolderKanban, label: "10+ Projects" },
    { icon: Users2, label: "Live Mentorship" },
  ],
  price: "Rs. 71,999",
  originalPrice: "Rs. 71,999",
  priceLabel: "All 4 Microsoft Azure tracks included",
  enrollSlug: "microsoft-cloud-master-program",
  enrollFeatures: [
    { icon: Clock3, text: "20 Weeks (5 Months)" },
    { icon: GraduationCap, text: "Beginner to Advanced" },
    { icon: FolderKanban, text: "10+ Real-World Azure Projects" },
    { icon: Award, text: "AZ-900 + AZ-104 + AZ-204 + AZ-305 Prep" },
    { icon: Shield, text: "Identity, Security & Governance labs" },
    { icon: Users2, text: "Live Sessions + LMS Access" },
  ],
  roadmap: ["AZ-900 / AI-901 Fundamentals", "AZ-104 Administrator", "AZ-204 → AI-200 Developer", "AZ-305 Solutions Architect Expert"],
  phases: [
    {
      label: "Phase 1",
      title: "AZ-900 — Azure Fundamentals",
      duration: "3 Weeks",
      cert: "AZ-900",
      color: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
      icon: Sparkles,
      objective: "Build foundational knowledge of Azure cloud services, core architectural components, security, compliance, pricing and support. Ideal starting point for cloud beginners.",
      modules: [
        {
          title: "Module 1 — Cloud Concepts & Azure Architecture",
          topics: [
            "Cloud computing models: IaaS, PaaS, SaaS",
            "Public, Private & Hybrid cloud",
            "Azure global infrastructure: Regions, AZs, Edge Zones",
            "Azure Sovereign Regions (Government, China)",
            "Azure Resource Groups, Subscriptions & Management Groups",
            "Azure Arc overview",
          ],
          lab: "Create Azure Free account, navigate portal, create Resource Groups & set RBAC roles",
        },
        {
          title: "Module 2 — Core Azure Services",
          topics: [
            "Compute: VMs, App Services, Azure Functions, AKS",
            "Networking: VNet, VPN Gateway, ExpressRoute, CDN",
            "Storage: Blob, File, Queue, Table, Disk",
            "Databases: Azure SQL, Cosmos DB, Azure Database for PostgreSQL/MySQL",
            "Azure AI Services overview (Cognitive, OpenAI)",
            "Azure DevOps & GitHub Actions overview",
          ],
          lab: "Deploy a simple web app on Azure App Service and connect to Azure SQL Database",
        },
        {
          title: "Module 3 — Security, Compliance & Pricing",
          topics: [
            "Microsoft Entra ID (Azure AD) basics",
            "Azure RBAC — roles and permissions",
            "Microsoft Defender for Cloud overview",
            "Azure Policy & Compliance Manager",
            "Azure Pricing Calculator & TCO Calculator",
            "Azure Cost Management & Billing",
          ],
          lab: "Set up Cost Management budget alerts and explore Azure Policy compliance",
        },
      ],
      capstone: {
        title: "AZ-900 Practice Sprint",
        deliverables: [
          "Web app deployed on Azure App Service",
          "Resource Group with RBAC policies applied",
          "Cost budget and billing alerts configured",
          "300+ practice questions completed",
        ],
      },
    },
    {
      label: "Phase 2",
      title: "AZ-104 — Azure Administrator",
      duration: "8 Weeks",
      cert: "AZ-104",
      color: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
      icon: Server,
      objective: "Master the administration of Azure cloud infrastructure. Learn how to manage identities, virtual machines, storage, networking, monitoring and governance in enterprise environments.",
      modules: [
        {
          title: "Module 1 — Microsoft Entra ID & Identity",
          topics: [
            "Entra ID: Users, Groups, Service Principals",
            "RBAC: built-in and custom roles",
            "Conditional Access Policies",
            "Multi-Factor Authentication (MFA)",
            "Privileged Identity Management (PIM)",
            "Azure AD B2B & B2C overview",
          ],
          lab: "Configure enterprise IAM: users, groups, MFA and conditional access for a team",
        },
        {
          title: "Module 2 — Virtual Machines & Compute",
          topics: [
            "VM sizes, series and pricing tiers",
            "VM deployment: portal, CLI, ARM templates",
            "Availability Sets & Availability Zones",
            "Virtual Machine Scale Sets (VMSS)",
            "Azure Bastion & JIT VM Access",
            "VM Backup with Azure Recovery Services Vault",
          ],
          lab: "Deploy a Linux and Windows VM, configure VMSS with auto-scale, set up Azure Backup",
        },
        {
          title: "Module 3 — Azure Virtual Networking",
          topics: [
            "VNet design: CIDR, subnets, route tables",
            "Network Security Groups (NSG) and ASGs",
            "Azure Load Balancer (Standard) and Application Gateway",
            "Azure Firewall and Firewall Policy",
            "VNet Peering and Service Endpoints",
            "Azure DNS and Private DNS Zones",
          ],
          lab: "Design a 3-tier network: web, app and DB subnets with NSG rules and load balancer",
        },
        {
          title: "Module 4 — Azure Storage",
          topics: [
            "Blob storage: access tiers, lifecycle management",
            "Azure Files: SMB/NFS shares and Azure File Sync",
            "Storage accounts: redundancy (LRS, ZRS, GRS, GZRS)",
            "Shared Access Signatures (SAS) and stored policies",
            "Azure Storage encryption and firewall rules",
            "AzCopy & Azure Storage Explorer",
          ],
          lab: "Configure blob storage with lifecycle rules, SAS tokens and encryption policies",
        },
        {
          title: "Module 5 — App Services & Serverless",
          topics: [
            "Azure App Service plans and deployment slots",
            "Web App: deployment from GitHub, Docker, ZIP",
            "Azure Functions: triggers, bindings, Durable Functions",
            "Azure Logic Apps: workflow automation",
            "Azure Container Instances (ACI)",
            "Azure Container Registry (ACR)",
          ],
          lab: "Deploy a .NET or Python web app with staging slot and blue-green deployment",
        },
        {
          title: "Module 6 — Monitoring & Governance",
          topics: [
            "Azure Monitor: metrics, logs and alerts",
            "Log Analytics Workspace and KQL queries",
            "Application Insights: APM and distributed tracing",
            "Azure Policy: definitions, assignments and compliance",
            "Azure Blueprints and Management Groups",
            "Azure Cost Management: tags, budgets, advisor",
          ],
          lab: "Build a monitoring dashboard with 20+ KQL queries, alerts and compliance reporting",
        },
      ],
      capstone: {
        title: "AZ-104 Capstone — Enterprise Azure Infrastructure",
        deliverables: [
          "Multi-tier VNet with subnets, NSG, ASG, load balancer",
          "VM scale set with auto-scaling and monitoring",
          "Storage with lifecycle management and encryption",
          "App Service deployment with slot swapping",
          "Azure Monitor dashboard and policy compliance report",
          "Backup and disaster recovery configuration",
        ],
      },
    },
    {
      label: "Phase 3",
      title: "AZ-204 → AI-200 — Azure AI Cloud Developer Associate",
      duration: "5 Weeks",
      cert: "AZ-204 → AI-200 (AZ-204 retires Jul 31, 2026)",
      color: "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]",
      icon: Code2,
      objective: "Learn how to design, build, test and maintain Azure cloud applications. Master serverless development, API management, messaging, caching and Azure security from a developer perspective.",
      modules: [
        {
          title: "Module 1 — Azure App Service & Serverless Development",
          topics: [
            "App Service: authentication, custom domains, TLS/SSL",
            "Deployment: CI/CD via GitHub Actions and Azure DevOps",
            "Azure Functions: isolated worker model, Durable Functions",
            "Event-driven patterns with Event Grid, Event Hubs",
            "Azure Service Bus: queues, topics and subscriptions",
            "Azure API Management: policies, products and subscriptions",
          ],
          lab: "Build an event-driven order processing system using Service Bus and Azure Functions",
        },
        {
          title: "Module 2 — Data Storage & Caching",
          topics: [
            "Azure Cosmos DB: SQL API, partition keys, consistency levels",
            "Azure SQL Database: elastic pools, geo-replication",
            "Azure Cache for Redis: caching patterns and configuration",
            "Blob storage SDK: upload, download, metadata, SAS generation",
            "Table Storage and Queue Storage for lightweight data",
            "Azure Cognitive Search integration",
          ],
          lab: "Build a full-stack app with Cosmos DB, Redis caching and Blob storage",
        },
        {
          title: "Module 3 — Security, Monitoring & Deployment",
          topics: [
            "Microsoft Entra ID: app registrations, OAuth2 and OIDC",
            "Managed Identities and Key Vault references",
            "Azure Key Vault: secrets, keys and certificates",
            "Application Insights: custom events, metrics and live metrics stream",
            "Azure Container Apps and Docker deployment",
            "ARM templates and Bicep for developer IaC",
          ],
          lab: "Secure an Azure app with Managed Identity + Key Vault, containerise and deploy",
        },
      ],
      capstone: {
        title: "AZ-204 Capstone — Cloud-Native Application",
        deliverables: [
          "Serverless API: Functions + Service Bus + Cosmos DB",
          "Entra ID OAuth2 authentication flow",
          "Redis caching for hot data paths",
          "Key Vault for all secrets and certificates",
          "Application Insights monitoring with custom dashboards",
        ],
      },
    },
    {
      label: "Phase 4",
      title: "AZ-305 — Azure Solutions Architect",
      duration: "4 Weeks",
      cert: "AZ-305",
      color: "bg-[#F5F3FF] text-[#4C1D95] border-[#DDD6FE]",
      icon: Layers,
      objective: "Develop the expertise to design enterprise-grade Azure solutions covering identity, data storage, compute, networking, security, compliance and business continuity. Become an Azure architect.",
      modules: [
        {
          title: "Module 1 — Designing Identity & Security Solutions",
          topics: [
            "Hybrid identity: Entra ID Connect and Pass-through Auth",
            "Azure AD DS and SSPR",
            "Zero Trust architecture principles",
            "Azure Sentinel: SIEM, detection rules, playbooks",
            "Microsoft Defender for Cloud architecture",
            "Designing governance: Management Groups, Policy, Blueprints",
          ],
          lab: "Design and document a Zero Trust identity architecture for an enterprise",
        },
        {
          title: "Module 2 — Designing Data Storage & Compute Solutions",
          topics: [
            "Selecting storage: Blob vs ADLS Gen2 vs Azure Files",
            "Data integration: Azure Data Factory, Synapse, Databricks",
            "Designing compute: VMs vs AKS vs App Service vs Functions",
            "Azure Landing Zone architecture and CAF",
            "Migration: Azure Migrate and Database Migration Service",
            "High availability patterns: N+1, active-active, geo-redundancy",
          ],
          lab: "Design the architecture for a multi-region, HA SaaS application with a write-up",
        },
        {
          title: "Module 3 — Designing Networks & Business Continuity",
          topics: [
            "Hub-and-spoke vs Virtual WAN network topologies",
            "Azure Front Door: global load balancing and WAF",
            "DDoS Protection and Azure Web Application Firewall",
            "Business continuity: RTO/RPO, backup strategies",
            "Azure Site Recovery for VM and workload failover",
            "Cost optimisation strategies for enterprise architectures",
          ],
          lab: "Design and present a complete enterprise Azure architecture with DR strategy",
        },
      ],
      capstone: {
        title: "AZ-305 Final Architecture Case Study",
        deliverables: [
          "Azure Landing Zone design for a 500-person enterprise",
          "Hub-spoke network topology with Azure Firewall",
          "Multi-region active-active application deployment",
          "Security and compliance framework documentation",
          "Business continuity plan with RTO/RPO targets",
          "Presented architecture review (mock Microsoft exam format)",
        ],
      },
    },
  ],
  projects: [
    { title: "Azure Static Web App + CDN", desc: "React/HTML app deployed to Azure Static Web Apps with custom domain, HTTPS and CDN" },
    { title: "Enterprise VM Infrastructure", desc: "Multi-VM deployment with VMSS, Azure Bastion, load balancer and Recovery Services Vault" },
    { title: "3-Tier Azure Network Design", desc: "VNet with public/private subnets, NSG rules, Application Gateway and Azure Firewall" },
    { title: "Serverless Order Processing API", desc: "Azure Functions + Service Bus + Cosmos DB event-driven order management system" },
    { title: "Cloud-Native Web Application", desc: "App Service + Azure SQL + Redis Cache + Application Insights monitoring" },
    { title: "Secure Key Vault Integration", desc: "App with Managed Identity accessing Key Vault secrets — zero hardcoded credentials" },
    { title: "Azure Data Pipeline", desc: "Azure Data Factory ETL pipeline ingesting data from Blob to Azure SQL with monitoring" },
    { title: "Container App on AKS", desc: "Docker app deployed to Azure Kubernetes Service with ACR, HPA and Azure Monitor" },
    { title: "Multi-Region DR Setup", desc: "Azure Site Recovery + geo-redundant storage + Traffic Manager failover configuration" },
    { title: "Enterprise Architecture Design", desc: "Full AZ-305-style architecture: Landing Zone, hub-spoke network, security, compliance documentation" },
  ],
  technologies: ["Azure VMs", "Azure App Service", "Azure Functions", "Azure SQL", "Cosmos DB", "Azure Storage", "AKS", "Azure DevOps", "Terraform", "Bicep", "Azure Monitor", "Key Vault", "Entra ID", "Azure Sentinel"],
  certifications: [
    { code: "AZ-900", title: "Microsoft Azure Fundamentals", emoji: "🌐" },
    { code: "AZ-104", title: "Microsoft Azure Administrator", emoji: "🔧" },
    { code: "AZ-204 / AI-200", title: "Azure Developer → Azure AI Cloud Developer (AZ-204 retires Jul 2026)", emoji: "💻" },
    { code: "AZ-305", title: "Microsoft Azure Solutions Architect Expert", emoji: "🏗️" },
  ],
  careerTiers: [
    { level: "Entry-Level (0–1 yr)", roles: ["Azure Cloud Administrator", "Cloud Support Engineer", "Azure Operations Engineer", "Junior Cloud Developer"], color: "border-[#BFDBFE] bg-[#EFF6FF]" },
    { level: "Mid-Level (1–3 yr)", roles: ["Azure Developer", "Cloud Engineer", "DevOps Engineer (Azure)", "Azure Platform Engineer"], color: "border-[#BBF7D0] bg-[#F0FDF4]" },
    { level: "Advanced (3+ yr)", roles: ["Azure Solutions Architect", "Cloud Architect", "Principal Azure Engineer", "Cloud Security Architect"], color: "border-[#DDD6FE] bg-[#F5F3FF]" },
  ],
  idealFor: [
    { icon: GraduationCap, title: "Students & Freshers", desc: "Get all 4 Microsoft Azure certifications in 5 months. The AZ-104 alone commands a 30–50% salary premium at most MNCs.", color: "text-[#4F46E5]", bg: "bg-[#EEF2FF]" },
    { icon: Briefcase, title: "IT Professionals & Sysadmins", desc: "Migrate your on-premise Windows Server and Active Directory skills directly to Azure. Familiar technologies, new cloud context.", color: "text-[#059669]", bg: "bg-[#ECFDF5]" },
    { icon: Users2, title: ".NET / Java Developers", desc: "Learn to build AI-integrated cloud applications on Azure. AZ-204 retires Jul 2026 — we prepare you for its replacement, AI-200 Azure AI Cloud Developer.", color: "text-[#D97706]", bg: "bg-[#FFFBEB]" },
  ],
};

export default function MicrosoftCloudMasterProgramPage() {
  return <ProgramPageLayout data={data} />;
}

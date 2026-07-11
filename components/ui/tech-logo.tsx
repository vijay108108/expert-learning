/* ══════════════════════════════════════════════════════════
   Tech Pills — clean colored text badges, no icons needed.
   Brand-accurate background colors for instant recognition.
══════════════════════════════════════════════════════════ */

type TechItem = { name: string; bg: string; fg: string };

/* ── Tech stacks per program ─────────────────────────────── */

export const programTechStacks: Record<string, TechItem[]> = {

  /* ── AI Tools Master ───────────────────────────────────── */
  "ai-tools-master": [
    { name: "ChatGPT",          bg: "#D1FAE5", fg: "#065F46" },
    { name: "Claude AI",        bg: "#FEF3C7", fg: "#92400E" },
    { name: "Gemini",           bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "Microsoft Copilot",bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Midjourney",       bg: "#F1F5F9", fg: "#0F172A" },
    { name: "DALL-E 3",         bg: "#ECFDF5", fg: "#065F46" },
    { name: "Runway",           bg: "#E0F2FE", fg: "#0369A1" },
    { name: "Google Veo 3",     bg: "#FEE2E2", fg: "#991B1B" },
    { name: "ElevenLabs",       bg: "#FFF7ED", fg: "#9A3412" },
    { name: "HeyGen",           bg: "#EDE9FE", fg: "#4C1D95" },
    { name: "GitHub Copilot",   bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "Cursor 3",         bg: "#F8FAFC", fg: "#0F172A" },
    { name: "Perplexity",       bg: "#ECFEFF", fg: "#164E63" },
    { name: "Notion AI",        bg: "#F8FAFC", fg: "#111827" },
    { name: "Jasper AI",        bg: "#EDE9FE", fg: "#4C1D95" },
    { name: "Canva AI",         bg: "#ECFEFF", fg: "#0E7490" },
    { name: "Zapier AI",        bg: "#FFF1F2", fg: "#9F1239" },
    { name: "Make",             bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "Gamma AI",         bg: "#EDE9FE", fg: "#5B21B6" },
    { name: "Julius AI",        bg: "#F0FDF4", fg: "#166534" },
    { name: "Grammarly",        bg: "#F0FDF4", fg: "#15803D" },
    { name: "Otter.ai",         bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "DeepSeek V4",      bg: "#0F172A", fg: "#E2E8F0" },
    { name: "Bolt.new",         bg: "#FEFCE8", fg: "#854D0E" },
    { name: "Fireflies.ai",     bg: "#FEF2F2", fg: "#991B1B" },
  ],

  /* ── MS Cloud + AI DevOps ──────────────────────────────── */
  "microsoft-cloud-ai-devops-master": [
    { name: "Microsoft Azure",  bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure Portal",     bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Azure CLI",        bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "Entra ID",         bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "Azure Monitor",    bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Log Analytics",    bg: "#EEF4FB", fg: "#15407E" },
    { name: "Application Insights", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "KQL",              bg: "#EAF0FA", fg: "#3730A3" },
    { name: "Azure DevOps",     bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Azure Boards",     bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure Pipelines",  bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "GitHub Actions",   bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Terraform",        bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "Bicep",            bg: "#EEF4FB", fg: "#15407E" },
    { name: "ACR",              bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "AKS",              bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "Azure Automation", bg: "#FFF7ED", fg: "#9A3412" },
    { name: "Logic Apps",       bg: "#FFF7ED", fg: "#C2410C" },
  ],

  "azure-administrator": [
    { name: "Microsoft Azure", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure Portal", bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Azure CLI", bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "Entra ID", bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "RBAC", bg: "#EAF0FA", fg: "#3730A3" },
    { name: "Azure VMs", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "VNet", bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "NSG", bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "Load Balancer", bg: "#EEF4FB", fg: "#15407E" },
    { name: "Storage Accounts", bg: "#F0FDF4", fg: "#166534" },
    { name: "Blob Storage", bg: "#F0FDF4", fg: "#14532D" },
    { name: "Azure Backup", bg: "#FFF7ED", fg: "#9A3412" },
    { name: "Azure Monitor", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Log Analytics", bg: "#EEF4FB", fg: "#15407E" },
  ],

  "azure-devops-engineer": [
    { name: "Azure DevOps", bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Azure Boards", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure Repos", bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "Azure Pipelines", bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "GitHub Actions", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Terraform", bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "Bicep", bg: "#EEF4FB", fg: "#15407E" },
    { name: "ARM Templates", bg: "#EAF0FA", fg: "#3730A3" },
    { name: "Azure Monitor", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Application Insights", bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Policy as Code", bg: "#FEF3C7", fg: "#92400E" },
    { name: "Key Vault", bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Secret Scanning", bg: "#FEF2F2", fg: "#991B1B" },
    { name: "Release Gates", bg: "#FFF7ED", fg: "#C2410C" },
  ],

  "aiops-engineering": [
    { name: "Azure Monitor", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Log Analytics", bg: "#EEF4FB", fg: "#15407E" },
    { name: "Application Insights", bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "KQL", bg: "#EAF0FA", fg: "#3730A3" },
    { name: "Workbooks", bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "Alerts", bg: "#FEF3C7", fg: "#92400E" },
    { name: "Action Groups", bg: "#FFF7ED", fg: "#C2410C" },
    { name: "Azure Automation", bg: "#FFF7ED", fg: "#9A3412" },
    { name: "Logic Apps", bg: "#FFF7ED", fg: "#C2410C" },
    { name: "Runbooks", bg: "#FEFCE8", fg: "#854D0E" },
    { name: "Service Health", bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "Dashboards", bg: "#E0F2FE", fg: "#075985" },
    { name: "Incident Response", bg: "#FEF2F2", fg: "#991B1B" },
    { name: "SRE Practices", bg: "#FFF3E8", fg: "#5B21B6" },
  ],

  /* ── Master AI & Generative AI ────────────────────────── */
  "ai-generative-ai-master": [
    { name: "Python 3.11",      bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "OpenAI GPT-5.5",   bg: "#D1FAE5", fg: "#065F46" },
    { name: "Claude Opus 4.8",  bg: "#FEF3C7", fg: "#92400E" },
    { name: "Gemini 3 Pro",     bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "DeepSeek V4",      bg: "#0F172A", fg: "#E2E8F0" },
    { name: "LangChain",        bg: "#ECFDF5", fg: "#065F46" },
    { name: "LlamaIndex",       bg: "#EDE9FE", fg: "#4C1D95" },
    { name: "LangSmith",        bg: "#ECFDF5", fg: "#166534" },
    { name: "LangGraph",        bg: "#ECFDF5", fg: "#065F46" },
    { name: "Pinecone",         bg: "#ECFDF5", fg: "#14532D" },
    { name: "ChromaDB",         bg: "#FFF7ED", fg: "#9A3412" },
    { name: "Qdrant",           bg: "#FFF1F2", fg: "#881337" },
    { name: "HuggingFace",      bg: "#FEF3C7", fg: "#92400E" },
    { name: "FastAPI",          bg: "#ECFDF5", fg: "#065F46" },
    { name: "Docker",           bg: "#EEF4FB", fg: "#0369A1" },
    { name: "CrewAI",           bg: "#FEF2F2", fg: "#991B1B" },
    { name: "AutoGen",          bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure OpenAI",     bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "RAGAS",            bg: "#EDE9FE", fg: "#5B21B6" },
    { name: "Whisper API",      bg: "#D1FAE5", fg: "#065F46" },
    { name: "DALL-E 3",         bg: "#D1FAE5", fg: "#065F46" },
    { name: "Redis",            bg: "#FEF2F2", fg: "#991B1B" },
    { name: "GitHub Actions",   bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Guardrails AI",    bg: "#FFF3E8", fg: "#5B21B6" },
  ],

  /* ── AWS Cloud Master ──────────────────────────────────── */
  "aws-cloud-master": [
    { name: "Amazon AWS",       bg: "#FEF3C7", fg: "#78350F" },
    { name: "EC2",              bg: "#FEF3C7", fg: "#92400E" },
    { name: "S3",               bg: "#F0FDF4", fg: "#14532D" },
    { name: "Lambda",           bg: "#FEF3C7", fg: "#78350F" },
    { name: "VPC",              bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "RDS",              bg: "#EAF0FA", fg: "#3730A3" },
    { name: "DynamoDB",         bg: "#EAF0FA", fg: "#3730A3" },
    { name: "EKS",              bg: "#FEF3C7", fg: "#92400E" },
    { name: "ECS Fargate",      bg: "#FEF3C7", fg: "#78350F" },
    { name: "IAM",              bg: "#FEF2F2", fg: "#991B1B" },
    { name: "CloudFormation",   bg: "#FDF2F8", fg: "#831843" },
    { name: "CloudWatch",       bg: "#FDF2F8", fg: "#9D174D" },
    { name: "CloudFront",       bg: "#FFF3E8", fg: "#6B21A8" },
    { name: "Route 53",         bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "API Gateway",      bg: "#FEF3C7", fg: "#78350F" },
    { name: "Terraform",        bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "CodePipeline",     bg: "#EAF0FA", fg: "#3730A3" },
    { name: "Systems Manager",  bg: "#FEF3C7", fg: "#92400E" },
    { name: "Security Hub",     bg: "#FEF2F2", fg: "#991B1B" },
    { name: "Athena",           bg: "#FEF3C7", fg: "#78350F" },
    { name: "SNS / SQS",        bg: "#FEF3C7", fg: "#92400E" },
    { name: "AWS CLI",          bg: "#F8FAFC", fg: "#374151" },
    { name: "SAM",              bg: "#FEF3C7", fg: "#78350F" },
    { name: "Elastic Load Balancer", bg: "#FEF3C7", fg: "#9A3412" },
  ],

  /* ── Microsoft Cloud Master ────────────────────────────── */
  "microsoft-cloud-master": [
    { name: "Microsoft Azure",  bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure VMs",        bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "AKS",              bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "App Service",      bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure Functions",  bg: "#FEF3C7", fg: "#92400E" },
    { name: "Azure SQL",        bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Cosmos DB",        bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Entra ID",         bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "Key Vault",        bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure Monitor",    bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Sentinel",         bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "Defender for Cloud",bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Bicep",            bg: "#EEF4FB", fg: "#15407E" },
    { name: "Terraform",        bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "GitHub Actions",   bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure DevOps",     bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "ACR",              bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Logic Apps",       bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Service Bus",      bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "AI-200",           bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "Application Insights", bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Log Analytics",    bg: "#EEF4FB", fg: "#15407E" },
    { name: "Azure Policy",     bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Azure Bastion",    bg: "#DBEAFE", fg: "#1E3A8A" },
  ],

  /* ── DevOps Master ─────────────────────────────────────── */
  "devops-master": [
    { name: "Linux",            bg: "#FEFCE8", fg: "#713F12" },
    { name: "Bash",             bg: "#F0FDF4", fg: "#166534" },
    { name: "Git",              bg: "#FEF2F2", fg: "#991B1B" },
    { name: "GitHub",           bg: "#F8FAFC", fg: "#0F172A" },
    { name: "Docker",           bg: "#EEF4FB", fg: "#0369A1" },
    { name: "Kubernetes 1.36",  bg: "#EAF0FA", fg: "#3730A3" },
    { name: "Helm",             bg: "#E0F2FE", fg: "#075985" },
    { name: "Argo CD v3",       bg: "#FFF7ED", fg: "#C2410C" },
    { name: "KEDA",             bg: "#EAF0FA", fg: "#3730A3" },
    { name: "Jenkins",          bg: "#FEF2F2", fg: "#991B1B" },
    { name: "GitHub Actions",   bg: "#EEF4FB", fg: "#1D4ED8" },
    { name: "Azure DevOps",     bg: "#EEF4FB", fg: "#1E40AF" },
    { name: "Terraform",        bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "OpenTofu 1.12",    bg: "#EDE9FE", fg: "#4C1D95" },
    { name: "Prometheus",       bg: "#FFF7ED", fg: "#9A3412" },
    { name: "Grafana",          bg: "#FFF7ED", fg: "#C2410C" },
    { name: "Loki",             bg: "#FFF7ED", fg: "#9A3412" },
    { name: "SonarQube",        bg: "#EEF4FB", fg: "#0369A1" },
    { name: "Trivy",            bg: "#EAF0FA", fg: "#3730A3" },
    { name: "cert-manager",     bg: "#DBEAFE", fg: "#1E40AF" },
    { name: "Nginx",            bg: "#F0FDF4", fg: "#14532D" },
    { name: "OpenTelemetry",    bg: "#FFF3E8", fg: "#5B21B6" },
    { name: "Python",           bg: "#DBEAFE", fg: "#1E3A8A" },
    { name: "Datadog",          bg: "#FFF3E8", fg: "#6B21A8" },
  ],
};

/* ── TechStackGrid ───────────────────────────────────────── */
export function TechStackGrid({ slug, max = 16 }: { slug: string; max?: number }) {
  const stack  = programTechStacks[slug] ?? [];
  const shown  = stack.slice(0, max);
  const hidden = stack.length - shown.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <span
          key={item.name}
          className="inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold leading-none"
          style={{ backgroundColor: item.bg, color: item.fg }}
        >
          {item.name}
        </span>
      ))}
      {hidden > 0 && (
        <span className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#64748B]">
          +{hidden} more
        </span>
      )}
    </div>
  );
}

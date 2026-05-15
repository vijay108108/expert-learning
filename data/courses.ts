export type CourseCategoryKey =
  | "aws"
  | "azure"
  | "ai"
  | "devops";

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  rating: number;
  duration: string;
  level: string;
  price: string;
  highlight: string;
  category: CourseCategoryKey;
  icon:
    | "cloud"
    | "cloudCog"
    | "database"
    | "ai"
    | "brain"
    | "code"
    | "layers"
    | "briefcase";
  tags: string[];
};

export const courseCategories = [
  {
    key: "aws",
    title: "AWS Programs",
    description: "Role-based certification tracks for architecture, DevOps, and cloud foundations.",
    href: "/courses/aws",
    gradient: "from-[#0B1F3A] to-[#2563EB]",
  },
  {
    key: "azure",
    title: "Azure Programs",
    description: "Microsoft-aligned tracks for administrators, solution architects, and AI engineers.",
    href: "/courses/azure",
    gradient: "from-[#2563EB] to-[#60A5FA]",
  },
  {
    key: "ai",
    title: "AI & GenAI",
    description: "Applied AI programs built around LLM workflows, prompting, and business use cases.",
    href: "/courses/ai",
    gradient: "from-[#F97316] to-[#2563EB]",
  },
  {
    key: "devops",
    title: "DevOps Programs",
    description: "Hands-on pipelines, containers, automation, and platform engineering bootcamps.",
    href: "/courses/devops",
    gradient: "from-[#0B1F3A] to-[#F97316]",
  },
] as const;

export const coursesByCategory: Record<CourseCategoryKey, Course[]> = {
  aws: [
    {
      slug: "aws-cloud-practitioner",
      title: "AWS Cloud Practitioner",
      subtitle: "Launch your cloud journey with guided labs, certification prep, and interview support.",
      rating: 4.8,
      duration: "6 Weeks",
      level: "Beginner",
      price: "Rs. 14,999",
      highlight: "Best for IT beginners",
      category: "aws",
      icon: "cloud",
      tags: ["AWS", "Foundations", "Live Labs"],
    },
    {
      slug: "aws-solutions-architect",
      title: "AWS Solutions Architect",
      subtitle: "Architect scalable systems with VPCs, IAM, serverless design, and migration projects.",
      rating: 4.9,
      duration: "12 Weeks",
      level: "Intermediate",
      price: "Rs. 28,999",
      highlight: "Most popular certification",
      category: "aws",
      icon: "cloudCog",
      tags: ["Architecture", "Certification", "Projects"],
    },
    {
      slug: "aws-devops-engineer",
      title: "AWS DevOps Engineer",
      subtitle: "Master CI/CD, IaC, observability, and release engineering on AWS production stacks.",
      rating: 4.8,
      duration: "10 Weeks",
      level: "Advanced",
      price: "Rs. 26,999",
      highlight: "Built for working professionals",
      category: "aws",
      icon: "code",
      tags: ["CI/CD", "Terraform", "Monitoring"],
    },
    {
      slug: "aws-data-engineer",
      title: "AWS Data Engineer",
      subtitle: "Design modern pipelines with Glue, Athena, Redshift, and event-driven analytics.",
      rating: 4.7,
      duration: "10 Weeks",
      level: "Intermediate",
      price: "Rs. 24,999",
      highlight: "Data + cloud specialization",
      category: "aws",
      icon: "database",
      tags: ["Data Lakes", "ETL", "Analytics"],
    },
  ],
  azure: [
    {
      slug: "azure-administrator",
      title: "Azure Administrator",
      subtitle: "Operate Azure environments with confidence using networking, governance, and monitoring labs.",
      rating: 4.8,
      duration: "8 Weeks",
      level: "Beginner",
      price: "Rs. 18,999",
      highlight: "Fast-track to Azure admin roles",
      category: "azure",
      icon: "cloud",
      tags: ["AZ-104", "Governance", "Virtual Networks"],
    },
    {
      slug: "azure-solutions-architect",
      title: "Azure Solutions Architect",
      subtitle: "Build hybrid, secure, and enterprise-grade Azure architectures with mentor guidance.",
      rating: 4.9,
      duration: "12 Weeks",
      level: "Advanced",
      price: "Rs. 30,999",
      highlight: "Enterprise architecture focus",
      category: "azure",
      icon: "cloudCog",
      tags: ["AZ-305", "Hybrid Cloud", "Security"],
    },
    {
      slug: "azure-ai-engineer",
      title: "Azure AI Engineer",
      subtitle: "Deploy intelligent apps with Azure AI services, search, and applied machine learning.",
      rating: 4.8,
      duration: "10 Weeks",
      level: "Intermediate",
      price: "Rs. 27,499",
      highlight: "Cloud AI specialization",
      category: "azure",
      icon: "ai",
      tags: ["AI Services", "Search", "Azure ML"],
    },
    {
      slug: "azure-devops",
      title: "Azure DevOps",
      subtitle: "Ship production workflows with repos, boards, pipelines, and release automation.",
      rating: 4.7,
      duration: "8 Weeks",
      level: "Intermediate",
      price: "Rs. 22,999",
      highlight: "Strong team delivery workflow",
      category: "azure",
      icon: "layers",
      tags: ["Pipelines", "Boards", "Release"],
    },
  ],
  ai: [
    {
      slug: "generative-ai-master-program",
      title: "Generative AI Master Program",
      subtitle: "A flagship program covering prompt design, RAG, evaluation, and AI product execution.",
      rating: 4.9,
      duration: "14 Weeks",
      level: "Intermediate",
      price: "Rs. 34,999",
      highlight: "Flagship GenAI career track",
      category: "ai",
      icon: "ai",
      tags: ["GenAI", "RAG", "Portfolio"],
    },
    {
      slug: "prompt-engineering",
      title: "Prompt Engineering",
      subtitle: "Learn prompting patterns, agent workflows, and high-quality outputs across real scenarios.",
      rating: 4.8,
      duration: "4 Weeks",
      level: "Beginner",
      price: "Rs. 9,999",
      highlight: "Quick upskilling sprint",
      category: "ai",
      icon: "brain",
      tags: ["Prompts", "Agents", "Use Cases"],
    },
    {
      slug: "ai-for-business",
      title: "AI for Business",
      subtitle: "Translate AI opportunities into ROI with case studies, workflows, and cross-functional adoption.",
      rating: 4.7,
      duration: "5 Weeks",
      level: "Beginner",
      price: "Rs. 11,999",
      highlight: "Ideal for managers and founders",
      category: "ai",
      icon: "briefcase",
      tags: ["Strategy", "Automation", "Leadership"],
    },
    {
      slug: "openai-llm-engineering",
      title: "OpenAI & LLM Engineering",
      subtitle: "Build production-ready LLM apps with APIs, evaluation patterns, and deployment workflows.",
      rating: 4.9,
      duration: "8 Weeks",
      level: "Advanced",
      price: "Rs. 24,999",
      highlight: "Developer-centric AI program",
      category: "ai",
      icon: "code",
      tags: ["LLMs", "APIs", "Deployment"],
    },
  ],
  devops: [
    {
      slug: "docker-kubernetes",
      title: "Docker & Kubernetes",
      subtitle: "Containerize, orchestrate, and scale cloud-native apps with battle-tested patterns.",
      rating: 4.8,
      duration: "8 Weeks",
      level: "Intermediate",
      price: "Rs. 19,999",
      highlight: "Core platform engineering skillset",
      category: "devops",
      icon: "layers",
      tags: ["Containers", "K8s", "Deployments"],
    },
    {
      slug: "terraform",
      title: "Terraform",
      subtitle: "Automate infrastructure provisioning with reusable modules, policy guardrails, and workflows.",
      rating: 4.8,
      duration: "5 Weeks",
      level: "Intermediate",
      price: "Rs. 12,999",
      highlight: "Hands-on IaC projects",
      category: "devops",
      icon: "code",
      tags: ["IaC", "Modules", "Automation"],
    },
    {
      slug: "ci-cd-pipeline",
      title: "CI/CD Pipeline Engineering",
      subtitle: "Build robust testing and deployment systems with observability and rollback strategies.",
      rating: 4.7,
      duration: "6 Weeks",
      level: "Intermediate",
      price: "Rs. 14,999",
      highlight: "Operational excellence focus",
      category: "devops",
      icon: "cloudCog",
      tags: ["Automation", "Release", "Quality"],
    },
    {
      slug: "jenkins-github-actions",
      title: "Jenkins & GitHub Actions",
      subtitle: "Create scalable pipelines from legacy Jenkins to modern GitHub automation flows.",
      rating: 4.7,
      duration: "5 Weeks",
      level: "Beginner",
      price: "Rs. 10,999",
      highlight: "Best for delivery teams",
      category: "devops",
      icon: "cloud",
      tags: ["Jenkins", "GitHub Actions", "CI"],
    },
  ],
};

export const allCourses = Object.values(coursesByCategory).flat();

export function getCategoryData(category: string) {
  return courseCategories.find((item) => item.key === category);
}

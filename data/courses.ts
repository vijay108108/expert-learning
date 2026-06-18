import type { IconKey } from "@/lib/icon-map";

export type CourseCategoryKey = "aws" | "azure" | "ai" | "devops";
export type CourseBadgeTone = "green" | "orange" | "blue" | "purple";
export type CourseTrackKey =
  | "ai"
  | "generative-ai"
  | "agentic-ai"
  | "devsecops"
  | "aws-certifications"
  | "azure-certifications";
export type CourseMode = "live" | "self-paced" | "recorded" | "hybrid";
export type CoursePriceType = "one-time";

export type CourseLesson = {
  title: string;
  description: string;
  url: string;
  duration: string;
  lessonType: "youtube";
  locked: boolean;
};

export type CourseResource = {
  title: string;
  description: string;
  type: "official-doc" | "pdf" | "notes" | "assignment" | "certification-guide";
  url: string;
};

export type CourseFaq = {
  question: string;
  answer: string;
};

export type Course = {
  title: string;
  slug: string;
  track: CourseTrackKey;
  category: CourseCategoryKey;
  shortDescription: string;
  longDescription: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  mode: CourseMode;
  priceType: CoursePriceType;
  certification: string;
  toolsCovered: string[];
  skillsYouWillLearn: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  prerequisites: string[];
  syllabusModules: string[];
  projects: string[];
  officialResources: CourseResource[];
  youtubeLessons: CourseLesson[];
  lmsResources: CourseResource[];
  faqs: CourseFaq[];
  subtitle: string;
  overview: string;
  rating: number;
  priceValue: number;
  originalPriceValue: number;
  price: string;
  originalPrice: string;
  highlight: string;
  tagLabel: string;
  tagTone: CourseBadgeTone;
  certificate: string;
  icon: IconKey;
  tags: string[];
  officialSyllabusUrl: string;
  roadmap: string[];
  outcomes: string[];
};

function formatPrice(value: number) {
  return `INR ${value.toLocaleString("en-IN")}`;
}

function buildYoutubeLessons(trackTitle: string): CourseLesson[] {
  return [
    {
      title: `${trackTitle} Overview Session`,
      description: "Program introduction and learning roadmap.",
      url: "",
      duration: "~15 mins",
      lessonType: "youtube",
      locked: false,
    },
    {
      title: `${trackTitle} Hands-on Lab Walkthrough`,
      description: "Practical implementation walkthrough with mentor notes.",
      url: "",
      duration: "~20 mins",
      lessonType: "youtube",
      locked: false,
    },
    {
      title: `${trackTitle} Advanced Discussion`,
      description: "Exam and project strategy for production-level readiness.",
      url: "",
      duration: "~16 mins",
      lessonType: "youtube",
      locked: true,
    },
  ];
}

function createCourse(input: Omit<Course, "price" | "originalPrice" | "overview" | "subtitle" | "roadmap" | "outcomes">): Course {
  return {
    ...input,
    subtitle: input.shortDescription,
    overview: input.longDescription,
    roadmap: input.syllabusModules,
    outcomes: input.learningOutcomes,
    price: formatPrice(input.priceValue),
    originalPrice: formatPrice(input.originalPriceValue),
  };
}

const commonOfficialResources: CourseResource[] = [
  {
    title: "Microsoft Learn",
    description: "Official learning paths and role-based modules.",
    type: "official-doc",
    url: "https://learn.microsoft.com/training/",
  },
  {
    title: "AWS Skill Builder",
    description: "Official AWS labs and certification prep journeys.",
    type: "official-doc",
    url: "https://skillbuilder.aws/",
  },
  {
    title: "AWS Training",
    description: "Official AWS training and certification guidance.",
    type: "official-doc",
    url: "https://aws.amazon.com/training/",
  },
  {
    title: "Azure Documentation",
    description: "Official Azure service and architecture docs.",
    type: "official-doc",
    url: "https://learn.microsoft.com/azure/",
  },
  {
    title: "GitHub Documentation",
    description: "Actions, security, and developer workflow documentation.",
    type: "official-doc",
    url: "https://docs.github.com/",
  },
  {
    title: "Kubernetes Documentation",
    description: "Official Kubernetes concepts and production guides.",
    type: "official-doc",
    url: "https://kubernetes.io/docs/home/",
  },
  {
    title: "Docker Documentation",
    description: "Official Docker engine and container docs.",
    type: "official-doc",
    url: "https://docs.docker.com/",
  },
  {
    title: "OWASP Top 10",
    description: "Security reference for secure-by-design engineering.",
    type: "official-doc",
    url: "https://owasp.org/www-project-top-ten/",
  },
];

function buildLmsResources(courseName: string): CourseResource[] {
  return [
    { title: `${courseName} PDF Notes`, description: "Module-wise revision notes.", type: "pdf", url: "/contact" },
    { title: `${courseName} Mentor Notes`, description: "Practical implementation notes.", type: "notes", url: "/contact" },
    { title: `${courseName} Practice Assignment`, description: "Hands-on assignment with review rubric.", type: "assignment", url: "/contact" },
    { title: `${courseName} Certification Guide`, description: "Exam blueprint and revision checkpoints.", type: "certification-guide", url: "/contact" },
  ];
}

function buildFaqs(certification: string): CourseFaq[] {
  return [
    {
      question: "Is this course suitable for working professionals?",
      answer: "Yes. The course includes flexible recorded support and assignment windows for working learners.",
    },
    {
      question: "Do I get certification preparation support?",
      answer: `Yes. This program includes structured guidance for ${certification} with revision plans and mock checkpoints.`,
    },
  ];
}

function buildCourseData(): Record<CourseCategoryKey, Course[]> {
  const aiCourses: Course[] = [
    createCourse({
      title: "Agentic AI Engineering",
      slug: "agentic-ai-engineering",
      track: "agentic-ai",
      category: "ai",
      shortDescription: "Design and deploy tool-using autonomous AI agent systems.",
      longDescription:
        "This advanced program covers planning loops, memory, tool orchestration, workflow governance, and reliability patterns for production-ready agentic applications.",
      level: "Advanced",
      duration: "8 Weeks",
      mode: "live",
      priceType: "one-time",
      certification: "GenZNext Agentic AI Engineering Credential",
      toolsCovered: ["LangChain", "LangGraph", "OpenAI APIs", "Vector Databases", "Tracing tools"],
      skillsYouWillLearn: ["Agent architecture", "Tool orchestration", "State management", "Execution reliability"],
      learningOutcomes: ["Build multi-step AI agents", "Implement safe tool-use patterns", "Monitor agent decisions"],
      targetAudience: ["AI engineers", "GenAI developers", "Automation teams"],
      prerequisites: ["GenAI basics", "Python", "API integration experience"],
      syllabusModules: ["Overview", "Recorded YouTube Lessons", "Official Learning Resources", "Practice Assignments", "Certification Preparation", "Final Project"],
      projects: ["Research agent workflow", "Operations automation agent"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Agentic AI Engineering"),
      lmsResources: buildLmsResources("Agentic AI Engineering"),
      faqs: buildFaqs("Agentic AI Engineering"),
      rating: 4.8,
      priceValue: 16499,
      originalPriceValue: 21999,
      highlight: "Advanced Engineering",
      tagLabel: "Enterprise Ready",
      tagTone: "blue",
      certificate: "Agentic AI Engineering Completion",
      icon: "brain",
      tags: ["Agentic AI", "Automation", "LLM Systems"],
      officialSyllabusUrl: "https://docs.github.com/en/copilot",
    }),
  ];

  const devsecopsCourses: Course[] = [];

  const awsCourses: Course[] = [
    createCourse({
      title: "AWS Solutions Architect Associate",
      slug: "aws-solutions-architect",
      track: "aws-certifications",
      category: "aws",
      shortDescription: "Design secure, scalable AWS architectures aligned to SAA-C03.",
      longDescription:
        "A role-based architecture program covering networking, compute, storage, resilience, and best-practice design trade-offs for AWS Solutions Architect Associate.",
      level: "Intermediate",
      duration: "8 Weeks",
      mode: "live",
      priceType: "one-time",
      certification: "SAA-C03",
      toolsCovered: ["VPC", "Route 53", "ALB", "RDS", "Lambda", "CloudFormation"],
      skillsYouWillLearn: ["Architecture design", "High availability", "Cost optimization", "Security by design"],
      learningOutcomes: ["Design AWS architectures", "Plan resilient systems", "Prepare for SAA-C03 exam"],
      targetAudience: ["Cloud engineers", "Developers", "System administrators"],
      prerequisites: ["Basic AWS knowledge"],
      syllabusModules: ["Overview", "Recorded YouTube Lessons", "Official Learning Resources", "Practice Assignments", "Certification Preparation", "Final Project"],
      projects: ["Multi-tier architecture design", "Resilience and DR blueprint"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AWS Solutions Architect Associate"),
      lmsResources: buildLmsResources("AWS Solutions Architect Associate"),
      faqs: buildFaqs("SAA-C03"),
      rating: 4.9,
      priceValue: 14999,
      originalPriceValue: 20999,
      highlight: "Top AWS Track",
      tagLabel: "Most Popular",
      tagTone: "orange",
      certificate: "AWS Solutions Architect Associate Completion",
      icon: "cloudCog",
      tags: ["AWS", "SAA-C03", "Architecture"],
      officialSyllabusUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    }),
  ];

  const azureCourses: Course[] = [
    createCourse({
      title: "Azure Administrator AZ-104",
      slug: "azure-administrator",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Master day-to-day Azure administration workflows and services.",
      longDescription:
        "A practical administrator pathway focused on identity, compute, networking, storage, and monitoring aligned to Azure Administrator AZ-104 outcomes.",
      level: "Intermediate",
      duration: "8 Weeks",
      mode: "hybrid",
      priceType: "one-time",
      certification: "AZ-104",
      toolsCovered: ["Azure Portal", "Entra ID", "VMs", "VNet", "Storage Accounts", "Azure Monitor"],
      skillsYouWillLearn: ["Azure administration", "Identity and access", "Monitoring operations", "Resource governance"],
      learningOutcomes: ["Manage Azure infrastructure", "Apply admin best practices", "Prepare for AZ-104"],
      targetAudience: ["System admins", "Cloud engineers", "IT professionals"],
      prerequisites: ["Basic cloud concepts"],
      syllabusModules: ["Overview", "Recorded YouTube Lessons", "Official Learning Resources", "Practice Assignments", "Certification Preparation", "Final Project"],
      projects: ["Azure operations baseline", "Monitoring and alerting implementation"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure Administrator AZ-104"),
      lmsResources: buildLmsResources("Azure Administrator AZ-104"),
      faqs: buildFaqs("AZ-104"),
      rating: 4.8,
      priceValue: 8999,
      originalPriceValue: 13999,
      highlight: "Career Track",
      tagLabel: "Most Popular",
      tagTone: "orange",
      certificate: "Azure Administrator AZ-104 Completion",
      icon: "cloudCog",
      tags: ["Azure", "AZ-104", "Admin"],
      officialSyllabusUrl: "https://learn.microsoft.com/certifications/azure-administrator/",
    }),
    createCourse({
      title: "Azure Solutions Architect AZ-305",
      slug: "azure-solutions-architect",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Design enterprise-grade Azure architectures for AZ-305 certification.",
      longDescription:
        "Advanced architecture journey focused on security, governance, hybrid cloud, high availability, and scalable system design aligned to AZ-305.",
      level: "Advanced",
      duration: "9 Weeks",
      mode: "live",
      priceType: "one-time",
      certification: "AZ-305",
      toolsCovered: ["Azure Architecture Center", "VNet", "AKS", "Identity", "Governance", "DR planning"],
      skillsYouWillLearn: ["Architecture decision making", "Hybrid design", "Security architecture", "Cost-aware planning"],
      learningOutcomes: ["Design Azure enterprise architecture", "Present architecture trade-offs", "Prepare for AZ-305"],
      targetAudience: ["Cloud architects", "Senior engineers", "Technical leads"],
      prerequisites: ["AZ-104 level understanding"],
      syllabusModules: ["Overview", "Recorded YouTube Lessons", "Official Learning Resources", "Practice Assignments", "Certification Preparation", "Final Project"],
      projects: ["Enterprise reference architecture", "Disaster recovery architecture plan"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure Solutions Architect AZ-305"),
      lmsResources: buildLmsResources("Azure Solutions Architect AZ-305"),
      faqs: buildFaqs("AZ-305"),
      rating: 4.9,
      priceValue: 16999,
      originalPriceValue: 22999,
      highlight: "Enterprise Architecture",
      tagLabel: "Advanced",
      tagTone: "purple",
      certificate: "Azure Solutions Architect AZ-305 Completion",
      icon: "topology",
      tags: ["Azure", "AZ-305", "Architecture"],
      officialSyllabusUrl: "https://learn.microsoft.com/certifications/azure-solutions-architect/",
    }),
    createCourse({
      title: "Azure DevOps Engineer AZ-400",
      slug: "azure-devops-engineer",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Build secure Azure and GitHub delivery pipelines aligned to AZ-400.",
      longDescription:
        "Professional Azure DevSecOps track focused on source control strategy, CI/CD architecture, release governance, observability, and AZ-400 exam outcomes.",
      level: "Advanced",
      duration: "8 Weeks",
      mode: "live",
      priceType: "one-time",
      certification: "AZ-400",
      toolsCovered: ["Azure DevOps", "GitHub Actions", "Pipelines", "Boards", "Repos", "Azure Monitor"],
      skillsYouWillLearn: ["DevSecOps planning", "Pipeline automation", "Release controls", "Monitoring strategy"],
      learningOutcomes: ["Implement Azure DevSecOps pipelines", "Improve release reliability", "Prepare for AZ-400"],
      targetAudience: ["DevOps engineers", "Platform engineers", "Cloud teams"],
      prerequisites: ["Azure admin basics", "CI/CD understanding"],
      syllabusModules: ["Overview", "Recorded YouTube Lessons", "Official Learning Resources", "Practice Assignments", "Certification Preparation", "Final Project"],
      projects: ["Enterprise release pipeline", "Secure IaC deployment workflow"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure DevOps Engineer AZ-400"),
      lmsResources: buildLmsResources("Azure DevOps Engineer AZ-400"),
      faqs: buildFaqs("AZ-400"),
      rating: 4.8,
      priceValue: 15499,
      originalPriceValue: 21499,
      highlight: "Professional Delivery",
      tagLabel: "Industry Ready",
      tagTone: "blue",
      certificate: "Azure DevOps Engineer AZ-400 Completion",
      icon: "shield",
      tags: ["Azure", "AZ-400", "DevSecOps"],
      officialSyllabusUrl: "https://learn.microsoft.com/certifications/devops-engineer/",
    }),
  ];

  return {
    aws: awsCourses,
    azure: azureCourses,
    ai: aiCourses,
    devops: devsecopsCourses,
  };
}

export const coursesByCategory: Record<CourseCategoryKey, Course[]> = buildCourseData();

export const courseCategories = [
  {
    key: "aws",
    title: "AWS Certifications",
    description: "Role-based AWS certification learning tracks from foundation to professional level.",
    href: "/courses/aws",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
  {
    key: "azure",
    title: "Azure Certifications",
    description: "Microsoft-aligned certification pathways for administrators, developers, architects, and DevSecOps engineers.",
    href: "/courses/azure",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
  {
    key: "ai",
    title: "AI, Generative AI & Agentic AI",
    description: "Practical AI tracks with project-based, certification-focused, and production-oriented outcomes.",
    href: "/courses/ai",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
  {
    key: "devops",
    title: "DevSecOps",
    description: "Secure CI/CD, cloud-native operations, Kubernetes hardening, and enterprise automation pathways.",
    href: "/courses/devops",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
] as const;

export type CategoryExperienceContent = {
  metadataDescription: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
};

export const categoryExperienceContent: Record<CourseCategoryKey, CategoryExperienceContent> = {
  aws: {
    metadataDescription: "AWS certification-ready courses with mentor-led projects, revision support, and practical cloud delivery.",
    sectionEyebrow: "AWS CERTIFICATIONS",
    sectionTitle: "Build your AWS certification and cloud engineering pathway",
    sectionDescription: "From Cloud Practitioner to DevOps Engineer Professional, these tracks are designed for practical, role-oriented career growth.",
  },
  azure: {
    metadataDescription: "Azure certification tracks for beginners and professionals across admin, developer, architect, and DevSecOps roles.",
    sectionEyebrow: "AZURE CERTIFICATIONS",
    sectionTitle: "Prepare for AZ-900, AZ-104, AZ-204, AZ-305, and AZ-400 with confidence",
    sectionDescription: "Structured Azure learning paths with labs, official docs, and certification preparation support.",
  },
  ai: {
    metadataDescription: "AI, Generative AI, and Agentic AI programs with project-driven practical outcomes and LMS resources.",
    sectionEyebrow: "AI LEARNING TRACKS",
    sectionTitle: "Master practical AI, GenAI, and agentic systems with project-based learning",
    sectionDescription: "Move from fundamentals to advanced implementation with structured modules, mentor guidance, and portfolio-focused outputs.",
  },
  devops: {
    metadataDescription: "DevSecOps programs for secure software delivery, pipeline hardening, and cloud-native observability.",
    sectionEyebrow: "DEVSECOPS TRACKS",
    sectionTitle: "Design secure CI/CD and production-ready cloud delivery systems",
    sectionDescription: "Build security-first automation skills across GitHub Actions, Kubernetes security, and enterprise pipeline workflows.",
  },
};

export function getCategoryExperienceContent(category: string) {
  if (category in categoryExperienceContent) {
    return categoryExperienceContent[category as CourseCategoryKey];
  }
  return null;
}

export const allCourses = Object.values(coursesByCategory).flat();

export function getCategoryData(category: string) {
  return courseCategories.find((item) => item.key === category);
}

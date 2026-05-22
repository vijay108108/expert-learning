import {
  allCourses,
  type Course,
  type CourseCategoryKey,
} from "@/data/courses";
import { siteConfig } from "@/lib/site-config";

export type LmsCategoryKey = CourseCategoryKey | "summer-training";
export type LmsProgramStatus = "live" | "upcoming";
export type LmsLessonStatus = "available" | "scheduled";
export type LmsLessonKind = "video" | "lab" | "resource";

export type LmsLesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  kind: LmsLessonKind;
  status: LmsLessonStatus;
  embedUrl?: string;
};

export type LmsModule = {
  id: string;
  title: string;
  summary: string;
  lessons: LmsLesson[];
};

export type LmsProgram = {
  courseSlug: string;
  category: CourseCategoryKey;
  batchStartDate: string;
  trainingDays: string;
  status: LmsProgramStatus;
  mentorNote: string;
  heroSummary: string;
  totalClasses: number;
  totalResources: number;
  classTimeLabel: string;
  classPlatform: string;
  whatsappGroupUrl: string;
  liveClassUrl: string;
  modules: LmsModule[];
};

export type SummerTrainingHighlight = {
  courseSlug: string;
  title: string;
  subtitle: string;
  batchStartDate: string;
  trainingDays: string;
  status: LmsProgramStatus;
  supportNote: string;
};

const programCategoryOrder: CourseCategoryKey[] = ["ai", "aws", "azure", "devops"];
const sampleAzureLessonUrl = "https://www.youtube.com/embed/vEeAXhz0bSE";

const courseMap = new Map(allCourses.map((course) => [course.slug, course]));

function requireCourse(slug: string) {
  const course = courseMap.get(slug);

  if (!course) {
    throw new Error(`LMS content setup is missing course data for ${slug}.`);
  }

  return course;
}

function buildModules(
  course: Course,
  availableVideos: Partial<Record<number, string>> = {},
) {
  return course.roadmap.map<LmsModule>((step, index) => {
    const embedUrl = availableVideos[index];
    const lessonStatus: LmsLessonStatus = embedUrl ? "available" : "scheduled";

    return {
      id: `${course.slug}-module-${index + 1}`,
      title: step,
      summary: course.outcomes[index] || course.subtitle,
      lessons: [
        {
          id: `${course.slug}-lesson-${index + 1}`,
          title: embedUrl ? `${step} walkthrough` : `${step} session`,
          description: embedUrl
            ? "Recorded mentor session available now inside your portal."
            : "This recorded module is planned and will appear here before the batch starts.",
          duration: embedUrl ? "18 mins" : "Upload pending",
          kind: embedUrl ? "video" : index % 2 === 0 ? "lab" : "resource",
          status: lessonStatus,
          embedUrl,
        },
      ],
    };
  });
}

function buildProgramLinks(courseTitle: string) {
  const message = encodeURIComponent(`Hi GenZNext, please share the ${courseTitle} WhatsApp group and class joining details.`);
  const url = `https://wa.me/${siteConfig.whatsapp}?text=${message}`;

  return {
    whatsappGroupUrl: url,
    liveClassUrl: url,
  };
}

function buildProgramMeta(
  courseTitle: string,
  overrides: Partial<Pick<LmsProgram, "totalClasses" | "totalResources" | "classTimeLabel" | "classPlatform">> = {},
) {
  return {
    totalClasses: 36,
    totalResources: 12,
    classTimeLabel: "7:00 PM IST",
    classPlatform: "Zoom",
    ...buildProgramLinks(courseTitle),
    ...overrides,
  } satisfies Pick<
    LmsProgram,
    "totalClasses" | "totalResources" | "classTimeLabel" | "classPlatform" | "whatsappGroupUrl" | "liveClassUrl"
  >;
}

export const lmsPrograms: LmsProgram[] = [
  {
    courseSlug: "ai-machine-learning-fundamentals",
    category: "ai",
    batchStartDate: "June 15, 2026",
    trainingDays: "Mon / Wed / Fri",
    status: "upcoming",
    mentorNote: "AI foundation batch with Python-first mentoring, labs, and guided checkpoints.",
    heroSummary: "Start with AI fundamentals, build confidence in ML concepts, and move into real applied practice with structured weekly sessions.",
    ...buildProgramMeta("AI & Machine Learning Fundamentals", { totalClasses: 24, totalResources: 8 }),
    modules: buildModules(requireCourse("ai-machine-learning-fundamentals")),
  },
  {
    courseSlug: "generative-ai",
    category: "ai",
    batchStartDate: "June 29, 2026",
    trainingDays: "Tue / Thu / Sat",
    status: "upcoming",
    mentorNote: "High-intensity GenAI track with implementation labs and product-style workflow reviews.",
    heroSummary: "Move from prompting basics into production-ready LLM application patterns, RAG, and modern GenAI delivery workflows.",
    ...buildProgramMeta("Generative AI & Prompt Engineering", { totalClasses: 30, totalResources: 14 }),
    modules: buildModules(requireCourse("generative-ai")),
  },
  {
    courseSlug: "mlops-ai-deployment",
    category: "ai",
    batchStartDate: "July 13, 2026",
    trainingDays: "Weekend intensive",
    status: "upcoming",
    mentorNote: "Advanced AI deployment pathway for learners preparing for MLOps and platform engineering roles.",
    heroSummary: "Take your models into production with deployment automation, observability, and scalable AI platform practices.",
    ...buildProgramMeta("MLOps & AI Deployment", { totalClasses: 20, totalResources: 10, classTimeLabel: "11:00 AM IST" }),
    modules: buildModules(requireCourse("mlops-ai-deployment")),
  },
  {
    courseSlug: "ai-data-science-analytics",
    category: "ai",
    batchStartDate: "July 6, 2026",
    trainingDays: "Mon / Thu",
    status: "upcoming",
    mentorNote: "Analytics-focused AI cohort with forecasting, reporting, and practical business intelligence exercises.",
    heroSummary: "Use Python and analytics tooling to apply AI in reporting, forecasting, and data-led business decision making.",
    ...buildProgramMeta("AI for Data Science & Analytics", { totalClasses: 20, totalResources: 10 }),
    modules: buildModules(requireCourse("ai-data-science-analytics")),
  },
  {
    courseSlug: "aws-cloud-practitioner",
    category: "aws",
    batchStartDate: "June 22, 2026",
    trainingDays: "Mon / Wed / Fri",
    status: "upcoming",
    mentorNote: "Foundational AWS batch for students and early-career professionals entering cloud roles.",
    heroSummary: "Build strong AWS fundamentals before moving into architecture, SysOps, or DevOps specializations.",
    ...buildProgramMeta("AWS Cloud Practitioner", { totalClasses: 24, totalResources: 8 }),
    modules: buildModules(requireCourse("aws-cloud-practitioner")),
  },
  {
    courseSlug: "aws-solutions-architect",
    category: "aws",
    batchStartDate: "July 6, 2026",
    trainingDays: "Tue / Thu / Sat",
    status: "upcoming",
    mentorNote: "Architecture-first cohort with guided design reviews and solution blueprint exercises.",
    heroSummary: "Learn to design secure, scalable AWS systems with structured architecture reviews and certification-focused mentoring.",
    ...buildProgramMeta("AWS Solutions Architect", { totalClasses: 36, totalResources: 12 }),
    modules: buildModules(requireCourse("aws-solutions-architect")),
  },
  {
    courseSlug: "aws-devops-engineer",
    category: "aws",
    batchStartDate: "July 20, 2026",
    trainingDays: "Weekend intensive",
    status: "upcoming",
    mentorNote: "Release engineering and observability track for cloud delivery teams and DevOps practitioners.",
    heroSummary: "Automate deployments, manage infrastructure workflows, and build mature DevOps practices on AWS.",
    ...buildProgramMeta("AWS DevOps Engineer", { totalClasses: 20, totalResources: 10, classTimeLabel: "11:00 AM IST" }),
    modules: buildModules(requireCourse("aws-devops-engineer")),
  },
  {
    courseSlug: "aws-sysops-administrator",
    category: "aws",
    batchStartDate: "July 1, 2026",
    trainingDays: "Tue / Thu",
    status: "upcoming",
    mentorNote: "Operations-centered AWS cohort with monitoring, incident response, and admin workflow practice.",
    heroSummary: "Operate and optimize AWS environments with hands-on monitoring, troubleshooting, and systems administration sessions.",
    ...buildProgramMeta("AWS SysOps Administrator", { totalClasses: 24, totalResources: 9 }),
    modules: buildModules(requireCourse("aws-sysops-administrator")),
  },
  {
    courseSlug: "azure-administrator",
    category: "azure",
    batchStartDate: "June 8, 2026",
    trainingDays: "Mon to Sat",
    status: "live",
    mentorNote: "Current live summer training batch with internship-oriented delivery, Azure labs, and mentor support.",
    heroSummary: "This is the current active Summer Training LMS track. Students can follow Azure administration modules, recorded explainers, and upcoming live batch checkpoints here.",
    ...buildProgramMeta("Microsoft Azure Administrator (AZ-104)", { totalClasses: 36, totalResources: 12 }),
    modules: buildModules(requireCourse("azure-administrator"), {
      0: sampleAzureLessonUrl,
    }),
  },
  {
    courseSlug: "azure-security-engineer",
    category: "azure",
    batchStartDate: "July 15, 2026",
    trainingDays: "Tue / Thu / Sat",
    status: "upcoming",
    mentorNote: "Security specialization covering identity, posture, and protection controls for Azure environments.",
    heroSummary: "Follow a structured Azure security journey covering IAM, protection workflows, compliance, and defensive operations.",
    ...buildProgramMeta("Azure Security Engineer (AZ-500)", { totalClasses: 30, totalResources: 12 }),
    modules: buildModules(requireCourse("azure-security-engineer")),
  },
  {
    courseSlug: "azure-devops-engineer",
    category: "azure",
    batchStartDate: "July 27, 2026",
    trainingDays: "Weekend intensive",
    status: "upcoming",
    mentorNote: "Delivery engineering batch for Azure DevOps pipelines, GitHub Actions, release automation, and monitoring.",
    heroSummary: "Build Azure-native CI/CD confidence with mentor-led labs across source control, deployment workflows, and observability.",
    ...buildProgramMeta("Azure DevOps Engineer (AZ-400)", { totalClasses: 20, totalResources: 10, classTimeLabel: "11:00 AM IST" }),
    modules: buildModules(requireCourse("azure-devops-engineer")),
  },
  {
    courseSlug: "azure-solutions-architect",
    category: "azure",
    batchStartDate: "August 3, 2026",
    trainingDays: "Wed / Sat",
    status: "upcoming",
    mentorNote: "Advanced architecture pathway focused on enterprise design, hybrid infrastructure, and secure scale.",
    heroSummary: "Prepare for architecture-level Azure work with structured design reviews, security planning, and enterprise deployment strategy.",
    ...buildProgramMeta("Azure Solutions Architect (AZ-305)", { totalClasses: 24, totalResources: 10 }),
    modules: buildModules(requireCourse("azure-solutions-architect")),
  },
  {
    courseSlug: "devops-fundamentals",
    category: "devops",
    batchStartDate: "June 18, 2026",
    trainingDays: "Mon / Thu",
    status: "upcoming",
    mentorNote: "Beginner-friendly DevOps cohort with Git, Linux, shell, and pipeline fundamentals.",
    heroSummary: "Start your DevOps learning path with source control, Linux, scripting, and delivery basics that support every later specialization.",
    ...buildProgramMeta("DevOps Fundamentals", { totalClasses: 20, totalResources: 8 }),
    modules: buildModules(requireCourse("devops-fundamentals")),
  },
  {
    courseSlug: "docker-kubernetes",
    category: "devops",
    batchStartDate: "July 2, 2026",
    trainingDays: "Tue / Thu / Sat",
    status: "upcoming",
    mentorNote: "Containers and orchestration cohort with production-style deployment and microservices workflow practice.",
    heroSummary: "Master modern container platforms and orchestration workflows with a curriculum designed around production delivery patterns.",
    ...buildProgramMeta("Docker & Kubernetes Mastery", { totalClasses: 30, totalResources: 12 }),
    modules: buildModules(requireCourse("docker-kubernetes")),
  },
  {
    courseSlug: "ci-cd-pipeline-engineering",
    category: "devops",
    batchStartDate: "July 16, 2026",
    trainingDays: "Weekend intensive",
    status: "upcoming",
    mentorNote: "Automation track for Jenkins, GitHub Actions, ArgoCD, and delivery pipeline design.",
    heroSummary: "Build release confidence across CI/CD systems, automated testing, and repeatable deployment workflows.",
    ...buildProgramMeta("CI/CD Pipeline Engineering", { totalClasses: 20, totalResources: 10, classTimeLabel: "11:00 AM IST" }),
    modules: buildModules(requireCourse("ci-cd-pipeline-engineering")),
  },
  {
    courseSlug: "devops-monitoring-security",
    category: "devops",
    batchStartDate: "July 30, 2026",
    trainingDays: "Wed / Sat",
    status: "upcoming",
    mentorNote: "Observability and DevSecOps pathway for alerting, metrics, logs, and pipeline hardening.",
    heroSummary: "Strengthen your platform operations mindset with monitoring stacks, DevSecOps controls, and reliability workflows.",
    ...buildProgramMeta("DevOps Monitoring & Security", { totalClasses: 24, totalResources: 10 }),
    modules: buildModules(requireCourse("devops-monitoring-security")),
  },
];

export const summerTrainingHighlight: SummerTrainingHighlight = {
  courseSlug: "azure-administrator",
  title: "Summer Training 2026",
  subtitle: "Azure Administrator (AZ-104) live batch with internship support and guided labs.",
  batchStartDate: "June 8, 2026",
  trainingDays: "Mon to Sat",
  status: "live",
  supportNote: "Batch joining support, mentor guidance, and YouTube-backed recorded explainers are available inside the LMS portal.",
};

export function getLmsProgramsByCategory(category: CourseCategoryKey) {
  return lmsPrograms.filter((program) => program.category === category);
}

export function getLmsProgramBySlug(courseSlug: string) {
  return lmsPrograms.find((program) => program.courseSlug === courseSlug) ?? null;
}

export function getLmsCategoryOrder() {
  return programCategoryOrder;
}

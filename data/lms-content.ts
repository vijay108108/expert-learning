import {
  allCourses,
  type Course,
  type CourseCategoryKey,
} from "@/data/courses";
import { resolveCourseSlugAlias } from "@/lib/course-identity";
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
const fallbackCourse = allCourses[0];

const courseMap = new Map(allCourses.map((course) => [course.slug, course]));

function resolveCourseSlug(slug: string) {
  return courseMap.has(slug) ? slug : resolveCourseSlugAlias(slug);
}

function requireCourse(slug: string) {
  const resolvedSlug = resolveCourseSlug(slug);
  const course = courseMap.get(resolvedSlug);

  if (!course) {
    console.warn(`[LMS] Missing course data for "${slug}". Falling back to a placeholder course mapping.`);
    return fallbackCourse;
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
    courseSlug: "prompt-engineering",
    category: "ai",
    batchStartDate: "June 15, 2026",
    trainingDays: "Mon / Wed / Fri",
    status: "upcoming",
    mentorNote: "Prompt-first AI starter batch with guided practice, evaluation exercises, and real-world prompting workflows.",
    heroSummary: "Start your AI journey with structured prompt design, practical LLM workflows, and beginner-friendly implementation sessions.",
    ...buildProgramMeta("Prompt Engineering", { totalClasses: 24, totalResources: 8 }),
    modules: buildModules(requireCourse("prompt-engineering")),
  },
  {
    courseSlug: "generative-ai",
    category: "ai",
    batchStartDate: "June 29, 2026",
    trainingDays: "Tue / Thu / Sat",
    status: "upcoming",
    mentorNote: "High-intensity GenAI track with implementation labs, LLM workflows, and product-style review sessions.",
    heroSummary: "Move from core generative AI concepts into production-ready LLM application patterns, RAG, and modern GenAI delivery workflows.",
    ...buildProgramMeta("Generative AI Master Program", { totalClasses: 30, totalResources: 14 }),
    modules: buildModules(requireCourse("generative-ai")),
  },
  {
    courseSlug: "openai-llm-engineering",
    category: "ai",
    batchStartDate: "July 13, 2026",
    trainingDays: "Weekend intensive",
    status: "upcoming",
    mentorNote: "Advanced LLM engineering pathway for developers building production-ready AI applications with APIs and retrieval systems.",
    heroSummary: "Build OpenAI-powered applications with orchestration, vector search, and deployment practices designed for real engineering teams.",
    ...buildProgramMeta("OpenAI & LLM Engineering", { totalClasses: 20, totalResources: 10, classTimeLabel: "11:00 AM IST" }),
    modules: buildModules(requireCourse("openai-llm-engineering")),
  },
  {
    courseSlug: "ai-for-business",
    category: "ai",
    batchStartDate: "July 6, 2026",
    trainingDays: "Mon / Thu",
    status: "upcoming",
    mentorNote: "Business-first AI cohort focused on productivity, automation, research, and non-technical adoption use cases.",
    heroSummary: "Use modern AI tools to improve business productivity, automate repetitive work, and make better decisions without needing to code.",
    ...buildProgramMeta("AI for Business", { totalClasses: 20, totalResources: 10 }),
    modules: buildModules(requireCourse("ai-for-business")),
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
    courseSlug: "azure-ai-engineer",
    category: "azure",
    batchStartDate: "July 15, 2026",
    trainingDays: "Tue / Thu / Sat",
    status: "upcoming",
    mentorNote: "Advanced Azure AI specialization covering cognitive services, AI APIs, and applied machine learning workflows.",
    heroSummary: "Follow a structured Azure AI engineering journey covering intelligent services, AI integrations, and production-ready cloud use cases.",
    ...buildProgramMeta("Azure AI Engineer", { totalClasses: 30, totalResources: 12 }),
    modules: buildModules(requireCourse("azure-ai-engineer")),
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
    courseSlug: "jenkins-github-actions",
    category: "devops",
    batchStartDate: "June 18, 2026",
    trainingDays: "Mon / Thu",
    status: "upcoming",
    mentorNote: "Automation-first DevOps cohort focused on Jenkins pipelines, GitHub Actions, and beginner-friendly release workflows.",
    heroSummary: "Start with practical CI/CD automation using Jenkins and GitHub Actions before moving into broader delivery engineering patterns.",
    ...buildProgramMeta("Jenkins & GitHub Actions", { totalClasses: 20, totalResources: 8 }),
    modules: buildModules(requireCourse("jenkins-github-actions")),
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
    courseSlug: "terraform",
    category: "devops",
    batchStartDate: "July 30, 2026",
    trainingDays: "Wed / Sat",
    status: "upcoming",
    mentorNote: "Infrastructure automation pathway focused on reusable modules, cloud provisioning, and multi-environment Terraform workflows.",
    heroSummary: "Strengthen your infrastructure-as-code mindset with Terraform modules, provisioning strategy, and cloud automation practices.",
    ...buildProgramMeta("Terraform", { totalClasses: 24, totalResources: 10 }),
    modules: buildModules(requireCourse("terraform")),
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
  const direct = lmsPrograms.find((program) => program.courseSlug === courseSlug);
  if (direct) {
    return direct;
  }

  const normalized = resolveCourseSlug(courseSlug);
  const byNormalized = lmsPrograms.find(
    (program) => program.courseSlug === normalized || resolveCourseSlug(program.courseSlug) === normalized,
  );

  if (byNormalized) {
    return byNormalized;
  }

  const resolvedFallbackCourse = courseMap.get(normalized) || fallbackCourse;
  const fallbackLinks = buildProgramLinks(resolvedFallbackCourse.title);
  const workshopWhatsappUrl = process.env.NEXT_PUBLIC_WORKSHOP_WHATSAPP_URL || fallbackLinks.whatsappGroupUrl;
  const workshopMeetingUrl = process.env.NEXT_PUBLIC_WORKSHOP_MEETING_URL || fallbackLinks.liveClassUrl;
  const isWorkshopLaunchLab = normalized === "ai-developer-launch-lab";

  const fallbackProgram = {
    courseSlug,
    category: resolvedFallbackCourse.category,
    batchStartDate: "Coming Soon",
    trainingDays: "Schedule updating",
    status: "upcoming" as const,
    mentorNote: "Course content coming soon. Our team is preparing modules, lessons, and resources for your dashboard.",
    heroSummary: "Course content coming soon. Please check back shortly or contact support for batch details.",
    totalClasses: 0,
    totalResources: 0,
    classTimeLabel: "TBA",
    classPlatform: "TBA",
    whatsappGroupUrl: isWorkshopLaunchLab ? workshopWhatsappUrl : fallbackLinks.whatsappGroupUrl,
    liveClassUrl: isWorkshopLaunchLab ? workshopMeetingUrl : fallbackLinks.liveClassUrl,
    modules: [],
  } satisfies LmsProgram;

  return fallbackProgram;
}

export function getLmsCategoryOrder() {
  return programCategoryOrder;
}

import { allCourses } from "@/data/courses";

export type LearningTrackKey =
  | "ai"
  | "generative-ai"
  | "agentic-ai"
  | "devsecops"
  | "aws-certifications"
  | "azure-certifications";

export type LearningTrack = {
  key: LearningTrackKey;
  title: string;
  slug: string;
  description: string;
  icon: string;
  accentClass: string;
  featuredCourseSlugs: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const learningTracks: LearningTrack[] = [
  {
    key: "ai",
    title: "AI",
    slug: "ai",
    description: "Applied AI learning paths for practical product and automation use-cases.",
    icon: "AI",
    accentClass: "border-[#A78BFA]/30 bg-[#A78BFA]/10 text-[#E8DCCF]",
    featuredCourseSlugs: ["applied-ai-foundations", "machine-learning-foundations"],
    ctaLabel: "Explore AI Programs",
    ctaHref: "/courses?track=ai",
  },
  {
    key: "generative-ai",
    title: "Generative AI",
    slug: "genai",
    description: "LLM workflows, RAG pipelines, prompt design, and production GenAI engineering.",
    icon: "GAI",
    accentClass: "border-[#C084FC]/30 bg-[#C084FC]/10 text-[#E9D5FF]",
    featuredCourseSlugs: ["generative-ai", "prompt-engineering"],
    ctaLabel: "Explore GenAI Programs",
    ctaHref: "/courses?track=generative-ai",
  },
  {
    key: "agentic-ai",
    title: "Agentic AI",
    slug: "agentic-ai",
    description: "Design, orchestrate, and monitor multi-step AI agent systems and toolchains.",
    icon: "AG",
    accentClass: "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#C8D7EE]",
    featuredCourseSlugs: ["agentic-ai-engineering", "langchain-multi-agent-workflows"],
    ctaLabel: "Explore Agentic AI",
    ctaHref: "/courses?track=agentic-ai",
  },
  {
    key: "devsecops",
    title: "DevSecOps",
    slug: "devsecops",
    description: "Secure CI/CD, cloud hardening, observability, and policy-driven delivery pipelines.",
    icon: "DS",
    accentClass: "border-[#34D399]/30 bg-[#34D399]/10 text-[#BBF7D0]",
    featuredCourseSlugs: ["devsecops-foundation", "ci-cd-pipeline-engineering"],
    ctaLabel: "Explore DevSecOps",
    ctaHref: "/courses?track=devsecops",
  },
  {
    key: "aws-certifications",
    title: "AWS Certifications",
    slug: "aws",
    description: "Certification-aligned AWS pathways from fundamentals to architecture and DevSecOps.",
    icon: "AWS",
    accentClass: "border-[#15407E]/30 bg-[#15407E]/10 text-[#FED7AA]",
    featuredCourseSlugs: ["aws-cloud-practitioner", "aws-solutions-architect"],
    ctaLabel: "Explore AWS Certifications",
    ctaHref: "/courses/aws",
  },
  {
    key: "azure-certifications",
    title: "Azure Certifications",
    slug: "azure",
    description: "Microsoft-aligned training paths for administration, AI, architecture, and DevSecOps.",
    icon: "AZ",
    accentClass: "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#C8D7EE]",
    featuredCourseSlugs: ["azure-administrator", "azure-solutions-architect"],
    ctaLabel: "Explore Azure Certifications",
    ctaHref: "/courses/azure",
  },
];

export function getTrackCourseCount(track: LearningTrack): number {
  const featured = track.featuredCourseSlugs.length;

  switch (track.key) {
    case "aws-certifications":
      return allCourses.filter((course) => course.category === "aws").length;
    case "azure-certifications":
      return allCourses.filter((course) => course.category === "azure").length;
    case "devsecops":
      return allCourses.filter((course) => course.category === "devops").length;
    case "ai":
    case "generative-ai":
    case "agentic-ai":
      return Math.max(featured, allCourses.filter((course) => course.category === "ai").length);
    default:
      return featured;
  }
}

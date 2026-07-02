import { allCourses, type Course } from "@/data/courses";
import { formatPaiseToPrice, getCourseBySlug } from "@/lib/course-catalog";
import {
  getCanonicalCourseId,
  getCanonicalCourseIdBySlug,
  getCourseSlugByCourseId,
} from "@/lib/course-identity";

type BundleDefinition = {
  slug: string;
  title: string;
  subtitle: string;
  tagLabel: string;
  duration: string;
  level: string;
  highlight: string;
  priceValue: number;
  originalPriceValue: number;
  courseSlugs: string[];
};

export type CheckoutOffering = {
  kind: "course" | "bundle";
  slug: string;
  title: string;
  subtitle: string;
  overview: string;
  tagLabel: string;
  duration: string;
  level: string;
  highlight: string;
  priceValue: number;
  originalPriceValue: number;
  price: string;
  originalPrice: string;
  courseSlugs: string[];
};

const bundleDefinitions: BundleDefinition[] = [
  {
    slug: "ai-tools-master-program",
    title: "Practical AI Tools Master Program",
    subtitle: "Complete AI Tools Master bundle checkout.",
    tagLabel: "AI Tools Mastery Track",
    duration: "8 Weeks",
    level: "Beginner to Advanced",
    highlight: "Bundle Offer",
    priceValue: 69999,
    originalPriceValue: 99999,
    courseSlugs: ["applied-ai-foundations", "ai-for-business-automation", "prompt-engineering", "agentic-ai-engineering"],
  },
  {
    slug: "microsoft-cloud-master-program",
    title: "Microsoft Cloud Master Program",
    subtitle: "Complete Microsoft Cloud Master bundle checkout.",
    tagLabel: "Microsoft Cloud Track",
    duration: "24 Weeks",
    level: "Beginner to Advanced",
    highlight: "Bundle Offer",
    priceValue: 24999,
    originalPriceValue: 49999,
    courseSlugs: ["azure-fundamentals", "azure-administrator", "azure-developer-az-204", "azure-solutions-architect"],
  },
  {
    slug: "aws-cloud-master-program",
    title: "AWS Cloud Master Program",
    subtitle: "Complete AWS Cloud Master bundle checkout.",
    tagLabel: "AWS Cloud Track",
    duration: "24 Weeks",
    level: "Beginner to Advanced",
    highlight: "Bundle Offer",
    priceValue: 24999,
    originalPriceValue: 49999,
    courseSlugs: ["aws-cloud-practitioner", "aws-solutions-architect", "aws-developer-associate", "aws-devops-engineer"],
  },
  {
    slug: "ai-generative-ai-master-program",
    title: "Master AI & Generative AI Program",
    subtitle: "Complete AI & Generative AI bundle checkout.",
    tagLabel: "AI & GenAI Track",
    duration: "32 Weeks",
    level: "Beginner to Advanced",
    highlight: "Bundle Offer",
    priceValue: 29999,
    originalPriceValue: 59999,
    courseSlugs: ["applied-ai-foundations", "prompt-engineering", "rag-applications-vector-databases", "agentic-ai-engineering"],
  },
  {
    slug: "microsoft-cloud-ai-devops-master-program",
    title: "Microsoft Cloud & AI DevOps Master Program",
    subtitle: "Complete Microsoft Cloud & AI DevOps master bundle checkout.",
    tagLabel: "AZ-104 + AZ-400 + AIOps",
    duration: "24 Weeks",
    level: "Beginner to Advanced",
    highlight: "Bundle Offer",
    priceValue: 90000,
    originalPriceValue: 90000,
    courseSlugs: ["azure-administrator", "azure-devops-engineer", "aiops-engineering"],
  },
  {
    slug: "devops-master-program",
    title: "DevOps Master Program",
    subtitle: "Complete DevOps Master bundle checkout.",
    tagLabel: "DevOps & Automation Track",
    duration: "28 Weeks",
    level: "Beginner to Advanced",
    highlight: "Bundle Offer",
    priceValue: 29999,
    originalPriceValue: 59999,
    courseSlugs: ["devsecops-foundation", "docker-kubernetes", "ci-cd-pipeline-engineering", "aws-devops-engineer"],
  },
  {
    slug: "cloud-devops-ai-summer-2026",
    title: "Cloud, DevOps & AI Engineering Professional Program",
    subtitle: "Summer Training 2026 — 15 June Batch",
    tagLabel: "Summer Training 2026",
    duration: "8 Weeks (Fast-Track)",
    level: "Beginner to Advanced",
    highlight: "Summer Scholarship — 67% Off",
    priceValue: 25000,
    originalPriceValue: 75000,
    courseSlugs: ["azure-administrator"],
  },
];

const bundleBySlug = new Map(bundleDefinitions.map((bundle) => [bundle.slug, bundle]));

function toCourseOffering(course: Course): CheckoutOffering {
  return {
    kind: "course",
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    overview: course.overview,
    tagLabel: course.tagLabel,
    duration: course.duration,
    level: course.level,
    highlight: course.highlight,
    priceValue: course.priceValue,
    originalPriceValue: course.originalPriceValue,
    price: course.price,
    originalPrice: course.originalPrice,
    courseSlugs: [course.slug],
  };
}

function toBundleOffering(bundle: BundleDefinition): CheckoutOffering {
  return {
    kind: "bundle",
    slug: bundle.slug,
    title: bundle.title,
    subtitle: bundle.subtitle,
    overview: bundle.subtitle,
    tagLabel: bundle.tagLabel,
    duration: bundle.duration,
    level: bundle.level,
    highlight: bundle.highlight,
    priceValue: bundle.priceValue,
    originalPriceValue: bundle.originalPriceValue,
    price: formatPaiseToPrice(bundle.priceValue * 100),
    originalPrice: formatPaiseToPrice(bundle.originalPriceValue * 100),
    courseSlugs: bundle.courseSlugs,
  };
}

export { getCanonicalCourseIdBySlug, getCanonicalCourseId, getCourseSlugByCourseId };

export function getCheckoutOfferingBySlug(slug: string) {
  const bundle = bundleBySlug.get(slug);
  if (bundle) {
    return toBundleOffering(bundle);
  }

  const course = getCourseBySlug(slug);
  if (!course) {
    return null;
  }

  return toCourseOffering(course);
}

export function resolveCheckoutOfferings(requestedSlugs: string[]) {
  const offerings = requestedSlugs
    .map((slug) => getCheckoutOfferingBySlug(slug))
    .filter((offering): offering is CheckoutOffering => Boolean(offering));

  return {
    offerings,
    missing: requestedSlugs.filter((slug) => !getCheckoutOfferingBySlug(slug)),
  };
}

export function expandOfferingCourseSlugs(offerings: CheckoutOffering[]) {
  return Array.from(
    new Set(
      offerings.flatMap((offering) => offering.courseSlugs),
    ),
  );
}

export function expandRequestedCourseSlugs(requestedSlugs: string[]) {
  const { offerings } = resolveCheckoutOfferings(requestedSlugs);
  return expandOfferingCourseSlugs(offerings);
}

export function getDisplayPriceByCourseSlug(slug: string) {
  const offering = getCheckoutOfferingBySlug(slug);
  if (!offering) {
    return null;
  }

  return {
    priceValue: offering.priceValue,
    originalPriceValue: offering.originalPriceValue,
    price: offering.price,
    originalPrice: offering.originalPrice,
  };
}

export function getCanonicalIdSetFromCourseSlugs(courseSlugs: string[]) {
  return new Set(courseSlugs.map((slug) => getCanonicalCourseIdBySlug(slug)));
}

export function toCanonicalIdSetFromEnrollmentRecords(enrollmentCourseIds: string[]) {
  return new Set(enrollmentCourseIds.map((value) => getCanonicalCourseId(value)));
}

export function listBundleSlugs() {
  return bundleDefinitions.map((bundle) => bundle.slug);
}

export function listAllCourseSlugs() {
  return allCourses.map((course) => course.slug);
}


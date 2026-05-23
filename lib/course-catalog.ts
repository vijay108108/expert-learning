import { allCourses, type Course } from "@/data/courses";

export function getCourseBySlug(slug: string) {
  return allCourses.find((course) => course.slug === slug);
}

export function getCoursesBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getCourseBySlug(slug))
    .filter((course): course is Course => Boolean(course));
}

export function getCategorySectionId(category: string) {
  return `${category}-programs`;
}

export function getCategorySectionHref(category: string) {
  return `/courses#${getCategorySectionId(category)}`;
}

export function getCoursePath(course: Course) {
  return getCategorySectionHref(course.category);
}

export function listCoursesForApi() {
  return allCourses.map((course) => ({
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    rating: course.rating,
    duration: course.duration,
    level: course.level,
    priceValue: course.priceValue,
    originalPriceValue: course.originalPriceValue,
    price: course.price,
    originalPrice: course.originalPrice,
    highlight: course.highlight,
    tagLabel: course.tagLabel,
    tagTone: course.tagTone,
    certificate: course.certificate,
    category: course.category,
    tags: course.tags,
    officialSyllabusUrl: course.officialSyllabusUrl,
    toolsCovered: course.toolsCovered,
    roadmap: course.roadmap,
    outcomes: course.outcomes,
  }));
}

export function parsePriceToPaise(price: string) {
  if (/custom/i.test(price)) {
    return null;
  }

  const normalized = price.replace(/[^\d]/g, "");

  if (!normalized) {
    return null;
  }

  return Number(normalized) * 100;
}

export function formatPaiseToPrice(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString("en-IN")}`;
}

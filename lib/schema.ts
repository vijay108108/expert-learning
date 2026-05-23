import { allCourses } from "@/data/courses";
import { faqs } from "@/data/site";
import { siteConfig } from "@/lib/site-config";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.company,
    url: siteConfig.url,
    logo: `${siteConfig.url}/opengraph-image`,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: [
      "https://www.instagram.com/genznextofficial/",
      "https://www.facebook.com/profile.php?id=61590060611725",
      "https://www.linkedin.com/in/adarsh-vishwakarma-184ab0410/",
    ],
  };
}

export function getCourseListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GenZNext Research & Training professional certification courses",
    itemListElement: allCourses.map((course, index) => ({
      "@type": "Course",
      position: index + 1,
      name: course.title,
      description: course.subtitle,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        sameAs: siteConfig.url,
      },
    })),
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

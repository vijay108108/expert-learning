import type { MetadataRoute } from "next";
import { courseCategories } from "@/data/courses";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/courses",
    "/about",
    "/contact",
    "/blog",
    "/career",
    "/corporate-training",
    "/privacy-policy",
    "/terms-of-service",
    "/refund-policy",
  ];

  return [
    ...routes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
    })),
    ...courseCategories.map((category) => ({
      url: `${siteConfig.url}${category.href}`,
      lastModified: new Date(),
    })),
  ];
}

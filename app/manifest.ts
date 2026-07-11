import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GenZNext Research & Training",
    short_name: "GenZNext",
    description: "Cloud, AI & DevOps training for students, professionals and enterprise teams. Live mentorship, real projects, LMS access.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#0B2E6B",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en-IN",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon-192.png",          sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png",          sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "My Courses",
        short_name: "Courses",
        url: "/dashboard/courses",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Browse Programs",
        short_name: "Programs",
        url: "/programs",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "LMS Portal",
        short_name: "LMS",
        url: "/lms/my-learning",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}

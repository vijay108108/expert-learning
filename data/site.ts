import type { IconKey } from "@/lib/icon-map";

export const heroStats = [
  { value: 10, suffix: "K+", label: "builders upskilled" },
  { value: 94, suffix: "%", label: "program completion rate" },
  { value: 180, suffix: "+", label: "guided cloud labs" },
  { value: 4.8, suffix: "/5", label: "average builder rating" },
];

export const trustHighlights = [
  "Live mentor-led cohorts",
  "Interview and career outcomes support",
  "Hands-on project portfolio",
  "EMI payment options available",
];

export const whyChooseUs: {
  title: string;
  description: string;
  icon: IconKey;
}[] = [
  {
    title: "Industry mentors",
    description: "Learn from architects, AI practitioners, and platform engineers working on real enterprise stacks.",
    icon: "guidance",
  },
  {
    title: "Real projects",
    description: "Ship capstone projects that mirror production workloads across cloud, data, and AI use cases.",
    icon: "code",
  },
  {
    title: "Career outcomes assistance",
    description: "Get resume reviews, mock interviews, hiring guidance, and role mapping support.",
    icon: "briefcase",
  },
  {
    title: "Lifetime access",
    description: "Revisit updated content, templates, and revision notes whenever you need to reskill.",
    icon: "support",
  },
  {
    title: "Certification preparation",
    description: "Target exam objectives with structured roadmaps, practice sessions, and mentor checkpoints.",
    icon: "awards",
  },
  {
    title: "Live classes",
    description: "Join interactive sessions designed for working professionals and fast-moving builders.",
    icon: "devices",
  },
  {
    title: "Recorded sessions",
    description: "Catch up anytime with chapter-based recordings and recap notes after every class.",
    icon: "building",
  },
  {
    title: "Community support",
    description: "Stay accountable through peer groups, office hours, and cohort communities.",
    icon: "community",
  },
];

export const quickLinks = [
  { label: "All Courses", href: "/courses" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Career", href: "/career" },
];

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/genznextofficial/",
    icon: "instagram",
    hoverClass: "hover:border-[rgba(225,48,108,0.34)] hover:bg-[rgba(225,48,108,0.12)] hover:text-[#e1306c]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590060611725",
    icon: "facebook",
    hoverClass: "hover:border-[rgba(24,119,242,0.34)] hover:bg-[rgba(24,119,242,0.12)] hover:text-[#1877f2]",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/genznext-research-training/",
    icon: "linkedin",
    hoverClass: "hover:border-[rgba(0,119,181,0.34)] hover:bg-[rgba(0,119,181,0.12)] hover:text-[#0077b5]",
  },
  {
    label: "Email",
    href: "mailto:info@genznext.com",
    icon: "mail",
    hoverClass: "hover:border-[rgba(249,115,22,0.34)] hover:bg-[rgba(249,115,22,0.12)] hover:text-[#f97316]",
  },
];

export const blogHighlights = [
  {
    title: "How to choose between AWS, Azure, and AI in 2026",
    excerpt: "A role-first guide for students and professionals deciding where to invest their builder time.",
    category: "Career Advice",
  },
  {
    title: "What hiring managers expect from cloud portfolios",
    excerpt: "The portfolio patterns that help builders stand out beyond certification scores.",
    category: "Cloud Careers",
  },
  {
    title: "Why GenAI engineers need systems thinking",
    excerpt: "Prompting alone is not enough. Here is what strong AI product teams actually hire for.",
    category: "AI Engineering",
  },
];

export const careerOpenings = [
  {
    slug: "senior-cloud-mentor",
    title: "Senior Cloud Mentor",
    location: "Remote",
    type: "Contract",
  },
  {
    slug: "program-success-manager",
    title: "Program Success Manager",
    location: "Bengaluru",
    type: "Full-time",
  },
  {
    slug: "growth-marketing-associate",
    title: "Growth Marketing Associate",
    location: "Remote",
    type: "Full-time",
  },
];

import type { IconKey } from "@/lib/icon-map";

export const navCourseLinks = [
  { label: "AWS Courses", href: "/courses/aws" },
  { label: "Azure Courses", href: "/courses/azure" },
  { label: "AI Courses", href: "/courses/ai" },
  { label: "DevOps Courses", href: "/courses/devops" },
];

export const heroStats = [
  { value: 10, suffix: "K+", label: "learners upskilled" },
  { value: 94, suffix: "%", label: "program completion rate" },
  { value: 180, suffix: "+", label: "guided cloud labs" },
  { value: 4.8, suffix: "/5", label: "average learner rating" },
];

export const trustHighlights = [
  "Live mentor-led cohorts",
  "Interview and placement support",
  "Hands-on project portfolio",
  "EMI payment options available",
];

export const companyLogos = [
  "Amazon",
  "Microsoft",
  "Google",
  "IBM",
  "Accenture",
  "Infosys",
  "TCS",
  "Wipro",
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
    title: "Placement assistance",
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
    description: "Join interactive sessions designed for working professionals and fast-moving learners.",
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

export const journeySteps = [
  "Enroll",
  "Learn",
  "Build Projects",
  "Get Certified",
  "Crack Interviews",
  "Get Hired",
];

export const testimonials = [
  {
    name: "Rhea Kapoor",
    initials: "RK",
    role: "Cloud Support Engineer",
    company: "Accenture",
    salaryHike: "72% hike",
    review:
      "The AWS track was structured like an enterprise launchpad. The labs, mentor reviews, and interview prep gave me the confidence to switch careers.",
  },
  {
    name: "Nitin Sahoo",
    initials: "NS",
    role: "Azure Administrator",
    company: "Infosys",
    salaryHike: "48% hike",
    review:
      "I had theory from YouTube but no production perspective. GenZNext Research & Training helped me connect Azure services to real delivery workflows and hiring expectations.",
  },
  {
    name: "Mariam George",
    initials: "MG",
    role: "AI Solutions Analyst",
    company: "IBM",
    salaryHike: "2 offers",
    review:
      "The GenAI program balanced business thinking and engineering. My portfolio project became the centerpiece of interviews for AI analyst roles.",
  },
];

export const certificationPaths = [
  {
    title: "AWS Certification Path",
    subtitle: "Start from foundations and progress toward architecture, data, and DevOps specializations.",
    steps: ["Cloud Practitioner", "Solutions Architect", "Developer / SysOps", "DevOps / Data Engineer"],
  },
  {
    title: "Azure Certification Path",
    subtitle: "Move from administration into architecture, AI engineering, and enterprise delivery.",
    steps: ["AZ-900", "AZ-104", "AZ-305", "AI Engineer / DevOps"],
  },
  {
    title: "AI Career Path",
    subtitle: "Blend business fluency, prompt design, LLM engineering, and deployment fundamentals.",
    steps: ["AI Foundations", "Prompt Engineering", "GenAI Projects", "LLM Product Delivery"],
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "₹12,999",
    description: "For learners building baseline skills and certification readiness.",
    recommended: false,
    features: [
      "Live weekend classes",
      "Recorded session library",
      "Certification prep guide",
      "EMI support available",
    ],
  },
  {
    name: "Professional",
    price: "₹24,999",
    description: "For professionals who want projects, mentorship, and interview outcomes.",
    recommended: true,
    features: [
      "Everything in Starter",
      "Mentor office hours",
      "Project portfolio access",
      "Placement support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For corporate teams, academies, and workforce transformation programs.",
    recommended: false,
    features: [
      "Team dashboards",
      "Custom cohorts",
      "Reporting and skill mapping",
      "Dedicated customer success",
    ],
  },
] as const;

export const faqs = [
  {
    question: "Who can join?",
    answer:
      "Our programs are designed for college students, working professionals, IT beginners, developers, cloud engineers, and corporate learners who want structured upskilling.",
  },
  {
    question: "Do you provide certification?",
    answer:
      "We provide course completion credentials and certification preparation support. For vendor certifications like AWS and Azure, we guide you through the official exam path.",
  },
  {
    question: "Is placement support included?",
    answer:
      "Yes. Placement support is included in selected plans and includes resume reviews, mock interviews, role guidance, and hiring readiness support.",
  },
  {
    question: "Are classes live?",
    answer:
      "Yes. Core cohorts run live with mentors, and every session is also recorded so learners can revisit concepts at their own pace.",
  },
  {
    question: "What is course duration?",
    answer:
      "Programs typically range from 4 to 14 weeks depending on the track, depth, and project complexity.",
  },
];

export const quickLinks = [
  { label: "All Courses", href: "/courses" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Career", href: "/career" },
];

export const courseFooterLinks = navCourseLinks;

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
    href: "https://www.linkedin.com/in/adarsh-vishwakarma-184ab0410/",
    icon: "linkedin",
    hoverClass: "hover:border-[rgba(0,119,181,0.34)] hover:bg-[rgba(0,119,181,0.12)] hover:text-[#0077b5]",
  },
  {
    label: "Email",
    href: "mailto:genznextofficial@gmail.com",
    icon: "mail",
    hoverClass: "hover:border-[rgba(249,115,22,0.34)] hover:bg-[rgba(249,115,22,0.12)] hover:text-[#f97316]",
  },
];

export const blogHighlights = [
  {
    title: "How to choose between AWS, Azure, and AI in 2026",
    excerpt: "A role-first guide for students and professionals deciding where to invest their learning time.",
    category: "Career Advice",
  },
  {
    title: "What hiring managers expect from cloud portfolios",
    excerpt: "The portfolio patterns that help learners stand out beyond certification scores.",
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
    title: "Senior Cloud Mentor",
    location: "Remote",
    type: "Contract",
  },
  {
    title: "Program Success Manager",
    location: "Bengaluru",
    type: "Full-time",
  },
  {
    title: "Growth Marketing Associate",
    location: "Remote",
    type: "Full-time",
  },
];

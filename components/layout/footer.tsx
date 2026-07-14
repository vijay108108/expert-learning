"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { socialLinks } from "@/data/site";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/* ── Nav columns ─────────────────────────────────────────── */
const columns = [
  {
    heading: "Programs",
    links: [
      { label: "Cloud -> DevOps -> AIOps Journey", href: "/programs" },
      { label: "MS Cloud & AI DevOps", href: "/programs/microsoft-cloud-ai-devops-master" },
      { label: "AI & Generative AI",   href: "/programs/ai-generative-ai-master" },
      { label: "DevOps Master",        href: "/programs/devops-master" },
      { label: "All Programs",         href: "/programs" },
    ],
  },
  {
    heading: "Workshops",
    links: [
      { label: "AI Developer Launch Lab", href: "/workshops/ai-developer-launch-lab" },
      { label: "Workshop Outcome Graph",  href: "/workshops/ai-developer-launch-lab#outcome-graph" },
      { label: "Reserve My Seat",         href: "/checkout/ai-developer-launch-lab" },
      { label: "Workshop FAQs",           href: "/workshops/ai-developer-launch-lab#workshop-faqs" },
      { label: "Corporate Training",      href: "/corporate-training" },
      { label: "Talk to Team",            href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us",           href: "/about" },
      { label: "Contact",            href: "/contact" },
      { label: "Corporate Training", href: "/corporate-training" },
      { label: "Summer Training",    href: "/summer-training" },
      { label: "Careers",            href: "/career" },
      { label: "Blog",               href: "/blog" },
    ],
  },
];

/* ── Social icons ─────────────────────────────────────────── */
function FacebookIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-2.74-2.74A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialIcons: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  facebook:  FacebookIcon,
  linkedin:  LinkedInIcon,
  mail:      Mail,
};

const trustHighlights = ["6,000+ builders upskilled", "Live mentor-led sessions", "Cloud, DevOps, AI execution"];

/* ── Component ───────────────────────────────────────────── */
export function Footer({ reserveMobileCtaSpace = false }: { reserveMobileCtaSpace?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("bg-[#0F172A] text-[#94A3B8]", reserveMobileCtaSpace && "pb-24 md:pb-0")}>

      {/* ── CTA band ── */}
      <div className="border-b border-[#1E293B] bg-[radial-gradient(circle_at_top_left,rgba(245,130,32,0.2),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(11,46,107,0.3),transparent_52%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B]">Ready to start?</p>
            <p className="mt-1 text-xl font-bold text-white sm:text-2xl">Build your Cloud -&gt; DevOps -&gt; AIOps edge with one clear roadmap.</p>
            <p className="mt-2 text-sm text-[#CBD5E1]">Start with the 2-hour AI workshop, then scale into job-focused execution programs.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trustHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#334155] bg-[#0B1220]/70 px-3 py-1 text-xs font-medium text-[#CBD5E1]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/workshops/ai-developer-launch-lab"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#F58220,#0B2E6B)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#092552] sm:w-auto"
            >
              Start With Workshop <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#334155] bg-[#1E293B] px-5 py-2.5 text-sm font-semibold text-[#4ADE80] transition hover:border-[#4ADE80]/30 hover:bg-[#172117] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Main columns ── */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] lg:gap-8 lg:px-8">

        {/* Brand + description */}
        <div>
          <Link
            href="/"
            className="inline-flex items-baseline text-[40px] font-extrabold leading-none tracking-[-0.03em] sm:text-[48px]"
            aria-label="GenZNext"
          >
            <span className="text-white">GenZ</span>
            <span className="text-[#F58220]">Next</span>
          </Link>
          <p className="mt-4 max-w-[280px] text-[13px] leading-6 text-[#94A3B8]">
            Builder-first learning ecosystem for Cloud, DevOps and AI execution. Learn fast, ship projects, and move toward real roles.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socialLinks.map((item) => {
              const Icon = socialIcons[item.icon];
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] bg-[#1E293B] text-[#94A3B8] transition hover:border-[#0B2E6B] hover:bg-[linear-gradient(135deg,#F58220,#0B2E6B)] hover:text-white"
                >
                  {Icon ? <Icon className="h-4 w-4" /> : item.label.slice(0, 1)}
                </a>
              );
            })}
          </div>
        </div>

        {/* Nav columns */}
        {columns.map((col) => (
          <div key={col.heading} className="rounded-2xl border border-[#1E293B] bg-[#111827]/30 p-4 sm:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#E2E8F0]">{col.heading}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#94A3B8] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827]/30 p-4 sm:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#E2E8F0]">Contact</p>
          <p className="mt-2 max-w-[220px] text-xs leading-5 text-[#94A3B8]">Prefer chat-first support? Reach our team on WhatsApp for quick guidance on workshop and program fit.</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2.5 text-[13px] text-[#94A3B8] transition hover:text-white"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1E293B]">
                  <Phone className="h-3.5 w-3.5 text-[#0B2E6B]" />
                </span>
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-2.5 text-[13px] text-[#94A3B8] transition hover:text-white"
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1E293B]">
                  <Mail className="h-3.5 w-3.5 text-[#0B2E6B]" />
                </span>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <div className="flex items-start gap-2.5 text-[13px] text-[#94A3B8]">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1E293B]">
                  <MapPin className="h-3.5 w-3.5 text-[#0B2E6B]" />
                </span>
                <span>
                  {siteConfig.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#1E293B] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 text-[11.5px] text-[#64748B] sm:justify-between">
          <p>© {year} <span className="text-[#64748B]">{siteConfig.name}</span>. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about"   className="transition hover:text-white">About</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
            <Link href="/programs" className="transition hover:text-white">Programs</Link>
            <Link href="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms-of-service" className="transition hover:text-white">Terms of Service</Link>
            <Link href="/refund-policy" className="transition hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

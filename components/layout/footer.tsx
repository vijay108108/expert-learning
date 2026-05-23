"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { courseFooterLinks, quickLinks, socialLinks } from "@/data/site";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function FacebookIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-2.74-2.74A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  mail: Mail,
};

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,123,34,0.12),transparent_24%),linear-gradient(180deg,rgba(7,20,43,0.96),rgba(7,16,40,0.995))] text-[12px] text-[#CBD5E1] backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-0 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_1.5fr] lg:gap-12 lg:px-20 lg:pt-[60px]">
        <div>
          <Brand mode="footer" />
          <p className="mt-4 max-w-[240px] text-[13px] leading-[1.8] text-[#CBD5E1]">
            Premium AWS, Azure, AI, DevOps, and cloud learning experiences designed for career outcomes and enterprise credibility.
          </p>
          <p className="mt-4 text-[11px] text-[#94A3B8]">{siteConfig.tagline}</p>
        </div>
        <div>
          <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">Quick Links</div>
          <div>
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block py-[5px] text-[13px] text-[#CBD5E1] transition-colors duration-200 hover:text-[#F97316]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">Courses</div>
          <div>
            {courseFooterLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block py-[5px] text-[13px] text-[#CBD5E1] transition-colors duration-200 hover:text-[#F97316]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">Contact</div>
          <div>
            <div className="mb-[14px] flex items-start gap-[10px]">
              <MapPin className="mt-[2px] h-[15px] w-[15px] shrink-0 text-[#FF7B22]" />
              <div className="text-[13px] leading-[1.6] text-[#CBD5E1]">
                {siteConfig.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <a
              href={`tel:${siteConfig.phone}`}
              className="mb-[14px] flex items-start gap-[10px] text-[13px] leading-[1.6] text-[#CBD5E1] transition-colors duration-200 hover:text-[#F97316]"
            >
              <Phone className="mt-[2px] h-[15px] w-[15px] shrink-0 text-[#FF7B22]" />
              <span>{siteConfig.phone}</span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-start gap-[10px] text-[13px] leading-[1.6] text-[#CBD5E1] transition-colors duration-200 hover:text-[#F97316]"
            >
              <Mail className="mt-[2px] h-[15px] w-[15px] shrink-0 text-[#FF7B22]" />
              <span>{siteConfig.email}</span>
            </a>
          </div>
          <div className="mt-6 flex items-center gap-[10px]">
            {socialLinks.map((item) => {
              const Icon = socialIcons[item.icon as keyof typeof socialIcons];

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-[#64748b] shadow-[0_10px_24px_rgba(2,8,28,0.16)] transition-all duration-200 hover:-translate-y-0.5",
                    item.hoverClass,
                  )}
                  aria-label={item.label}
                >
                  {Icon ? <Icon className="h-[18px] w-[18px]" /> : item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 border-t border-[rgba(255,255,255,0.08)] px-4 py-5 shadow-[inset_0_1px_0_rgba(249,115,22,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-20">
        <p className="text-[12px] text-[#94A3B8]">(c) 2026 {siteConfig.name}. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/contact" className="text-[12px] text-[#CBD5E1] transition-colors duration-200 hover:text-[#F97316]">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-[12px] text-[#CBD5E1] transition-colors duration-200 hover:text-[#F97316]">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

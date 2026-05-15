import Link from "next/link";
import { Brand } from "@/components/layout/brand";
import { courseFooterLinks, quickLinks, socialLinks } from "@/data/site";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="section-shell mt-16 border-t border-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted">
            Premium AWS, Azure, AI, DevOps, and cloud learning experiences designed for career outcomes and enterprise credibility.
          </p>
          <p className="mt-4 text-sm font-medium text-brand-blue">{siteConfig.tagline}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Quick Links</h3>
          <div className="mt-5 space-y-3">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-muted transition hover:text-brand-blue">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Courses</h3>
          <div className="mt-5 space-y-3">
            {courseFooterLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-muted transition hover:text-brand-blue">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Contact</h3>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <p>{siteConfig.address}</p>
            <a href={`tel:${siteConfig.phone}`} className="block transition hover:text-brand-blue">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="block transition hover:text-brand-blue">
              {siteConfig.email}
            </a>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-4 py-2 text-sm text-muted transition hover:border-brand-blue/30 hover:text-brand-blue"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>(c) 2026 Expert Learning. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/contact" className="transition hover:text-brand-blue">
            Privacy Policy
          </Link>
          <Link href="/contact" className="transition hover:text-brand-blue">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

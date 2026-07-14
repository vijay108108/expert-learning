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
      "https://www.facebook.com/profile.php?id=61592055052262",
      "https://www.linkedin.com/company/genznext-research-training/",
    ],
  };
}

function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return "https://expertlearning.in";
  }

  return configuredUrl.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "GenZNext Research & Training",
  company: "Netseems Ventures Pvt Ltd",
  tagline: "GenZNext Research & Training by Netseems Ventures Pvt Ltd",
  description:
    "Cloud, AI, DevOps, data engineering, summer training, and certification programs designed for ambitious learners and modern teams.",
  url: resolveSiteUrl(),
  email: "info@genznext.com",
  supportEmail: "info@genznext.com",
  admissionsEmail: "info@genznext.com",
  phone: "+91 8867359208",
  whatsapp: "918867359208",
  gstNumber: "27AAHCN4778J1ZU",
  address: "A19, Om Bungalow, Sai Jyot Park, Rahatani, Pune, Maharashtra – 411017",
  addressLines: ["A19, Om Bungalow, Sai Jyot Park", "Rahatani, Pune, Maharashtra – 411017"],
  legalName: "NETSEEMS VENTURES PRIVATE LIMITED",
  cin: "U72900MH2023PTC000000",
};

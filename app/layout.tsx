import type { Metadata } from "next";
import { AppShellEnhancements } from "@/components/app-shell-enhancements";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = buildMetadata({
  title: "Expert Learning | AWS, Azure, AI & DevOps Certification Programs",
  description:
    "Expert Learning helps students and professionals master AWS, Azure, AI, cloud, data engineering, GenAI, and DevOps with live mentorship and career-focused certification programs.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col overflow-x-clip">
          <AppShellEnhancements />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileStickyCta />
        </div>
      </body>
    </html>
  );
}

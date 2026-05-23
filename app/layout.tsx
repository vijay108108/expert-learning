/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { DemoModalRoot } from "@/components/demo/demo-modal-root";
import { AppChrome } from "@/components/layout/app-chrome";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = buildMetadata({
  title: "GenZNext Research & Training | AWS, Azure, AI & DevOps Certification Programs",
  description:
    "GenZNext Research & Training helps students and professionals master AWS, Azure, AI, cloud, data engineering, GenAI, and DevOps with live mentorship and career-focused certification programs.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            <div className="relative min-h-screen overflow-x-clip">
              <AppChrome>{children}</AppChrome>
              <DemoModalRoot />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

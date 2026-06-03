/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { DemoModalRoot } from "@/components/demo/demo-modal-root";
import { AppChrome } from "@/components/layout/app-chrome";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GenZNext Research & Training | AI, GenAI, Agentic AI, DevSecOps, AWS & Azure Certifications",
    description:
      "GenZNext Research & Training helps students and professionals master AI, Generative AI, Agentic AI, DevSecOps, AWS and Azure certifications with live mentorship and career-focused programs.",
  }),
  applicationName: "GenZNext",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GenZNext",
  },
  formatDetection: { telephone: false },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#4F46E5",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4F46E5" },
    { media: "(prefers-color-scheme: dark)",  color: "#4F46E5" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased" data-scroll-behavior="smooth">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* PWA / Apple icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GenZNext" />
        {/* Splash colors */}
        <meta name="msapplication-TileColor" content="#4F46E5" />
        <meta name="msapplication-TileImage" content="/icon-512.png" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            <div className="relative min-h-screen overflow-x-clip">
              <AppChrome>{children}</AppChrome>
              <DemoModalRoot />
              <PwaProvider />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

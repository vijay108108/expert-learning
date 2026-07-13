import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { ClientAnalyticsProvider } from "@/components/analytics/client-analytics-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { DemoModalRoot } from "@/components/demo/demo-modal-root";
import { AppChrome } from "@/components/layout/app-chrome";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { env } from "@/lib/env";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-ui",
  display: "swap",
});

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
    "msapplication-TileColor": "#0B2E6B",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B2E6B" },
    { media: "(prefers-color-scheme: dark)",  color: "#0B2E6B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth antialiased ${sora.variable} ${jetBrainsMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {env.nextPublicGaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${env.nextPublicGaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${env.nextPublicGaMeasurementId}', { send_page_view: false });`}
            </Script>
          </>
        ) : null}
        {env.nextPublicMetaPixelId ? (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${env.nextPublicMetaPixelId}');
fbq('track', 'PageView');`}
          </Script>
        ) : null}
        {/* PWA / Apple icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GenZNext" />
        {/* Splash colors */}
        <meta name="msapplication-TileColor" content="#0B2E6B" />
        <meta name="msapplication-TileImage" content="/icon-512.png" />
      </head>
      <body className="min-h-full bg-background text-foreground">
        {env.nextPublicMetaPixelId ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${env.nextPublicMetaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        ) : null}
        <AuthProvider>
          <CartProvider>
            <div className="relative min-h-screen overflow-x-clip">
              <Suspense fallback={null}>
                <ClientAnalyticsProvider />
              </Suspense>
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

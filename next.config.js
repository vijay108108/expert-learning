/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  reactStrictMode: false,

  async headers() {
    return [
      {
        // Service worker must be served from the root with correct headers
        source: "/sw.js",
        headers: [
          { key: "Content-Type",   value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control",  value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        // Web app manifest
        source: "/manifest.webmanifest",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

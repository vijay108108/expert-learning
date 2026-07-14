/** @type {import('next').NextConfig} */
const ignoreBuildTypecheck = process.env.NEXT_IGNORE_BUILD_TYPECHECK === "1";

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: ignoreBuildTypecheck,
  },

  async headers() {
    return [
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

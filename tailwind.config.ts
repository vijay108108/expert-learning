import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0B2E6B",
          secondary: "#15407E",
          accent: "#E56F12",
          background: "#F8FAFC",
          card: "#FFFFFF",
          text: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
          hover: "#092552",
        },
      },
      fontFamily: {
        sans: ["Sora", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "14px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(17,24,39,0.06)",
        card: "0 10px 28px rgba(17,24,39,0.08)",
      },
    },
  },
};

export default config;

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";

export default async function OpenGraphImage() {
  const logoPath = join(process.cwd(), "public", "genznext-navbar-logo.png");
  const logoBuffer = await readFile(logoPath);
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(6,182,212,0.30), transparent 28%), radial-gradient(circle at bottom right, rgba(124,58,237,0.30), transparent 28%), linear-gradient(135deg, #020617 0%, #0f172a 52%, #15407e 100%)",
          color: "white",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src={logoDataUrl}
            width={84}
            height={84}
            alt="GenZNext logo"
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "18px",
              objectFit: "cover",
              boxShadow: "0 8px 24px rgba(2, 6, 23, 0.45)",
            }}
          />
          <div style={{ fontSize: 24, letterSpacing: "0.14em" }}>GENZNEXT RESEARCH &amp; TRAINING</div>
        </div>
        <div style={{ maxWidth: "860px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.05 }}>
            GenZNext Research &amp; Training
          </div>
          <div style={{ fontSize: 30, color: "rgba(226,232,240,0.92)", lineHeight: 1.4 }}>
            AI, GenAI, Agentic AI, DevSecOps, AWS &amp; Azure Certifications
          </div>
        </div>
      </div>
    ),
    size,
  );
}

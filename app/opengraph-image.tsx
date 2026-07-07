import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
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
            "radial-gradient(circle at top left, rgba(6,182,212,0.30), transparent 28%), radial-gradient(circle at bottom right, rgba(124,58,237,0.30), transparent 28%), linear-gradient(135deg, #020617 0%, #0f172a 52%, #2563eb 100%)",
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
          <div
            style={{
              width: "84px",
              height: "84px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "28px",
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 55%, #7c3aed 100%)",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            GZ
          </div>
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

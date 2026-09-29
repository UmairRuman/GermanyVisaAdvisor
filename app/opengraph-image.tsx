import { ImageResponse } from "next/og";

export const alt = "GermanyChalo — Study in Germany, Guided Every Step";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Uses Satori's default sans-serif rather than fetching the site's Fraunces webfont at
// build time — keeps image generation dependency-free and build-safe. The brand still reads
// clearly through color and layout alone.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#171310",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 18,
              background: "#faf7f1",
              color: "#171310",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            GC
          </div>
          <div
            style={{
              display: "flex",
              height: 6,
              width: 110,
              borderRadius: 999,
              background: "linear-gradient(90deg, #b3241c, #b98a2e)",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row", fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
            <div style={{ display: "flex", color: "#faf7f1" }}>Germany</div>
            <div style={{ display: "flex", color: "#c9463b" }}>Chalo</div>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, color: "rgba(250,247,241,0.62)" }}>
            Study in Germany. We Make the Path Clear.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

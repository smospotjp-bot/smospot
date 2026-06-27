import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SmoSpot — Find smoking spots near you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded OG image, generated at the edge. Uses Latin text only so it renders
 * correctly with the default font (no bundled Japanese webfont required).
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0E2A20 0%, #1B4332 55%, #2D6A4F 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "rgba(255,255,255,0.12)",
              border: "2px solid rgba(255,255,255,0.25)",
            }}
          >
            {/* drawn cigarette: white body + orange filter tip */}
            <div style={{ display: "flex", width: 58, height: 18, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "flex", flex: 1, background: "#ffffff" }} />
              <div style={{ display: "flex", width: 12, background: "#E76F51" }} />
            </div>
          </div>
          <span>
            Smo<span style={{ color: "#52B788" }}>Spot</span>
          </span>
        </div>
        <div style={{ marginTop: 28, fontSize: 40, fontWeight: 700, color: "#D8F3DC" }}>
          Find smoking spots near you
        </div>
        <div style={{ marginTop: 12, fontSize: 28, color: "rgba(216,243,220,0.75)" }}>
          GPS map of smoking areas &amp; smoking-friendly cafes in Tokyo
        </div>
      </div>
    ),
    size
  );
}

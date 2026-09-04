import { ImageResponse } from "next/og";

import { BRAND } from "@/lib/email/brand";

/** Live marketing tokens from globals.css (:root / .marketing-theme). */
const OG_FOREST = "#1c1f24";
const OG_MOSS = "#e4bb00";
const OG_PARCHMENT = "#f5f6f7";
const OG_MUTED = "#cfd5dd";

export const alt = `${BRAND.name} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: OG_FOREST,
          color: OG_PARCHMENT,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: OG_MOSS,
            }}
          >
            Legal counsel · Medellín
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontFamily: "Georgia, serif",
            }}
          >
            {BRAND.name}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              maxWidth: 900,
              color: OG_MUTED,
            }}
          >
            {BRAND.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: OG_MUTED,
          }}
        >
          <span>{BRAND.lawyer}</span>
          <span>{BRAND.website.replace("https://", "")}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

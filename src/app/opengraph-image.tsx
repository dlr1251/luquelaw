import { ImageResponse } from "next/og";

import { BRAND } from "@/lib/email/brand";

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
          backgroundColor: BRAND.colors.forest,
          color: BRAND.colors.parchment,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: BRAND.colors.moss,
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
              color: "#e8dfd0",
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
            color: "#d8cdb8",
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

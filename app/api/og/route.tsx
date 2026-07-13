import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/app/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const DEFAULT_DESCRIPTION =
  "Hızlı, ücretsiz ve tamamen tarayıcıda çalışan online araçlar.";

const BADGES = ["Ücretsiz", "Kayıt Gerekmez", "Tarayıcıda Çalışır"];

// tools.ts / categories.ts tabanlı merkezi SEO sistemi (bkz.
// app/lib/tool-metadata.ts, app/lib/category-metadata.ts, app/lib/og-image.ts)
// her sayfa için bu endpoint'e title/description query parametreleriyle
// gelir; böylece her araç kendi OG görselini otomatik alır, yeni bir araç
// eklendiğinde elle görsel tasarlamaya gerek kalmaz. Renk paleti kök
// app/opengraph-image.tsx ile birebir aynı (marka tutarlılığı için).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 80) || SITE_NAME;
  const description =
    searchParams.get("description")?.slice(0, 160) || DEFAULT_DESCRIPTION;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "linear-gradient(135deg, #0d0a16 0%, #1a1330 50%, #0d0a16 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#e9e4fb",
              display: "flex",
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              color: "#ffffff",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "#c4b5fd",
              display: "flex",
            }}
          >
            {description}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {BADGES.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 9999,
                border: "1px solid rgba(167,139,250,0.35)",
                color: "#c4b5fd",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    }
  );
}

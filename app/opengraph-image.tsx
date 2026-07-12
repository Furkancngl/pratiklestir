import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Site genelinde varsayılan OG görseli - kendi opengraph-image dosyasını
// tanımlamayan her rota (araç/kategori sayfaları dahil) bunu miras alır.
// Statik bir görsel dosyasına ihtiyaç duymadan, kod üzerinden üretilir.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d0a16 0%, #1a1330 50%, #0d0a16 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)",
            }}
          />
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#ffffff",
            }}
          >
            Pratikleştir
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#c4b5fd",
          }}
        >
          Hızlı ve Ücretsiz Online Araçlar
        </div>
      </div>
    ),
    { ...size }
  );
}

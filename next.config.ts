import type { NextConfig } from "next";

// staticimgly.com barındırır @imgly/background-removal'ın WASM/ONNX model
// dosyalarını (arka plan silme aracı); paket varsayılan olarak bu CDN'den
// indirir (bkz. node_modules/@imgly/background-removal), bu yüzden
// connect-src/script-src'ye eklenmesi gerekir, yoksa araç CSP tarafından
// kırılır.
const IMGLY_CDN = "https://staticimgly.com";

// @vercel/speed-insights script'i bu host'tan yükleniyor (veri gönderimi
// ise aynı origin'deki /speed-insights/vitals'e gidiyor, connect-src 'self'
// zaten kapsıyor - bkz. node_modules/@vercel/speed-insights/dist/index.mjs).
const VERCEL_SPEED_INSIGHTS = "https://va.vercel-scripts.com";

// Döviz Hesapla aracı güncel kurları bu ücretsiz, anahtarsız uçtan
// doğrudan tarayıcıda çekiyor (bkz. app/doviz-hesapla/page-client.tsx);
// connect-src'ye eklenmezse istek CSP tarafından engellenir.
const EXCHANGE_RATE_API = "https://open.er-api.com";

// recent-activity-card.tsx, son giriş konumunu göstermek için bu ücretsiz,
// anahtarsız uçtan doğrudan tarayıcıda IP-konum sorgusu çekiyor;
// connect-src'ye eklenmezse istek CSP tarafından engellenir.
const IP_GEOLOCATION_API = "https://ipwho.is";

// next dev (Turbopack/Fast Refresh) HMR client'ı modül değiştirmede
// eval() kullanıyor; production build'de (next build/start, Vercel dahil)
// bu dev-only çalışma zamanı hiç var olmuyor, dolayısıyla 'unsafe-eval'e
// hiç ihtiyaç yok - sadece yerel geliştirmede ekliyoruz, prod CSP'si
// zayıflamıyor.
const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'wasm-unsafe-eval': arka plan silme aracı @imgly/background-removal
  // üzerinden ONNX runtime WASM modeli çalıştırıyor; bazı tarayıcılar WASM
  // instantiation'ı bu izin olmadan CSP script-src altında engelleyebilir.
  // blob: aynı aracın kendi worker script'ini bir blob URL'den yüklemesi
  // için gerekli (worker-src'deki blob: izni sadece `new Worker(...)`
  // örneklemesini kapsıyor, <script src="blob:...">'i kapsamıyor).
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: ${IMGLY_CDN} ${VERCEL_SPEED_INSIGHTS}${
    isDev ? " 'unsafe-eval'" : ""
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // blob:: arka plan silme aracının worker'ı, WASM/model verisini kendi
  // ürettiği blob: URL'lerinden fetch() ile okuyor.
  `connect-src 'self' blob: ${IMGLY_CDN} ${EXCHANGE_RATE_API} ${IP_GEOLOCATION_API}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Sadece prod'da eklenir: yerel geliştirme sunucusu düz HTTP üzerinden
  // çalışıyor (next dev/start, TLS yok). Bu header dev'de de gönderilirse
  // tarayıcı o an itibariyle localhost'a yapılan TÜM sonraki istekleri
  // (aynı sekme/profil içinde, kalıcı olarak - max-age 2 yıl) otomatik
  // HTTPS'e yükseltir; sunucu TLS dinlemediği için bu istekler
  // SSL_PROTOCOL_ERROR ile başarısız olur ve yerel geliştirme kilitlenir.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  // Anonim/pazarlama sayfalarının statik/ISR kabuk olarak servis
  // edilebilmesi için Cache Components (Next 16'nın PPR yerine geçen
  // modeli) açık. Bu, cookies()/headers()/auth()/searchParams okuyan HER
  // sayfa/layout'un <Suspense> ile sarılmasını zorunlu kılar (aksi halde
  // build hata verir) - bkz. app/layout.tsx, app/components/auth-nav.tsx,
  // app/page.tsx, app/planlar/page.tsx, app/admin/layout.tsx,
  // app/ayarlar/layout.tsx, app/sifre-sifirla/page.tsx.
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // PDF Kilitle/Kilit Kaldır'ın kullandığı @neslinesli93/qpdf-wasm
  // (Emscripten çıktısı), pdfjs-dist'in aksine bir "browser" alanı
  // tanımlamıyor: dosyasında hiç çalışmayacağı bir Node.js dalında
  // `require("fs")`/`require("path")` bulunuyor. Turbopack bunu build
  // sırasında statik olarak çözmeye çalışıp hata veriyor - bu iki modülü
  // tarayıcı paketlerinde zararsız bir boş shim'e yönlendiriyoruz (bkz.
  // node-empty-shim.js).
  turbopack: {
    resolveAlias: {
      fs: { browser: "./node-empty-shim.js" },
      path: { browser: "./node-empty-shim.js" },
    },
  },
};

export default nextConfig;

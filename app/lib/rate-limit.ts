import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN ayarlanmadıysa rate
// limiting sessizce devre dışı kalır (fail-open) — bu, env değişkenleri
// eklenene kadar local/preview ortamlarını kırmamak için bilinçli bir
// tercih; prod'a çıkmadan önce bu iki değişkenin ayarlandığından emin olun.
const isConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// guest-usage-server.ts de aynı Redis bağlantısını paylaşıp kullanır
// (misafir IP+araç sayacı için) - Ratelimit bu iş için uygun değil çünkü
// o kayan zaman penceresinde sıfırlanan bir limit, burada ise ömür boyu
// (TTL'e kadar) kalıcı bir kullanım sayacı gerekiyor.
export const redis = isConfigured ? Redis.fromEnv() : null;

function createLimiter(tokens: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
  });
}

// Giriş denemesi: aynı IP'den dakikada 5 deneme (brute-force/credential
// stuffing'i yavaşlatmak için).
export const loginRateLimit = createLimiter(5, "1 m");

// Kayıt: aynı IP'den saatte 5 hesap (kitlesel sahte hesap açmayı zorlaştırmak
// için).
export const signupRateLimit = createLimiter(5, "1 h");

// Hesap/admin API mutasyonları: aynı IP'den dakikada 30 istek (genel kötüye
// kullanım/otomasyon koruması, normal kullanım akışını etkilemeyecek kadar
// gevşek).
export const apiMutationRateLimit = createLimiter(30, "1 m");

// Şifre sıfırlama isteği/onayı: aynı IP'den 15 dakikada 5 deneme (e-posta
// bombalama ve token brute-force'unu yavaşlatmak için).
export const passwordResetRateLimit = createLimiter(5, "15 m");

export type RateLimitResult = { allowed: true } | { allowed: false };

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  if (!limiter) return { allowed: true };
  const { success } = await limiter.limit(identifier);
  return success ? { allowed: true } : { allowed: false };
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

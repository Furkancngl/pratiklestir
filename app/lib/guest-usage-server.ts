import "server-only";
import { redis } from "./rate-limit";
import { GUEST_FREE_USES } from "./guest-usage";
import type { ToolKey } from "./credits";

// IP zamanla el değiştirebilir (dinamik IP, paylaşımlı ağlar), bu yüzden
// kotayı süresiz kilitlemek yerine belirli bir süre sonra sıfırlanmasına
// izin veriyoruz.
const GUEST_USAGE_TTL_SECONDS = 60 * 60 * 24 * 30;

export type GuestUsageResult = { allowed: boolean; remaining: number };

// Login yapmamış ziyaretçiler için asıl/kesin kota doğrulaması. localStorage
// sadece hızlı bir client-side ön kontrol - biri onu temizlese/değiştirse
// bile bu IP+araç bazlı Redis sayacı gerçek kotayı uygular. Redis
// yapılandırılmadıysa (env değişkenleri eksikse) fail-open: sınırsız izin
// ver - bkz. rate-limit.ts'deki aynı felsefe.
export async function checkAndRecordGuestUsage(
  tool: ToolKey,
  ip: string
): Promise<GuestUsageResult> {
  if (!redis) return { allowed: true, remaining: GUEST_FREE_USES };

  const key = `guest-usage:${tool}:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, GUEST_USAGE_TTL_SECONDS);
  }

  if (count > GUEST_FREE_USES) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: GUEST_FREE_USES - count };
}

const STORAGE_KEY = "pratiklestir:guest-tool-uses";

// Login yapmamış ziyaretçiler için araç başına ücretsiz deneme sayısı. Bu
// dosyadaki sayaç yalnızca hızlı, anlık bir client-side ön kontrol - asıl/
// kesin doğrulama artık sunucu tarafında IP+araç bazlı Redis sayacıyla
// yapılıyor (bkz. app/lib/guest-usage-server.ts, app/api/guest-usage).
// localStorage temizlense bile Redis sayacı kullanıcıyı yakalar.
export const GUEST_FREE_USES = 2;

type UsageMap = Record<string, number>;

function readUsageMap(): UsageMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as UsageMap) : {};
  } catch {
    return {};
  }
}

export function getGuestUseCount(tool: string): number {
  const count = readUsageMap()[tool];
  return typeof count === "number" && count > 0 ? count : 0;
}

export function recordGuestUse(tool: string): number {
  const map = readUsageMap();
  const next = (map[tool] ?? 0) + 1;
  map[tool] = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  return next;
}

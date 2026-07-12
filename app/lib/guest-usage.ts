const STORAGE_KEY = "pratiklestir:guest-tool-uses";

// Login yapmamış ziyaretçiler için sunucu tarafında oturum/cookie yok, bu
// yüzden sayaç tarayıcı başına localStorage'da tutuluyor (site geneli
// toplam, araç bazlı değil).
export const GUEST_FREE_USES = 2;

export function getGuestUseCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function recordGuestUse(): number {
  const next = getGuestUseCount() + 1;
  window.localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

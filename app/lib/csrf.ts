import "server-only";

// NextAuth'un oturum çerezi SameSite=Lax olsa da, bu route handler'lar
// (Server Action olmayan /api/* uçları) Next.js'in Server Action'lara
// otomatik uyguladığı same-origin kontrolünden yararlanmaz. Bu yüzden
// state değiştiren her PATCH/DELETE isteğinde Origin header'ını host ile
// karşılaştırarak CSRF'e karşı ek bir savunma katmanı sağlıyoruz.
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

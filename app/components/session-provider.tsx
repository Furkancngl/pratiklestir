"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

export default function AuthSessionProvider({
  session,
  children,
}: {
  // `undefined` (prop hiç verilmemiş gibi) kasıtlı: next-auth'un
  // SessionProvider'ı `session !== undefined` olduğunda render sırasında
  // senkron Date.now() çağırıyor (bkz. node_modules/next-auth/src/react.tsx)
  // - bu, Cache Components altında STATİK sayfaların prerender'ını
  // kırıyor. `undefined` bırakınca o dal atlanıyor, client kendi
  // /api/auth/session fetch'ini yapıyor (bkz. app/layout.tsx yorumu).
  session?: Session | null;
  children: ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

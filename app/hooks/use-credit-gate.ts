"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { consumeCredit } from "@/app/actions/credits";
import type { ToolKey } from "@/app/lib/credits";
import { GUEST_FREE_USES, getGuestUseCount, recordGuestUse } from "@/app/lib/guest-usage";

export type CreditError = {
  message: string;
  showUpgrade: boolean;
  kind?: "guest-invite";
};

export function useCreditGate(tool: ToolKey) {
  const router = useRouter();
  const { status } = useSession();
  const [creditError, setCreditError] = useState<CreditError | null>(null);

  const checkAndConsume = async (): Promise<boolean> => {
    setCreditError(null);

    // Kredi sistemi sadece giriş yapmış kullanıcıların günlük plan limitini
    // düşürür. Login yapmamış ziyaretçiler araç başına ilk GUEST_FREE_USES
    // denemeyi serbestçe kullanabilir, sonrasında kayıt daveti gösterilir.
    if (status !== "authenticated") {
      // Hızlı, anlık client-side ön kontrol - sunucuya gitmeden önce bariz
      // durumlarda gereksiz istek atmayı önler. Asıl/kesin karar aşağıdaki
      // sunucu (Redis, IP+araç bazlı) yanıtına göre verilir.
      if (getGuestUseCount(tool) >= GUEST_FREE_USES) {
        setCreditError({
          message: `İlk ${GUEST_FREE_USES} ücretsiz denemeni kullandın. Sınırsız kullanmak için hemen ücretsiz hesap oluştur.`,
          showUpgrade: false,
          kind: "guest-invite",
        });
        return false;
      }

      try {
        const res = await fetch("/api/guest-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool }),
        });
        const data: { allowed?: boolean } = await res.json();
        if (!res.ok || !data.allowed) {
          setCreditError({
            message: `İlk ${GUEST_FREE_USES} ücretsiz denemeni kullandın. Sınırsız kullanmak için hemen ücretsiz hesap oluştur.`,
            showUpgrade: false,
            kind: "guest-invite",
          });
          return false;
        }
      } catch {
        // Sunucuya ulaşılamadıysa fail-open: misafir deneyimini bozma,
        // yalnızca client sayaçla devam et (rate-limit.ts'deki Redis
        // yapılandırılmamış durumundaki aynı fail-open felsefesi).
      }

      recordGuestUse(tool);
      return true;
    }

    const result = await consumeCredit(tool);
    if (!result.ok) {
      setCreditError({
        message: result.message,
        showUpgrade: result.code === "insufficient_credits",
      });
      return false;
    }
    router.refresh();
    return true;
  };

  return { checkAndConsume, creditError, clearCreditError: () => setCreditError(null) };
}

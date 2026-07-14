"use client";

import { useSession } from "next-auth/react";
import { formatFileSizeMB, getMaxFileSizeForPlan } from "@/app/lib/file-limits";

export type FileSizeError = {
  message: string;
  showUpgrade: boolean;
};

// Dosya yükleme gerektiren her araç, dosya boyutu limitini ve aşıldığında
// gösterilecek hatayı buradan alır - useCreditGate/CreditErrorNotice ile
// aynı desen. Yeni bir araca eklemek için tek yapılması gereken: bu hook'u
// çağırıp dosya filtresinde `file.size > maxFileSizeBytes` kontrolü yapmak.
export function useFileSizeLimit() {
  const { data: session } = useSession();
  const isPro = session?.user?.plan === "pro";
  const maxFileSizeBytes = getMaxFileSizeForPlan(session?.user?.plan);

  function buildOversizedError(): FileSizeError {
    if (isPro) {
      return {
        message: `Dosya boyutu Pro planda ${formatFileSizeMB(maxFileSizeBytes)} ile sınırlı.`,
        showUpgrade: false,
      };
    }
    return {
      message: `Dosya boyutu Free planda ${formatFileSizeMB(maxFileSizeBytes)} ile sınırlı. Daha büyük dosyalar için Pro'ya geçin.`,
      showUpgrade: true,
    };
  }

  return { maxFileSizeBytes, isPro, buildOversizedError };
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { consumeCredit } from "@/app/actions/credits";
import type { ToolKey } from "@/app/lib/credits";

export type CreditError = { message: string; showUpgrade: boolean };

export function useCreditGate(tool: ToolKey) {
  const router = useRouter();
  const [creditError, setCreditError] = useState<CreditError | null>(null);

  const checkAndConsume = async (): Promise<boolean> => {
    setCreditError(null);
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

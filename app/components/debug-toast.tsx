"use client";

// GEÇİCİ TEŞHİS ARACI — sorun bulununca bu dosya ve tüm kullanımları kaldırılacak.
import { useEffect, useState } from "react";

export function useDebugToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const toast = message ? (
    <div className="fixed inset-x-4 top-4 z-[9999] rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg">
      {message}
    </div>
  ) : null;

  return { show: setMessage, toast };
}

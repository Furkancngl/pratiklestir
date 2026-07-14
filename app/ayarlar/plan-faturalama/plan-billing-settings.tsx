"use client";

import { useState } from "react";
import Link from "next/link";
import PlanBadge from "@/app/components/plan-badge";

const PLAN_DESCRIPTIONS: Record<string, string> = {
  free: "Günde 30 kredi, aynı anda 1 dosya işleme.",
  pro: "Günde 200 kredi, aynı anda 10 dosya işleme, toplu işlem ve öncelikli destek.",
};

export default function PlanBillingSettings({
  plan,
  renewalDateLabel,
}: {
  plan: string;
  renewalDateLabel: string | null;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelRequested, setCancelRequested] = useState(false);
  const isPro = plan === "pro";

  return (
    <div>
      <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-black dark:text-white">
        Plan &amp; Faturalama
      </h1>
      <p className="mb-8 text-[13.5px] text-zinc-500 dark:text-zinc-400">
        Planını yönet, faturalarını görüntüle.
      </p>

      <div className="max-w-[460px] rounded-2xl border border-violet-500/30 bg-violet-500/[.06] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1.5">
              <PlanBadge plan={plan} />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {PLAN_DESCRIPTIONS[plan] ?? ""}
            </p>
          </div>
          {!isPro && (
            <Link
              href="/planlar"
              className="shrink-0 touch-manipulation rounded-[9px] bg-linear-to-r from-violet-500 to-indigo-500 px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              Pro&apos;ya Geç
            </Link>
          )}
        </div>

        {isPro && renewalDateLabel && (
          <p className="mt-4 border-t border-violet-500/15 pt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Tahmini yenileme tarihi:{" "}
            <span className="font-medium text-black dark:text-zinc-50">
              {renewalDateLabel}
            </span>
            <br />
            Otomatik faturalandırma sistemi tam entegre edildiğinde bu tarih
            gerçek ödeme döngünüzü yansıtacaktır.
          </p>
        )}
      </div>

      {isPro && (
        <div className="mt-8 max-w-[460px]">
          {cancelRequested ? (
            <div className="rounded-[10px] border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-700 dark:text-emerald-400">
              İptal talebini aldık. Ödeme sistemimiz tam entegre olduğunda bu
              talep otomatik işleyip mevcut dönemin sonunda hesabını Free
              plana geçirecek şekilde aktif olacak. Şimdilik plan durumunda
              bir değişiklik yapılmadı.
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="touch-manipulation rounded-[10px] border border-red-500/40 px-4.5 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
              >
                Planı İptal Et
              </button>
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                İptal ettiğinde mevcut dönemin sonuna kadar Pro özelliklerini
                kullanmaya devam edersin.
              </p>
            </>
          )}
        </div>
      )}

      <div className="mt-10 border-t border-black/[.08] pt-6 dark:border-white/[.08]">
        <p className="mb-3 text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">
          Fatura Geçmişi
        </p>
        <div className="flex max-w-[460px] flex-col items-center gap-2 rounded-2xl border border-dashed border-black/[.12] px-6 py-10 text-center dark:border-white/[.12]">
          <p className="text-sm font-semibold text-black dark:text-zinc-50">
            Henüz faturanız yok
          </p>
          <p className="max-w-[280px] text-xs text-zinc-500 dark:text-zinc-400">
            Ödeme sistemi bağlandığında faturaların burada listelenecek.
          </p>
        </div>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-black/[.08] bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-lg font-bold text-black dark:text-zinc-50">
              Planını iptal etmek istediğine emin misin?
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              İptal ettiğinde Pro özelliklerini mevcut dönemin sonuna kadar
              kullanmaya devam edersin; dönem bitiminde hesabın otomatik
              olarak Free plana döner.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-[10px] border border-black/[.12] px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] dark:border-white/[.12] dark:text-zinc-300 dark:hover:bg-white/[.06]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setCancelRequested(true);
                }}
                className="rounded-[10px] bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Evet, İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

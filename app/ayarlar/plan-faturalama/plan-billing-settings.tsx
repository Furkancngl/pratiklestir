"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import PlanBadge from "@/app/components/plan-badge";
import { cancelProPlan, undoCancelProPlan } from "@/app/actions/plan";

const PLAN_DESCRIPTIONS: Record<string, string> = {
  free: "Günde 30 kredi, aynı anda 1 dosya işleme.",
  pro: "Günde 200 kredi, aynı anda 10 dosya işleme, toplu işlem ve öncelikli destek.",
};

export default function PlanBillingSettings({
  plan,
  renewalDateLabel,
  cancelAtPeriodEnd,
}: {
  plan: string;
  renewalDateLabel: string | null;
  cancelAtPeriodEnd: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isPro = plan === "pro";

  const handleConfirmCancel = () => {
    setError("");
    startTransition(async () => {
      const result = await cancelProPlan();
      if (result?.error) {
        setError(result.error);
      }
      setConfirmOpen(false);
    });
  };

  const handleUndo = () => {
    setError("");
    startTransition(async () => {
      const result = await undoCancelProPlan();
      if (result?.error) {
        setError(result.error);
      }
    });
  };

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
            {cancelAtPeriodEnd ? "Erişiminizin sona ereceği tarih" : "Tahmini yenileme tarihi"}:{" "}
            <span className="font-medium text-black dark:text-zinc-50">{renewalDateLabel}</span>
            {!cancelAtPeriodEnd && (
              <>
                <br />
                Otomatik faturalandırma sistemi tam entegre edildiğinde bu tarih
                gerçek ödeme döngünüzü yansıtacaktır.
              </>
            )}
          </p>
        )}
      </div>

      {isPro && (
        <div className="mt-8 max-w-[460px]">
          {cancelAtPeriodEnd ? (
            <div className="rounded-[10px] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-700 dark:text-amber-400">
              <p className="font-semibold">
                Pro üyeliğiniz{renewalDateLabel ? ` ${renewalDateLabel}` : ""} tarihinde sona
                erecek.
              </p>
              <p className="mt-1 text-amber-700/80 dark:text-amber-400/80">
                Bu tarihe kadar Pro özelliklerini kullanmaya devam edersin, sonrasında hesabın
                otomatik olarak Free plana döner.
              </p>
              <button
                type="button"
                onClick={handleUndo}
                disabled={isPending}
                className="mt-3 touch-manipulation rounded-[10px] border border-amber-600/40 px-3.5 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-amber-400"
              >
                {isPending ? "İşleniyor..." : "İptali Geri Al"}
              </button>
              <p className="mt-2 text-[11px] text-amber-700/70 dark:text-amber-400/70">
                Bu, yalnızca uygulamamızdaki iptal işaretini kaldırır. Gumroad tarafında da
                aboneliğini iptal ettiysen, orayı da ayrıca kontrol etmen gerekir.
              </p>
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
          {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
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
          onClick={() => !isPending && setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-black/[.08] bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-lg font-bold text-black dark:text-zinc-50">Emin misiniz?</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Pro üyeliğiniz{renewalDateLabel ? ` ${renewalDateLabel}` : ""} tarihine kadar aktif
              kalmaya devam edecek. Bu tarihten sonra otomatik olarak Free plana geçeceksiniz.
            </p>
            <p className="mt-3 rounded-[10px] bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400">
              Önemli: Bir sonraki dönemde tekrar ücretlendirilmemek için, Gumroad&apos;dan
              aldığın makbuz e-postasındaki bağlantıdan aboneliğini Gumroad tarafında da iptal
              etmen gerekiyor. Bu işlemi senin adına otomatik yapamıyoruz.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={isPending}
                className="rounded-[10px] border border-black/[.12] px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[.12] dark:text-zinc-300 dark:hover:bg-white/[.06]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isPending}
                className="rounded-[10px] bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "İşleniyor..." : "İptal Et, Onaylıyorum"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

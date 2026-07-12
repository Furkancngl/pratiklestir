"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const inputClass =
  "w-full max-w-[360px] rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.5 text-sm text-black outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white";

const placeholderBtnClass =
  "shrink-0 touch-manipulation rounded-[9px] border border-black/[.12] bg-black/[.03] px-4 py-2 text-xs font-semibold text-zinc-500 disabled:cursor-not-allowed dark:border-white/[.12] dark:bg-white/[.04] dark:text-zinc-400";

export default function AccountSettings() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");

    const res = await fetch("/api/account", { method: "DELETE" });

    if (!res.ok) {
      setDeleting(false);
      setError("Hesap silinemedi. Lütfen tekrar deneyin.");
      return;
    }

    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-black dark:text-white">
        Hesap
      </h1>
      <p className="mb-8 text-[13.5px] text-zinc-500 dark:text-zinc-400">
        Şifre, bağlı hesaplar ve güvenlik ayarların.
      </p>

      <div className="mb-3">
        <label
          htmlFor="currentPassword"
          className="mb-2 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400"
        >
          Mevcut Şifre
        </label>
        <input
          id="currentPassword"
          type="password"
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      <button
        type="button"
        disabled
        title="Resend entegrasyonu tamamlandığında aktif olacak"
        className="touch-manipulation rounded-[10px] bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-[13.5px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Şifreyi Değiştirmek İstiyorum
      </button>
      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
        E-posta ile şifre sıfırlama bağlantısı gönderilecek (yakında).
      </p>

      <div className="mt-10 max-w-[460px]">
        <div className="flex items-center justify-between gap-4 border-b border-black/[.08] py-3.5 dark:border-zinc-800">
          <div>
            <p className="text-[13.5px] font-semibold text-black dark:text-zinc-50">
              Google Hesabı
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Bağlı değil</p>
          </div>
          <button type="button" disabled title="Yakında" className={placeholderBtnClass}>
            Bağla
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <div>
            <p className="text-[13.5px] font-semibold text-black dark:text-zinc-50">
              Aktif Oturumlar
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              1 cihazda giriş yapılmış
            </p>
          </div>
          <button type="button" disabled title="Yakında" className={placeholderBtnClass}>
            Görüntüle
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-red-500/15 pt-6">
        <p className="text-[12.5px] font-semibold text-red-500">Tehlikeli Bölge</p>
        <p className="mb-3 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Hesabını silmek geri alınamaz, tüm verilerin kalıcı olarak silinir.
        </p>
        {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="touch-manipulation rounded-[10px] border border-red-500/40 px-4.5 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
        >
          Hesabımı Sil
        </button>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-black/[.08] bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-lg font-bold text-black dark:text-zinc-50">
              Hesabını silmek istediğine emin misin?
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Bu işlem geri alınamaz. Hesabın ve tüm verilerin kalıcı olarak silinecek.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmOpen(false)}
                className="rounded-[10px] border border-black/[.12] px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.12] dark:text-zinc-300 dark:hover:bg-white/[.06]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-[10px] bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Siliniyor..." : "Evet, Hesabımı Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import QRCode from "qrcode";
import CreditErrorNotice from "../components/credit-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";

export default function QrKodPage() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [hasQr, setHasQr] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/qr-kod");

  const handleGenerate = async () => {
    const value = text.trim();
    if (!value) {
      setError("Lütfen bir metin veya link girin.");
      setHasQr(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const allowed = await checkAndConsume();
    if (!allowed) return;

    try {
      await QRCode.toCanvas(canvas, value, {
        width: 280,
        margin: 2,
      });
      setError("");
      setHasQr(true);
    } catch {
      setError("QR kod oluşturulamadı. Lütfen tekrar deneyin.");
      setHasQr(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qr-kod.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex w-full max-w-md flex-col items-center gap-6 px-6 py-16">
        <div
          aria-hidden="true"
          className="mb-3 flex select-none items-center justify-center gap-4 opacity-90"
        >
          <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-950">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-300"
            >
              <path d="M10 13a5 5 0 0 0 7.07 0l1.93-1.93a5 5 0 0 0-7.07-7.07L10.5 5.5" />
              <path d="M14 11a5 5 0 0 0-7.07 0L4.93 12.93a5 5 0 0 0 7.07 7.07L13.5 18.5" />
            </svg>
            <span className="text-sm text-zinc-500 dark:text-zinc-300">
              ornek-site.com
            </span>
          </div>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5.5 w-5.5 shrink-0 text-zinc-400 dark:text-zinc-600"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>

          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-12 w-12 shrink-0 text-zinc-500 dark:text-zinc-400"
          >
            <rect x="1" y="1" width="7" height="7" rx="1" />
            <rect
              x="3"
              y="3"
              width="3"
              height="3"
              className="fill-zinc-50 dark:fill-zinc-900"
            />
            <rect x="16" y="1" width="7" height="7" rx="1" />
            <rect
              x="18"
              y="3"
              width="3"
              height="3"
              className="fill-zinc-50 dark:fill-zinc-900"
            />
            <rect x="1" y="16" width="7" height="7" rx="1" />
            <rect
              x="3"
              y="18"
              width="3"
              height="3"
              className="fill-zinc-50 dark:fill-zinc-900"
            />
            <rect x="10" y="1" width="2" height="2" />
            <rect x="13" y="2" width="2" height="2" />
            <rect x="10" y="5" width="2" height="2" />
            <rect x="1" y="10" width="2" height="2" />
            <rect x="5" y="10" width="2" height="2" />
            <rect x="9" y="10" width="2" height="2" />
            <rect x="12" y="10" width="2" height="2" />
            <rect x="16" y="10" width="2" height="2" />
            <rect x="19" y="10" width="2" height="2" />
            <rect x="10" y="13" width="2" height="2" />
            <rect x="13" y="13" width="2" height="2" />
            <rect x="16" y="13" width="2" height="2" />
            <rect x="10" y="16" width="2" height="2" />
            <rect x="13" y="17" width="2" height="2" />
            <rect x="16" y="19" width="2" height="2" />
            <rect x="19" y="16" width="2" height="2" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            QR Kod Oluşturucu
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Bir metin veya link girin, anında QR kodunuzu oluşturun ve indirin.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
            placeholder="Metin veya link girin..."
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
          />
          <button
            onClick={handleGenerate}
            className="flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Oluştur
          </button>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <CreditErrorNotice error={creditError} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            className={`rounded-lg border border-black/10 dark:border-zinc-800 ${
              hasQr ? "" : "hidden"
            }`}
          />
          {hasQr && (
            <button
              onClick={handleDownload}
              className="flex h-11 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              PNG olarak indir
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

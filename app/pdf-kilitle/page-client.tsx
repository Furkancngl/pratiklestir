"use client";

import { useRef, useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import FileSizeErrorNotice from "../components/file-size-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";
import { type FileSizeError, useFileSizeLimit } from "../hooks/use-file-size-limit";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/pdf-kilitle")?.accentClassName ?? "bg-slate-600";

const inputClass =
  "w-full rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.75 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:placeholder:text-zinc-600";

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export default function PdfKilitlePage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fileSizeError, setFileSizeError] = useState<FileSizeError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/pdf-kilitle");
  const { maxFileSizeBytes, buildOversizedError } = useFileSizeLimit();

  const reset = () => {
    setFile(null);
    setResultUrl(null);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const candidate = fileList[0];

    if (!isPdf(candidate)) {
      setError("Yalnızca geçerli bir PDF dosyası kabul edilir.");
      return;
    }
    if (candidate.size > maxFileSizeBytes) {
      setFileSizeError(buildOversizedError());
      return;
    }

    setError("");
    setFileSizeError(null);
    setFile(candidate);
    setResultUrl(null);
  };

  const handleLock = async () => {
    if (!file) {
      setError("Lütfen bir PDF dosyası seçin.");
      return;
    }
    if (password.length < 4) {
      setError("Şifre en az 4 karakter olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");

    try {
      const { encryptPdf } = await import("../lib/pdf-crypto");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const encryptedBytes = await encryptPdf(bytes, password);
      const blob = new Blob([encryptedBytes as BlobPart], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "PDF şifrelenirken bir sorun oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.download = "kilitli.pdf";
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            PDF Kilitle
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            PDF dosyanızı yükleyin, bir şifre belirleyin; dosya AES-256 ile
            gerçek şekilde şifrelenip korumaya alınır.
          </p>
        </div>

        {!file && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`mt-8 flex touch-manipulation cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
              isDragging
                ? "border-black/40 bg-black/[.04] dark:border-zinc-500 dark:bg-zinc-800"
                : "border-black/15 dark:border-zinc-700"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <span className="text-sm font-medium text-black dark:text-zinc-50">
              PDF dosyasını sürükleyip bırakın veya seçin
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Tek seferde bir dosya işlenir
            </span>
          </div>
        )}

        {error && (
          <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <FileSizeErrorNotice error={fileSizeError} />
        <CreditErrorNotice error={creditError} />

        {file && (
          <>
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-black/[.08] bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-500"
              >
                <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v5h5" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
                  {file.name}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="shrink-0 text-xs font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Değiştir
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre belirleyin"
                  autoComplete="new-password"
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 touch-manipulation text-[11px] font-semibold tracking-wide text-zinc-400 select-none hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  {showPassword ? "GİZLE" : "GÖSTER"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifreyi tekrar girin"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
          </>
        )}

        <button
          onClick={handleLock}
          disabled={isProcessing || !file}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
              Kilitleniyor...
            </>
          ) : (
            "Kilitle"
          )}
        </button>

        {resultUrl && (
          <button
            onClick={handleDownload}
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-solid border-black/[.08] text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            PDF olarak indir
          </button>
        )}

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır; dosyanız ve belirlediğiniz
          şifre hiçbir sunucuya gönderilmez. Şifreyi unutursanız dosyayı
          kimse (biz dahil) açamaz.
        </p>
      </div>
    </div>
  );
}

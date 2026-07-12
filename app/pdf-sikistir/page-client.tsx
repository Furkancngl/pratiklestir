"use client";

import { useRef, useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";
import { MAX_PDF_FILE_SIZE_BYTES, formatFileSizeMB } from "../lib/file-limits";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/pdf-sikistir")?.accentClassName ??
  "bg-yellow-500";

type PdfEntry = {
  id: string;
  file: File;
  compressedBytes: Uint8Array | null;
  error: string | null;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfSikistirPage() {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/pdf-sikistir");

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const isPdf = (file: File) =>
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const oversized = incoming.filter(
      (file) => isPdf(file) && file.size > MAX_PDF_FILE_SIZE_BYTES
    );
    const pdfs = incoming.filter(
      (file) => isPdf(file) && file.size <= MAX_PDF_FILE_SIZE_BYTES
    );

    if (pdfs.length > 0) {
      setEntries((current) => [
        ...current,
        ...pdfs.map((file) => ({
          id: crypto.randomUUID(),
          file,
          compressedBytes: null,
          error: null,
        })),
      ]);
    }

    if (oversized.length > 0) {
      setError(
        `Bazı dosyalar eklenemedi: PDF başına maksimum ${formatFileSizeMB(MAX_PDF_FILE_SIZE_BYTES)} boyut sınırı var.`
      );
    } else {
      setError(
        pdfs.length !== incoming.length
          ? "Bazı dosyalar eklenemedi: yalnızca PDF dosyaları kabul edilir."
          : ""
      );
    }
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const handleCompress = async () => {
    if (entries.length === 0) {
      setError("Lütfen en az bir PDF dosyası seçin.");
      return;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");

    const { PDFDocument } = await import("pdf-lib");

    const results = await Promise.all(
      entries.map(async (entry) => {
        try {
          const bytes = await entry.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(bytes);
          const compressedBytes = await pdfDoc.save({
            useObjectStreams: true,
          });
          return { ...entry, compressedBytes, error: null };
        } catch {
          return {
            ...entry,
            compressedBytes: null,
            error: "Sıkıştırılamadı.",
          };
        }
      })
    );

    setEntries(results);
    setIsProcessing(false);
  };

  const downloadEntry = (entry: PdfEntry) => {
    if (!entry.compressedBytes) return;
    const blob = new Blob([entry.compressedBytes as BlobPart], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${entry.file.name.replace(/\.pdf$/i, "")}-sikistirilmis.pdf`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            PDF Sıkıştırıcı
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            PDF dosyalarını yükleyin, mümkün olan en iyi şekilde
            sıkıştırılmış hallerini indirin.
          </p>
        </div>

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
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <span className="text-sm font-medium text-black dark:text-zinc-50">
            PDF dosyalarını sürükleyip bırakın veya seçin
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Birden fazla dosya seçebilirsiniz
          </span>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <CreditErrorNotice error={creditError} />

        {entries.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2">
            {entries.map((entry) => {
              const reducedPercent = entry.compressedBytes
                ? Math.round(
                    (1 - entry.compressedBytes.length / entry.file.size) * 100
                  )
                : null;

              return (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 rounded-lg border border-black/[.08] bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950"
                >
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
                      {entry.file.name}
                    </p>
                    {entry.compressedBytes && reducedPercent !== null ? (
                      reducedPercent > 0 ? (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {formatBytes(entry.file.size)} →{" "}
                          {formatBytes(entry.compressedBytes.length)} · %
                          {reducedPercent} küçüldü
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Bu dosya zaten optimize görünüyor, boyut
                          değişmedi.
                        </p>
                      )
                    ) : entry.error ? (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {entry.error}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {formatBytes(entry.file.size)}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {entry.compressedBytes && (
                      <button
                        type="button"
                        onClick={() => downloadEntry(entry)}
                        aria-label="İndir"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                          <path d="M4 19h16" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      aria-label="Kaldır"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <button
          onClick={handleCompress}
          disabled={isProcessing}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
              Sıkıştırılıyor...
            </>
          ) : entries.length > 0 ? (
            `Sıkıştır (${entries.length} dosya)`
          ) : (
            "Sıkıştır"
          )}
        </button>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Sıkıştırma oranı dosya türüne göre değişir: pdf-lib öncelikle
          gereksiz veriyi temizler, görsel yeniden sıkıştırma yapmaz — bu
          yüzden bazı PDF&apos;lerde boyut az değişebilir. İşlem tamamen
          tarayıcınızda yapılır, dosyalarınız cihazınızdan çıkmaz.
        </p>
      </div>
    </div>
  );
}

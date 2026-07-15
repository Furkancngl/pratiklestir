"use client";

import { useRef, useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import FileSizeErrorNotice from "../components/file-size-error-notice";
import PdfPageGrid from "../components/pdf-page-grid";
import { useCreditGate } from "../hooks/use-credit-gate";
import { type FileSizeError, useFileSizeLimit } from "../hooks/use-file-size-limit";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/pdf-dondur")?.accentClassName ?? "bg-indigo-500";

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export default function PdfDondurPage() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pendingRotations, setPendingRotations] = useState<Record<number, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fileSizeError, setFileSizeError] = useState<FileSizeError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/pdf-dondur");
  const { maxFileSizeBytes, buildOversizedError } = useFileSizeLimit();

  const reset = () => {
    setFile(null);
    setBytes(null);
    setPageCount(0);
    setSelectedPages(new Set());
    setPendingRotations({});
    setResultUrl(null);
  };

  const handleFiles = async (fileList: FileList | null) => {
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

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await candidate.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      const pdfDoc = await PDFDocument.load(fileBytes);

      setFile(candidate);
      setBytes(fileBytes);
      setPageCount(pdfDoc.getPageCount());
      setSelectedPages(new Set());
      setPendingRotations({});
      setResultUrl(null);
    } catch {
      setError("Dosya okunamadı. Lütfen geçerli bir PDF dosyası seçin.");
    }
  };

  const togglePage = (page: number) => {
    setSelectedPages((current) => {
      const next = new Set(current);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
  };

  const clearSelection = () => setSelectedPages(new Set());

  const rotateSelected = (delta: 90 | 180 | 270) => {
    if (selectedPages.size === 0) {
      setError("Önce döndürmek istediğiniz sayfa(lar)ı seçin.");
      return;
    }
    setError("");
    setResultUrl(null);
    setPendingRotations((current) => {
      const next = { ...current };
      selectedPages.forEach((page) => {
        next[page] = ((next[page] ?? 0) + delta) % 360;
      });
      return next;
    });
  };

  const hasPendingRotation = Object.values(pendingRotations).some((value) => value !== 0);

  const handleRotate = async () => {
    if (!bytes) {
      setError("Lütfen bir PDF dosyası seçin.");
      return;
    }
    if (!hasPendingRotation) {
      setError("Lütfen en az bir sayfa seçip döndürme yönü belirleyin.");
      return;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();

      Object.entries(pendingRotations).forEach(([pageStr, delta]) => {
        if (!delta) return;
        const page = pages[Number(pageStr) - 1];
        if (!page) return;
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + delta + 360) % 360));
      });

      const outputBytes = await pdfDoc.save();
      const blob = new Blob([outputBytes as BlobPart], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("PDF döndürülürken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.download = "dondurulmus.pdf";
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            PDF Döndür
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            PDF dosyanızı yükleyin, döndürmek istediğiniz sayfa(lar)ı seçin ve
            yönünü belirleyin.
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
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {pageCount} sayfa · {selectedPages.size} seçili
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

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="rounded-full border border-black/[.08] px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Tümünü Seç
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-full border border-black/[.08] px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Seçimi Temizle
              </button>
              <span className="mx-1 h-4 w-px bg-black/10 dark:bg-white/10" />
              <button
                type="button"
                onClick={() => rotateSelected(90)}
                className="rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/[.08] dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                ↻ 90°
              </button>
              <button
                type="button"
                onClick={() => rotateSelected(180)}
                className="rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/[.08] dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                ↻ 180°
              </button>
              <button
                type="button"
                onClick={() => rotateSelected(270)}
                className="rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/[.08] dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                ↻ 270°
              </button>
            </div>

            <PdfPageGrid
              bytes={bytes}
              pageCount={pageCount}
              selected={selectedPages}
              onPageClick={togglePage}
              rotationOverrides={pendingRotations}
              disabled={isProcessing}
            />
          </>
        )}

        <button
          onClick={handleRotate}
          disabled={isProcessing || !file}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
              Döndürülüyor...
            </>
          ) : (
            "Döndür"
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
          İşlem tamamen tarayıcınızda yapılır, dosyanız cihazınızdan çıkmaz.
        </p>
      </div>
    </div>
  );
}

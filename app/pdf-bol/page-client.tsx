"use client";

import { useMemo, useRef, useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import FileSizeErrorNotice from "../components/file-size-error-notice";
import PdfPageGrid from "../components/pdf-page-grid";
import { useCreditGate } from "../hooks/use-credit-gate";
import { type FileSizeError, useFileSizeLimit } from "../hooks/use-file-size-limit";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/pdf-bol")?.accentClassName ?? "bg-teal-500";

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export default function PdfBolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [awaitingEnd, setAwaitingEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fileSizeError, setFileSizeError] = useState<FileSizeError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/pdf-bol");
  const { maxFileSizeBytes, buildOversizedError } = useFileSizeLimit();

  const selectedPages = useMemo(() => {
    if (pageCount === 0) return new Set<number>();
    const set = new Set<number>();
    for (let page = rangeStart; page <= rangeEnd; page++) set.add(page);
    return set;
  }, [rangeStart, rangeEnd, pageCount]);

  const reset = () => {
    setFile(null);
    setBytes(null);
    setPageCount(0);
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
      const count = pdfDoc.getPageCount();

      setFile(candidate);
      setBytes(fileBytes);
      setPageCount(count);
      setRangeStart(1);
      setRangeEnd(count);
      setAwaitingEnd(false);
      setResultUrl(null);
    } catch {
      setError("Dosya okunamadı. Lütfen geçerli bir PDF dosyası seçin.");
    }
  };

  const handlePageClick = (page: number) => {
    if (!awaitingEnd) {
      setRangeStart(page);
      setRangeEnd(page);
      setAwaitingEnd(true);
    } else {
      setRangeStart(Math.min(rangeStart, page));
      setRangeEnd(Math.max(rangeStart, page));
      setAwaitingEnd(false);
    }
    setResultUrl(null);
  };

  const clampAndSetStart = (value: number) => {
    const clamped = Math.min(Math.max(1, value || 1), pageCount);
    setRangeStart(clamped);
    if (clamped > rangeEnd) setRangeEnd(clamped);
    setResultUrl(null);
  };

  const clampAndSetEnd = (value: number) => {
    const clamped = Math.min(Math.max(1, value || 1), pageCount);
    setRangeEnd(clamped);
    if (clamped < rangeStart) setRangeStart(clamped);
    setResultUrl(null);
  };

  const handleSplit = async () => {
    if (!bytes) {
      setError("Lütfen bir PDF dosyası seçin.");
      return;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const donorPdf = await PDFDocument.load(bytes);
      const outputPdf = await PDFDocument.create();
      const indices = Array.from(
        { length: rangeEnd - rangeStart + 1 },
        (_, i) => rangeStart - 1 + i
      );
      const copiedPages = await outputPdf.copyPages(donorPdf, indices);
      copiedPages.forEach((page) => outputPdf.addPage(page));

      const outputBytes = await outputPdf.save();
      const blob = new Blob([outputBytes as BlobPart], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("PDF bölünürken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.download = `bolunmus-sayfa-${rangeStart}-${rangeEnd}.pdf`;
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            PDF Böl
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            PDF dosyanızı yükleyin, ayırmak istediğiniz sayfa aralığını seçin
            ve yeni bir PDF olarak indirin.
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
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{pageCount} sayfa</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="shrink-0 text-xs font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Değiştir
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Başlangıç sayfası
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={rangeStart}
                  onChange={(e) => clampAndSetStart(Number(e.target.value))}
                  className="w-24 rounded-lg border border-black/[.12] bg-black/[.02] px-3 py-2 text-center text-sm text-black outline-none focus:border-violet-500 dark:border-white/[.12] dark:bg-white/[.04] dark:text-white"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Bitiş sayfası
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={rangeEnd}
                  onChange={(e) => clampAndSetEnd(Number(e.target.value))}
                  className="w-24 rounded-lg border border-black/[.12] bg-black/[.02] px-3 py-2 text-center text-sm text-black outline-none focus:border-violet-500 dark:border-white/[.12] dark:bg-white/[.04] dark:text-white"
                />
              </label>
            </div>
            <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Aralığı ayarlamak için aşağıdaki sayfalara da tıklayabilirsiniz.
            </p>

            <PdfPageGrid
              bytes={bytes}
              pageCount={pageCount}
              selected={selectedPages}
              onPageClick={handlePageClick}
              disabled={isProcessing}
            />
          </>
        )}

        <button
          onClick={handleSplit}
          disabled={isProcessing || !file}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
              Bölünüyor...
            </>
          ) : pageCount > 0 ? (
            `Böl (Sayfa ${rangeStart}-${rangeEnd})`
          ) : (
            "Böl"
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

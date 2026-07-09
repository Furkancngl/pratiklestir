"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/pdf-birlestir")?.accentClassName ??
  "bg-orange-500";

type PdfEntry = {
  id: string;
  file: File;
  pageCount: number | null;
};

export default function PdfBirlestirPage() {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const notPdf = incoming.filter(
      (file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")
    );
    const candidates = incoming.filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    const results = await Promise.all(
      candidates.map(async (file): Promise<PdfEntry | null> => {
        try {
          const bytes = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(bytes);
          return {
            id: crypto.randomUUID(),
            file,
            pageCount: pdfDoc.getPageCount(),
          };
        } catch {
          return null;
        }
      })
    );

    const valid = results.filter((entry): entry is PdfEntry => entry !== null);
    const failedCount = candidates.length - valid.length;

    if (valid.length > 0) {
      setEntries((current) => [...current, ...valid]);
      setResultUrl(null);
    }

    if (notPdf.length > 0 || failedCount > 0) {
      setError(
        "Bazı dosyalar eklenemedi: yalnızca geçerli PDF dosyaları kabul edilir."
      );
    } else {
      setError("");
    }
  };

  const moveEntry = (index: number, direction: -1 | 1) => {
    setEntries((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    setResultUrl(null);
  };

  const handleMerge = async () => {
    if (entries.length === 0) {
      setError("Lütfen en az bir PDF dosyası seçin.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const entry of entries) {
        const bytes = await entry.file.arrayBuffer();
        const donorPdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(
          donorPdf,
          donorPdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as BlobPart], {
        type: "application/pdf",
      });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("PDF'ler birleştirilirken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.download = "birlestirilmis.pdf";
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            PDF Birleştirici
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Birden fazla PDF dosyasını sürükleyip bırakın veya seçin, sırasını
            düzenleyin ve tek bir PDF olarak birleştirin.
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

        {entries.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2">
            {entries.map((entry, index) => (
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
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {entry.pageCount ?? "?"} sayfa
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveEntry(index, -1)}
                    disabled={index === 0}
                    aria-label="Yukarı taşı"
                    className="flex h-11 w-11 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
                      <path d="M18 15 12 9l-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveEntry(index, 1)}
                    disabled={index === entries.length - 1}
                    aria-label="Aşağı taşı"
                    className="flex h-11 w-11 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    aria-label="Kaldır"
                    className="flex h-11 w-11 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
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
            ))}
          </ul>
        )}

        <button
          onClick={handleMerge}
          disabled={isProcessing}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
              Birleştiriliyor...
            </>
          ) : entries.length > 0 ? (
            `Birleştir (${entries.length} dosya)`
          ) : (
            "Birleştir"
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
          İşlem tamamen tarayıcınızda yapılır, dosyalarınız cihazınızdan
          çıkmaz.
        </p>
      </div>
    </div>
  );
}

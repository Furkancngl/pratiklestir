"use client";

import { useEffect, useRef, useState } from "react";
import { loadPdfDocument, renderPageThumbnail } from "../lib/pdf-render";

type PdfPageGridProps = {
  bytes: Uint8Array | null;
  pageCount: number;
  selected: Set<number>;
  onPageClick: (page: number) => void;
  rotationOverrides?: Record<number, number>;
  disabled?: boolean;
};

// PDF Böl, PDF Döndür ve PDF Sayfa Sil ortak sayfa önizleme/seçim gridi -
// hangi sayfaların seçili olduğuna ve tıklamaya ne olacağına yalnızca
// çağıran araç karar verir (aralık mı, çoklu seçim mi), bu bileşen sadece
// thumbnail render ve tıklama aktarımından sorumludur.
export default function PdfPageGrid({
  bytes,
  pageCount,
  selected,
  onPageClick,
  rotationOverrides,
  disabled,
}: PdfPageGridProps) {
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const generationRef = useRef(0);

  useEffect(() => {
    generationRef.current += 1;
    const generation = generationRef.current;
    setThumbnails({});
    if (!bytes || pageCount === 0) return;

    (async () => {
      try {
        const pdf = await loadPdfDocument(bytes.slice());
        for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
          if (generationRef.current !== generation) return;
          const dataUrl = await renderPageThumbnail(pdf, pageNumber);
          if (generationRef.current !== generation) return;
          setThumbnails((current) => ({ ...current, [pageNumber]: dataUrl }));
        }
      } catch {
        // Thumbnail üretilemezse sessizce yutulur; sayfa numarası yine de
        // görünür kalır, seçim işlevselliği bozulmaz.
      }
    })();
  }, [bytes, pageCount]);

  if (pageCount === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => {
        const isSelected = selected.has(pageNumber);
        const rotation = rotationOverrides?.[pageNumber] ?? 0;

        return (
          <button
            key={pageNumber}
            type="button"
            disabled={disabled}
            onClick={() => onPageClick(pageNumber)}
            aria-pressed={isSelected}
            className={`group relative flex touch-manipulation flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isSelected
                ? "border-violet-500 bg-violet-500/[.08] dark:border-violet-400"
                : "border-black/[.08] bg-white hover:border-black/20 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-white/20"
            }`}
          >
            <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              {thumbnails[pageNumber] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnails[pageNumber]}
                  alt={`Sayfa ${pageNumber}`}
                  className="max-h-full max-w-full object-contain"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              ) : (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-500 dark:border-zinc-700 dark:border-t-zinc-400" />
              )}
            </div>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {pageNumber}
            </span>
            {isSelected && (
              <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

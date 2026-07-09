"use client";

import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/gorsel-sikistir")?.accentClassName ??
  "bg-cyan-500";

type Quality = "high" | "medium" | "max";

const qualityPresets: Record<
  Quality,
  {
    label: string;
    maxSizeMB: number;
    maxWidthOrHeight: number;
    initialQuality: number;
  }
> = {
  high: {
    label: "Yüksek Kalite",
    maxSizeMB: 2,
    maxWidthOrHeight: 2560,
    initialQuality: 0.9,
  },
  medium: {
    label: "Orta",
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    initialQuality: 0.75,
  },
  max: {
    label: "Maksimum Sıkıştırma",
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1280,
    initialQuality: 0.5,
  },
};

type ImageEntry = {
  id: string;
  file: File;
  compressedFile: File | null;
  error: string | null;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GorselSikistirPage() {
  const [entries, setEntries] = useState<ImageEntry[]>([]);
  const [quality, setQuality] = useState<Quality>("medium");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hasResults = entries.some((entry) => entry.compressedFile);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const images = incoming.filter((file) => file.type.startsWith("image/"));

    if (images.length > 0) {
      const newEntries: ImageEntry[] = images.map((file) => ({
        id: crypto.randomUUID(),
        file,
        compressedFile: null,
        error: null,
      }));
      setEntries((current) => [...current, ...newEntries]);
    }

    setError(
      images.length !== incoming.length
        ? "Bazı dosyalar eklenemedi: yalnızca görsel dosyaları kabul edilir."
        : ""
    );
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const handleCompress = async () => {
    if (entries.length === 0) {
      setError("Lütfen en az bir görsel seçin.");
      return;
    }

    setIsProcessing(true);
    setError("");

    const preset = qualityPresets[quality];

    const results = await Promise.all(
      entries.map(async (entry) => {
        try {
          const compressedFile = await imageCompression(entry.file, {
            maxSizeMB: preset.maxSizeMB,
            maxWidthOrHeight: preset.maxWidthOrHeight,
            initialQuality: preset.initialQuality,
            useWebWorker: true,
          });
          return { ...entry, compressedFile, error: null };
        } catch {
          return {
            ...entry,
            compressedFile: null,
            error: "Sıkıştırılamadı.",
          };
        }
      })
    );

    setEntries(results);
    setIsProcessing(false);
  };

  const downloadEntry = (entry: ImageEntry) => {
    if (!entry.compressedFile) return;
    const url = URL.createObjectURL(entry.compressedFile);
    const link = document.createElement("a");
    link.download = entry.compressedFile.name;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    entries.forEach((entry) => {
      if (entry.compressedFile) {
        zip.file(entry.compressedFile.name, entry.compressedFile);
      }
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "sikistirilmis-gorseller.zip";
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
            Görsel Sıkıştırıcı
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Görsellerini yükle, kalite seviyesini seç, dosya boyutunu
            küçültüp indir.
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
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <span className="text-sm font-medium text-black dark:text-zinc-50">
            Görselleri sürükleyip bırakın veya seçin
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

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(Object.keys(qualityPresets) as Quality[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setQuality(key)}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                quality === key
                  ? "border-transparent bg-black text-white dark:bg-white dark:text-black"
                  : "border-black/[.08] text-zinc-700 hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {qualityPresets[key].label}
            </button>
          ))}
        </div>

        {entries.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2">
            {entries.map((entry) => (
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
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="8.5" cy="9.5" r="1.5" />
                  <path d="M21 16.5 16 11l-4 4-3-3-6 5.5" />
                </svg>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
                    {entry.file.name}
                  </p>
                  {entry.compressedFile ? (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {formatBytes(entry.file.size)} →{" "}
                      {formatBytes(entry.compressedFile.size)} · %
                      {Math.max(
                        0,
                        Math.round(
                          (1 - entry.compressedFile.size / entry.file.size) *
                            100
                        )
                      )}{" "}
                      küçüldü
                    </p>
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
                  {entry.compressedFile && (
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
            ))}
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

        {hasResults && entries.length > 1 && (
          <button
            onClick={downloadAllAsZip}
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-solid border-black/[.08] text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            Tümünü İndir (.zip)
          </button>
        )}

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır, görselleriniz cihazınızdan
          çıkmaz.
        </p>
      </div>
    </div>
  );
}

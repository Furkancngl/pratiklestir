"use client";

import { useRef, useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import FileSizeErrorNotice from "../components/file-size-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";
import { type FileSizeError, useFileSizeLimit } from "../hooks/use-file-size-limit";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/gorsel-netlestir")?.accentClassName ??
  "bg-amber-500";

const SHARPENABLE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function clampByte(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : value;
}

// 3x3 kutu bulanıklaştırma (box blur) - unsharp mask'in "blur" adımı.
function boxBlur(imageData: ImageData, width: number, height: number): ImageData {
  const src = imageData.data;
  const result = new ImageData(width, height);
  const dst = result.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          const idx = (ny * width + nx) * 4;
          r += src[idx];
          g += src[idx + 1];
          b += src[idx + 2];
          count++;
        }
      }

      const idx = (y * width + x) * 4;
      dst[idx] = r / count;
      dst[idx + 1] = g / count;
      dst[idx + 2] = b / count;
      dst[idx + 3] = src[idx + 3];
    }
  }

  return result;
}

// Unsharp mask: sonuç = orijinal + güç × (orijinal - bulanık). Kenarlardaki
// (yüksek frekanslı) fark abartılıp geri eklenir, düz alanlar değişmez.
async function sharpenImage(file: File, strengthPercent: number): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context alınamadı.");
    ctx.drawImage(bitmap, 0, 0);

    const { width, height } = canvas;
    const original = ctx.getImageData(0, 0, width, height);
    const blurred = boxBlur(original, width, height);

    const strength = strengthPercent / 100;
    const output = ctx.createImageData(width, height);
    const src = original.data;
    const blur = blurred.data;
    const dst = output.data;

    for (let i = 0; i < src.length; i += 4) {
      dst[i] = clampByte(src[i] + strength * (src[i] - blur[i]));
      dst[i + 1] = clampByte(src[i + 1] + strength * (src[i + 1] - blur[i + 1]));
      dst[i + 2] = clampByte(src[i + 2] + strength * (src[i + 2] - blur[i + 2]));
      dst[i + 3] = src[i + 3];
    }

    ctx.putImageData(output, 0, 0);

    const mime = SHARPENABLE_MIME_TYPES.has(file.type) ? file.type : "image/png";
    const ext = mime === "image/jpeg" ? "jpg" : mime.split("/")[1];
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("Netleştirilemedi."))),
        mime,
        0.92
      );
    });

    const baseName = file.name.replace(/\.[^./\\]+$/, "") || "gorsel";
    return new File([blob], `${baseName}-netlestirilmis.${ext}`, { type: mime });
  } finally {
    bitmap.close();
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GorselNetlestirPage({
  heading = "Görsel Netleştir",
  description = "Görselini yükle, netleştirme gücünü ayarla, keskinleştirip indir.",
}: {
  heading?: string;
  description?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [strength, setStrength] = useState(100);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [fileSizeError, setFileSizeError] = useState<FileSizeError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/gorsel-netlestir");
  const { maxFileSizeBytes, buildOversizedError } = useFileSizeLimit();

  const handleFile = (selected: File | undefined | null) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin.");
      setFileSizeError(null);
      return;
    }

    if (selected.size > maxFileSizeBytes) {
      setFileSizeError(buildOversizedError());
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setError("");
    setFileSizeError(null);
    setResultFile(null);
    setResultUrl(null);
    setStrength(100);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSharpen = async () => {
    if (!file) return;

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");

    try {
      const sharpened = await sharpenImage(file, strength);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultFile(sharpened);
      setResultUrl(URL.createObjectURL(sharpened));
    } catch {
      setError("Netleştirilirken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultFile || !resultUrl) return;
    const link = document.createElement("a");
    link.download = resultFile.name;
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {heading}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {description}
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
            handleFile(e.dataTransfer.files?.[0]);
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
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <span className="text-sm font-medium text-black dark:text-zinc-50">
            {file ? file.name : "Görseli sürükleyip bırakın veya seçin"}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            PNG, JPG veya WebP
          </span>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <FileSizeErrorNotice error={fileSizeError} />
        <CreditErrorNotice error={creditError} />

        {file && (
          <>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Netleştirme Gücü</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  %{strength}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                step={10}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="mt-2 w-full accent-black dark:accent-white"
              />
            </div>

            <button
              onClick={handleSharpen}
              disabled={isProcessing}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
            >
              {isProcessing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                  Netleştiriliyor...
                </>
              ) : (
                "Netleştir"
              )}
            </button>
          </>
        )}

        {previewUrl && !isProcessing && (
          <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
            İşlem tamamen tarayıcınızda yapılır, görseliniz cihazınızdan
            çıkmaz.
          </p>
        )}

        {(previewUrl || resultUrl) && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {previewUrl && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Orijinal
                </span>
                <div className="overflow-hidden rounded-2xl border border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Orijinal görsel"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {resultUrl && resultFile && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Netleştirilmiş · {formatBytes(resultFile.size)}
                </span>
                <div className="overflow-hidden rounded-2xl border border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Netleştirilmiş görsel"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {resultUrl && (
          <button
            onClick={handleDownload}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-full border border-solid border-black/[.08] text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            İndir
          </button>
        )}
      </div>
    </div>
  );
}

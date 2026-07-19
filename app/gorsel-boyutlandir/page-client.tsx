"use client";

import { useRef, useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import FileSizeErrorNotice from "../components/file-size-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";
import { type FileSizeError, useFileSizeLimit } from "../hooks/use-file-size-limit";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/gorsel-boyutlandir")?.accentClassName ??
  "bg-orange-500";

type Mode = "pixel" | "percent";

const RESIZABLE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Kaynağı hedef piksel boyutuna Canvas API ile yeniden çizer. Format PNG,
// JPG veya WebP değilse (ör. GIF, BMP) çıktı PNG'ye düşer - saydamlık ve
// kalite kaybetmeden güvenli bir varsayılan.
async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context alınamadı.");
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    const mime = RESIZABLE_MIME_TYPES.has(file.type) ? file.type : "image/png";
    const ext = mime === "image/jpeg" ? "jpg" : mime.split("/")[1];
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("Boyutlandırılamadı."))),
        mime,
        0.92
      );
    });

    const baseName = file.name.replace(/\.[^./\\]+$/, "") || "gorsel";
    return new File([blob], `${baseName}-${targetWidth}x${targetHeight}.${ext}`, {
      type: mime,
    });
  } finally {
    bitmap.close();
  }
}

export default function GorselBoyutlandirPage({
  heading = "Görsel Boyutlandır",
  description = "Görselin genişlik/yükseklik boyutunu veya yüzdesini değiştir, indir.",
}: {
  heading?: string;
  description?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(
    null
  );
  const [mode, setMode] = useState<Mode>("pixel");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [percent, setPercent] = useState(100);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [fileSizeError, setFileSizeError] = useState<FileSizeError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/gorsel-boyutlandir");
  const { maxFileSizeBytes, buildOversizedError } = useFileSizeLimit();

  const handleFile = async (selected: File | undefined | null) => {
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

    try {
      const bitmap = await createImageBitmap(selected);
      setNaturalSize({ width: bitmap.width, height: bitmap.height });
      bitmap.close();
      setWidth(String(bitmap.width));
      setHeight(String(bitmap.height));
      setPercent(100);
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    } catch {
      setError("Görsel okunamadı. Lütfen başka bir dosya deneyin.");
    }
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (lockRatio && naturalSize) {
      const parsed = Number(value);
      if (parsed > 0) {
        const ratio = naturalSize.height / naturalSize.width;
        setHeight(String(Math.max(1, Math.round(parsed * ratio))));
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (lockRatio && naturalSize) {
      const parsed = Number(value);
      if (parsed > 0) {
        const ratio = naturalSize.width / naturalSize.height;
        setWidth(String(Math.max(1, Math.round(parsed * ratio))));
      }
    }
  };

  const percentDims =
    naturalSize && percent > 0
      ? {
          width: Math.max(1, Math.round((naturalSize.width * percent) / 100)),
          height: Math.max(1, Math.round((naturalSize.height * percent) / 100)),
        }
      : null;

  const handleResize = async () => {
    if (!file) return;

    let targetWidth: number;
    let targetHeight: number;

    if (mode === "percent") {
      if (!percentDims) {
        setError("Lütfen geçerli bir yüzde girin.");
        return;
      }
      targetWidth = percentDims.width;
      targetHeight = percentDims.height;
    } else {
      const parsedWidth = Math.round(Number(width));
      const parsedHeight = Math.round(Number(height));
      if (!parsedWidth || !parsedHeight || parsedWidth <= 0 || parsedHeight <= 0) {
        setError("Lütfen geçerli bir genişlik ve yükseklik girin.");
        return;
      }
      targetWidth = parsedWidth;
      targetHeight = parsedHeight;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");

    try {
      const resized = await resizeImage(file, targetWidth, targetHeight);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultFile(resized);
      setResultUrl(URL.createObjectURL(resized));
    } catch {
      setError("Boyutlandırılırken bir sorun oluştu. Lütfen tekrar deneyin.");
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
            {naturalSize
              ? `${naturalSize.width} × ${naturalSize.height} px`
              : "PNG, JPG veya WebP"}
          </span>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <FileSizeErrorNotice error={fileSizeError} />
        <CreditErrorNotice error={creditError} />

        {file && naturalSize && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("pixel")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  mode === "pixel"
                    ? "border-transparent bg-black text-white dark:bg-white dark:text-black"
                    : "border-black/[.08] text-zinc-700 hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Piksel
              </button>
              <button
                type="button"
                onClick={() => setMode("percent")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  mode === "percent"
                    ? "border-transparent bg-black text-white dark:bg-white dark:text-black"
                    : "border-black/[.08] text-zinc-700 hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Yüzde
              </button>
            </div>

            {mode === "pixel" ? (
              <div className="mt-4 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Genişlik (px)
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="h-10 rounded-lg border border-black/[.08] bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Yükseklik (px)
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="h-10 rounded-lg border border-black/[.08] bg-white px-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500"
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={lockRatio}
                    onChange={(e) => setLockRatio(e.target.checked)}
                    className="h-4 w-4 accent-black dark:accent-white"
                  />
                  Oranı kilitle
                </label>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Ölçek</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    %{percent}
                    {percentDims &&
                      ` · ${percentDims.width} × ${percentDims.height} px`}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={5}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="mt-2 w-full accent-black dark:accent-white"
                />
              </div>
            )}

            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
            >
              {isProcessing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                  Boyutlandırılıyor...
                </>
              ) : (
                "Boyutlandır"
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
                  Orijinal {naturalSize && `(${naturalSize.width} × ${naturalSize.height})`}
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
                  Boyutlandırılmış · {formatBytes(resultFile.size)}
                </span>
                <div className="overflow-hidden rounded-2xl border border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Boyutlandırılmış görsel"
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

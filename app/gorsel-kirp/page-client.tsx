"use client";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CreditErrorNotice from "../components/credit-error-notice";
import FileSizeErrorNotice from "../components/file-size-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";
import { type FileSizeError, useFileSizeLimit } from "../hooks/use-file-size-limit";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/gorsel-kirp")?.accentClassName ??
  "bg-rose-500";

const CROPPABLE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Seçilen kırpma alanını, önizlemede gösterilen ölçek yerine kaynağın
// orijinal çözünürlüğüne göre yeniden çizer - böylece kırpılan bölge kalite
// kaybetmez.
async function cropToFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  mimeType: string
): Promise<File> {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(crop.width * scaleX));
  canvas.height = Math.max(1, Math.round(crop.height * scaleY));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context alınamadı.");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Kırpılamadı."))),
      mimeType,
      0.92
    );
  });

  return new File([blob], fileName, { type: mimeType });
}

export default function GorselKirpPage({
  heading = "Görsel Kırp",
  description = "Görsel yükle, önizlemede alanı sürükleyerek seç, kırpıp indir.",
}: {
  heading?: string;
  description?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | undefined>(undefined);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [fileSizeError, setFileSizeError] = useState<FileSizeError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/gorsel-kirp");
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

    if (imgSrc) URL.revokeObjectURL(imgSrc);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setError("");
    setFileSizeError(null);
    setResultFile(null);
    setResultUrl(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setFile(selected);
    setImgSrc(URL.createObjectURL(selected));
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      { unit: "%", width: 80, height: 80 },
      width,
      height
    );
    setCrop(initialCrop);
    setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
  };

  const handleCrop = async () => {
    if (!file || !imgRef.current || !completedCrop) return;
    if (completedCrop.width < 1 || completedCrop.height < 1) {
      setError("Lütfen geçerli bir kırpma alanı seçin.");
      return;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");

    try {
      const mimeType = CROPPABLE_MIME_TYPES.has(file.type) ? file.type : "image/png";
      const ext = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1];
      const baseName = file.name.replace(/\.[^./\\]+$/, "") || "gorsel";
      const cropped = await cropToFile(
        imgRef.current,
        completedCrop,
        `${baseName}-kirpilmis.${ext}`,
        mimeType
      );
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultFile(cropped);
      setResultUrl(URL.createObjectURL(cropped));
    } catch {
      setError("Kırpılırken bir sorun oluştu. Lütfen tekrar deneyin.");
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

        {!imgSrc && (
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
              Görseli sürükleyip bırakın veya seçin
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              PNG, JPG veya WebP
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

        {imgSrc && (
          <>
            <div className="mt-6 flex justify-center overflow-hidden rounded-2xl border border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                minWidth={10}
                minHeight={10}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Kırpılacak görsel"
                  onLoad={onImageLoad}
                  className="max-h-[70vh] w-auto"
                />
              </ReactCrop>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (imgSrc) URL.revokeObjectURL(imgSrc);
                  if (resultUrl) URL.revokeObjectURL(resultUrl);
                  setFile(null);
                  setImgSrc(null);
                  setCrop(undefined);
                  setCompletedCrop(undefined);
                  setResultFile(null);
                  setResultUrl(null);
                  setError("");
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-full border border-solid border-black/[.08] text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                Başka görsel seç
              </button>
              <button
                onClick={handleCrop}
                disabled={isProcessing || !completedCrop}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                    Kırpılıyor...
                  </>
                ) : (
                  "Kırp"
                )}
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
              İşlem tamamen tarayıcınızda yapılır, görseliniz cihazınızdan
              çıkmaz.
            </p>
          </>
        )}

        {resultUrl && resultFile && (
          <div className="mt-8 flex flex-col gap-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Kırpılmış sonuç · {formatBytes(resultFile.size)}
            </span>
            <div className="overflow-hidden rounded-2xl border border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt="Kırpılmış görsel"
                className="h-full w-full object-contain"
              />
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-full border border-solid border-black/[.08] text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              İndir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

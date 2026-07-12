"use client";

import { useRef, useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";
import { MAX_IMAGE_FILE_SIZE_BYTES, formatFileSizeMB } from "../lib/file-limits";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/qr-kod-oku")?.accentClassName ??
  "bg-purple-500";

export default function QrKodOkuPage() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { checkAndConsume, creditError } = useCreditGate("/qr-kod-oku");

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin.");
      return;
    }

    if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      setError(
        `Dosya çok büyük: maksimum ${formatFileSizeMB(MAX_IMAGE_FILE_SIZE_BYTES)} boyutunda görsel yükleyebilirsiniz.`
      );
      return;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setIsProcessing(true);
    setError("");
    setResult("");
    setCopied(false);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setError("Görsel işlenemedi.");
        setIsProcessing(false);
        URL.revokeObjectURL(objectUrl);
        return;
      }

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { default: jsQR } = await import("jsqr");
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        setResult(code.data);
        setError("");
      } else {
        setError("Görselde okunabilir bir QR kod bulunamadı.");
      }

      setIsProcessing(false);
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      setError("Görsel yüklenemedi.");
      setIsProcessing(false);
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Panoya kopyalanamadı.");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            QR Kod Oku
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            İçinde QR kod bulunan bir görsel yükle, içeriğini anında oku.
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
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <span className="text-sm font-medium text-black dark:text-zinc-50">
            QR kod içeren görseli sürükleyip bırakın veya seçin
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            PNG, JPG ve diğer görsel formatları desteklenir
          </span>
        </div>

        {previewUrl && (
          <div className="mt-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Yüklenen görsel"
              className="max-h-56 rounded-lg border border-black/[.08] dark:border-zinc-800"
            />
          </div>
        )}

        {isProcessing && (
          <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Görsel taranıyor...
          </p>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <CreditErrorNotice error={creditError} />

        {result && (
          <div className="mt-6 flex flex-col gap-3">
            <div className="rounded-lg border border-black/[.08] bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Okunan içerik
              </p>
              <p className="break-all text-sm text-black dark:text-zinc-50">
                {result}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              {copied ? "Kopyalandı ✓" : "Kopyala"}
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır, görseliniz cihazınızdan çıkmaz.
        </p>
      </div>
    </div>
  );
}

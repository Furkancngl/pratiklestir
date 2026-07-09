"use client";

import { useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/arka-plan-sil")?.accentClassName ??
  "bg-green-500";

export default function ArkaPlanSilPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File | undefined | null) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setError("");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResultUrl(null);
  };

  const handleRemoveBackground = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError("");

    try {
      const blob = await removeBackground(file);
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError(
        "Arka plan kaldırılırken bir sorun oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.download = "arka-plan-silinmis.png";
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Arka Plan Silici
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Bir fotoğraf yükleyin, arka planını otomatik olarak kaldırıp PNG
            olarak indirin.
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
          className={`mt-8 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
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
            {file ? file.name : "Fotoğrafı sürükleyip bırakın veya seçin"}
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

        {previewUrl && (
          <button
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                İşleniyor...
              </>
            ) : (
              "Arka Planı Kaldır"
            )}
          </button>
        )}

        {previewUrl && (
          <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
            İşlem tamamen tarayıcınızda yapılır, fotoğraflarınız cihazınızdan
            çıkmaz. İlk çalıştırmada model dosyaları indirileceği için işlem
            biraz zaman alabilir.
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
                    alt="Orijinal fotoğraf"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {resultUrl && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Arka planı silinmiş
                </span>
                <div className="bg-checkerboard overflow-hidden rounded-2xl border border-black/[.08] dark:border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Arka planı silinmiş fotoğraf"
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
            PNG olarak indir
          </button>
        )}
      </div>
    </div>
  );
}

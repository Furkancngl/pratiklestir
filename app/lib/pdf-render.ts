import type { PDFDocumentProxy } from "pdfjs-dist";

// pdf-lib PDF'in iç yapısını değiştirebilir ama bir sayfayı görsele
// çeviremez (rasterize edemez) - bu yüzden sayfa önizlemesi (PDF Böl, PDF
// Döndür, PDF Sayfa Sil) ve PDF -> JPG dönüşümü için pdfjs-dist (Mozilla
// PDF.js) kullanılıyor. Worker dosyası bundler'ın statik olarak
// çözebilmesi için import.meta.url ile referanslanıyor.
let workerConfigured = false;

async function getPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (!workerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    workerConfigured = true;
  }
  return pdfjsLib;
}

export async function loadPdfDocument(
  bytes: ArrayBuffer | Uint8Array
): Promise<PDFDocumentProxy> {
  const pdfjsLib = await getPdfjs();
  // getDocument kendi kopyasını alır; aynı ArrayBuffer'ı pdf-lib ile de
  // kullanacaksak (örn. sayfa sayısı/manipülasyon) çağıranın kendi kopyasını
  // (slice) geçmesi transferable object detach hatasını önler.
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  return loadingTask.promise;
}

// Küçük, hızlı bir önizleme görseli (thumbnail) üretir - sayfa seçim
// gridlerinde (PDF Böl, PDF Döndür, PDF Sayfa Sil) kullanılır.
export async function renderPageThumbnail(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  maxWidth = 180
): Promise<string> {
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Tarayıcınız canvas render işlemini desteklemiyor.");
  }

  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
}

// Yüksek çözünürlüklü tam sayfa görseli - PDF -> JPG dönüşümünde
// kullanılır, indirilecek dosyanın kalitesi için daha büyük bir scale
// kullanır.
export async function renderPageToBlob(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  scale = 2
): Promise<Blob> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Tarayıcınız canvas render işlemini desteklemiyor.");
  }

  await page.render({ canvas, canvasContext: context, viewport }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Görsel oluşturulamadı."))),
      "image/jpeg",
      0.92
    );
  });
}

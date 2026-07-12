// Tüm dosya işleme araçları tamamen tarayıcıda çalışır (bkz. AGENTS.md /
// güvenlik notları); bu limitler bir sunucuyu korumaz, kullanıcının kendi
// sekmesinin çok büyük dosyalarla donmasını/çökmesini önler.
export const MAX_PDF_FILE_SIZE_BYTES = 50 * 1024 * 1024;
export const MAX_IMAGE_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export function formatFileSizeMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

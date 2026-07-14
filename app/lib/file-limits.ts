// Tüm dosya işleme araçları tamamen tarayıcıda çalışır (bkz. AGENTS.md /
// güvenlik notları); bu limitler bir sunucuyu korumaz, kullanıcının kendi
// sekmesinin çok büyük dosyalarla donmasını/çökmesini önler - ayrıca Free
// ve Pro planları arasında somut bir farklılaştırma noktası oluşturur.
export const FREE_MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
export const PRO_MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

// Dosya yükleme gerektiren HER araç (PDF Birleştir/Sıkıştır, Görsel
// Sıkıştır, Arka Plan Sil ve ileride eklenecek diğerleri - Görsel
// Genişlet/Kalite Arttır/Netleştir, Video Sıkıştırıcı) bu tek fonksiyonu
// kullanır; limit tek yerden yönetilir, araca özel bir sabit tanımlanmaz.
// Giriş yapmamış ziyaretçiler ve "free" planındaki kullanıcılar aynı
// limiti alır. Kullanımı için bkz. app/hooks/use-file-size-limit.ts.
export function getMaxFileSizeForPlan(plan?: string | null): number {
  return plan === "pro" ? PRO_MAX_FILE_SIZE_BYTES : FREE_MAX_FILE_SIZE_BYTES;
}

export function formatFileSizeMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

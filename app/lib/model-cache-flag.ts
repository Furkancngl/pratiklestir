const STORAGE_KEY = "pratiklestir:bg-removal-model-ready";

// Kütüphane modeli standart HTTP disk önbelleğiyle indiriyor (Cache-Control:
// max-age=14400 + ETag, bkz. staticimgly.com) - JS Cache API kullanmıyor.
// Bu yüzden "gerçekten ilk kez mi indiriliyor" bilgisini kendimiz, tarayıcı
// başına bir bayrakla tutuyoruz; sadece mesaj metnini doğru göstermek için.
export function hasDownloadedModelBefore(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function markModelDownloaded(): void {
  window.localStorage.setItem(STORAGE_KEY, "1");
}

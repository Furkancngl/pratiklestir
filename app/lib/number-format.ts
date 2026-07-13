// Hesaplama araçları arasında ortak Türkçe sayı/para birimi biçimlendirmesi.
export function formatTL(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, maxFractionDigits = 2): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

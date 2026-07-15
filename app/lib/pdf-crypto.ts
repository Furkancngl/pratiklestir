// pdf-lib şifreleme/şifre çözme desteklemiyor (bkz. pdf-lib API'si - bu
// kütüphanenin bilinen bir sınırı). PDF Kilitle ve PDF Kilit Kaldır bu
// yüzden qpdf'in WASM'a derlenmiş hâlini (@neslinesli93/qpdf-wasm)
// kullanır; qpdf Apache-2.0 lisanslıdır ve gerçek AES-256 şifreleme/şifre
// çözme uygular. WASM dosyası public/wasm/qpdf.wasm altında aynı origin'den
// (CSP connect-src 'self') servis edilir.
const INPUT_PATH = "/input.pdf";
const OUTPUT_PATH = "/output.pdf";

// @neslinesli93/qpdf-wasm'in yayınlanan tipleri EmscriptenFS.writeFile'ı
// eksik bırakıyor (runtime'da gerçekten var, sadece .d.ts eksik) - burada
// yerelde tamamlıyoruz.
type QpdfFS = Awaited<ReturnType<typeof createQpdf>>["FS"] & {
  writeFile: (path: string, data: Uint8Array) => void;
};

async function createQpdf() {
  const createModule = (await import("@neslinesli93/qpdf-wasm")).default;
  return createModule({
    locateFile: () => "/wasm/qpdf.wasm",
  });
}

export async function encryptPdf(
  bytes: Uint8Array,
  password: string
): Promise<Uint8Array> {
  const qpdf = await createQpdf();
  (qpdf.FS as QpdfFS).writeFile(INPUT_PATH, bytes);

  let rc: number;
  try {
    rc = qpdf.callMain([
      INPUT_PATH,
      "--encrypt",
      password,
      password,
      "256",
      "--",
      OUTPUT_PATH,
    ]);
  } catch {
    rc = 1;
  }

  if (rc !== 0) {
    throw new Error("PDF şifrelenirken bir sorun oluştu. Lütfen tekrar deneyin.");
  }

  return qpdf.FS.readFile(OUTPUT_PATH);
}

export async function decryptPdf(
  bytes: Uint8Array,
  password: string
): Promise<Uint8Array> {
  const qpdf = await createQpdf();
  (qpdf.FS as QpdfFS).writeFile(INPUT_PATH, bytes);

  let rc: number;
  try {
    rc = qpdf.callMain([`--password=${password}`, "--decrypt", INPUT_PATH, OUTPUT_PATH]);
  } catch {
    rc = 1;
  }

  if (rc !== 0) {
    throw new Error(
      "Şifre yanlış görünüyor veya dosya bozuk. Lütfen şifreyi kontrol edip tekrar deneyin."
    );
  }

  return qpdf.FS.readFile(OUTPUT_PATH);
}

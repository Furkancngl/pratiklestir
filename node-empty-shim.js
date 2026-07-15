// qpdf-wasm (Emscripten çıktısı) tarayıcıda hiç çalışmayacak bir Node.js
// dalında `require("fs")`/`require("path")` çağırıyor; bu dal çalışma
// zamanında asla tetiklenmiyor (yalnızca gerçek Node ortamında devreye
// girer) ama Turbopack modülü statik olarak çözmeye çalıştığı için
// build sırasında "Module not found: fs" hatası veriyor. next.config.ts
// bu iki modülü tarayıcı paketlerinde bu boş shim'e yönlendiriyor - bkz.
// @neslinesli93/qpdf-wasm README'sindeki webpack fallback tavsiyesinin
// Turbopack karşılığı.
module.exports = {};

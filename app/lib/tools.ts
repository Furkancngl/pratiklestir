export type Tool = {
  name: string;
  href: string;
  description: string;
  available: boolean;
  accentClassName: string;
  beta?: boolean;
  group?: string;
};

export const tools: Tool[] = [
  {
    name: "QR Kod Oluşturucu",
    href: "/qr-kod",
    description:
      "Metin veya link gir, QR kodunu anında oluştur ve PNG olarak indir.",
    available: true,
    accentClassName: "bg-blue-500",
  },
  {
    name: "PDF Birleştirici",
    href: "/pdf-birlestir",
    description: "Birden fazla PDF dosyasını tek bir dosyada birleştir.",
    available: true,
    accentClassName: "bg-orange-500",
  },
  {
    name: "Arka Plan Silici",
    href: "/arka-plan-sil",
    description: "Görsellerin arka planını otomatik olarak kaldır.",
    available: true,
    accentClassName: "bg-green-500",
    beta: true,
  },
  {
    name: "Makale Hazırla",
    href: "/makale-hazirla",
    description: "Yapay zeka ile hızlıca makale ve yazı taslağı oluşturur",
    available: false,
    accentClassName: "bg-red-500",
  },
  {
    name: "Görsel Sıkıştırıcı",
    href: "/gorsel-sikistir",
    description: "Fotoğrafların dosya boyutunu kaliteden ödün vermeden küçültür.",
    available: true,
    accentClassName: "bg-cyan-500",
    group: "Sıkıştırma",
  },
  {
    name: "PDF Sıkıştırıcı",
    href: "/pdf-sikistir",
    description: "PDF dosyalarının boyutunu küçültüp paylaşımını kolaylaştırır.",
    available: true,
    accentClassName: "bg-yellow-500",
    group: "Sıkıştırma",
  },
  {
    name: "Video Sıkıştırıcı",
    href: "/video-sikistir",
    description: "Video dosyalarını daha küçük boyutlara sıkıştırır.",
    available: false,
    accentClassName: "bg-teal-500",
    group: "Sıkıştırma",
  },
  {
    name: "Görsel Genişlet",
    href: "/gorsel-genislet",
    description:
      "Görselin kenarlarını yapay zeka ile akıllıca genişletir/büyütür.",
    available: false,
    accentClassName: "bg-indigo-600",
    group: "Görsel Düzenle",
  },
  {
    name: "Görsel Kalite Arttır",
    href: "/kalite-arttir",
    description:
      "Düşük çözünürlüklü görselleri yapay zeka ile netleştirir ve büyütür.",
    available: false,
    accentClassName: "bg-lime-500",
    group: "Görsel Düzenle",
  },
  {
    name: "Görsel Netleştir",
    href: "/gorsel-netlestir",
    description: "Bulanık görselleri yapay zeka ile netleştirir.",
    available: false,
    accentClassName: "bg-amber-500",
    group: "Görsel Düzenle",
  },
];

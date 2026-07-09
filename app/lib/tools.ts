export type Tool = {
  name: string;
  href: string;
  description: string;
  available: boolean;
  accentClassName: string;
  beta?: boolean;
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
    name: "Kalite Arttırma",
    href: "/kalite-arttir",
    description:
      "Düşük çözünürlüklü görselleri yapay zeka ile netleştirir ve büyütür.",
    available: false,
    accentClassName: "bg-purple-500",
  },
  {
    name: "Makale Hazırla",
    href: "/makale-hazirla",
    description: "Yapay zeka ile hızlıca makale ve yazı taslağı oluşturur",
    available: false,
    accentClassName: "bg-red-500",
  },
];

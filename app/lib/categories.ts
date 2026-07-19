import { tools, type Tool, type ToolFaqItem } from "./tools";

export type Category = {
  slug: string;
  name: string;
  tools: Tool[];
  // En az bir available:true araç içeriyor mu? Sitemap ve indexlenebilirlik
  // kararı bu bayrağa göre veriliyor (bkz. app/sitemap.ts,
  // app/[category]/page.tsx) - tamamı "yakında" olan bir kategori sayfası
  // hâlâ var olur (404 vermez) ama arama motorlarına kapalı kalır.
  hasAvailableTools: boolean;
};

// Türkçe karakterleri sadeleştirip URL-güvenli bir slug üretir. Bu slug
// aynı zamanda kategorinin gerçek URL'idir: /{slug} (bkz. app/[category]).
function slugify(name: string): string {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Kategoriler tools.ts'deki `group` alanından otomatik türetilir. Yeni bir
// araç yeni bir group ile eklendiğinde kategori sayfası (/{slug}), sidebar
// girişi ve "Benzer Araçlar" havuzu otomatik oluşur - hiçbir dosyayı elle
// güncellemeye gerek yoktur.
const groupNames = Array.from(
  new Set(
    tools
      .map((tool) => tool.group)
      .filter((group): group is string => Boolean(group))
  )
);

export const categories: Category[] = groupNames.map((name) => {
  const categoryTools = tools.filter((tool) => tool.group === name);
  return {
    slug: slugify(name),
    name,
    tools: categoryTools,
    hasAvailableTools: categoryTools.some((tool) => tool.available),
  };
});

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryForTool(tool: Tool): Category | undefined {
  if (!tool.group) return undefined;
  return categories.find((category) => category.name === tool.group);
}

export type CategorySeoContent = {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faq: ToolFaqItem[];
};

// Bilinen kategoriler için özenle yazılmış içerik burada tutulur. Henüz
// içerik yazılmamış (yeni eklenmiş) bir kategori için getCategorySeo,
// isimden makul bir varsayılan üretir - sayfa yine de çalışır, yalnızca
// metni sonradan buraya eklemeniz önerilir.
const categorySeo: Record<string, CategorySeoContent> = {
  Günlük: {
    metaTitle: "Günlük Araçlar | Ücretsiz Online Pratik Araçlar | Pratikleştir",
    metaDescription:
      "QR kod oluşturma, QR kod okuma, güçlü şifre üretme ve metin sayma gibi günlük ihtiyaçlarınız için hızlı, ücretsiz ve tarayıcı tabanlı araçlar bir arada.",
    intro:
      "Gündelik işlerinizi hızlandıran küçük ama pratik araçlar burada bir araya geliyor. QR kod oluşturup okumaktan güçlü şifre üretmeye, metin istatistiklerine kadar sık ihtiyaç duyduğunuz işlemleri kayıt olmadan, tamamen tarayıcınızda tamamlayabilirsiniz.",
    faq: [
      {
        question: "Günlük kategorisindeki araçlar ücretsiz mi?",
        answer:
          "Evet, bu kategorideki tüm araçlar tamamen ücretsizdir ve kayıt olmadan kullanılabilir.",
      },
      {
        question: "Bu araçlar verilerimi bir sunucuya gönderiyor mu?",
        answer:
          "Hayır. QR kod oluşturma/okuma, şifre üretme ve kelime sayma işlemlerinin tamamı tarayıcınızda gerçekleşir; girdiğiniz veri veya oluşturulan içerik sunucularımıza gönderilmez.",
      },
      {
        question: "Hangi araçlar bu kategoride yer alıyor?",
        answer:
          "QR Kod Oluşturucu, QR Kod Oku, Şifre Oluşturucu ve Kelime Sayacı - gündelik işlerinizi hızlandıran küçük ama sık kullanılan araçlar.",
      },
    ],
  },
  PDF: {
    metaTitle: "PDF Araçları | Ücretsiz Online PDF Birleştir, Sıkıştır | Pratikleştir",
    metaDescription:
      "PDF dosyalarını birleştirin, sıkıştırın ve yakında farklı formatlara dönüştürün. Kayıt gerekmez, tüm işlemler tarayıcınızda ve ücretsiz yapılır.",
    intro:
      "Sözleşme, rapor veya fatura gibi PDF dosyalarınızla ilgili tüm işlemler burada. Birden fazla PDF'i tek dosyada birleştirin, dosya boyutunu küçültün; dönüştürme aracımız da yakında bu kategoriye eklenecek.",
    faq: [
      {
        question: "PDF araçları için kayıt olmam gerekiyor mu?",
        answer:
          "Hayır, PDF Birleştirici ve PDF Sıkıştırıcı'yı kayıt olmadan doğrudan kullanabilirsiniz.",
      },
      {
        question: "Yüklediğim PDF dosyaları bir sunucuya gönderiliyor mu?",
        answer:
          "Hayır. Birleştirme ve sıkıştırma işlemleri pdf-lib kütüphanesiyle tamamen tarayıcınızda yapılır, dosyalarınız cihazınızdan çıkmaz.",
      },
      {
        question: "PDF Dönüştür ne zaman kullanıma açılacak?",
        answer:
          "PDF'leri Word, görsel ve diğer formatlara dönüştürecek araç üzerinde çalışıyoruz; hazır olduğunda bu kategoride \"yakında\" etiketi kalkacak.",
      },
    ],
  },
  Görsel: {
    metaTitle: "Görsel Araçları | Ücretsiz Online Fotoğraf Düzenleme | Pratikleştir",
    metaDescription:
      "Fotoğraflarınızı sıkıştırın, boyutlandırın, kırpın, format dönüştürün veya arka planını kaldırın; yakında genişletme ve netleştirme de eklenecek. Ücretsiz, tarayıcı tabanlı.",
    intro:
      "Fotoğraf ve görsellerinizle ilgili işlemleri tek yerden yönetin: dosya boyutunu küçültün, piksel ölçüsünü değiştirin, istediğiniz alanı kırpın, formatını dönüştürün veya arka planı yapay zeka ile kaldırın. Genişletme, kalite artırma ve netleştirme araçları yakında bu kategoriye katılacak.",
    faq: [
      {
        question: "Görsel kategorisindeki araçlar ücretsiz mi?",
        answer:
          "Evet, Görsel Sıkıştırıcı, Görsel Boyutlandır, Görsel Kırp, Görsel Dönüştür ve Arka Plan Silici'nin tamamı ücretsizdir ve kayıt olmadan kullanılabilir.",
      },
      {
        question: "Fotoğraflarım işlem sırasında bir yere yükleniyor mu?",
        answer:
          "Hayır, sıkıştırma, boyutlandırma, kırpma ve format dönüştürme tamamen tarayıcınızda yapılır. Arka plan silme ise tarayıcınızda çalışan bir yapay zeka modeliyle gerçekleşir; fotoğrafınız cihazınızdan çıkmaz.",
      },
      {
        question: "Bu kategoriye ne zaman yeni araç eklenecek?",
        answer:
          "Görsel genişletme, kalite artırma ve netleştirme araçları üzerinde çalışıyoruz; her biri hazır olduğunda bu kategoride \"yakında\" etiketi kalkacak.",
      },
    ],
  },
  Video: {
    metaTitle: "Video Araçları | Ücretsiz Online Video Sıkıştırma | Pratikleştir",
    metaDescription:
      "Video dosyalarınızı küçültecek ücretsiz online araç yakında burada. Diğer araçlarımızı incelemek için kategorilere göz atabilirsiniz.",
    intro:
      "Video sıkıştırma aracımız üzerinde çalışıyoruz; yakında bu kategoride video dosyalarınızın boyutunu kaliteden ödün vermeden küçültebileceksiniz.",
    faq: [
      {
        question: "Video Sıkıştırıcı ne zaman kullanıma açılacak?",
        answer:
          "Şu an geliştirme aşamasında; hazır olduğunda bu sayfada \"yakında\" etiketi kalkacak ve doğrudan kullanabileceksiniz.",
      },
      {
        question: "Video sıkıştırma da diğer araçlar gibi ücretsiz olacak mı?",
        answer:
          "Evet, sitemizdeki diğer araçlar gibi ücretsiz ve kayıt gerektirmeden kullanılabilecek şekilde tasarlanıyor.",
      },
      {
        question: "Bu süreçte hangi araçları kullanabilirim?",
        answer:
          "Video aracımızı beklerken PDF ve Görsel kategorilerindeki sıkıştırma araçlarımızı hemen kullanabilirsiniz.",
      },
    ],
  },
  Hesapla: {
    metaTitle: "Hesaplama Araçları | Ücretsiz Online Hesap Makineleri | Pratikleştir",
    metaDescription:
      "KDV, yüzde, döviz, kredi, ortalama ve indirim hesaplamalarınızı saniyeler içinde yapan ücretsiz online hesaplama araçları.",
    intro:
      "Günlük finansal hesaplamalarınızı kolaylaştıran araçlar burada bir arada: KDV'den kredi taksitine, döviz çevirisinden not ortalamasına kadar birçok hesaplamayı bu kategoride tek tıkla yapabilirsiniz.",
    faq: [
      {
        question: "Hesaplama araçları ücretsiz mi?",
        answer:
          "Evet, KDV, yüzde, döviz, kredi, ortalama ve indirim hesaplama araçlarımızın tamamı ücretsizdir ve kayıt olmadan kullanılabilir.",
      },
      {
        question: "Bu araçlar verilerimi bir sunucuya gönderiyor mu?",
        answer:
          "Hayır. Hesaplamaların tamamı tarayıcınızda yapılır; Döviz Hesapla yalnızca güncel kur verisini harici bir servisten çeker, girdiğiniz tutarlar hiçbir sunucumuza gönderilmez.",
      },
      {
        question: "Hangi araçlar bu kategoride yer alıyor?",
        answer:
          "KDV Hesapla, Yüzde Hesapla, Döviz Hesapla, Kredi Hesapla, Ortalama Hesapla ve İndirim Hesapla - günlük finansal hesaplamalarınız için ihtiyacınız olan araçlar.",
      },
    ],
  },
};

function autoCategoryFaq(name: string): ToolFaqItem[] {
  return [
    {
      question: `${name} kategorisindeki araçlar ücretsiz mi?`,
      answer: `Evet, ${name} kategorisindeki araçlar ücretsiz olarak kullanılabilir.`,
    },
    {
      question: "Kayıt olmam gerekiyor mu?",
      answer:
        "Hayır, çoğu aracımızı kayıt olmadan kullanabilirsiniz. Daha yüksek kullanım limitleri için ücretsiz hesap oluşturabilirsiniz.",
    },
  ];
}

export function getCategorySeo(name: string): CategorySeoContent {
  return (
    categorySeo[name] ?? {
      metaTitle: `${name} Araçları | Pratikleştir`,
      metaDescription: `${name} kategorisindeki ücretsiz online araçları keşfedin ve tarayıcınızda kullanmaya hemen başlayın.`,
      intro: `${name} kategorisindeki araçlarımızı aşağıda bulabilirsiniz.`,
      faq: autoCategoryFaq(name),
    }
  );
}

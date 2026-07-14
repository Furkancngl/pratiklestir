import type { ComponentType } from "react";
import {
  AverageIcon,
  CompressIcon,
  CreditCardIcon,
  CurrencyExchangeIcon,
  DocumentIcon,
  ExpandIcon,
  FocusIcon,
  ImageIcon,
  LockIcon,
  PenIcon,
  PercentIcon,
  QrCodeIcon,
  ReceiptIcon,
  ScanIcon,
  SparkleIcon,
  TagIcon,
  TextIcon,
  VideoIcon,
} from "../components/icons";

export type IconComponent = ComponentType<{ className?: string }>;

export type ToolFaqItem = {
  question: string;
  answer: string;
};

// Bir aracın tüm SEO içeriği: hepsi opsiyoneldir. Boş bırakılan alanlar
// getToolSeoContent() tarafından (app/lib/tool-metadata.ts) `description`
// ve `name`den türetilen makul bir varsayılanla otomatik doldurulur - yeni
// bir araç bu alanları hiç doldurmadan da SEO Title, Meta Description,
// Canonical, Open Graph, Schema, FAQ ve Breadcrumb'a otomatik kavuşur.
// Daha iyi/benzersiz sonuç için (özellikle `faq` ve `about`) doldurulması
// önerilir, ama zorunlu değildir.
export type ToolSeoContent = {
  metaTitle?: string;
  metaDescription?: string;
  about?: string[];
  howTo?: string[];
  advantages?: string[];
  faq?: ToolFaqItem[];
  applicationCategory?: string;
};

export type Tool = {
  name: string;
  href: string;
  description: string;
  available: boolean;
  accentClassName: string;
  icon: IconComponent;
  beta?: boolean;
  group?: string;
  // Sidebar'da kategori başlığının altında gösterilen kısa etiket (örn.
  // "PDF" kategorisi altında "PDF Sıkıştırıcı" yerine sadece "Sıkıştır").
  // Belirtilmezse `name` kullanılır.
  shortLabel?: string;
  // Ana sayfadaki "En Popüler Araçlar" bölümünde gösterilsin mi - editoryal
  // bir seçim, gerçek kullanım istatistiğine dayanmıyor (henüz analytics
  // yok). Bkz. app/components/popular-tools.tsx.
  popular?: boolean;
  seo?: ToolSeoContent;
};

// ---------------------------------------------------------------------------
// TEK KAYNAK: Yeni bir araç eklemek için tek yapmanız gereken bu diziye bir
// obje eklemektir. isim/açıklama/kategori/ikon/durum buradan; SEO title,
// meta description, canonical, Open Graph, JSON-LD schema, FAQ, breadcrumb
// ve sitemap.xml hepsi bu tek kayıttan otomatik türetilir:
//   - app/lib/tool-metadata.ts  -> title/description/canonical/OG/schema/FAQ
//   - app/components/tool-breadcrumbs.tsx -> breadcrumb + BreadcrumbList
//   - app/lib/categories.ts     -> kategori sayfası + "Benzer Araçlar"
//   - app/sitemap.ts            -> sitemap.xml girdisi (available:true ise)
// Başka HİÇBİR dosyada araca özel SEO/ikon/breadcrumb kodu yazmanız gerekmez.
// ---------------------------------------------------------------------------
export const tools: Tool[] = [
  {
    name: "QR Kod Oluşturucu",
    href: "/qr-kod",
    description:
      "Metin veya link gir, QR kodunu anında oluştur ve PNG olarak indir.",
    available: true,
    accentClassName: "bg-blue-500",
    icon: QrCodeIcon,
    group: "Günlük",
    popular: true,
    seo: {
      metaTitle: "QR Kod Oluştur | Ücretsiz Online QR Kod Oluşturucu | Pratikleştir",
      metaDescription:
        "Metin, link veya bilgiyi saniyeler içinde QR koda dönüştürün, PNG olarak indirin. Kayıt gerekmez, tamamen tarayıcınızda ve ücretsiz çalışır.",
      about: [
        "QR kod, bir web sitesi linkini, metni, wifi şifresini veya iletişim bilgisini kameradan tek okutuşta paylaşmanın en hızlı yollarından biridir. Menü, kartvizit, ambalaj ya da afiş gibi basılı materyallerde sıkça kullanılır.",
        "Bu araç, girdiğiniz metni tarayıcınız içinde anında QR koda çevirir. Sunucuya herhangi bir veri gönderilmez; oluşturma işlemi cihazınızda tamamlanır ve sonucu PNG dosyası olarak indirebilirsiniz.",
      ],
      howTo: [
        "QR koda dönüştürmek istediğiniz metni veya linki giriş alanına yazın.",
        "\"Oluştur\" butonuna tıklayın; QR kodunuz anında ekranda belirir.",
        "Oluşan kodu \"PNG olarak indir\" ile cihazınıza kaydedin.",
        "İndirdiğiniz görseli baskı materyaline veya dijital paylaşıma ekleyin.",
      ],
      advantages: [
        "Kayıt veya üyelik olmadan anında kullanılır.",
        "QR kod tarayıcınızda oluşturulur, herhangi bir sunucuya veri gönderilmez.",
        "Yüksek çözünürlüklü PNG çıktısı baskı için de uygundur.",
        "Tamamen ücretsizdir, kullanım sınırı yoktur.",
      ],
      faq: [
        {
          question: "Oluşturduğum QR kodun kullanım süresi var mı?",
          answer:
            "Hayır. QR kod, içine kodladığınız metni veya linki temsil eden statik bir görseldir; süresi dolmaz. Yönlendirdiği link veya içerik değişmediği sürece kalıcı olarak çalışır.",
        },
        {
          question: "Hangi içerikler için QR kod oluşturabilirim?",
          answer:
            "Web sitesi linki, düz metin, telefon numarası, e-posta adresi gibi herhangi bir metinsel içeriği QR koda çevirebilirsiniz.",
        },
        {
          question: "QR kodum başka bir cihazda okunmayabilir mi?",
          answer:
            "Standart QR kod formatı kullanıldığı için güncel kameralı telefonların tamamı tarafından okunur. Kodu bastırırken yeterli boyutta ve net baskı yapmanız okunabilirliği artırır.",
        },
        {
          question: "Oluşturduğum QR kod bir yerlerde saklanıyor mu?",
          answer:
            "Hayır. İşlem tamamen tarayıcınızda gerçekleşir, girdiğiniz metin veya oluşan görsel sunucularımıza kaydedilmez.",
        },
      ],
      applicationCategory: "UtilitiesApplication",
    },
  },
  {
    name: "QR Kod Oku",
    href: "/qr-kod-oku",
    description: "Görselden QR kodu okur, içeriğini anında gösterir.",
    available: true,
    accentClassName: "bg-purple-500",
    icon: ScanIcon,
    group: "Günlük",
    seo: {
      metaTitle: "QR Kod Oku | Görselden Online QR Kod Okuyucu | Pratikleştir",
      metaDescription:
        "Görseldeki QR kodu anında okuyun, içeriğini görüntüleyin ve tek tıkla kopyalayın. Kayıt gerektirmez, işlem tamamen tarayıcınızda gerçekleşir.",
      about: [
        "Elinizde QR kod içeren bir fotoğraf ya da ekran görüntüsü var ama kamerayla okutma imkanınız yoksa, bu araç görseli analiz ederek kodun içeriğini saniyeler içinde çözer.",
        "Görüntü işleme tamamen tarayıcınızda yapılır; yüklediğiniz dosya hiçbir sunucuya iletilmez. Okunan içerik ekranda gösterilir ve tek tıkla panoya kopyalanabilir.",
      ],
      howTo: [
        "QR kod içeren görseli sürükleyip bırakın veya dosya seçiciyle yükleyin.",
        "Görsel otomatik olarak taranır, ek bir işlem yapmanız gerekmez.",
        "Okunan metin veya link ekranda \"Okunan içerik\" alanında görüntülenir.",
        "\"Kopyala\" butonuyla sonucu panoya alıp istediğiniz yerde kullanın.",
      ],
      advantages: [
        "Kamera veya ek bir uygulama gerektirmeden, mevcut görselden okuma yapar.",
        "PNG, JPG gibi yaygın görsel formatlarını destekler.",
        "Görsel cihazınızdan çıkmaz, işlem tarayıcı içinde tamamlanır.",
        "Sonucu tek tıkla kopyalayıp anında paylaşabilirsiniz.",
      ],
      faq: [
        {
          question: "Hangi görsel formatlarını yükleyebilirim?",
          answer:
            "PNG, JPG ve tarayıcınızın desteklediği diğer yaygın görsel formatlarını yükleyebilirsiniz.",
        },
        {
          question: "Görselimde QR kod bulunamıyor diyor, neden olabilir?",
          answer:
            "Görsel çok bulanık, kırpılmış ya da QR kodun kenarları kesilmiş olabilir. Kodun tamamını içeren, net bir görsel yüklemeyi deneyin.",
        },
        {
          question: "Yüklediğim görsel bir yere kaydediliyor mu?",
          answer:
            "Hayır. Görsel yalnızca tarayıcınızda işlenir, herhangi bir sunucuya gönderilmez veya depolanmaz.",
        },
        {
          question: "Aynı anda birden fazla görsel yükleyebilir miyim?",
          answer:
            "Şu an araç tek seferde bir görsel işleyecek şekilde tasarlandı; yeni bir görsel yüklediğinizde önceki sonucun yerini alır.",
        },
      ],
      applicationCategory: "UtilitiesApplication",
    },
  },
  {
    name: "Şifre Oluşturucu",
    href: "/sifre-olusturucu",
    description: "Güçlü ve rastgele şifreler üretir.",
    available: true,
    accentClassName: "bg-rose-500",
    icon: LockIcon,
    group: "Günlük",
    seo: {
      metaTitle: "Şifre Oluştur | Güçlü ve Rastgele Online Şifre Oluşturucu | Pratikleştir",
      metaDescription:
        "Kriptografik olarak güvenli, rastgele ve güçlü şifreler oluşturun. Uzunluk ve karakter türünü özelleştirin, şifreniz sunucuya gönderilmez.",
      about: [
        "Zayıf veya tekrar kullanılan şifreler hesap güvenliğinin en büyük zaafiyetlerinden biridir. Bu araç, tarayıcınızın kriptografik olarak güvenli rastgele sayı üretecini (Web Crypto API) kullanarak tahmin edilmesi son derece zor şifreler oluşturur.",
        "Şifre uzunluğunu ve hangi karakter türlerinin (büyük harf, küçük harf, rakam, sembol) kullanılacağını siz belirlersiniz. Oluşan şifre yalnızca ekranınızda gösterilir, herhangi bir yere kaydedilmez.",
      ],
      howTo: [
        "Kaydırma çubuğuyla şifre uzunluğunu 8 ile 32 karakter arasında ayarlayın.",
        "Kullanılmasını istediğiniz karakter türlerini (büyük/küçük harf, rakam, sembol) işaretleyin.",
        "\"Oluştur\" butonuna tıklayarak yeni bir şifre üretin.",
        "Şifre gücünü kontrol edin ve \"Kopyala\" ile panoya alıp kullandığınız yere yapıştırın.",
      ],
      advantages: [
        "Math.random yerine kriptografik olarak güvenli rastgelelik kullanır.",
        "Uzunluk ve karakter türü tamamen özelleştirilebilir.",
        "Anlık şifre gücü göstergesiyle ne kadar güçlü olduğunu görürsünüz.",
        "Oluşan şifre hiçbir sunucuya iletilmez, yalnızca cihazınızda kalır.",
      ],
      faq: [
        {
          question: "Oluşturduğunuz şifreleri bir yerde saklıyor musunuz?",
          answer:
            "Hayır. Şifre üretimi tamamen tarayıcınızda gerçekleşir; oluşturulan şifre hiçbir sunucuya gönderilmez veya kaydedilmez.",
        },
        {
          question: "Önerilen şifre uzunluğu nedir?",
          answer:
            "Çoğu hesap için en az 12-16 karakter, mümkünse büyük/küçük harf, rakam ve sembol karışımı önerilir. Kritik hesaplarda 20 karakter ve üzeri tercih edebilirsiniz.",
        },
        {
          question: "Sembol içeren şifreler her sitede kabul ediliyor mu?",
          answer:
            "Çoğu site sembol içeren şifreleri kabul eder, ancak bazı eski sistemler kısıtlama getirebilir. Sembol seçeneğini kapatarak yalnızca harf ve rakamdan oluşan bir şifre de üretebilirsiniz.",
        },
        {
          question: "Aynı ayarlarla her seferinde aynı şifre mi üretilir?",
          answer:
            "Hayır, her \"Oluştur\" tıklamasında tamamen yeni ve rastgele bir şifre üretilir; aynı ayarları kullansanız bile sonuç her seferinde farklıdır.",
        },
      ],
      applicationCategory: "UtilitiesApplication",
    },
  },
  {
    name: "Kelime Sayacı",
    href: "/kelime-sayaci",
    description: "Metnindeki kelime sayısını anında hesaplar.",
    available: true,
    accentClassName: "bg-sky-500",
    icon: TextIcon,
    group: "Günlük",
    seo: {
      metaTitle: "Kelime Sayacı | Online Kelime ve Karakter Sayma Aracı | Pratikleştir",
      metaDescription:
        "Metninizi yapıştırın; kelime, karakter, cümle ve paragraf sayısını anında görün. Öğrenciler ve içerik yazarları için ücretsiz online araç.",
      about: [
        "Ödev, makale, sosyal medya gönderisi veya SEO içeriği hazırlarken belirli bir kelime sınırına uymak gerekebilir. Bu araç, yazdığınız veya yapıştırdığınız metni anlık olarak analiz ederek temel istatistikleri sunar.",
        "Metin kutusuna yazdığınız her karakterle birlikte kelime, karakter, cümle ve paragraf sayıları güncellenir; ayrı bir hesaplama veya bekleme gerekmez.",
      ],
      howTo: [
        "Metin kutusuna yazınız veya elinizdeki metni yapıştırın.",
        "Kelime, karakter, cümle ve paragraf sayıları alttaki kartlarda anında güncellenir.",
        "İstediğiniz kadar düzenleme yapın; sayaç her değişiklikte otomatik yenilenir.",
      ],
      advantages: [
        "Kelime, karakter, cümle ve paragraf sayımını tek ekranda birlikte gösterir.",
        "Yazarken gecikme olmadan anlık sonuç verir.",
        "Metniniz tarayıcınızdan dışarı çıkmaz, hiçbir sunucuya gönderilmez.",
        "Kayıt veya kurulum gerektirmeden doğrudan kullanılır.",
      ],
      faq: [
        {
          question: "Yapıştırdığım metin bir yere kaydediliyor mu?",
          answer:
            "Hayır. Sayım işlemi tamamen tarayıcınızda yapılır; metniniz hiçbir sunucuya gönderilmez veya saklanmaz.",
        },
        {
          question: "Karakter sayısına boşluklar da dahil mi?",
          answer:
            "Evet, karakter sayacı boşluklar dahil toplam karakter sayısını gösterir. Yalnızca boşluksuz sayım gerekiyorsa Karakter Sayacı aracımızı kullanabilirsiniz.",
        },
        {
          question: "Cümle ve paragraf sayısı nasıl hesaplanıyor?",
          answer:
            "Cümle sayısı nokta, ünlem ve soru işareti gibi noktalama işaretlerine göre; paragraf sayısı ise satır sonlarına göre belirlenir.",
        },
        {
          question: "Çok uzun metinlerde araç yavaşlar mı?",
          answer:
            "Hesaplama tarayıcınızda anlık yapıldığı için uzun metinlerde de akıcı çalışır; ekstra bir yükleme süresi beklemezsiniz.",
        },
      ],
      applicationCategory: "UtilitiesApplication",
    },
  },
  {
    name: "PDF Birleştirici",
    href: "/pdf-birlestir",
    description: "Birden fazla PDF dosyasını tek bir dosyada birleştir.",
    available: true,
    accentClassName: "bg-orange-500",
    icon: DocumentIcon,
    group: "PDF",
    shortLabel: "Birleştir",
    popular: true,
    seo: {
      metaTitle: "PDF Birleştir | Ücretsiz Online PDF Birleştirme Aracı | Pratikleştir",
      metaDescription:
        "Birden fazla PDF dosyasını istediğiniz sırada tek bir dosyada birleştirin. Kayıt gerekmez, işlem tamamen tarayıcınızda ve ücretsiz yapılır.",
      about: [
        "Sözleşme ekleri, fatura grupları, ödev sayfaları ya da rapor bölümleri gibi birden fazla PDF dosyasını tek bir dosyada toplamak, paylaşımı ve arşivlemeyi kolaylaştırır.",
        "Bu araç, yüklediğiniz PDF dosyalarını istediğiniz sırayla tek bir dosyada birleştirir. Birleştirme işlemi pdf-lib kütüphanesiyle tarayıcınızda yapılır, dosyalarınız cihazınızdan çıkmaz.",
      ],
      howTo: [
        "Birleştirmek istediğiniz PDF dosyalarını sürükleyip bırakın veya seçin.",
        "Listedeki yukarı/aşağı oklarla dosyaların sırasını istediğiniz gibi düzenleyin.",
        "\"Birleştir\" butonuna tıklayarak tüm dosyaları tek bir PDF'te birleştirin.",
        "Sonucu \"PDF olarak indir\" ile cihazınıza kaydedin.",
      ],
      advantages: [
        "Dosya sırasını sürükleme yerine tek tıkla yukarı/aşağı taşıyarak düzenlersiniz.",
        "Aynı anda birden fazla PDF dosyası yükleyip tek seferde birleştirebilirsiniz.",
        "Orijinal dosyalarınız değişmez, yalnızca yeni birleşik dosya oluşturulur.",
        "Yükleme veya bulut aktarımı olmadan tamamen tarayıcınızda çalışır.",
      ],
      faq: [
        {
          question: "Birleştirdiğim dosyaların sırasını değiştirebilir miyim?",
          answer:
            "Evet. Dosyayı yükledikten sonra listedeki yukarı ve aşağı taşıma butonlarıyla sırasını dilediğiniz gibi ayarlayabilirsiniz.",
        },
        {
          question: "Kaç PDF dosyasını birden birleştirebilirim?",
          answer:
            "Belirli bir dosya sayısı sınırı yoktur; pratik sınır, tarayıcınızın ve cihazınızın belleğiyle ilgilidir. Çok sayıda büyük dosyada işlem biraz daha uzun sürebilir.",
        },
        {
          question: "Yüklediğim PDF'ler bir sunucuya gönderiliyor mu?",
          answer:
            "Hayır. Birleştirme işlemi tamamen tarayıcınızda gerçekleşir, dosyalarınız cihazınızdan hiç çıkmaz.",
        },
        {
          question: "Şifreli veya bozuk bir PDF'i birleştirebilir miyim?",
          answer:
            "Şifre korumalı veya bozuk PDF dosyaları okunamadığı için listeye eklenemez; bu durumda bir uyarı mesajı gösterilir.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "Arka Plan Silici",
    href: "/arka-plan-sil",
    description: "Görsellerin arka planını otomatik olarak kaldır.",
    available: true,
    accentClassName: "bg-green-500",
    icon: ImageIcon,
    beta: true,
    group: "Görsel",
    shortLabel: "Arka Plan Sil",
    popular: true,
    seo: {
      metaTitle: "Arka Plan Sil | Yapay Zeka ile Ücretsiz Arka Plan Kaldırma | Pratikleştir",
      metaDescription:
        "Fotoğraflardaki arka planı yapay zeka ile tek tıkla kaldırın, şeffaf PNG olarak indirin. Ücretsiz, kayıt gerektirmez, tarayıcıda çalışır.",
      about: [
        "Ürün fotoğrafı, profil resmi veya tasarım çalışması hazırlarken arka planı temizlemek genelde ayrı bir düzenleme programı gerektirir. Bu araç, yapay zeka destekli bir model kullanarak arka planı otomatik olarak tespit edip kaldırır.",
        "İşlem tamamen tarayıcınızda çalışır; fotoğrafınız hiçbir sunucuya yüklenmez. İlk kullanımda model dosyalarının indirilmesi biraz zaman alabilir, sonraki kullanımlarda işlem daha hızlıdır.",
      ],
      howTo: [
        "Arka planı kaldırılacak fotoğrafı sürükleyip bırakın veya seçin.",
        "\"Arka Planı Kaldır\" butonuna tıklayın ve işlemin tamamlanmasını bekleyin.",
        "Orijinal ve arka planı silinmiş halini yan yana karşılaştırın.",
        "Sonucu şeffaf arka planlı PNG olarak indirin.",
      ],
      advantages: [
        "Elle seçim yapmadan, yapay zeka ile otomatik arka plan tespiti sağlar.",
        "Sonuç şeffaf arka planlı PNG olarak indirilir, tasarım araçlarında doğrudan kullanılabilir.",
        "PNG, JPG ve WebP gibi yaygın formatları destekler.",
        "Fotoğrafınız cihazınızdan çıkmadan, tarayıcı içinde işlenir.",
      ],
      faq: [
        {
          question: "Hangi görsel formatlarını yükleyebilirim?",
          answer: "PNG, JPG ve WebP formatındaki fotoğrafları yükleyebilirsiniz.",
        },
        {
          question: "İlk kullanımda neden daha yavaş çalışıyor?",
          answer:
            "Arka plan kaldırma modeli ilk çalıştırmada tarayıcınıza indirilir; bu tek seferlik indirme işlemi birkaç saniye sürebilir. Sonraki kullanımlarda işlem belirgin şekilde hızlanır.",
        },
        {
          question: "Sonuç dosyası şeffaf mı çıkıyor?",
          answer:
            "Evet, kaldırılan arka planın yerini şeffaflık alır ve dosya PNG formatında, şeffaf arka planlı olarak indirilir.",
        },
        {
          question: "Fotoğrafım bir sunucuya yükleniyor mu?",
          answer:
            "Hayır. Arka plan kaldırma işlemi tamamen tarayıcınızda çalışan bir yapay zeka modeliyle yapılır, fotoğrafınız cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "Makale Hazırla",
    href: "/makale-hazirla",
    description: "Yapay zeka ile hızlıca makale ve yazı taslağı oluşturur",
    available: false,
    accentClassName: "bg-red-500",
    icon: PenIcon,
  },
  {
    name: "Görsel Sıkıştırıcı",
    href: "/gorsel-sikistir",
    description: "Fotoğrafların dosya boyutunu kaliteden ödün vermeden küçültür.",
    available: true,
    accentClassName: "bg-cyan-500",
    icon: CompressIcon,
    group: "Görsel",
    shortLabel: "Sıkıştır",
    popular: true,
    seo: {
      metaTitle: "Görsel Sıkıştır | Ücretsiz Online Fotoğraf Sıkıştırma Aracı | Pratikleştir",
      metaDescription:
        "Fotoğraflarınızı kaliteden ödün vermeden küçültün, üç sıkıştırma seviyesinden seçin ve toplu olarak indirin. Ücretsiz ve tarayıcı tabanlı.",
      about: [
        "Büyük boyutlu fotoğraflar web sitelerini yavaşlatır, e-posta eklerinde sorun çıkarır ve depolama alanını gereksiz yere doldurur. Bu araç, görsellerinizi seçtiğiniz kalite seviyesine göre yeniden boyutlandırıp sıkıştırır.",
        "Yüksek Kalite, Orta ve Maksimum Sıkıştırma seçenekleri arasından ihtiyacınıza uygun olanı seçebilir, birden fazla görseli aynı anda işleyip toplu halde indirebilirsiniz.",
      ],
      howTo: [
        "Sıkıştırmak istediğiniz görselleri sürükleyip bırakın veya seçin.",
        "Yüksek Kalite, Orta ya da Maksimum Sıkıştırma seviyelerinden birini seçin.",
        "\"Sıkıştır\" butonuna tıklayarak tüm görselleri işleyin.",
        "Dosyaları tek tek indirin veya birden fazla dosyayı \"Tümünü İndir (.zip)\" ile toplu alın.",
      ],
      advantages: [
        "Üç farklı kalite/boyut presetiyle ihtiyaca göre denge kurarsınız.",
        "Birden fazla görseli tek seferde işleyip zip olarak indirebilirsiniz.",
        "Her dosya için ne kadar küçüldüğünü yüzde olarak anında görürsünüz.",
        "Görselleriniz tarayıcınızdan çıkmadan, cihazınızda işlenir.",
      ],
      faq: [
        {
          question: "Hangi görsel formatlarını sıkıştırabilirim?",
          answer:
            "JPG, PNG, WebP gibi tarayıcınızın desteklediği yaygın görsel formatlarını sıkıştırabilirsiniz.",
        },
        {
          question: "Sıkıştırma görsel kalitesini ne kadar etkiler?",
          answer:
            "Yüksek Kalite seçeneği görünür kaliteyi büyük ölçüde korurken dosya boyutunu az miktarda küçültür; Maksimum Sıkıştırma ise boyutu ciddi oranda azaltır ama görsel kalitesinde fark edilir bir düşüşe yol açabilir.",
        },
        {
          question: "Sıkıştırılan dosyaları toplu olarak indirebilir miyim?",
          answer:
            "Evet, birden fazla görsel işlediğinizde \"Tümünü İndir (.zip)\" seçeneğiyle tüm sonuçları tek bir zip dosyasında indirebilirsiniz.",
        },
        {
          question: "Görsellerim bir sunucuya yükleniyor mu?",
          answer: "Hayır. Sıkıştırma işlemi tamamen tarayıcınızda yapılır, görselleriniz cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "PDF Sıkıştırıcı",
    href: "/pdf-sikistir",
    description: "PDF dosyalarının boyutunu küçültüp paylaşımını kolaylaştırır.",
    available: true,
    accentClassName: "bg-yellow-500",
    icon: DocumentIcon,
    group: "PDF",
    shortLabel: "Sıkıştır",
    seo: {
      metaTitle: "PDF Sıkıştır | Ücretsiz Online PDF Sıkıştırma Aracı | Pratikleştir",
      metaDescription:
        "PDF dosyalarınızın boyutunu küçültüp paylaşımını kolaylaştırın. Birden fazla dosyayı aynı anda sıkıştırın, kayıt olmadan ücretsiz kullanın.",
      about: [
        "Büyük PDF dosyaları e-posta eklerinde reddedilebilir veya paylaşım platformlarında yavaş yüklenebilir. Bu araç, PDF içindeki gereksiz veriyi temizleyerek dosya boyutunu küçültmeye çalışır.",
        "Sıkıştırma, pdf-lib kütüphanesiyle tarayıcınızda gerçekleşir ve öncelikle dosya yapısındaki fazlalıkları temizler; görselleri yeniden sıkıştırmadığı için bazı PDF'lerde boyut değişimi sınırlı kalabilir.",
      ],
      howTo: [
        "Sıkıştırmak istediğiniz PDF dosyalarını sürükleyip bırakın veya seçin.",
        "\"Sıkıştır\" butonuna tıklayarak tüm dosyaları işleyin.",
        "Her dosya için orijinal ve sıkıştırılmış boyutu karşılaştırın.",
        "Sonuçları tek tek \"İndir\" ikonuyla cihazınıza kaydedin.",
      ],
      advantages: [
        "Birden fazla PDF dosyasını tek seferde sıkıştırabilirsiniz.",
        "Her dosya için elde edilen küçülme yüzdesini anında görürsünüz.",
        "Belge içeriği ve görsel kalitesi değişmez, yalnızca gereksiz veri temizlenir.",
        "Yükleme gerektirmeden tamamen tarayıcınızda çalışır.",
      ],
      faq: [
        {
          question: "Her PDF dosyası aynı oranda küçülür mü?",
          answer:
            "Hayır. Sıkıştırma oranı dosyanın yapısına göre değişir; zaten optimize edilmiş bir PDF'te boyut çok az değişebilir veya hiç değişmeyebilir.",
        },
        {
          question: "Sıkıştırma sonrası görsel kalitesi düşer mi?",
          answer:
            "Hayır. Araç, PDF içindeki görselleri yeniden sıkıştırmaz; yalnızca dosya yapısındaki gereksiz verileri temizler, bu yüzden içerik kalitesi korunur.",
        },
        {
          question: "Aynı anda birden fazla PDF sıkıştırabilir miyim?",
          answer: "Evet, istediğiniz kadar PDF dosyasını aynı anda yükleyip tek seferde sıkıştırabilirsiniz.",
        },
        {
          question: "Dosyalarım bir sunucuya yükleniyor mu?",
          answer: "Hayır. Sıkıştırma işlemi tamamen tarayıcınızda yapılır, PDF dosyalarınız cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "PDF Dönüştür",
    href: "/pdf-donustur",
    description: "PDF dosyalarını Word, görsel ve diğer formatlara dönüştürür.",
    available: false,
    accentClassName: "bg-rose-500",
    icon: DocumentIcon,
    group: "PDF",
    shortLabel: "Dönüştür",
  },
  {
    name: "Video Sıkıştırıcı",
    href: "/video-sikistir",
    description: "Video dosyalarını daha küçük boyutlara sıkıştırır.",
    available: false,
    accentClassName: "bg-teal-500",
    icon: VideoIcon,
    group: "Video",
    shortLabel: "Sıkıştır",
  },
  {
    name: "Görsel Genişlet",
    href: "/gorsel-genislet",
    description: "Görselin kenarlarını yapay zeka ile akıllıca genişletir/büyütür.",
    available: false,
    accentClassName: "bg-indigo-600",
    icon: ExpandIcon,
    group: "Görsel",
    shortLabel: "Genişlet",
  },
  {
    name: "Görsel Kalite Arttır",
    href: "/kalite-arttir",
    description: "Düşük çözünürlüklü görselleri yapay zeka ile netleştirir ve büyütür.",
    available: false,
    accentClassName: "bg-lime-500",
    icon: SparkleIcon,
    group: "Görsel",
    shortLabel: "Kalite Arttır",
  },
  {
    name: "Görsel Netleştir",
    href: "/gorsel-netlestir",
    description: "Bulanık görselleri yapay zeka ile netleştirir.",
    available: false,
    accentClassName: "bg-amber-500",
    icon: FocusIcon,
    group: "Görsel",
    shortLabel: "Netleştir",
  },
  {
    name: "Görsel Dönüştür",
    href: "/gorsel-donustur",
    description: "Görselleri PNG, JPG ve WebP gibi formatlar arasında dönüştürür.",
    available: false,
    accentClassName: "bg-fuchsia-500",
    icon: ImageIcon,
    group: "Görsel",
    shortLabel: "Dönüştür",
  },
  {
    name: "KDV Hesapla",
    href: "/kdv-hesapla",
    description: "Tutara KDV ekler veya tutardan KDV'yi ayrıştırır.",
    available: true,
    accentClassName: "bg-emerald-500",
    icon: ReceiptIcon,
    group: "Hesapla",
    seo: {
      metaTitle: "KDV Hesapla | Ücretsiz Online KDV Hesaplama Aracı | Pratikleştir",
      metaDescription:
        "Tutara KDV ekleyin veya tutardan KDV'yi ayrıştırın. %1, %10, %20 gibi yaygın oranlar veya özel oranla anında, ücretsiz hesaplayın.",
      about: [
        "Fatura keserken veya bir ürünün KDV dahil/hariç fiyatını karşılaştırırken elle yapılan yüzde hesapları kolayca hataya açık olabilir. Bu araç, girdiğiniz tutarı seçtiğiniz KDV oranına göre saniyeler içinde hesaplar.",
        "Tutarınızın KDV hariç mi yoksa KDV dahil mi olduğunu seçip yaygın oranlardan (%1, %10, %20) birini kullanabilir veya kendi özel oranınızı girebilirsiniz.",
      ],
      howTo: [
        "Tutarı TL cinsinden girin.",
        "Girdiğiniz tutarın KDV hariç mi yoksa KDV dahil mi olduğunu seçin.",
        "Yaygın KDV oranlarından birini seçin veya \"Özel\" alanına kendi oranınızı yazın.",
        "KDV tutarını, KDV hariç ve KDV dahil değerleri anında görün.",
      ],
      advantages: [
        "%1, %10, %20 gibi yaygın oranların yanında özel oran girişi de destekler.",
        "KDV hariç veya KDV dahil tutardan başlayarak hesaplama yapabilirsiniz.",
        "Sonuç, tutarı değiştirdikçe anında güncellenir.",
        "Girdiğiniz tutar tarayıcınızdan çıkmaz, hiçbir sunucuya gönderilmez.",
      ],
      faq: [
        {
          question: "Türkiye'de yaygın KDV oranları nelerdir?",
          answer:
            "En sık kullanılan oranlar %1, %10 ve %20'dir; ürün ve hizmet türüne göre farklılık gösterebilir. Aracımızda bu üç oranın yanında özel oran girme seçeneği de bulunur.",
        },
        {
          question: "KDV hariç ve KDV dahil tutar arasındaki fark nedir?",
          answer:
            "KDV hariç tutar, vergi eklenmeden önceki tutardır. KDV dahil tutar ise bu tutara ilgili oranda KDV eklendikten sonraki, müşterinin ödediği nihai tutardır.",
        },
        {
          question: "Elimde olan tutar KDV dahil mi hariç mi bilmiyorum, nasıl anlarım?",
          answer:
            "Fatura veya fiyat etiketinde \"KDV dahildir\" ya da \"+ KDV\" gibi bir ifade genelde belirtilir. Emin değilseniz her iki modu da deneyip hangisinin beklediğiniz sonuca yakın olduğuna bakabilirsiniz.",
        },
        {
          question: "Girdiğim tutarlar bir yere kaydediliyor mu?",
          answer:
            "Hayır. Hesaplama tamamen tarayıcınızda yapılır; girdiğiniz tutar ve oran hiçbir sunucuya gönderilmez veya saklanmaz.",
        },
      ],
      applicationCategory: "FinanceApplication",
    },
  },
  {
    name: "Yüzde Hesapla",
    href: "/yuzde-hesapla",
    description: "Bir sayının yüzdesini veya yüzdelik değişimini hesaplar.",
    available: true,
    accentClassName: "bg-violet-500",
    icon: PercentIcon,
    group: "Hesapla",
    seo: {
      metaTitle: "Yüzde Hesapla | Online Yüzde Hesaplama Aracı | Pratikleştir",
      metaDescription:
        "Bir sayının yüzdesini, bir sayının diğerinin yüzde kaçı olduğunu veya yüzdelik artış/azalışı saniyeler içinde, ücretsiz hesaplayın.",
      about: [
        "\"200'ün %15'i kaç\", \"30, 150'nin yüzde kaçı\" veya \"1000'e %20 zam gelirse ne olur\" gibi sorular günlük hayatta sık karşımıza çıkar. Bu araç, en yaygın üç yüzde hesaplama modunu tek ekranda toplar.",
        "İhtiyacınıza uygun modu seçip iki sayıyı girmeniz yeterli; sonuç, sayılar değiştikçe anında güncellenir.",
      ],
      howTo: [
        "Yapmak istediğiniz hesaplama moduna göre üstteki sekmelerden birini seçin.",
        "İlgili alanlara sayıları girin.",
        "Sonucu anında ekranda görün.",
        "Farklı bir hesaplama için sekmeyi değiştirip sayıları güncelleyin.",
      ],
      advantages: [
        "Üç yaygın yüzde hesaplama modunu tek araçta birleştirir.",
        "Sekmeler arasında geçiş yaparak farklı hesaplamaları hızlıca deneyebilirsiniz.",
        "Ondalıklı sayıları da destekler.",
        "Girdiğiniz sayılar tarayıcınızdan çıkmaz, hiçbir sunucuya gönderilmez.",
      ],
      faq: [
        {
          question: "\"X'in %Y'si\" modu ne işe yarar?",
          answer:
            "Bir sayının belirli bir yüzdesinin karşılığını bulmanızı sağlar; örneğin \"200'ün %15'i kaç\" sorusunun cevabını anında verir.",
        },
        {
          question: "\"X, Y'nin yüzde kaçı\" modu neyi hesaplar?",
          answer:
            "Bir sayının başka bir sayıya oranını yüzde olarak gösterir; örneğin \"30, 150'nin yüzde kaçı\" sorusuna cevap verir.",
        },
        {
          question: "Yüzde artış/azalış modunda negatif değer girebilir miyim?",
          answer:
            "Evet. Pozitif bir değer girerseniz artış, negatif bir değer girerseniz (örneğin -10) azalış hesaplanır.",
        },
        {
          question: "Girdiğim sayılar bir yere kaydediliyor mu?",
          answer:
            "Hayır. Hesaplama tamamen tarayıcınızda yapılır; girdiğiniz sayılar hiçbir sunucuya gönderilmez veya saklanmaz.",
        },
      ],
      applicationCategory: "UtilitiesApplication",
    },
  },
  {
    name: "Döviz Hesapla",
    href: "/doviz-hesapla",
    description: "Güncel kurlarla farklı para birimleri arasında çevirir.",
    available: true,
    accentClassName: "bg-pink-500",
    icon: CurrencyExchangeIcon,
    group: "Hesapla",
    seo: {
      metaTitle: "Döviz Hesapla | Güncel Kurla Online Döviz Çevirici | Pratikleştir",
      metaDescription:
        "TL, dolar, euro ve sterlin arasında güncel kurlarla anında çeviri yapın. Kayıt gerekmez, kur verisi güvenilir bir kaynaktan çekilir.",
      about: [
        "Alışveriş, seyahat veya yurt dışı ödemesi planlarken güncel döviz kurunu bilmek işinizi kolaylaştırır. Bu araç, güncel kurları harici bir kur servisinden çekip TL, dolar, euro ve sterlin arasında anında çeviri yapar.",
        "Tutarı ve kaynak/hedef para birimini seçmeniz yeterli; kur bilgisi günde bir kez güncellenen güvenilir bir kaynaktan alınır ve son güncelleme zamanı ekranda gösterilir.",
      ],
      howTo: [
        "Çevirmek istediğiniz tutarı girin.",
        "Kaynak ve hedef para birimini seçin.",
        "Gerekirse para birimlerini yer değiştirme butonuyla hızlıca ters çevirin.",
        "Sonucu ve güncel birim kuru ekranda görün.",
      ],
      advantages: [
        "TL, dolar, euro ve sterlin arasında hızlı çeviri yapar.",
        "Kur verisi güncel ve güvenilir bir kaynaktan çekilir.",
        "Tek tıkla kaynak ve hedef para birimini yer değiştirebilirsiniz.",
        "Kayıt veya üyelik olmadan anında kullanılır.",
      ],
      faq: [
        {
          question: "Kur bilgisi nereden alınıyor?",
          answer:
            "Kurlar, exchangerate-api.com'un ücretsiz ve kayıt gerektirmeyen açık erişim servisinden çekilir; veriler günde bir kez güncellenir.",
        },
        {
          question: "Kur bilgisi güncellenmezse ne olur?",
          answer:
            "Kur servisine ulaşılamazsa ekranda bir hata mesajı gösterilir ve \"Tekrar Dene\" butonuyla yeniden deneyebilirsiniz.",
        },
        {
          question: "Hangi para birimleri arasında çeviri yapabilirim?",
          answer: "Şu an TL, dolar, euro ve sterlin arasında çeviri yapabilirsiniz.",
        },
        {
          question: "Girdiğim tutar bir yere kaydediliyor mu?",
          answer:
            "Hayır. Yalnızca güncel kur verisi harici servisten çekilir; girdiğiniz tutar tarayıcınızda kalır, hiçbir sunucumuza gönderilmez.",
        },
      ],
      applicationCategory: "FinanceApplication",
    },
  },
  {
    name: "Kredi Hesapla",
    href: "/kredi-hesapla",
    description: "Kredi tutarı, vade ve faize göre taksitleri hesaplar.",
    available: true,
    accentClassName: "bg-yellow-500",
    icon: CreditCardIcon,
    group: "Hesapla",
    seo: {
      metaTitle: "Kredi Hesapla | Online Kredi Taksit Hesaplama Aracı | Pratikleştir",
      metaDescription:
        "Kredi tutarı, vade ve aylık faiz oranını girin; aylık taksiti, toplam geri ödemeyi ve ödeme planını standart anüite formülüyle hesaplayın.",
      about: [
        "Bir krediye başvurmadan önce aylık taksitin ve toplam maliyetin ne olacağını bilmek, bütçenizi planlamanıza yardımcı olur. Bu araç, standart kredi/anüite formülünü kullanarak taksit tutarını hesaplar.",
        "Kredi tutarı, vade (ay) ve aylık faiz oranını girmeniz yeterli; aylık taksit, toplam geri ödeme ve toplam faiz tutarının yanında isteğe bağlı olarak ay ay ödeme planını da görüntüleyebilirsiniz.",
      ],
      howTo: [
        "Kredi tutarını TL cinsinden girin.",
        "Vadeyi ay olarak girin.",
        "Bankanızın belirttiği aylık faiz oranını yüzde olarak girin.",
        "Aylık taksiti, toplam geri ödemeyi görün; isterseniz \"Ödeme planını göster\" ile ay ay dökümü inceleyin.",
      ],
      advantages: [
        "Standart kredi/anüite formülüyle güvenilir bir tahmin sunar.",
        "Toplam geri ödeme ve toplam faiz tutarını ayrı ayrı gösterir.",
        "İsteğe bağlı ay ay ödeme planıyla anapara/faiz dağılımını görebilirsiniz.",
        "Girdiğiniz bilgiler tarayıcınızdan çıkmaz, hiçbir sunucuya gönderilmez.",
      ],
      faq: [
        {
          question: "Hesaplanan tutar bankamın vereceği teklifle birebir aynı olur mu?",
          answer:
            "Hayır, bu araç standart anüite formülüyle bir tahmin sunar. Bankalar dosya masrafı, BSMV/KKDF gibi ek kalemler uygulayabilir; kesin tutar için bankanızın resmi teklifine bakmanız gerekir.",
        },
        {
          question: "Aylık faiz oranını nereden öğrenebilirim?",
          answer:
            "Bankanızın kredi teklifinde veya kredi sözleşmesinde belirtilen aylık faiz oranını kullanabilirsiniz; yıllık oran verilmişse yaklaşık aylık karşılığına bölerek girebilirsiniz.",
        },
        {
          question: "Ödeme planı nasıl hesaplanıyor?",
          answer:
            "Her ay için kalan bakiye üzerinden faiz payı ve anapara payı hesaplanır; taksit sabit kalırken ilerleyen aylarda anapara payı artar, faiz payı azalır.",
        },
        {
          question: "Girdiğim bilgiler bir yere kaydediliyor mu?",
          answer:
            "Hayır. Hesaplama tamamen tarayıcınızda yapılır; kredi tutarı, vade ve faiz oranı hiçbir sunucuya gönderilmez veya saklanmaz.",
        },
      ],
      applicationCategory: "FinanceApplication",
    },
  },
  {
    name: "Ortalama Hesapla",
    href: "/ortalama-hesapla",
    description: "Bir sayı dizisinin ortalamasını anında hesaplar.",
    available: true,
    accentClassName: "bg-teal-500",
    icon: AverageIcon,
    group: "Hesapla",
    seo: {
      metaTitle: "Ortalama Hesapla | Basit ve Ağırlıklı Ortalama Hesaplama | Pratikleştir",
      metaDescription:
        "Birden fazla sayının basit ortalamasını veya not ortalaması gibi ağırlıklı ortalamasını saniyeler içinde, ücretsiz hesaplayın.",
      about: [
        "Not ortalaması, ürün puanları veya bir dizi ölçümün ortalamasını almak gerektiğinde elle toplayıp bölmek zaman alabilir ve hataya açıktır. Bu araç, istediğiniz kadar sayıyı ekleyip ortalamasını anında hesaplar.",
        "Basit ortalamanın yanında, her değere farklı bir ağırlık (örneğin ders kredisi) verebileceğiniz ağırlıklı ortalama modu da bulunur.",
      ],
      howTo: [
        "Basit veya Ağırlıklı Ortalama sekmesini seçin.",
        "\"+ Sayı ekle\" veya \"+ Satır ekle\" ile istediğiniz kadar değer ekleyin.",
        "Ağırlıklı modda her değerin yanına ilgili ağırlığı girin.",
        "Ortalama sonucunu anında ekranda görün.",
      ],
      advantages: [
        "Sınırsız sayıda değer ekleyip çıkarabilirsiniz.",
        "Not ortalaması gibi hesaplamalar için ağırlıklı ortalama modu sunar.",
        "Sonuç, her değişiklikte anında güncellenir.",
        "Girdiğiniz sayılar tarayıcınızdan çıkmaz, hiçbir sunucuya gönderilmez.",
      ],
      faq: [
        {
          question: "Ağırlıklı ortalama ne zaman kullanılır?",
          answer:
            "Her değerin eşit öneme sahip olmadığı durumlarda kullanılır; örneğin ders notlarını kredi sayısına göre ağırlıklandırarak genel not ortalaması hesaplamak için idealdir.",
        },
        {
          question: "Kaç değer ekleyebilirim?",
          answer: "Belirli bir sınır yoktur; \"+ Sayı ekle\" veya \"+ Satır ekle\" ile istediğiniz kadar değer ekleyebilirsiniz.",
        },
        {
          question: "Ondalıklı sayı girebilir miyim?",
          answer: "Evet, virgül veya nokta ile ondalıklı değerler girebilirsiniz.",
        },
        {
          question: "Girdiğim değerler bir yere kaydediliyor mu?",
          answer:
            "Hayır. Hesaplama tamamen tarayıcınızda yapılır; girdiğiniz değerler hiçbir sunucuya gönderilmez veya saklanmaz.",
        },
      ],
      applicationCategory: "UtilitiesApplication",
    },
  },
  {
    name: "İndirim Hesapla",
    href: "/indirim-hesapla",
    description: "İndirimli fiyatı ve ne kadar tasarruf ettiğini hesaplar.",
    available: true,
    accentClassName: "bg-indigo-600",
    icon: TagIcon,
    group: "Hesapla",
    seo: {
      metaTitle: "İndirim Hesapla | Online İndirimli Fiyat Hesaplama Aracı | Pratikleştir",
      metaDescription:
        "Orijinal fiyatı ve indirim yüzdesini girin; indirimli fiyatı ve ne kadar tasarruf ettiğinizi saniyeler içinde, ücretsiz hesaplayın.",
      about: [
        "İndirim kampanyalarında gerçek fiyat farkını görmek, alışverişte doğru karar vermenize yardımcı olur. Bu araç, orijinal fiyat ve indirim oranını girdiğinizde indirimli fiyatı ve tam olarak ne kadar tasarruf ettiğinizi anında hesaplar.",
        "Mağaza etiketindeki veya online alışveriş sitesindeki \"%X indirim\" ibaresinin gerçekte ne kadar tasarrufa denk geldiğini görmek için tek yapmanız gereken iki değeri girmek.",
      ],
      howTo: [
        "Ürünün orijinal fiyatını TL cinsinden girin.",
        "Uygulanacak indirim oranını yüzde olarak girin.",
        "İndirimli fiyatı ve kazancınızı anında görün.",
        "Farklı bir ürün veya oran için değerleri güncelleyin.",
      ],
      advantages: [
        "İndirimli fiyatı ve tasarruf tutarını ayrı ayrı gösterir.",
        "Sonuç, değerleri değiştirdikçe anında güncellenir.",
        "Ondalıklı fiyat ve oranları destekler.",
        "Girdiğiniz tutar tarayıcınızdan çıkmaz, hiçbir sunucuya gönderilmez.",
      ],
      faq: [
        {
          question: "\"Kazancınız\" ne anlama geliyor?",
          answer:
            "Orijinal fiyat ile indirimli fiyat arasındaki farktır; yani indirim sayesinde ödemekten kurtulduğunuz tutardır.",
        },
        {
          question: "%100'den büyük bir indirim oranı girebilir miyim?",
          answer:
            "Girebilirsiniz ancak gerçek hayatta böyle bir indirim bulunmadığından sonuç negatif bir \"indirimli fiyat\" olarak görünür; oranın doğru olduğundan emin olun.",
        },
        {
          question: "Art arda uygulanan iki indirimi hesaplayabilir miyim?",
          answer:
            "Bu araç tek seferlik bir indirimi hesaplar. Art arda iki indirim için önce ilk indirimin sonucunu \"Orijinal Fiyat\" alanına girip ikinci oranı uygulayabilirsiniz.",
        },
        {
          question: "Girdiğim tutar ve oran bir yere kaydediliyor mu?",
          answer:
            "Hayır. Hesaplama tamamen tarayıcınızda yapılır; girdiğiniz değerler hiçbir sunucuya gönderilmez veya saklanmaz.",
        },
      ],
      applicationCategory: "UtilitiesApplication",
    },
  },
];

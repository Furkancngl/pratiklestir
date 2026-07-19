import type { ComponentType } from "react";
import {
  AverageIcon,
  CompressIcon,
  CreditCardIcon,
  CropIcon,
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
  ResizeIcon,
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
        "QR kod (\"Quick Response\" - hızlı yanıt), 1994'te Japon otomotiv endüstrisinde parça takibi için geliştirilmiş, günümüzde kameralı hemen her telefonun bir saniyede okuyabildiği kare bir matris barkod türüdür. Klasik çizgi barkodlardan farklı olarak hem yatay hem dikey eksende veri taşıdığı için tek bir karede çok daha fazla bilgi (bağlantı, düz metin, wifi şifresi, iletişim bilgisi) sığdırabilir.",
        "Günlük hayatta en sık restoran masalarındaki temassız menülerde, ürün ambalajlarının üzerindeki kullanım kılavuzu linklerinde, etkinlik giriş biletlerinde ve kartvizitlerin köşesine eklenen iletişim kodlarında karşınıza çıkar. Bir işletme sahibiyseniz menünüzü her güncellediğinizde yeniden bastırma maliyetinden kurtulmak, bir etkinlik düzenliyorsanız katılımcıyı kağıda değil doğrudan bir kayıt linkine yönlendirmek için pratik bir çözümdür.",
        "Bu araç girdiğiniz metni veya bağlantıyı doğrudan tarayıcınızda, açık kaynaklı bir kütüphaneyle QR koda çevirir; herhangi bir sunucuya veri gönderilmez, oluşturma anında tamamlanır ve sonucu PNG dosyası olarak indirirsiniz.",
        "Burada ürettiğiniz kodlar statiktir - yani girdiğiniz metin doğrudan kodun içine gömülür. Bazı ücretli servisler bunun yerine \"dinamik QR\" sunar: kod aslında kısa bir yönlendirme linkine işaret eder ve arkasındaki hedefi sonradan değiştirebilirsiniz, ama bu durumda o servisin sunucusuna bağımlı kalırsınız ve genelde aylık ücret ödersiniz. Menü linki ya da wifi şifresi gibi nadiren değişen bir hedef için statik kod hem yeterlidir hem de tamamen sizin kontrolünüzdedir - üçüncü bir servise bağımlı olmadan süresiz çalışır.",
        "QR kodlar Reed-Solomon hata düzeltme algoritması kullanır; bu sayede kodun bir kısmı lekelenir, buruşur ya da hafifçe yırtılırsa bile geri kalan kısımdan içerik yeniden okunabilir. Bu dayanıklılık, onları baskı materyallerinde bu kadar yaygın hale getiren nedenlerden biridir.",
        "Bastıracağınız yüzeye göre boyut önemlidir: kartvizit gibi küçük bir alanda en az 2x2 cm, bir vitrin camı veya afişte en az 5x5 cm önerilir - kod küçüldükçe telefonun okuyabileceği mesafe de kısalır.",
        "Misafirlerinize wifi şifresini sesli söylemek ya da bir kağıda yazmak yerine `WIFI:S:AğAdınız;T:WPA;P:Şifreniz;;` formatında bir metin girip QR koda çevirirseniz, telefon kamerasıyla tek okutuşta ağa bağlanmalarını sağlayabilirsiniz.",
      ],
      howTo: [
        "QR koda dönüştürmek istediğiniz metni, bağlantıyı veya yukarıdaki wifi formatını giriş alanına yazın.",
        "\"Oluştur\" butonuna tıklayın; kodunuz anında ekranda belirir, herhangi bir işlem süresi beklemezsiniz.",
        "Kodu telefonunuzun kamerasıyla test ederek doğru içeriğe yönlendirdiğinden emin olun.",
        "\"PNG olarak indir\" ile sonucu cihazınıza kaydedin.",
        "İndirdiğiniz görseli kartvizit, afiş, menü veya dijital paylaşımınıza ekleyin; kullanım alanına göre yeterli boyutta bastırmayı unutmayın.",
      ],
      advantages: [
        "Kayıt veya üyelik olmadan, saniyeler içinde kullanılır.",
        "QR kod tamamen tarayıcınızda oluşturulur; girdiğiniz metin hiçbir sunucuya gönderilmez veya kaydedilmez.",
        "Statik kod ürettiği için üçüncü bir servise bağımlı kalmaz, süresiz ve ücretsiz çalışmaya devam eder.",
        "Yüksek çözünürlüklü PNG çıktısı hem ekranda hem baskıda net görünür.",
        "Wifi paylaşımı, iletişim bilgisi, bağlantı gibi farklı içerik türlerini destekler.",
        "Tamamen ücretsizdir, günlük veya aylık kullanım sınırı yoktur.",
      ],
      faq: [
        {
          question: "Oluşturduğum QR kodun kullanım süresi var mı?",
          answer:
            "Hayır. QR kod, içine kodladığınız metni veya linki temsil eden statik bir görseldir; süresi dolmaz. Yönlendirdiği link veya içerik değişmediği sürece kalıcı olarak çalışır.",
        },
        {
          question: "Statik ve dinamik QR kod arasındaki fark nedir?",
          answer:
            "Statik kodda girdiğiniz içerik doğrudan kodun içine gömülür ve asla değişmez - bu aracın ürettiği tür budur. Dinamik kodda ise kod bir yönlendirme linkine işaret eder, hedefi sonradan değiştirebilirsiniz ama genelde ücretli bir servise bağımlı kalırsınız.",
        },
        {
          question: "Wifi şifremi QR kod olarak paylaşabilir miyim?",
          answer:
            "Evet. \"WIFI:S:AğAdınız;T:WPA;P:Şifreniz;;\" formatında bir metin girip QR koda çevirirseniz, çoğu telefon kamerayla okuttuğunda otomatik olarak ağa bağlanma seçeneği sunar.",
        },
        {
          question: "QR kodun ortasına logo ekleyebilir miyim?",
          answer:
            "Şu an bu özellik desteklenmiyor; araç sade, yüksek kontrastlı bir QR kod üretir. Logo eklemek isterseniz indirdiğiniz PNG'yi bir görsel düzenleme aracında kodun okunabilirliğini bozmayacak şekilde düzenlemeniz gerekir.",
        },
        {
          question: "Kartvizite veya menüye bastıracağım kod için hangi boyutu seçmeliyim?",
          answer:
            "Kartvizit gibi elle yakından okutulacak küçük alanlarda en az 2x2 cm, vitrin veya afiş gibi uzaktan okutulacak yerlerde en az 5x5 cm boyut önerilir.",
        },
        {
          question: "Kodum hasar görürse (leke, buruşma) yine de okunur mu?",
          answer:
            "Çoğu zaman evet. QR kodlar Reed-Solomon hata düzeltme algoritması sayesinde kodun bir kısmı bozulsa bile kalan kısımdan içeriği yeniden oluşturabilir.",
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
        "İş başvurusunda bulunurken CV'nizi, ön yazınızı ve diplomanızı ayrı ayrı üç dosya olarak göndermek yerine tek bir PDF'te toplamak, hem sizi düzenli gösterir hem de karşı tarafın işini kolaylaştırır. Aynı ihtiyaç muhasebede fatura gruplarını, hukuk bürolarında sözleşme eklerini, okulda ödev ve rapor bölümlerini tek dosyada birleştirirken de karşınıza çıkar.",
        "Bu araç, yüklediğiniz PDF dosyalarını belirlediğiniz sırayla tek bir dosyada toplar. Her dosyanın sayfa sayısını listede görür, yukarı/aşağı oklarla sırasını değiştirir, gerekirse listeden çıkarırsınız - birleştirme tamamlanana kadar hiçbir değişiklik kalıcı değildir.",
        "Birleştirme işlemi pdf-lib kütüphanesiyle tarayıcınızda gerçekleşir: her dosyanın sayfaları tek tek okunup yeni bir belgeye kopyalanır, orijinal dosyalarınıza hiçbir şekilde dokunulmaz. Hiçbir dosya sunucuya yüklenmez.",
        "Örneğin bir kira sözleşmesine ek olarak kimlik fotokopisi, gelir belgesi ve kefil bilgilerini tek dosyada sunmanız gerektiğinde, her belgeyi ayrı ayrı taratıp sıraya koyduktan sonra bu araçla tek bir PDF'te birleştirebilir, karşı tarafa tek dosya göndererek işini kolaylaştırabilirsiniz.",
        "Bir tez veya uzun rapor hazırlıyorsanız her bölümü ayrı bir dosyada yazıp en son tek bir PDF'te birleştirmek, dosya yönetimini kolaylaştırır: kapak sayfası, içindekiler, her bölüm ve kaynakça ayrı ayrı hazırlanıp son adımda tek bir sırayla birleştirilebilir. Bir bölümde düzeltme yaptığınızda yalnızca o bölümün dosyasını güncelleyip tüm belgeyi yeniden birleştirmeniz yeterlidir.",
        "Birden fazla kaynaktan gelen taranmış belgeleri (örneğin farklı kişilerin imzaladığı sayfaları) tek bir sözleşme dosyasında toplarken de aynı mantık işler: her taraf kendi sayfasını ayrı ayrı gönderir, siz de bunları doğru sırayla tek dosyada birleştirip resmi makama veya karşı tarafa tek seferde iletirsiniz.",
        "Free planda dosya başına en fazla 50 MB, Pro planda 500 MB büyüklüğünde PDF'ler yükleyebilirsiniz; birleştirebileceğiniz dosya sayısında sabit bir sınır yoktur, pratik sınır tarayıcınızın belleğidir. Çok sayıda büyük dosyayı aynı anda birleştirirken işlem birkaç saniye sürebilir, bu normaldir.",
      ],
      howTo: [
        "Birleştirmek istediğiniz PDF dosyalarını sürükleyip bırakın veya seçin.",
        "Listede her dosyanın sayfa sayısını kontrol edin, eksik veya yanlış dosya varsa kaldırın.",
        "Yukarı/aşağı oklarla dosyaların birleştirme sırasını istediğiniz gibi düzenleyin.",
        "\"Birleştir\" butonuna tıklayarak tüm dosyaları tek bir PDF'te toplayın.",
        "Sonucu \"PDF olarak indir\" ile cihazınıza kaydedin ve tek dosya olarak paylaşın.",
      ],
      advantages: [
        "Dosya sırasını sürükleme yerine tek tıkla yukarı/aşağı taşıyarak düzenlersiniz.",
        "Aynı anda birden fazla PDF dosyası yükleyip tek seferde birleştirebilirsiniz.",
        "Orijinal dosyalarınız değişmez, yalnızca yeni birleşik dosya oluşturulur.",
        "Yükleme veya bulut aktarımı olmadan tamamen tarayıcınızda çalışır.",
        "Free planda 50 MB'a, Pro planda 500 MB'a kadar dosya boyutu desteklenir.",
        "Başvuru, sözleşme veya rapor gibi çok parçalı belgeleri tek dosyada teslim etmenizi sağlar.",
      ],
      faq: [
        {
          question: "Birleştirdiğim dosyaların sırasını değiştirebilir miyim?",
          answer:
            "Evet. Dosyayı yükledikten sonra listedeki yukarı ve aşağı taşıma butonlarıyla sırasını dilediğiniz gibi ayarlayabilirsiniz.",
        },
        {
          question: "İş başvurusu için CV, ön yazı ve diplomamı nasıl tek dosyada toplarım?",
          answer:
            "Üç dosyayı da yükleyin, ok butonlarıyla istediğiniz sırayı (örneğin önce ön yazı, sonra CV, en son diploma) verin ve \"Birleştir\"e tıklayın; sonuç tek bir PDF olarak iner.",
        },
        {
          question: "Kaç PDF dosyasını birden birleştirebilirim?",
          answer:
            "Belirli bir dosya sayısı sınırı yoktur; pratik sınır, tarayıcınızın ve cihazınızın belleğiyle ilgilidir. Çok sayıda büyük dosyada işlem biraz daha uzun sürebilir.",
        },
        {
          question: "Dosya başına boyut sınırı nedir?",
          answer:
            "Free planda dosya başına en fazla 50 MB, Pro planda 500 MB yükleyebilirsiniz.",
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
        {
          question: "Birleştirilen dosyanın sayfa sayısı ve içeriği değişir mi?",
          answer:
            "Hayır, her kaynak dosyanın tüm sayfaları olduğu gibi, sırayla yeni belgeye kopyalanır; içerik veya kalite kaybı olmaz.",
        },
        {
          question: "Tez veya rapor gibi çok bölümlü bir belgeyi birleştirmek için önerini var mı?",
          answer:
            "Her bölümü ayrı dosyada tutup yalnızca son adımda birleştirmenizi öneririz; böylece bir bölümde düzeltme yaptığınızda yalnızca o dosyayı güncelleyip belgeyi yeniden birleştirmeniz yeterli olur.",
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
        "Trendyol, Hepsiburada veya Amazon gibi pazar yerlerine ürün eklerken çoğu platform düz, temiz bir arka plan bekler; dağınık bir masada veya evin bir köşesinde çekilmiş fotoğraflar hem onay sürecinde reddedilebilir hem de vitrinde amatör görünür. Aynı ihtiyaç LinkedIn profil fotoğrafında, sunum hazırlarken bir ürün görselini slayta oturturken veya sosyal medya için tasarım yaparken de karşınıza çıkar.",
        "Normalde bu işlem Photoshop gibi bir düzenleme programında elle seçim yapmayı gerektirir. Bu araç bunun yerine tarayıcınızda çalışan bir yapay zeka modeli kullanarak ürünü ya da kişiyi arka plandan otomatik olarak ayırır; siz yalnızca fotoğrafı yükler, sonucu bekler ve indirirsiniz.",
        "İşlem tamamen tarayıcınızda gerçekleşir - fotoğrafınız hiçbir sunucuya yüklenmez. Model dosyaları ilk kullanımda tarayıcınıza indirilir (bu yüzden ilk işlem birkaç saniye daha uzun sürer), sonraki kullanımlarda tarayıcı önbelleğinden okunduğu için işlem belirgin biçimde hızlanır.",
        "Sonuç, arka planın yerini şeffaflığın aldığı bir PNG dosyasıdır. Bazı pazar yerleri şeffaf PNG'yi doğrudan kabul ederken bazıları düz beyaz arka plan şart koşar - bu durumda şeffaf sonucu bir görsel düzenleme aracında beyaz bir zemine yerleştirmeniz yeterlidir.",
        "En iyi sonucu almak için ürünü düz, kontrastlı bir zemin (beyaz, gri veya tek renk) üzerinde çekmenizi öneririz; bu, yapay zekanın kenarları daha net ayırt etmesini sağlar. Saydam cam, ince tel veya saç gibi çok ince detaylarda kenarlarda küçük kusurlar görülebilir.",
        "Free planda en fazla 50 MB, Pro planda 500 MB büyüklüğünde fotoğraf yükleyebilirsiniz; araç şu an tek seferde bir fotoğraf işleyecek şekilde tasarlandı, birden fazla ürün fotoğrafınız varsa her birini sırayla yüklemeniz gerekir.",
        "Sonucu indirdikten sonra tasarım araçlarında (sunum, sosyal medya gönderisi, ürün kataloğu) doğrudan kullanabilirsiniz - şeffaf zemin sayesinde görseli istediğiniz renkte bir arka planın veya başka bir görselin üzerine sorunsuzca yerleştirebilirsiniz.",
        "Profil fotoğrafı için kullanıyorsanız, arka planı kaldırdıktan sonra LinkedIn'in yuvarlak kırpma alanına veya bir sosyal medya platformunun kare/dairesel çerçevesine göre görseli yeniden konumlandırmanız gerekebilir; araç yalnızca arka planı kaldırır, kırpma ve konumlandırmayı platformun kendi yükleme ekranında yapmanız gerekir.",
      ],
      howTo: [
        "Arka planı kaldırılacak fotoğrafı sürükleyip bırakın veya seçin (PNG, JPG veya WebP).",
        "\"Arka Planı Kaldır\" butonuna tıklayın; ilk kullanımda model indirilirken bir ilerleme göstergesi görürsünüz.",
        "Orijinal ve arka planı silinmiş halini yan yana karşılaştırın.",
        "Sonucu şeffaf arka planlı PNG olarak indirin.",
        "Platformunuz düz beyaz arka plan istiyorsa, indirdiğiniz şeffaf PNG'yi bir düzenleme aracında beyaz zemine yerleştirin.",
      ],
      advantages: [
        "Elle seçim yapmadan, yapay zeka ile otomatik arka plan tespiti sağlar.",
        "Sonuç şeffaf arka planlı PNG olarak indirilir, tasarım araçlarında doğrudan kullanılabilir.",
        "PNG, JPG ve WebP gibi yaygın formatları destekler.",
        "Fotoğrafınız cihazınızdan çıkmadan, tarayıcı içinde işlenir.",
        "Free planda 50 MB'a, Pro planda 500 MB'a kadar dosya boyutu desteklenir.",
        "Model tarayıcınızda önbelleğe alınır, ilk kullanımdan sonraki işlemler belirgin şekilde hızlanır.",
      ],
      faq: [
        {
          question: "Hangi görsel formatlarını yükleyebilirim?",
          answer: "PNG, JPG ve WebP formatındaki fotoğrafları yükleyebilirsiniz.",
        },
        {
          question: "Sonuç dosyası Trendyol veya Hepsiburada'ya doğrudan yüklenebilir mi?",
          answer:
            "Şeffaf PNG çoğu pazar yerinde kabul edilir, ancak bazı platformlar düz beyaz arka plan şart koşar. Bu durumda şeffaf sonucu bir düzenleme aracında beyaz zemine yerleştirmeniz gerekebilir.",
        },
        {
          question: "İlk kullanımda neden daha yavaş çalışıyor?",
          answer:
            "Arka plan kaldırma modeli ilk çalıştırmada tarayıcınıza indirilir; bu tek seferlik indirme işlemi birkaç saniye sürebilir. Sonraki kullanımlarda işlem belirgin şekilde hızlanır.",
        },
        {
          question: "Birden fazla ürün fotoğrafını aynı anda işleyebilir miyim?",
          answer:
            "Hayır, araç şu an tek seferde bir görsel işliyor. Birden fazla ürününüz varsa her birini sırayla yükleyip indirmeniz gerekir.",
        },
        {
          question: "Parlak, saydam veya ince detaylı ürünlerde (takı, cam, kumaş) sonuç ne kadar iyi olur?",
          answer:
            "Yapay zeka modeli çoğu üründe iyi sonuç verir, ancak saydam cam, ince tel veya saç gibi çok ince detaylarda kenarlarda küçük kusurlar görülebilir. Düz ve kontrastlı bir zeminde çekilen fotoğraflar bu durumlarda daha iyi sonuç verir.",
        },
        {
          question: "Dosya boyutu sınırı nedir?",
          answer: "Free planda en fazla 50 MB, Pro planda 500 MB büyüklüğünde fotoğraf yükleyebilirsiniz.",
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
        "Büyüyen bir PDF dosyası genelde üç yerde sorun çıkarır: e-posta ekleri, online başvuru formları ve bulut depolama kotanız. Gmail ve Outlook gibi yaygın servisler tek bir e-postada genelde 25 MB civarında bir ek sınırı uygular; bu sınırı aşan bir dosya sessizce reddedilir ve çoğu zaman bunu ancak alıcı size dönüş yaptığında fark edersiniz.",
        "Üniversite başvuru sistemleri, e-Devlet formları ve iş başvuru portalları ise çok daha katı, kimi zaman 200 KB ile 2 MB arasında değişen limitler koyar. Telefonla taratılan bir belge - özellikle renkli ve yüksek çözünürlükle taranmışsa - bu sınırları kolaylıkla aşar.",
        "Bu araç, PDF'inizin iç yapısındaki gereksiz veriyi (kullanılmayan nesneler, tekrarlanan veri akışları, eski düzenleme geçmişinden kalan artıklar) temizleyerek dosya boyutunu küçültür. İşlem tamamen tarayıcınızda çalışır; dosyanız hiçbir sunucuya yüklenmez.",
        "Bilmeniz gereken önemli bir sınır var: araç, PDF içindeki görselleri yeniden sıkıştırmaz, yalnızca dosyanın iç yapısını optimize eder. Bu yüzden metin ağırlıklı bir sözleşme veya rapor belirgin şekilde küçülürken, yüksek çözünürlüklü taranmış sayfalardan oluşan bir belgede küçülme oranı sınırlı kalabilir. Böyle durumlarda sayfaları önce Görsel Sıkıştırıcı ile küçültüp yeniden PDF'e dönüştürmek çok daha etkili bir sonuç verir.",
        "Free planda tek seferde en fazla 50 MB, Pro planda 500 MB büyüklüğünde dosyalar yükleyebilirsiniz; birden fazla dosyayı aynı anda seçip tek işlemde sıkıştırabilir, her biri için elde edilen küçülme yüzdesini anında görebilirsiniz.",
        "Sıkıştırma sonrası belgenizin içeriği, sayfa sayısı ve metin kalitesi hiç değişmez - yalnızca dosyanın taşıdığı gereksiz teknik veri azalır, bu yüzden sonuç aynı belgenin daha hafif bir kopyasıdır.",
        "Zaten bir kez sıkıştırılmış veya modern bir PDF oluşturucuyla (ör. doğrudan Word'den \"PDF olarak kaydet\" ile) üretilmiş dosyalarda küçülme oranı düşük çıkabilir - bu bir hata değildir, dosyada zaten temizlenecek gereksiz veri kalmamış demektir.",
      ],
      howTo: [
        "Sıkıştırmak istediğiniz PDF dosyalarını sürükleyip bırakın veya seçin - birden fazla dosyayı aynı anda ekleyebilirsiniz.",
        "\"Sıkıştır\" butonuna tıklayarak tüm dosyaları tek seferde işleyin.",
        "Her dosya için orijinal boyut, sıkıştırılmış boyut ve küçülme yüzdesini karşılaştırın.",
        "Sonuçları tek tek \"İndir\" ikonuyla cihazınıza kaydedin.",
        "Hedef sisteminizin (e-posta, başvuru formu) boyut sınırını aştıysanız ve belge taranmış sayfalar içeriyorsa, sayfaları Görsel Sıkıştırıcı ile ayrıca küçültmeyi deneyin.",
      ],
      advantages: [
        "Birden fazla PDF dosyasını tek seferde sıkıştırabilirsiniz.",
        "Her dosya için elde edilen küçülme yüzdesini anında görürsünüz.",
        "Belge içeriği ve görsel kalitesi değişmez, yalnızca gereksiz veri temizlenir.",
        "Yükleme gerektirmeden tamamen tarayıcınızda çalışır.",
        "Free planda 50 MB'a, Pro planda 500 MB'a kadar dosya boyutu desteklenir.",
        "Dosya sayısında bir sınır yoktur; pratik sınır yalnızca cihazınızın belleğidir.",
      ],
      faq: [
        {
          question: "Her PDF dosyası aynı oranda küçülür mü?",
          answer:
            "Hayır. Sıkıştırma oranı dosyanın yapısına göre değişir; zaten optimize edilmiş bir PDF'te boyut çok az değişebilir veya hiç değişmeyebilir.",
        },
        {
          question: "Taranmış (scan) bir PDF neden yeterince küçülmüyor?",
          answer:
            "Araç görselleri yeniden sıkıştırmaz, yalnızca dosya yapısını optimize eder. Belgeniz esas olarak taranmış sayfalardan oluşuyorsa, sayfaları önce Görsel Sıkıştırıcı ile küçültüp yeniden PDF'e dönüştürmeniz çok daha etkili sonuç verir.",
        },
        {
          question: "E-posta eki veya başvuru formu boyut sınırını aşıyorum, ne yapmalıyım?",
          answer:
            "Önce dosyayı bu araçtan geçirin. Sonuç hâlâ sınırın üzerindeyse ve belge taranmış sayfalar içeriyorsa, sayfaları görsele çevirip Görsel Sıkıştırıcı'nın \"Maksimum Sıkıştırma\" seçeneğiyle küçülttükten sonra yeniden PDF'e dönüştürmeyi deneyin.",
        },
        {
          question: "Sıkıştırma sonrası görsel kalitesi düşer mi?",
          answer:
            "Hayır. Araç, PDF içindeki görselleri yeniden sıkıştırmaz; yalnızca dosya yapısındaki gereksiz verileri temizler, bu yüzden içerik kalitesi korunur.",
        },
        {
          question: "Aynı anda kaç PDF dosyası sıkıştırabilirim, boyut sınırı nedir?",
          answer:
            "İstediğiniz kadar dosyayı aynı anda yükleyip tek seferde sıkıştırabilirsiniz. Dosya başına boyut sınırı Free planda 50 MB, Pro planda 500 MB'tır.",
        },
        {
          question: "Şifreli veya bozuk bir PDF'i sıkıştırabilir miyim?",
          answer:
            "Şifre korumalı veya bozuk PDF dosyaları tarayıcı tarafından okunamadığı için işlenemez; bu durumda ilgili dosya için bir hata mesajı gösterilir.",
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
    name: "PDF Böl",
    href: "/pdf-bol",
    description: "PDF'ten seçtiğiniz sayfa aralığını ayrı bir dosya olarak çıkarır.",
    available: true,
    accentClassName: "bg-teal-500",
    icon: DocumentIcon,
    group: "PDF",
    shortLabel: "Böl",
    seo: {
      metaTitle: "PDF Böl | Ücretsiz Online PDF Sayfa Ayırma Aracı | Pratikleştir",
      metaDescription:
        "PDF dosyanızdan istediğiniz sayfa aralığını ayrı bir PDF olarak çıkarın. Kayıt gerekmez, işlem tamamen tarayıcınızda ve ücretsiz yapılır.",
      about: [
        "Uzun bir sözleşmenin yalnızca imza sayfasını, kalın bir raporun tek bir bölümünü ya da bir kitabın belirli sayfalarını ayrı bir dosya olarak paylaşmanız gerektiğinde, tüm belgeyi göndermek yerine yalnızca ilgili sayfaları çıkarmak hem daha profesyonel görünür hem de karşı tarafın işini kolaylaştırır.",
        "Bu araç, yüklediğiniz PDF'in sayfa sayısını okuyup küçük önizlemelerini gösterir; başlangıç ve bitiş sayfasını seçtiğinizde (yazarak veya önizlemeye tıklayarak) yalnızca o aralık yeni bir PDF olarak oluşturulur. İşlem tamamen tarayıcınızda gerçekleşir, orijinal dosyanız değişmeden kalır.",
      ],
      howTo: [
        "PDF dosyanızı sürükleyip bırakın veya seçin.",
        "Aşağıda beliren sayfa önizlemelerinden başlangıç ve bitiş sayfasına tıklayın veya sayı kutularına yazın.",
        "\"Böl\" butonuna tıklayın; yalnızca seçtiğiniz aralık yeni bir PDF olarak oluşturulur.",
        "Sonucu \"PDF olarak indir\" ile cihazınıza kaydedin.",
      ],
      advantages: [
        "Sayfa aralığını hem yazarak hem önizlemeye tıklayarak seçebilirsiniz.",
        "Orijinal dosyanız değişmeden kalır, yalnızca seçilen aralık yeni bir dosyada toplanır.",
        "Yükleme veya bulut aktarımı olmadan tamamen tarayıcınızda çalışır.",
        "Sayfa kalitesi ve içeriği hiç değişmez, yalnızca istenmeyen sayfalar dışarıda bırakılır.",
      ],
      faq: [
        {
          question: "Birden fazla ayrı aralığı tek seferde çıkarabilir miyim?",
          answer:
            "Şu an tek seferde tek bir aralık çıkarabilirsiniz. Farklı bir aralık daha çıkarmak isterseniz aynı dosyada yeni bir başlangıç/bitiş sayfası seçip \"Böl\"e tekrar tıklamanız yeterlidir.",
        },
        {
          question: "Seçtiğim aralık dışındaki sayfalara ne olur?",
          answer:
            "Yeni oluşan dosyaya dahil edilmez; orijinal dosyanız hiçbir şekilde değişmez veya silinmez, yalnızca seçtiğiniz aralığı içeren ayrı bir kopya oluşturulur.",
        },
        {
          question: "Sayfa önizlemeleri neden birkaç saniye sonra beliriyor?",
          answer:
            "Her sayfa, dosyanızı yükledikten hemen sonra tarayıcınızda tek tek render edilir; büyük veya çok sayfalı PDF'lerde önizlemelerin tamamlanması birkaç saniye sürebilir.",
        },
        {
          question: "Dosyam bir sunucuya yükleniyor mu?",
          answer:
            "Hayır. Hem önizleme hem bölme işlemi tamamen tarayıcınızda yapılır, dosyanız cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "PDF Döndür",
    href: "/pdf-dondur",
    description: "PDF sayfalarını seçip 90, 180 veya 270 derece döndürür.",
    available: true,
    accentClassName: "bg-indigo-500",
    icon: DocumentIcon,
    group: "PDF",
    shortLabel: "Döndür",
    seo: {
      metaTitle: "PDF Döndür | Ücretsiz Online PDF Sayfa Döndürme Aracı | Pratikleştir",
      metaDescription:
        "Yanlış yönde taranmış PDF sayfalarını 90, 180 veya 270 derece döndürün. Kayıt gerekmez, işlem tamamen tarayıcınızda ve ücretsiz yapılır.",
      about: [
        "Bir belgeyi tararken yanlışlıkla ters veya yan çevirmek yaygın bir sorundur; sonuçta ekranda döndürerek okunabilen ama yazdırıldığında veya bir sisteme yüklendiğinde hep yan duran bir PDF ortaya çıkar. Bu araç, sayfaları kalıcı olarak doğru yöne çevirmenizi sağlar.",
        "Yüklediğiniz PDF'in her sayfasının küçük bir önizlemesini görür, düzeltmek istediğiniz sayfa(lar)ı seçip 90, 180 veya 270 derece döndürme yönünü belirtirsiniz; önizleme seçtiğiniz döndürmeyi anında yansıtır.",
      ],
      howTo: [
        "PDF dosyanızı sürükleyip bırakın veya seçin.",
        "Önizlemeden döndürmek istediğiniz sayfa(lar)a tıklayarak seçin (\"Tümünü Seç\" ile hepsini birden seçebilirsiniz).",
        "90°, 180° veya 270° butonlarından istediğiniz yönü seçin; önizleme anında güncellenir.",
        "\"Döndür\" butonuna tıklayıp sonucu indirin.",
      ],
      advantages: [
        "Sayfaları tek tek veya toplu olarak seçip döndürebilirsiniz.",
        "Seçilen döndürme açısını uygulamadan önce önizlemede görürsünüz.",
        "Yalnızca seçtiğiniz sayfalar döner, diğer sayfalar olduğu gibi kalır.",
        "Yükleme gerektirmeden tamamen tarayıcınızda çalışır.",
      ],
      faq: [
        {
          question: "Yalnızca bazı sayfaları, diğerlerini olduğu gibi bırakarak döndürebilir miyim?",
          answer:
            "Evet. Önizlemeden yalnızca döndürmek istediğiniz sayfaları seçersiniz; seçilmeyen sayfalar hiç değişmeden kalır.",
        },
        {
          question: "Yanlış yön seçersem geri alabilir miyim?",
          answer:
            "Henüz indirmediyseniz sayfayı tekrar seçip istediğiniz açıyla yeniden döndürebilirsiniz; döndürme açıları birikimli uygulanır (örneğin 90°'ye tekrar tıklamak toplamda 180° yapar).",
        },
        {
          question: "Taranmış (yatık) sayfalarımı düzeltmek için hangi açıyı seçmeliyim?",
          answer:
            "Önizlemede sayfanın hangi yönde durduğuna bakarak 90°, 180° veya 270° seçeneklerinden doğru sonucu veren açıyı deneyebilirsiniz; önizleme her tıklamada anında güncellenir.",
        },
        {
          question: "Dosyam bir sunucuya yükleniyor mu?",
          answer: "Hayır. Önizleme ve döndürme işlemi tamamen tarayıcınızda yapılır.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "PDF Sayfa Sil",
    href: "/pdf-sayfa-sil",
    description: "Önizlemeden seçtiğiniz PDF sayfalarını kalıcı olarak siler.",
    available: true,
    accentClassName: "bg-red-500",
    icon: DocumentIcon,
    group: "PDF",
    shortLabel: "Sayfa Sil",
    seo: {
      metaTitle: "PDF Sayfa Sil | Ücretsiz Online PDF Sayfa Silme Aracı | Pratikleştir",
      metaDescription:
        "PDF'inizdeki boş, hatalı veya gereksiz sayfaları önizlemeden seçip silin. Kayıt gerekmez, işlem tamamen tarayıcınızda ve ücretsiz yapılır.",
      about: [
        "Taranmış bir belgenin arasına karışan boş bir sayfa, eski bir kapak sayfası veya artık gerekmeyen bir ek genellikle tüm PDF'i yeniden oluşturmadan çıkarılamaz. Bu araç, sayfaları tek tek görüp istemediklerinizi seçerek kalan sayfalardan yeni ve temiz bir PDF oluşturmanızı sağlar.",
        "Yüklediğiniz PDF'in her sayfasının küçük bir önizlemesi gösterilir; silmek istediğiniz sayfa(lar)a tıklamanız yeterlidir, geri kalan sayfalar sırası korunarak yeni bir dosyada birleştirilir.",
      ],
      howTo: [
        "PDF dosyanızı sürükleyip bırakın veya seçin.",
        "Önizlemeden silmek istediğiniz sayfa(lar)a tıklayarak seçin.",
        "\"Sil\" butonuna tıklayın; seçilen sayfalar dışındaki tüm sayfalar yeni bir PDF'te toplanır.",
        "Sonucu \"PDF olarak indir\" ile cihazınıza kaydedin.",
      ],
      advantages: [
        "Hangi sayfayı sildiğinizi önizlemeden görerek karar verirsiniz, sayfa numarası ezberlemeniz gerekmez.",
        "Kalan sayfaların sırası ve içeriği hiç değişmez.",
        "Birden fazla sayfayı tek seferde seçip silebilirsiniz.",
        "Yükleme gerektirmeden tamamen tarayıcınızda çalışır.",
      ],
      faq: [
        {
          question: "Tüm sayfaları silebilir miyim?",
          answer:
            "Hayır, PDF'te en az bir sayfa kalması gerekir; tüm sayfaları seçtiğinizde araç bir uyarı gösterir ve işlemi tamamlamaz.",
        },
        {
          question: "Sildiğim sayfaları geri getirebilir miyim?",
          answer:
            "Sonucu indirmeden önce seçimi \"Seçimi Temizle\" ile sıfırlayabilirsiniz; indirdikten sonra ise orijinal dosyanızı tekrar yükleyip yeniden seçim yapmanız gerekir (orijinal dosyanız hiçbir zaman değişmez).",
        },
        {
          question: "Sayfa numaraları silme sonrası nasıl olur?",
          answer:
            "Kalan sayfalar, aralarındaki sıra korunarak 1'den başlayacak şekilde yeniden numaralanmış bir PDF'te birleştirilir.",
        },
        {
          question: "Dosyam bir sunucuya yükleniyor mu?",
          answer: "Hayır. Önizleme ve silme işlemi tamamen tarayıcınızda yapılır.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "PDF → JPG",
    href: "/pdf-jpg",
    description: "PDF'in her sayfasını ayrı bir JPG görsel olarak dışa aktarır.",
    available: true,
    accentClassName: "bg-fuchsia-500",
    icon: DocumentIcon,
    group: "PDF",
    shortLabel: "JPG'ye Çevir",
    seo: {
      metaTitle: "PDF'ten JPG'ye Çevir | Ücretsiz Online Dönüştürme Aracı | Pratikleştir",
      metaDescription:
        "PDF'inizin her sayfasını ayrı bir JPG görsele dönüştürün, tek tek veya zip olarak toplu indirin. Kayıt gerekmez, tamamen tarayıcınızda çalışır.",
      about: [
        "Bir sunuma tek bir sayfa eklemeniz, bir belgeyi sosyal medyada paylaşmanız veya PDF açamayan bir sisteme görsel yüklemeniz gerektiğinde, PDF'in sayfalarını görsele çevirmek pratik bir çözümdür.",
        "Bu araç, yüklediğiniz PDF'in her sayfasını tarayıcınızda yüksek çözünürlüklü bir JPG görsele render eder; sonuçları tek tek veya \"Tümünü İndir (.zip)\" ile toplu olarak indirebilirsiniz.",
      ],
      howTo: [
        "PDF dosyanızı sürükleyip bırakın veya seçin.",
        "\"JPG'ye Dönüştür\" butonuna tıklayın; her sayfa sırayla görsele render edilir.",
        "Sonuçları tek tek indirin veya birden fazla sayfa varsa \"Tümünü İndir (.zip)\" ile toplu alın.",
      ],
      advantages: [
        "Her sayfa yüksek çözünürlüklü, ayrı bir JPG dosyası olarak üretilir.",
        "Birden fazla sayfayı tek seferde işleyip zip olarak indirebilirsiniz.",
        "Dönüştürme tamamen tarayıcınızda yapılır, dosyanız sunucuya yüklenmez.",
        "Ek bir PDF görüntüleyici veya dönüştürme programına ihtiyaç duymazsınız.",
      ],
      faq: [
        {
          question: "Çıkan görsellerin kalitesi nasıl belirleniyor?",
          answer:
            "Sayfalar yüksek çözünürlüklü bir ölçekte render edilir, bu sayede metin ve görseller net görünür; ekstra bir kalite ayarı yapmanız gerekmez.",
        },
        {
          question: "Çok sayfalı bir PDF'i dönüştürmek uzun sürer mi?",
          answer:
            "Her sayfa sırayla tarayıcınızda render edildiği için sayfa sayısı arttıkça işlem süresi de artar, ancak çoğu belge için bu birkaç saniyeyi geçmez.",
        },
        {
          question: "Sonuçları tek tek mi indirmem gerekiyor?",
          answer:
            "Birden fazla sayfa varsa \"Tümünü İndir (.zip)\" seçeneğiyle tüm görselleri tek bir zip dosyasında toplu indirebilirsiniz.",
        },
        {
          question: "Dosyam bir sunucuya yükleniyor mu?",
          answer: "Hayır. Dönüştürme işlemi tamamen tarayıcınızda yapılır, PDF'iniz cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "JPG → PDF",
    href: "/jpg-pdf",
    description: "Bir veya birden fazla JPG görselini tek bir PDF'e dönüştürür.",
    available: true,
    accentClassName: "bg-lime-500",
    icon: ImageIcon,
    group: "PDF",
    shortLabel: "PDF'e Çevir",
    seo: {
      metaTitle: "JPG'den PDF'e Çevir | Ücretsiz Online Dönüştürme Aracı | Pratikleştir",
      metaDescription:
        "Bir veya birden fazla JPG görselini sırasını düzenleyerek tek bir PDF dosyasında birleştirin. Kayıt gerekmez, tamamen tarayıcınızda çalışır.",
      about: [
        "Taranmış fatura fotoğraflarını, ürün görsellerini veya el yazısı notların fotoğraflarını tek tek göndermek yerine düzenli tek bir PDF olarak paylaşmak, iş başvurusu, muhasebe veya okul ödevi gibi birçok durumda beklenen formattır.",
        "Bu araç, yüklediğiniz JPG görsellerini belirlediğiniz sırayla, her birini kendi sayfası olacak şekilde tek bir PDF'te birleştirir; işlem tamamen tarayıcınızda gerçekleşir.",
      ],
      howTo: [
        "Dönüştürmek istediğiniz JPG görsellerini sürükleyip bırakın veya seçin.",
        "Yukarı/aşağı oklarla sayfa sırasını istediğiniz gibi düzenleyin.",
        "\"PDF'e Dönüştür\" butonuna tıklayın.",
        "Sonucu \"PDF olarak indir\" ile cihazınıza kaydedin.",
      ],
      advantages: [
        "Birden fazla JPG görselini tek seferde tek bir PDF'te birleştirir.",
        "Sayfa sırasını yukarı/aşağı taşıma butonlarıyla kolayca düzenlersiniz.",
        "Her görsel kendi boyutunda, kalite kaybı olmadan bir sayfaya yerleştirilir.",
        "Yükleme gerektirmeden tamamen tarayıcınızda çalışır.",
      ],
      faq: [
        {
          question: "Görsellerin sırasını nasıl değiştirebilirim?",
          answer:
            "Her görseli yükledikten sonra listedeki yukarı ve aşağı taşıma butonlarıyla PDF'teki sayfa sırasını dilediğiniz gibi ayarlayabilirsiniz.",
        },
        {
          question: "PNG veya diğer görsel formatlarını da yükleyebilir miyim?",
          answer:
            "Bu araç yalnızca JPG/JPEG formatındaki görselleri kabul eder. Farklı bir formatınız varsa önce görseli JPG'ye çevirmeniz gerekir.",
        },
        {
          question: "Sayfa boyutu görsele göre mi ayarlanıyor?",
          answer:
            "Evet, her sayfa kendi görselinin genişlik ve yüksekliğine göre oluşturulur; görseller kırpılmaz veya oranı bozulmaz.",
        },
        {
          question: "Görsellerim bir sunucuya yükleniyor mu?",
          answer: "Hayır. Dönüştürme işlemi tamamen tarayıcınızda yapılır, görselleriniz cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "PDF Kilitle",
    href: "/pdf-kilitle",
    description: "PDF'i belirlediğiniz şifreyle gerçek AES-256 şifrelemesiyle korumaya alır.",
    available: true,
    accentClassName: "bg-slate-600",
    icon: LockIcon,
    group: "PDF",
    shortLabel: "Kilitle",
    seo: {
      metaTitle: "PDF Şifrele | Ücretsiz Online PDF Kilitleme Aracı | Pratikleştir",
      metaDescription:
        "PDF dosyanıza gerçek AES-256 şifrelemesiyle şifre koyun; yalnızca doğru şifreyi bilenler açabilsin. Kayıt gerekmez, tamamen tarayıcınızda çalışır.",
      about: [
        "Bir bordroyu, sözleşmeyi veya kimlik fotokopisini e-posta ile gönderirken içeriğin yalnızca doğru kişi tarafından açılabilmesini istemek makul bir güvenlik ihtiyacıdır. Bu araç, PDF'inize gerçek, sektör standardı AES-256 şifrelemesi uygular.",
        "Bazı online \"PDF kilitleme\" araçları aslında yalnızca görünüşte bir koruma ekler; bu araç ise açık kaynaklı ve yaygın kullanılan qpdf motorunu tarayıcınızda (WebAssembly ile) çalıştırarak gerçek bir şifreleme uygular - şifreyi bilmeyen biri dosyayı hiçbir PDF okuyucuda açamaz.",
      ],
      howTo: [
        "PDF dosyanızı sürükleyip bırakın veya seçin.",
        "Bir şifre belirleyin ve doğrulamak için tekrar girin.",
        "\"Kilitle\" butonuna tıklayın; dosyanız tarayıcınızda şifrelenir.",
        "Şifrelenmiş PDF'i indirin ve şifreyi güvenli bir şekilde saklayın.",
      ],
      advantages: [
        "Gerçek AES-256 şifrelemesi uygular, yüzeysel bir koruma değildir.",
        "Şifreleme tamamen tarayıcınızda çalışır; dosyanız ve şifreniz hiçbir sunucuya gönderilmez.",
        "Şifrelenmiş dosya standart PDF okuyucularda (Adobe Acrobat, tarayıcı vb.) şifre sorularak açılır.",
        "Kayıt olmadan, saniyeler içinde kullanılır.",
      ],
      faq: [
        {
          question: "Şifremi unutursam dosyayı siz açabilir misiniz?",
          answer:
            "Hayır. Şifreleme tarayıcınızda yapılır, şifreniz hiçbir yerde saklanmaz; şifrenizi unutursanız dosyayı kimse (biz dahil) açamaz.",
        },
        {
          question: "Şifrelenmiş dosyayı herkes açabilir mi?",
          answer:
            "Hayır, yalnızca doğru şifreyi girenler açabilir. Standart bir PDF okuyucuyla açmaya çalıştığınızda önce şifre sorulur.",
        },
        {
          question: "Bu gerçek bir şifreleme mi, yoksa sadece görünüşte mi?",
          answer:
            "Gerçek bir şifreleme. Araç, açık kaynaklı ve yaygın kullanılan qpdf motorunun tarayıcı için derlenmiş (WebAssembly) hâlini kullanarak sektör standardı AES-256 şifrelemesi uygular.",
        },
        {
          question: "Dosyam veya şifrem bir sunucuya gönderiliyor mu?",
          answer: "Hayır. Şifreleme işlemi tamamen tarayıcınızda yapılır, hiçbir veri cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "PDF Kilit Kaldır",
    href: "/pdf-kilit-kaldir",
    description: "Şifreyle korunan PDF'in şifresini girip korumasını kaldırır.",
    available: true,
    accentClassName: "bg-emerald-500",
    icon: LockIcon,
    group: "PDF",
    shortLabel: "Kilit Kaldır",
    seo: {
      metaTitle: "PDF Şifre Kaldır | Ücretsiz Online Kilit Kaldırma Aracı | Pratikleştir",
      metaDescription:
        "Şifresini bildiğiniz, korumalı bir PDF'in şifresini kaldırın; tekrar şifre sormadan açılan bir kopyasını indirin. Kayıt gerekmez, tarayıcıda çalışır.",
      about: [
        "Şifresini bildiğiniz ama her açışında yeniden girmek istemediğiniz bir PDF için korumayı kalıcı olarak kaldırmak pratik bir çözümdür - örneğin kendi taradığınız ve şifrelediğiniz bir belgeyi artık paylaşmayacaksanız.",
        "Bu araç, dosyanızın şifresini girmenizi ister ve açık kaynaklı qpdf motorunu tarayıcınızda çalıştırarak korumayı kaldırır; sonuç, şifre sormadan doğrudan açılan normal bir PDF'tir.",
      ],
      howTo: [
        "Şifreyle korunan PDF dosyanızı sürükleyip bırakın veya seçin.",
        "Dosyanın şifresini girin.",
        "\"Kilidi Kaldır\" butonuna tıklayın.",
        "Şifre sormadan açılan yeni dosyayı indirin.",
      ],
      advantages: [
        "Şifreyi bildiğiniz dosyalar için korumayı kalıcı olarak kaldırır.",
        "İşlem tamamen tarayıcınızda çalışır; dosyanız ve şifreniz hiçbir sunucuya gönderilmez.",
        "Yanlış şifre girildiğinde net bir hata mesajı gösterilir.",
        "Kayıt olmadan, saniyeler içinde kullanılır.",
      ],
      faq: [
        {
          question: "Şifresini bilmediğim bir PDF'in kilidini kaldırabilir miyim?",
          answer:
            "Hayır. Bu araç şifreyi kırmaz; yalnızca doğru şifreyi girerek kendi dosyanızın korumasını kaldırmanızı sağlar. Şifreyi bilmiyorsanız işlem başarısız olur.",
        },
        {
          question: "Yanlış şifre girersem ne olur?",
          answer:
            "Araç şifrenin yanlış olduğunu belirten bir hata gösterir ve dosyayı işlemez; doğru şifreyi girip tekrar denemeniz gerekir.",
        },
        {
          question: "Kilidi kaldırılan dosyanın içeriği değişir mi?",
          answer:
            "Hayır, yalnızca şifre koruması kaldırılır; sayfa içeriği, sırası ve kalitesi hiç değişmez.",
        },
        {
          question: "Dosyam veya şifrem bir sunucuya gönderiliyor mu?",
          answer: "Hayır. İşlem tamamen tarayıcınızda yapılır, hiçbir veri cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
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
    description: "Görsellerinizdeki kenar ve detayları keskinleştirerek daha net gösterir.",
    available: true,
    accentClassName: "bg-amber-500",
    icon: FocusIcon,
    group: "Görsel",
    shortLabel: "Netleştir",
    seo: {
      metaTitle: "Görsel Netleştir | Ücretsiz Online Keskinleştirme Aracı | Pratikleştir",
      metaDescription:
        "Görsellerinizdeki kenarları keskinleştirin, detayları belirginleştirin. Netleştirme gücünü ayarlayın, kayıt gerekmeden, tamamen tarayıcınızda.",
      about: [
        "Hafif odak kaymış bir fotoğraf, ekran görüntüsü veya küçük çözünürlükten büyütülmüş bir görsel, kenarları biraz yumuşak/bulanık görünebilir. Bu araç, \"unsharp mask\" adı verilen ve çoğu fotoğraf düzenleme programının (Photoshop, GIMP, Lightroom) \"Keskinleştir/Sharpen\" özelliğinin de temelini oluşturan klasik bir teknikle kenar kontrastını artırarak görseli gözle daha net gösterir.",
        "Önemli bir netlik: bu, kaybolmuş gerçek detayı geri getiren bir yapay zeka modeli değildir - kenarlardaki renk/parlaklık geçişlerinin kontrastını artırarak görseli gözle daha keskin gösteren, onlarca yıldır kullanılan matematiksel bir tekniktir. Görsel zaten çok bulanıksa (örneğin hareket bulanıklığı) bu teknik sınırlı bir iyileşme sağlar; hafif yumuşaklık veya küçük çözünürlükten büyütme sonrası oluşan bulanıklık için en etkilidir.",
        "Teknik olarak araç, görselin hafifçe bulanıklaştırılmış bir kopyasını çıkarır (\"blur\"), bu kopya ile orijinal arasındaki farkı (yüksek frekanslı kenar bilgisini) bulur ve bu farkı seçtiğiniz güçte orijinale geri ekler - kenarlar belirginleşir, düz alanlar olduğu gibi kalır.",
        "Netleştirme gücünü çok yükseğe çekmek, özellikle kenarlarda ince beyaz/koyu \"halo\" çizgileri ve gürültü artışına yol açabilir; çoğu görselde orta seviye bir güç (%100 civarı) doğal görünen bir sonuç verir.",
      ],
      howTo: [
        "Netleştirmek istediğiniz görseli sürükleyip bırakın veya seçin.",
        "Netleştirme gücünü kaydırıcıyla ayarlayın; önizleme değişikliği anında yansıtır.",
        "\"Netleştir\" butonuna tıklayın.",
        "Orijinal ve netleştirilmiş halini yan yana karşılaştırın.",
        "Sonucu indirin.",
      ],
      advantages: [
        "Klasik, kanıtlanmış \"unsharp mask\" tekniğiyle kenar kontrastını artırır.",
        "Netleştirme gücünü kendiniz ayarlayabilir, sonucu önizleyip karşılaştırabilirsiniz.",
        "İşlem tamamen tarayıcınızda yapılır, görseliniz hiçbir sunucuya gönderilmez.",
        "Kayıt gerekmez, ücretsiz kullanılır.",
      ],
      faq: [
        {
          question: "Bu araç yapay zeka ile mi çalışıyor?",
          answer:
            "Hayır. Araç, fotoğraf düzenleme programlarındaki klasik \"keskinleştirme/unsharp mask\" tekniğini kullanır - kenar kontrastını artırarak görseli gözle daha net gösterir. Kaybolmuş gerçek detayı yeniden üreten bir yapay zeka modeli değildir.",
        },
        {
          question: "Çok bulanık (hareket bulanıklığı olan) bir fotoğrafı düzeltebilir mi?",
          answer:
            "Sınırlı ölçüde. Bu teknik hafif yumuşaklık ve küçük çözünürlükten büyütme sonrası oluşan bulanıklık için en etkilidir; ciddi hareket bulanıklığında kayıp detayı geri getiremez.",
        },
        {
          question: "Netleştirme gücünü çok yükseğe çekersem ne olur?",
          answer:
            "Kenarlarda ince beyaz/koyu \"halo\" çizgileri ve gürültü artışı görülebilir. Çoğu görsel için orta seviye bir güç daha doğal bir sonuç verir; önizlemeden farkı görüp ayarlayabilirsiniz.",
        },
        {
          question: "Hangi dosya formatları destekleniyor?",
          answer:
            "PNG, JPG ve WebP çıktısı desteklenir; farklı bir formatta bir görsel yüklerseniz sonuç PNG olarak indirilir.",
        },
        {
          question: "Görselim bir sunucuya yükleniyor mu?",
          answer:
            "Hayır, netleştirme işlemi tarayıcınızın Canvas API'siyle tamamen cihazınızda yapılır; dosyanız cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "Görsel Dönüştür",
    href: "/gorsel-donustur",
    description: "Görselleri PNG, JPG ve WebP gibi formatlar arasında dönüştürür.",
    available: true,
    accentClassName: "bg-fuchsia-500",
    icon: ImageIcon,
    group: "Görsel",
    shortLabel: "Dönüştür",
    seo: {
      metaTitle: "Görsel Dönüştür | PNG, JPG, WebP Dönüştürücü | Pratikleştir",
      metaDescription:
        "Görselleri PNG, JPG ve WebP formatları arasında ücretsiz dönüştürün. Kayıt gerekmez, tamamen tarayıcınızda çalışır, verileriniz hiçbir sunucuya gönderilmez.",
      about: [
        "Farklı platformlar farklı görsel formatları bekler: bir web sitesi küçük dosya boyutu için WebP isterken, bir eski sistem veya form yalnızca JPG kabul edebilir, saydamlık gerektiren bir logo ise PNG olmalıdır. Bu araç yüklediğiniz görseli seçtiğiniz formata anında dönüştürür.",
        "PNG kayıpsız bir formattır ve saydamlığı (alfa kanalı) destekler; logo, ikon ve ekran görüntüleri için uygundur ama dosya boyutu genelde daha büyüktür. JPG kayıplı sıkıştırma kullanır, saydamlığı desteklemez ve fotoğraflar için küçük dosya boyutu sağlar. WebP ise Google'ın geliştirdiği modern bir format olup hem kayıplı hem kayıpsız sıkıştırmayı destekler, saydamlığı korur ve genelde aynı kalitede JPG/PNG'den daha küçük dosya üretir - ancak çok eski tarayıcı veya programlarda açılmayabilir.",
        "Birden fazla görseli aynı anda yükleyip hepsini tek seferde aynı hedef formata dönüştürebilir, sonuçları tek tek veya .zip olarak toplu indirebilirsiniz.",
        "PNG veya farklı bir kaynaktan JPG'ye dönüştürürken saydam alanlar otomatik olarak beyaz arka planla doldurulur, çünkü JPG formatı saydamlığı desteklemez - bu davranış aracın kendisi tarafından otomatik yönetilir.",
      ],
      howTo: [
        "Dönüştürmek istediğiniz görseli veya görselleri sürükleyip bırakın ya da seçin.",
        "Hedef formatı seçin: PNG, JPG veya WebP.",
        "JPG veya WebP seçtiyseniz isterseniz kalite seviyesini ayarlayın.",
        "\"Dönüştür\" butonuna tıklayın; işlem tarayıcınızda saniyeler içinde tamamlanır.",
        "Sonucu tek tek indirin veya birden fazla dosya varsa \"Tümünü İndir (.zip)\" ile toplu indirin.",
      ],
      advantages: [
        "PNG, JPG ve WebP formatları arasında serbestçe dönüştürme yapar.",
        "İşlem tamamen tarayıcınızda gerçekleşir, görselleriniz hiçbir sunucuya yüklenmez.",
        "Birden fazla görseli aynı anda dönüştürüp toplu indirebilirsiniz.",
        "JPG/WebP için kalite seviyesini kendiniz ayarlayabilirsiniz.",
        "Kayıt gerekmez, ücretsiz kullanılır.",
      ],
      faq: [
        {
          question: "Hangi formatlar destekleniyor?",
          answer:
            "Çıktı formatı olarak PNG, JPG ve WebP arasından seçim yapabilirsiniz. Girdi olarak PNG, JPG, WebP, GIF ve BMP gibi tarayıcınızın açabildiği neredeyse tüm yaygın görsel formatlarını yükleyebilirsiniz.",
        },
        {
          question: "PNG'yi JPG'ye çevirince saydam alanlara ne olur?",
          answer:
            "JPG saydamlığı desteklemediği için saydam alanlar otomatik olarak beyaz arka planla doldurulur.",
        },
        {
          question: "WebP hangi durumlarda tercih edilmeli?",
          answer:
            "Web sitenizde sayfa yükleme hızını artırmak istiyorsanız WebP genelde aynı görsel kalitede PNG veya JPG'den daha küçük dosya boyutu sağlar. Ancak çok eski bir program veya sistemle paylaşacaksanız JPG/PNG daha güvenli bir seçim olabilir.",
        },
        {
          question: "Aynı anda birden fazla görsel dönüştürebilir miyim?",
          answer:
            "Evet, istediğiniz kadar görseli aynı anda yükleyip hepsini aynı hedef formata dönüştürebilir, sonuçları .zip olarak toplu indirebilirsiniz.",
        },
        {
          question: "Görsellerim bir sunucuya yükleniyor mu?",
          answer:
            "Hayır, dönüştürme işlemi tarayıcınızın Canvas API'siyle tamamen cihazınızda yapılır; dosyalarınız cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "Görsel Boyutlandır",
    href: "/gorsel-boyutlandir",
    description:
      "Görselin genişlik/yükseklik boyutunu veya yüzdesini değiştirip indirir.",
    available: true,
    accentClassName: "bg-orange-500",
    icon: ResizeIcon,
    group: "Görsel",
    shortLabel: "Boyutlandır",
    seo: {
      metaTitle: "Görsel Boyutlandır | Ücretsiz Online Resim Boyutlandırma | Pratikleştir",
      metaDescription:
        "Görselleri istediğiniz piksel boyutuna veya yüzdeye göre küçültün/büyütün. Oran kilitleme desteğiyle, kayıt gerekmeden, tamamen tarayıcınızda.",
      about: [
        "Bir görselin \"boyutlandırılması\" (resize), dosya boyutunu değil piksel cinsinden genişlik ve yüksekliğini değiştirmek demektir - bu, dosya boyutunu küçültmeyi amaçlayan sıkıştırmadan farklıdır. Bir e-ticaret sitesine ürün fotoğrafı yüklerken istenen tam ölçüye getirmek, bir formun izin verdiği maksimum piksel sınırına uymak veya sosyal medya platformlarının önerdiği ölçülere göre kırpmadan önce görseli hazırlamak gibi durumlarda kullanışlıdır.",
        "Yeni genişlik veya yükseklik değerini piksel cinsinden girebilir, \"oranı kilitle\" seçeneğiyle en-boy oranını bozmadan tek bir değeri değiştirdiğinizde diğerinin otomatik hesaplanmasını sağlayabilirsiniz. Alternatif olarak yüzde bazlı modda görseli örneğin %50 küçültüp veya %150 büyütüp orijinal oranı hiç bozmadan ölçeklendirebilirsiniz.",
        "Görseli büyütmek, kaybolan detayı geri getirmez - piksel sayısı arttıkça mevcut piksellerin arası enterpolasyonla doldurulur, bu da özellikle çok büyütmelerde bulanıklaşmaya yol açabilir. En iyi sonucu almak için genelde küçültme yönünde kullanmak veya orijinali olabildiğince yüksek çözünürlükte tutmak önerilir.",
      ],
      howTo: [
        "Boyutlandırmak istediğiniz görseli sürükleyip bırakın veya seçin.",
        "Piksel modunda yeni genişlik/yükseklik girin (isterseniz \"oranı kilitle\" ile en-boy oranını koruyun) veya yüzde modunda bir küçültme/büyütme oranı seçin.",
        "\"Boyutlandır\" butonuna tıklayın; sonuç anında önizlemede görünür.",
        "Sonucu indirin.",
      ],
      advantages: [
        "Piksel bazlı tam ölçü girişi veya yüzde bazlı hızlı ölçekleme sunar.",
        "\"Oranı kilitle\" seçeneğiyle görsel istemeden çarpıtılmaz.",
        "İşlem tamamen tarayıcınızda yapılır, görseliniz hiçbir sunucuya gönderilmez.",
        "Kayıt gerekmez, ücretsiz kullanılır.",
      ],
      faq: [
        {
          question: "Boyutlandırma ile sıkıştırma arasındaki fark nedir?",
          answer:
            "Boyutlandırma görselin piksel cinsinden genişlik/yüksekliğini değiştirir. Sıkıştırma ise boyutları aynı bırakıp dosya boyutunu küçültür. Dosya boyutunu küçültmek istiyorsanız Görsel Sıkıştırıcı aracımızı kullanabilirsiniz.",
        },
        {
          question: "\"Oranı kilitle\" ne işe yarar?",
          answer:
            "Açık olduğunda genişlik veya yükseklikten birini değiştirdiğinizde diğeri orijinal en-boy oranına göre otomatik hesaplanır, görsel çarpıtılmaz.",
        },
        {
          question: "Görseli büyütünce kalite kaybı olur mu?",
          answer:
            "Evet, büyütme mevcut piksel bilgisinden enterpolasyonla yeni pikseller üretir; bu da özellikle büyük oranlı büyütmelerde bulanıklaşmaya yol açabilir. En iyi sonuç için mümkünse yüksek çözünürlüklü bir orijinalle başlayın.",
        },
        {
          question: "Yüzde modu ne zaman kullanışlı?",
          answer:
            "Tam piksel değeriyle uğraşmadan görseli hızlıca örneğin yarı boyuta indirmek veya %150 büyütmek istediğinizde, oranı otomatik koruduğu için piksel modundan daha pratiktir.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
  },
  {
    name: "Görsel Kırp",
    href: "/gorsel-kirp",
    description: "Görsel üzerinde alan seçip istediğiniz kısmı kırpıp indirir.",
    available: true,
    accentClassName: "bg-rose-500",
    icon: CropIcon,
    group: "Görsel",
    shortLabel: "Kırp",
    seo: {
      metaTitle: "Görsel Kırp | Ücretsiz Online Resim Kırpma Aracı | Pratikleştir",
      metaDescription:
        "Görselinizi önizleme üzerinde sürükleyerek istediğiniz alanı seçin, kırpıp indirin. Kayıt gerekmez, tamamen tarayıcınızda çalışır.",
      about: [
        "Kırpma, bir görselin yalnızca ihtiyacınız olan kısmını almak için geri kalanını kesip atmaktır - profil fotoğrafını kareye getirmek, bir ekran görüntüsündeki gereksiz kenarları temizlemek veya bir ürün fotoğrafını istenen en-boy oranına oturtmak gibi durumlarda sık kullanılır.",
        "Bu araç yüklediğiniz görseli önizlemede gösterir; köşelerinden veya kenarlarından sürükleyerek istediğiniz kırpma alanını seçer, ardından yalnızca seçtiğiniz bölgeyi yeni bir görsel olarak indirirsiniz. Kırpma alanının konumu ve boyutu tamamen serbesttir, sabit bir oranla sınırlı değilsiniz.",
        "İşlem, seçtiğiniz alanı bir Canvas üzerine orijinal çözünürlükte yeniden çizerek yapılır - yani kırpılan bölge, kaynak görselin kalitesini korur, ek bir kalite kaybı yaşanmaz.",
      ],
      howTo: [
        "Kırpmak istediğiniz görseli sürükleyip bırakın veya seçin.",
        "Önizleme üzerinde kırpma alanının köşelerini veya kenarlarını sürükleyerek istediğiniz bölgeyi seçin.",
        "\"Kırp\" butonuna tıklayın; seçtiğiniz alan anında önizlemede görünür.",
        "Sonucu indirin.",
      ],
      advantages: [
        "Önizleme üzerinde sürükle-bırak ile serbest kırpma alanı seçimi.",
        "Kırpılan bölge kaynak çözünürlüğü korur, ek kalite kaybı yaşanmaz.",
        "İşlem tamamen tarayıcınızda yapılır, görseliniz hiçbir sunucuya gönderilmez.",
        "Kayıt gerekmez, ücretsiz kullanılır.",
      ],
      faq: [
        {
          question: "Kırpma alanını sabit bir en-boy oranıyla mı seçmem gerekiyor?",
          answer:
            "Hayır, kırpma alanını tamamen serbest boyutta seçebilirsiniz; sabit bir oranla sınırlı değilsiniz.",
        },
        {
          question: "Kırpılan görsel kalite kaybeder mi?",
          answer:
            "Hayır, seçtiğiniz alan kaynak görselin orijinal çözünürlüğünden yeniden çizilir; ek bir sıkıştırma veya kalite kaybı uygulanmaz.",
        },
        {
          question: "Hangi dosya formatları destekleniyor?",
          answer:
            "PNG, JPG, WebP gibi tarayıcınızın açabildiği yaygın görsel formatlarını yükleyebilirsiniz; sonuç, kaynak görselin formatında indirilir.",
        },
        {
          question: "Görselim bir sunucuya yükleniyor mu?",
          answer:
            "Hayır, kırpma işlemi tarayıcınızın Canvas API'siyle tamamen cihazınızda yapılır; dosyanız cihazınızdan çıkmaz.",
        },
      ],
      applicationCategory: "MultimediaApplication",
    },
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

import type { ToolFaqItem } from "./tools";

export type ScenarioTip = {
  title: string;
  body: string;
};

// Programatik SEO alt sayfaları: aynı aracı (aynı component) kullanan ama
// gerçekten farklı bir arama niyetine hizmet eden senaryo sayfaları
// (örn. "PDF'i 200 KB altına düşür"). "Thin content" riskinden kaçınmak
// için HER alanın (h1, meta, intro, tips, faq) o senaryoya özel, elle
// yazılmış ve genel araç sayfasından farklı olması gerekir - burada
// otomatik türetilen hiçbir varsayılan yoktur, kasıtlı olarak.
export type ToolScenario = {
  // Hangi aracın sayfasında render edileceği - tools.ts'deki Tool.href ile eşleşir.
  toolHref: string;
  // URL'in son parçası: {toolHref}/{slug}
  slug: string;
  h1: string;
  // H1'in altında, aracın kendi component'i içindeki kısa açıklamanın yerini alır.
  shortLede: string;
  metaTitle: string;
  metaDescription: string;
  // Giriş paragrafları - genel "Araç Hakkında" metninin kopyası olmamalı.
  intro: string[];
  // Bu senaryoya özel pratik ipuçları.
  tips: ScenarioTip[];
  // Bu senaryoya özel SSS - ana aracın SSS'siyle aynı sorular olmamalı.
  faq: ToolFaqItem[];
};

export const toolScenarios: ToolScenario[] = [
  {
    toolHref: "/pdf-sikistir",
    slug: "200kb-altina-dusur",
    h1: "PDF Dosyasını 200 KB Altına Nasıl Düşürürsünüz?",
    shortLede:
      "Başvuru formları, e-posta ekleri ve online sistemlerin sık karşılaşılan 200 KB sınırı için PDF'inizi hızlıca küçültün.",
    metaTitle: "PDF'i 200 KB Altına Düşür - Ücretsiz ve Hızlı | Pratikleştir",
    metaDescription:
      "Başvuru sistemleri, e-Devlet formları veya e-posta ekleri genelde 200 KB sınırı koyar. PDF'inizi tarayıcınızda, ücretsiz ve saniyeler içinde 200 KB altına indirin.",
    intro: [
      "Üniversite başvuru sistemleri, e-Devlet formları, iş başvuru portalları ve birçok online sistem PDF yüklemelerinde 200 KB gibi düşük bir boyut sınırı koyar. Telefonla taratılan ya da yüksek çözünürlüklü taranmış bir belge çoğunlukla bu sınırı kolayca aşar.",
      "Aşağıdaki PDF Sıkıştırıcı, dosyanızın iç yapısındaki gereksiz veriyi (kullanılmayan nesneler, tekrar eden akışlar) temizleyerek boyutu küçültür. İşlem tamamen tarayıcınızda çalışır, dosyanız hiçbir sunucuya yüklenmez.",
    ],
    tips: [
      {
        title: "Taranmış sayfalar en çok yer kaplayan kısımdır",
        body: "PDF Sıkıştırıcı görselleri yeniden sıkıştırmaz, yalnızca dosya yapısını temizler. Belgeniz esas olarak taranmış/fotoğraflı sayfalardan oluşuyorsa, sayfaları önce Görsel Sıkıştırıcı ile küçültüp yeniden PDF'e dönüştürmek 200 KB hedefine ulaşmanızı çok daha kolaylaştırır.",
      },
      {
        title: "Tarama çözünürlüğünü düşürün",
        body: "Telefon kamerasıyla veya tarayıcıyla 300 DPI üzerinde tarama yapmak dosya boyutunu gereksiz yere şişirir. Formlar ve metin belgeleri için 150-200 DPI çoğu zaman yeterli okunabilirlik sağlar.",
      },
      {
        title: "Gereksiz sayfaları ayıklayın",
        body: "Boş sayfalar, kapak sayfaları veya tekrarlanan ekler varsa PDF Birleştirici ile yalnızca gerekli sayfaları içeren yeni bir dosya oluşturup onu sıkıştırın.",
      },
      {
        title: "Renk yerine gri tonlama deneyin",
        body: "Belgenin renkli olması gerekmiyorsa tarama sırasında gri tonlamayı seçmek dosya boyutunu belirgin şekilde azaltır.",
      },
    ],
    faq: [
      {
        question: "PDF Sıkıştırıcı her dosyayı 200 KB altına indirebilir mi?",
        answer:
          "Hayır, garanti edemeyiz. Araç, pdf-lib kütüphanesiyle dosya yapısındaki gereksiz veriyi temizler ama içindeki görselleri yeniden sıkıştırmaz. Metin ağırlıklı PDF'lerde küçülme oranı yüksek olurken, yüksek çözünürlüklü taranmış sayfalardan oluşan dosyalarda etki sınırlı kalabilir - bu durumda sayfaları önce Görsel Sıkıştırıcı ile küçültmenizi öneririz.",
      },
      {
        question: "200 KB sınırı olan bir sisteme hangi sırayla ilerlemeliyim?",
        answer:
          "Önce dosyayı doğrudan PDF Sıkıştırıcı'dan geçirin. Sonuç hâlâ 200 KB üzerindeyse ve belge taranmış sayfalar içeriyorsa, sayfaları görsele çevirip Görsel Sıkıştırıcı'nın \"Maksimum Sıkıştırma\" seçeneğiyle küçültüp yeniden PDF'e dönüştürmeyi deneyin.",
      },
      {
        question: "Sıkıştırma belgenin okunabilirliğini bozar mı?",
        answer:
          "Hayır. PDF Sıkıştırıcı metni veya görselleri değiştirmez, yalnızca dosyanın iç yapısındaki fazlalıkları temizler; içerik ve görsel kalite aynı kalır.",
      },
      {
        question: "Dosyam bir sunucuya yükleniyor mu?",
        answer:
          "Hayır. Sıkıştırma işlemi tamamen tarayıcınızda gerçekleşir, PDF'iniz cihazınızdan çıkmaz.",
      },
    ],
  },
  {
    toolHref: "/arka-plan-sil",
    slug: "e-ticaret-urun-fotografi",
    h1: "E-Ticaret Ürün Fotoğrafları İçin Arka Plan Silme",
    shortLede:
      "Trendyol, Hepsiburada, Instagram ve kendi web siteniz için ürün fotoğraflarınızın arka planını saniyeler içinde temizleyin.",
    metaTitle: "Ürün Fotoğrafı Arka Planı Sil - E-Ticaret İçin | Pratikleştir",
    metaDescription:
      "E-ticaret ürün fotoğraflarınızın arka planını yapay zeka ile ücretsiz kaldırın; pazar yeri şablonlarına uygun, temiz ve profesyonel görsel elde edin.",
    intro: [
      "Pazar yerleri (Trendyol, Hepsiburada, Amazon) ve çoğu e-ticaret altyapısı, ürün fotoğraflarında düz/temiz bir arka plan bekler; dağınık bir arka planla çekilmiş fotoğraflar hem onay sürecinde reddedilebilir hem de vitrinde profesyonel görünmez.",
      "Aşağıdaki Arka Plan Silici, tarayıcınızda çalışan bir yapay zeka modeliyle ürününüzü arka plandan otomatik ayırır ve şeffaf arka planlı bir PNG üretir; bu dosyayı olduğu gibi kullanabilir ya da düz beyaz/renkli bir zemine yerleştirebilirsiniz.",
    ],
    tips: [
      {
        title: "Tek renkli bir zeminde çekim yapın",
        body: "Ürünü düz, kontrastlı bir zemin (beyaz, gri veya yalnızca bir renk) üzerinde çekmek, yapay zekanın ürün kenarlarını daha net ayırt etmesini sağlar - özellikle saydam, parlak veya tüylü ürünlerde sonucu belirgin şekilde iyileştirir.",
      },
      {
        title: "Pazar yeri şablonuna göre beyaza oturtun",
        body: "Çoğu pazar yeri şeffaf PNG değil, düz beyaz arka plan ister. Arka planı sildikten sonra görseli bir düzenleme aracında (veya basitçe beyaz bir tuval üzerine) yerleştirerek platformun kurallarına uygun hale getirin.",
      },
      {
        title: "Kare veya platformun istediği orana kırpın",
        body: "Arka planı sildikten sonra görseli pazar yerinin istediği orana (genelde 1:1 kare) kırpmak, listelemede ürünün ortalanmış ve tutarlı görünmesini sağlar.",
      },
      {
        title: "Her ürünü tek tek işleyin",
        body: "Araç şu an tek seferde bir fotoğraf işleyecek şekilde tasarlandı; birden fazla ürün fotoğrafınız varsa her birini sırayla yükleyip indirmeniz gerekir.",
      },
    ],
    faq: [
      {
        question: "Sonuç dosyası doğrudan Trendyol/Hepsiburada'ya yüklenebilir mi?",
        answer:
          "Şeffaf PNG çoğu platformda kabul edilir, ancak bazı pazar yerleri düz beyaz arka plan şart koşar. Bu durumda şeffaf sonucu bir düzenleme aracında beyaz zemine yerleştirmeniz gerekebilir.",
      },
      {
        question: "Birden fazla ürün fotoğrafını aynı anda işleyebilir miyim?",
        answer:
          "Hayır, araç şu an tek seferde bir görsel işliyor. Birden fazla ürününüz varsa her birini sırayla yükleyip indirmeniz gerekir.",
      },
      {
        question:
          "Parlak, saydam veya ince detaylı ürünlerde (takı, cam, kumaş) sonuç ne kadar iyi olur?",
        answer:
          "Yapay zeka modeli çoğu üründe iyi sonuç verir, ancak saydam cam, ince tel veya saç gibi çok ince detaylarda kenarlarda küçük kusurlar görülebilir. Düz ve kontrastlı bir zeminde çekilen fotoğraflar bu durumlarda daha iyi sonuç verir.",
      },
      {
        question: "Fotoğrafım bir sunucuya yükleniyor mu?",
        answer:
          "Hayır. Arka plan kaldırma işlemi tamamen tarayıcınızda çalışan bir yapay zeka modeliyle yapılır, ürün fotoğrafınız cihazınızdan çıkmaz.",
      },
    ],
  },
  {
    toolHref: "/gorsel-sikistir",
    slug: "sahibinden-ilan-boyutu",
    h1: "Sahibinden ve İlan Siteleri İçin Görsel Boyutu Küçültme",
    shortLede:
      "İlanlarınızın hızlı yüklenmesi ve platform sınırlarına takılmaması için fotoğraflarınızı hızlıca küçültün.",
    metaTitle: "İlan Fotoğrafı Küçült - Sahibinden ve İlan Siteleri İçin | Pratikleştir",
    metaDescription:
      "Sahibinden ve diğer ilan sitelerine yüklemeden önce fotoğraflarınızı kaliteden ödün vermeden küçültün. Ücretsiz, kayıt gerektirmez, tarayıcınızda çalışır.",
    intro: [
      "İlan siteleri genellikle telefonla çekilen yüksek çözünürlüklü fotoğrafları kabul eder, ancak büyük dosyalar hem yükleme süresini uzatır hem de bazı platformlarda otomatik olarak agresif şekilde sıkıştırılıp kalite kaybına yol açabilir.",
      "Aşağıdaki Görsel Sıkıştırıcı ile fotoğraflarınızı yüklemeden önce siz küçültürsünüz; hem yükleme daha hızlı olur hem de sonucun kalitesi üzerindeki kontrol sizde kalır.",
    ],
    tips: [
      {
        title: "İlan fotoğrafları için genelde \"Orta\" yeterlidir",
        body: "Araç, kullanılmış eşya/araç ilanı gibi standart ürün fotoğrafları için \"Orta\" kalite seviyesi, dosya boyutunu belirgin küçültürken ekran görünümünde kalite kaybını fark ettirmez.",
      },
      {
        title: "Çok sayıda fotoğrafınız varsa toplu işleyin ve zip indirin",
        body: "Bir ilana genelde birden fazla fotoğraf eklenir. Tüm fotoğraflarınızı aynı anda yükleyip sıkıştırdıktan sonra \"Tümünü İndir (.zip)\" ile hepsini tek seferde indirebilirsiniz.",
      },
      {
        title: "Yatay/dikey karışıklığına dikkat edin",
        body: "Sıkıştırma sırasında görselin yönü veya kırpımı değişmez; yalnızca dosya boyutu küçülür. Fotoğrafı ilana yüklemeden önce doğru yönde çektiğinizden emin olun.",
      },
      {
        title: "Aşırı sıkıştırmadan kaçının",
        body: "Görseli olabildiğince küçültmek isteseniz de \"Maksimum Sıkıştırma\" seçeneği görünür kalite kaybına yol açabilir; ilan fotoğraflarının satın alma kararını etkileyen en önemli unsurlardan biri olduğunu unutmayın.",
      },
    ],
    faq: [
      {
        question: "Sahibinden ilanları için hangi kalite seviyesini seçmeliyim?",
        answer:
          "Çoğu ilan fotoğrafı için \"Orta\" seviyesi iyi bir denge sağlar: dosya boyutu belirgin küçülür, görsel kalitesinde gözle fark edilir bir kayıp olmaz. Çok sayıda yüksek çözünürlüklü fotoğrafınız varsa \"Maksimum Sıkıştırma\"yı deneyebilirsiniz.",
      },
      {
        question: "Bir ilana ait tüm fotoğrafları tek seferde küçültebilir miyim?",
        answer:
          "Evet, birden fazla fotoğrafı aynı anda yükleyip sıkıştırabilir, sonucu \"Tümünü İndir (.zip)\" ile tek dosyada indirebilirsiniz.",
      },
      {
        question: "Sıkıştırma fotoğrafın çözünürlüğünü/boyutlarını değiştirir mi?",
        answer:
          "Evet, seçtiğiniz kalite seviyesine göre görsel gerekirse yeniden boyutlandırılır (örneğin Maksimum Sıkıştırma'da uzun kenar 1280 piksele kadar küçülebilir); bu, ekranda görüntülenecek ilan fotoğrafları için yeterli çözünürlüktür.",
      },
      {
        question: "Fotoğraflarım bir sunucuya yükleniyor mu?",
        answer:
          "Hayır. Sıkıştırma işlemi tamamen tarayıcınızda yapılır, fotoğraflarınız cihazınızdan çıkmaz.",
      },
    ],
  },
  {
    toolHref: "/gorsel-sikistir",
    slug: "whatsapp-icin-kucult",
    h1: "WhatsApp'ta Göndermek İçin Fotoğraf Boyutu Küçültme",
    shortLede:
      "WhatsApp'ın kendi sıkıştırmasına bırakmadan, fotoğraflarınızı siz küçültüp hem hızlı gönderin hem sonucu kontrol edin.",
    metaTitle: "WhatsApp İçin Fotoğraf Küçült - Hızlı Gönderim | Pratikleştir",
    metaDescription:
      "WhatsApp'ta fotoğraf gönderirken veri ve zaman kazanın. Görsellerinizi WhatsApp'ın kendi sıkıştırmasına bırakmadan, siz kontrol ederek küçültün - ücretsiz, tamamen tarayıcınızda.",
    intro: [
      "WhatsApp'ta \"Fotoğraf\" olarak gönderdiğiniz her görsel, uygulamanın kendi sıkıştırma algoritmasından geçer - bu süreç üzerinde sizin bir kontrolünüz yoktur. Bazen beklediğinizden fazla kalite kaybı olur, bazen de yavaş bir bağlantıda gönderimi geciktiren büyüklükte dosyalar ortaya çıkar. Özellikle bir düğün, etkinlik veya iş klasöründen onlarca fotoğrafı tek seferde paylaşırken bu fark iyice belirginleşir.",
      "Aşağıdaki Görsel Sıkıştırıcı ile fotoğraflarınızı WhatsApp'a yüklemeden önce siz küçültürsünüz; hem gönderim belirgin şekilde hızlanır hem de sonucun nasıl göründüğünü WhatsApp'ın algoritmasına bırakmadan siz belirlersiniz.",
    ],
    tips: [
      {
        title: "Toplu galeriler için \"Orta\" kalite genelde yeterlidir",
        body: "Bir etkinlik veya toplantıdan onlarca fotoğrafı aynı anda paylaşacaksanız, \"Orta\" kalite seviyesi dosya boyutunu belirgin küçültürken telefon ekranında fark edilir bir kalite kaybı yaratmaz.",
      },
      {
        title: "Kaliteyi tam korumak istiyorsanız \"Belge\" olarak göndermeyi düşünün",
        body: "WhatsApp'ta bir görseli \"Fotoğraf\" yerine \"Belge\" (Document) olarak gönderirseniz uygulama ek bir sıkıştırma uygulamaz, orijinal kaliteyi korur. Ama dosya zaten büyükse gönderim yine yavaş olur - bu durumda önce bu araçla küçültüp sonra belge olarak göndermek hem hızlı hem kontrollü bir sonuç verir.",
      },
      {
        title: "Çok sayıda fotoğrafı zip ile toplu indirip WhatsApp Web'den paylaşın",
        body: "Birden fazla görseli aynı anda sıkıştırdıktan sonra \"Tümünü İndir (.zip)\" ile hepsini bilgisayarınıza indirebilir, WhatsApp Web veya masaüstü uygulamasından zip'i açıp dosyaları tek seferde seçebilirsiniz.",
      },
      {
        title: "Kısıtlı veri planında veya yurt dışındaysanız önceliği boyuta verin",
        body: "Sınırlı mobil veri kullanıyorsanız veya roaming'deyseniz, göndermeden önce fotoğrafları \"Maksimum Sıkıştırma\" ile küçültmek hem sizin hem alıcının veri kullanımını azaltır.",
      },
    ],
    faq: [
      {
        question: "WhatsApp zaten fotoğrafları sıkıştırmıyor mu, neden ayrıca küçültmeliyim?",
        answer:
          "Evet, WhatsApp \"Fotoğraf\" olarak gönderilen görselleri kendi algoritmasıyla sıkıştırır, ancak bu süreç üzerinde kontrolünüz yoktur - bazen beklediğinizden fazla kalite kaybı, bazen de gereğinden büyük dosya boyutu ortaya çıkabilir. Görseli siz önceden küçültürseniz sonucu kontrol eder, gönderimi de hızlandırırsınız.",
      },
      {
        question: "Fotoğrafı \"Belge\" olarak gönderirsem sıkıştırmaya hiç gerek kalır mı?",
        answer:
          "\"Belge\" olarak göndermek WhatsApp'ın ek sıkıştırmasını atlar ve orijinal kaliteyi korur, ama dosya boyutu büyük kalmaya devam eder - yavaş bağlantılarda veya çok sayıda dosyada yine de önce küçültmeniz gönderimi belirgin şekilde hızlandırır.",
      },
      {
        question: "Kaç fotoğrafı aynı anda küçültüp WhatsApp'a hazırlayabilirim?",
        answer:
          "İstediğiniz kadar görseli aynı anda yükleyip sıkıştırabilir, sonuçları \"Tümünü İndir (.zip)\" ile tek seferde indirip WhatsApp'tan paylaşabilirsiniz.",
      },
      {
        question: "Fotoğraflarım bir sunucuya yükleniyor mu?",
        answer:
          "Hayır. Sıkıştırma işlemi tamamen tarayıcınızda yapılır, fotoğraflarınız cihazınızdan çıkmaz.",
      },
    ],
  },
  {
    toolHref: "/arka-plan-sil",
    slug: "vesikalik-fotograf",
    h1: "Vesikalık Fotoğraf İçin Arka Planı Beyaza Çevirme",
    shortLede:
      "Kimlik, pasaport, ehliyet ve iş başvurusu gibi resmi işlemler için fotoğrafınızın arka planını temizleyip düz beyaza hazırlayın.",
    metaTitle: "Vesikalık Fotoğraf Arka Planı Beyaz Yap - Ücretsiz | Pratikleştir",
    metaDescription:
      "Kimlik, pasaport, ehliyet ve iş başvurusu fotoğraflarınızın arka planını yapay zeka ile temizleyip düz beyaza hazırlayın. Ücretsiz, tamamen tarayıcınızda çalışır.",
    intro: [
      "Kimlik kartı, pasaport, ehliyet, vize veya iş başvurusu gibi resmi işlemlerde istenen vesikalık fotoğraflarda genellikle düz, gölgesiz ve tek renk (çoğunlukla beyaz) bir arka plan şartı aranır. Evde veya ofiste çekilen bir fotoğrafta arka planda duvar dokusu, gölge veya eşyalar bulunması bu şartı karşılamayabilir.",
      "Aşağıdaki Arka Plan Silici, fotoğrafınızdaki arka planı yapay zeka ile otomatik olarak kaldırıp şeffaf bir PNG üretir. Resmi bir sisteme yüklemeden önce bu şeffaf alanı düz beyaz bir zeminle doldurmanız gerekir - bunu nasıl yapacağınızı aşağıdaki ipuçlarında anlatıyoruz.",
    ],
    tips: [
      {
        title: "Şeffaf PNG'yi olduğu gibi yüklemeyin, beyaza oturtun",
        body: "Çoğu resmi sistem şeffaflığı desteklemez; şeffaf alanlar bazı görüntüleyicilerde siyah veya damalı görünebilir. Arka planı sildikten sonra sonucu bir görsel düzenleme aracında düz beyaz bir tuvalin üzerine yerleştirip yeniden JPG veya PNG olarak kaydedin.",
      },
      {
        title: "Çekim öncesi düz, aydınlık bir zemin seçin",
        body: "Arka planı zaten olabildiğince sade (düz duvar, gölgesiz) bir yerde çekmek, yapay zekanın saç ve omuz kenarlarını daha temiz ayırmasını sağlar; beyaza oturttuğunuzda kenarlarda renk taşması ihtimali de azalır.",
      },
      {
        title: "Kurumun istediği tam boyut ve oranı ayrıca kontrol edin",
        body: "Bu araç yalnızca arka planı temizler. Kimlik, pasaport, ehliyet gibi her belge türünün kendi piksel/santimetre boyutu ve baş oranı kuralı olabilir; arka planı temizledikten sonra ilgili kurumun istediği ölçüye göre görseli Görsel Kırp veya Görsel Boyutlandır araçlarımızla ayrıca hazırlamanız gerekebilir.",
      },
      {
        title: "Düz, önden ve nötr ifadeyle çekilmiş bir fotoğraf kullanın",
        body: "Arka plan temizliği açıyı veya yüz ifadesini düzeltmez; resmi fotoğraf kurallarının çoğu doğrudan kameraya bakan, nötr ifadeli ve gözlüksüz (yansımasız) bir çekim ister. En iyi sonuç için bu şartlara uygun bir fotoğrafla başlayın.",
      },
    ],
    faq: [
      {
        question: "Bu araçla oluşturduğum fotoğrafı doğrudan e-Devlet veya nüfus müdürlüğü sistemine yükleyebilir miyim?",
        answer:
          "Araç yalnızca arka planı temizler ve şeffaf bir PNG üretir; resmi sistemler genelde şeffaflığı kabul etmez. Yüklemeden önce sonucu düz beyaz bir zemine oturtup JPG/PNG olarak kaydetmeniz, ayrıca ilgili kurumun istediği boyut kuralına uymanız gerekir.",
      },
      {
        question: "Arka planı beyaz değil, mavi veya gri yapmam gerekiyorsa ne yapmalıyım?",
        answer:
          "Araç arka planı kaldırıp şeffaf bırakır; hangi renk zemine oturtacağınız size kalmıştır. Kurumun istediği renk beyaz değilse, şeffaf sonucu bir düzenleme aracında istediğiniz renkte bir zemine yerleştirebilirsiniz.",
      },
      {
        question: "Fotoğrafımın boyutunu da (örneğin belirli bir santimetre ölçüsünü) bu araçla ayarlayabilir miyim?",
        answer:
          "Hayır, bu araç yalnızca arka planı temizler. Kurumun istediği tam boyut ve orana getirmek için Görsel Kırp veya Görsel Boyutlandır araçlarımızı ayrıca kullanabilirsiniz.",
      },
      {
        question: "Fotoğrafım bir sunucuya yükleniyor mu?",
        answer:
          "Hayır. Arka plan kaldırma işlemi tamamen tarayıcınızda çalışan bir yapay zeka modeliyle yapılır, fotoğrafınız cihazınızdan çıkmaz.",
      },
    ],
  },
];

export function getToolScenario(toolHref: string, slug: string): ToolScenario | undefined {
  return toolScenarios.find((s) => s.toolHref === toolHref && s.slug === slug);
}

export function getScenariosForTool(toolHref: string): ToolScenario[] {
  return toolScenarios.filter((s) => s.toolHref === toolHref);
}

import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";
import { tools } from "@/app/lib/tools";
import { categories } from "@/app/lib/categories";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { buildBreadcrumbSchema } from "@/app/lib/breadcrumb-schema";

export const metadata: Metadata = {
  title: { absolute: "Sık Sorulan Sorular | Pratikleştir" },
  description:
    "Pratikleştir'in ücretsiz kullanımı, hesap ve Pro plan, gizlilik ve araçlarla ilgili en çok sorulan soruların yanıtları.",
  alternates: { canonical: `${SITE_URL}/sss` },
  robots: { index: false, follow: true },
};

const toolCount = tools.filter((tool) => tool.available).length;
const activeCategoryCount = categories.filter((c) => c.hasAvailableTools).length;

type FaqItem = { question: string; answer: string };
type FaqGroup = { title: string; items: FaqItem[] };

const faqGroups: FaqGroup[] = [
  {
    title: "Genel",
    items: [
      {
        question: "Pratikleştir nedir?",
        answer:
          "Pratikleştir, QR kod oluşturma, PDF birleştirme/sıkıştırma, görsel sıkıştırma, arka plan silme gibi günlük işleri hızlandıran, tarayıcı tabanlı pratik araçların toplandığı bir platformdur. Şu an " +
          `${toolCount} kullanılabilir araç, ${activeCategoryCount} aktif kategoride sunuluyor.`,
      },
      {
        question: "Pratikleştir tamamen ücretsiz mi?",
        answer:
          "Evet. Tüm araçlar kayıt olmadan, ücretsiz olarak kullanılabilir. Daha yüksek günlük kredi ve öncelikli işlem gibi ek avantajlar isteyenler için isteğe bağlı bir Pro plan bulunur.",
      },
      {
        question: "Kullanmak için hesap oluşturmam gerekiyor mu?",
        answer:
          "Hayır, araçların çoğunu kayıt olmadan doğrudan kullanabilirsin. Hesap oluşturmak yalnızca daha yüksek günlük kredi limiti ve ek özellikler istediğinde gerekir.",
      },
      {
        question: "Mobil telefondan kullanabilir miyim?",
        answer:
          "Evet. Tüm araçlar mobil tarayıcılarla uyumlu şekilde tasarlanmıştır; ek bir uygulama indirmene gerek yoktur.",
      },
      {
        question: "Uygulama indirmem gerekiyor mu?",
        answer:
          "Hayır. Pratikleştir tamamen web tabanlıdır, herhangi bir masaüstü veya mobil uygulama indirmene gerek kalmadan doğrudan tarayıcından kullanabilirsin.",
      },
    ],
  },
  {
    title: "Gizlilik ve Güvenlik",
    items: [
      {
        question: "Dosyalarım bir sunucuya yükleniyor mu?",
        answer:
          "Hayır. Araçların büyük çoğunluğu işlemi tamamen tarayıcında yapar; dosyaların cihazından çıkmaz. Arka Plan Silici gibi yapay zeka kullanan araçlarda da model tarayıcına indirilip yine cihazında çalışır.",
      },
      {
        question: "Verilerim nerede ve nasıl saklanıyor?",
        answer:
          "Hesap oluşturduğunda yalnızca hesabınla ilgili temel bilgiler (e-posta, şifrenin hash'lenmiş hâli, plan ve kredi bilgisi) yönetilen bir veritabanında saklanır. Ayrıntılar için Gizlilik Politikası sayfamıza bakabilirsin.",
      },
      {
        question: "Hesabımı ve verilerimi silebilir miyim?",
        answer:
          "Evet, istediğin zaman. Ayarlar > Hesap sayfasındaki \"Hesabımı Sil\" seçeneğiyle hesabın ve ilişkili tüm verilerin kalıcı olarak silinir; bu işlem geri alınamaz.",
      },
    ],
  },
  {
    title: "Hesap ve Planlar",
    items: [
      {
        question: "Ücretsiz plan ile Pro plan arasındaki fark nedir?",
        answer:
          "Ücretsiz plan günlük kullanım için yeterli bir kredi limiti sunar. Pro plan; daha yüksek günlük kredi, daha hızlı işlem önceliği, aynı anda birden fazla dosya ve daha yüksek dosya boyutu sınırı sağlar.",
      },
      {
        question: "Günlük kredi ne demek, ne zaman yenileniyor?",
        answer:
          "Bazı araçları kullanmak günlük kredinden düşer; bu, herkesin adil şekilde faydalanabilmesi için konulmuş bir kullanım sınırıdır. Günlük kredin her gün otomatik olarak baştan yenilenir, elle bir işlem yapmana gerek yoktur.",
      },
      {
        question: "Pro plana nasıl geçebilirim, istediğim zaman iptal edebilir miyim?",
        answer:
          "Hesabına giriş yaptıktan sonra Planlar sayfasından Pro plana yükseltebilirsin. Plan yükseltme ve iptali istediğin an yapılabilir, gizli bir ücret veya taahhüt yoktur.",
      },
      {
        question: "Şifremi unuttum, ne yapmalıyım?",
        answer:
          "Giriş sayfasındaki \"Şifremi unuttum\" bağlantısına tıklayıp hesabına kayıtlı e-posta adresini girerek şifre sıfırlama bağlantısı alabilirsin. Google ile giriş yaptıysan bu adım gerekmez, doğrudan Google hesabınla giriş yapabilirsin.",
      },
    ],
  },
  {
    title: "Araçlar Hakkında",
    items: [
      {
        question: "Kaç araç ve kategori sunuyorsunuz?",
        answer: `Şu an ${toolCount} kullanılabilir araç, ${activeCategoryCount} aktif kategoride toplanıyor. Kütüphane düzenli olarak yeni araçlarla büyümeye devam ediyor.`,
      },
      {
        question: "Aradığım araç listede \"yakında\" yazıyor, ne zaman gelecek?",
        answer:
          "Bu araçlar geliştirme aşamasındadır ve yakında kullanıma açılacaktır; kesin bir tarih taahhüt edemiyoruz ama kütüphane düzenli olarak güncelleniyor. Hangi aracın öncelikli olmasını istediğini bize iletişim sayfasından bildirebilirsin.",
      },
      {
        question: "Yeni bir araç önerebilir miyim?",
        answer:
          "Elbette. İletişim sayfamızdan önerini bize iletebilirsin; kullanıcı önerileri yeni araç kararlarımızda önemli bir girdi oluşturuyor.",
      },
      {
        question: "Bir araçla ilgili sorun yaşarsam ne yapmalıyım?",
        answer:
          "İletişim sayfamızdan bize ulaşabilirsin. Hangi aracı kullandığını, ne yapmaya çalıştığını ve karşılaştığın hatayı belirtmen sorunu daha hızlı çözmemize yardımcı olur.",
      },
    ],
  },
];

const allFaqItems = faqGroups.flatMap((group) => group.items);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Page() {
  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Sık Sorulan Sorular" },
  ];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema(breadcrumbItems)).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="w-full max-w-2xl">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Sık Sorulan Sorular
          </h1>
          <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {SITE_NAME} hakkında en çok sorulan sorular ve yanıtları. Aradığın
            cevabı burada bulamazsan{" "}
            <a
              href="/iletisim"
              className="font-medium text-purple-600 underline underline-offset-2 dark:text-purple-400"
            >
              iletişim sayfamızdan
            </a>{" "}
            bize ulaşabilirsin.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {faqGroups.map((group) => (
            <section key={group.title}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                {group.title}
              </h2>
              <div className="flex flex-col divide-y divide-black/[.06] rounded-2xl border border-black/[.08] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#1c1c1f]">
                {group.items.map((item) => (
                  <details key={item.question} className="group px-5 py-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-black marker:content-none dark:text-zinc-50">
                      {item.question}
                    </summary>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

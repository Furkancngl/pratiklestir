import Reveal from "./reveal";
import { tools } from "../lib/tools";
import { categories } from "../lib/categories";

const toolCount = tools.filter((tool) => tool.available).length;

const faqItems = [
  {
    question: "Pratikleştir tamamen ücretsiz mi?",
    answer:
      "Evet. Tüm araçlar kayıt olmadan, ücretsiz olarak kullanılabilir. Daha yüksek günlük kredi ve öncelikli işlem gibi ek avantajlar isteyenler için isteğe bağlı bir Pro plan bulunur.",
  },
  {
    question: "Dosyalarım bir sunucuya yükleniyor mu?",
    answer:
      "Hayır. Araçların büyük çoğunluğu işlemi tamamen tarayıcında yapar; dosyaların cihazından çıkmaz. Arka Plan Silici gibi yapay zeka kullanan araçlarda model tarayıcına indirilip yine cihazında çalışır.",
  },
  {
    question: "Kullanmak için hesap oluşturmam gerekiyor mu?",
    answer:
      "Hayır, araçların çoğunu kayıt olmadan doğrudan kullanabilirsin. Hesap oluşturmak yalnızca daha yüksek günlük kredi limiti ve ek özellikler istediğinde gerekir.",
  },
  {
    question: "Kaç araç ve kategori sunuyorsunuz?",
    answer: `Şu an ${toolCount} kullanılabilir araç, ${categories.filter((c) => c.hasAvailableTools).length} aktif kategoride toplanıyor. Kütüphane düzenli olarak yeni araçlarla büyümeye devam ediyor.`,
  },
  {
    question: "Mobil telefondan kullanabilir miyim?",
    answer:
      "Evet. Tüm araçlar mobil tarayıcılarla uyumlu şekilde tasarlanmıştır; ek bir uygulama indirmene gerek yoktur.",
  },
  {
    question: "Ücretsiz plan ile Pro plan arasındaki fark nedir?",
    answer:
      "Ücretsiz plan günlük kullanım için yeterli bir kredi limiti sunar. Pro plan; daha yüksek günlük kredi, daha hızlı işlem önceliği, aynı anda birden fazla dosya ve öncelikli destek sağlar.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function HomeFaq() {
  return (
    <div className="mt-16 w-full max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Reveal>
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          Sık Sorulan Sorular
        </h2>
        <div className="flex flex-col divide-y divide-black/[.06] rounded-2xl border border-black/[.08] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#1c1c1f]">
          {faqItems.map((item) => (
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
      </Reveal>
    </div>
  );
}

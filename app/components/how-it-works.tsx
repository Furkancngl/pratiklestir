import Reveal from "./reveal";

const STEPS = [
  {
    numberGradient: "bg-linear-to-br from-purple-500 to-indigo-500 shadow-purple-500/35",
    title: "Aracını Seç",
    description:
      "QR kod oluşturmadan PDF birleştirmeye, arka plan silmeden görsel sıkıştırmaya kadar — kayıt olmadan, doğrudan istediğin aracı tek tıkla aç.",
    badge: "🔓 Kayıt gerekmez",
  },
  {
    numberGradient: "bg-linear-to-br from-indigo-500 to-pink-500 shadow-indigo-500/35",
    title: "Yükle, İşle, İndir",
    description:
      "Dosyanı sürükle-bırak ya da seç, aracın işlemesini bekle, sonucu anında indir. Tüm işlemler tarayıcında yapılır, dosyaların sunucuya hiç yüklenmez.",
    badge: null,
  },
  {
    numberGradient: "bg-linear-to-br from-pink-500 to-orange-500 shadow-pink-500/35",
    title: "(Opsiyonel) Hesap Oluştur",
    description:
      "Daha fazla günlük kredi, toplu işlem ve öncelikli destek için 30 saniyede email ya da Google ile ücretsiz hesap oluştur.",
    badge: "🎉 Kredi kartı gerekmez",
  },
];

export default function HowItWorks() {
  return (
    <div id="how" className="relative mx-auto mt-20 w-full max-w-2xl scroll-mt-20 px-6 pb-8">
      <p className="text-center text-xs font-bold tracking-[0.1em] text-zinc-400 uppercase dark:text-zinc-600">
        Kolay Başlangıç
      </p>
      <h2 className="mt-2 mb-14 text-center text-[28px] font-extrabold tracking-tight text-black dark:text-white">
        3 Adımda Hazırsın
      </h2>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute top-2.5 bottom-2.5 left-7 w-0.5 bg-linear-to-b from-purple-500/50 via-indigo-500/50 to-pink-500/50 opacity-30"
        />

        <div className="flex flex-col">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delayMs={index * 120}>
              <div
                className={`relative flex gap-6 ${
                  index < STEPS.length - 1 ? "pb-14" : ""
                }`}
              >
                <div
                  className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-white shadow-lg ${step.numberGradient}`}
                >
                  {index + 1}
                </div>
                <div className="pt-1.5">
                  <h3 className="mb-2 text-[19px] font-bold tracking-tight text-black dark:text-white">
                    {step.title}
                  </h3>
                  <p className="max-w-[440px] text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                  {step.badge && (
                    <span className="mt-3 inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      {step.badge}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

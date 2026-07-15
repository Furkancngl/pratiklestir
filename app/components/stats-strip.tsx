import Reveal from "./reveal";
import { tools } from "../lib/tools";
import { categories } from "../lib/categories";

// Buradaki her değer tools.ts/categories.ts'den doğrudan sayılır ya da
// üründeki gerçek bir tasarım kararını (tarayıcıda çalışma, kayıtsız
// kullanım) yansıtır - kullanıcı/işlem sayısı gibi henüz ölçmediğimiz bir
// veri burada YER ALMAZ (bkz. AGENTS.md / görev talimatları).
const toolCount = tools.filter((tool) => tool.available).length;
const categoryCount = categories.filter((category) => category.hasAvailableTools).length;

const stats = [
  { value: `${toolCount}+`, label: "Kullanılabilir Araç" },
  { value: `${categoryCount}`, label: "Aktif Kategori" },
  { value: "%100", label: "Tarayıcıda Çalışır" },
  { value: "₺0", label: "Kayıt Olmadan Kullanım" },
];

export default function StatsStrip() {
  return (
    <div className="mt-16 w-full max-w-4xl">
      <Reveal>
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-black/[.08] bg-white p-6 sm:grid-cols-4 dark:border-white/10 dark:bg-[#1c1c1f]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

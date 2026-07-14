import Reveal from "./reveal";
import { categories } from "../lib/categories";
import { tools } from "../lib/tools";

// Ya tamamen "yakında" olan bir kategoriye ait ya da hiç kategorisi olmayan
// (ungrouped) ve henüz kullanılamayan araçlar - bunlara ana akışta tam kart
// ayırmak yerine (tamamı gri/tıklanamaz bir bölüm ziyaretçinin momentumunu
// kırar), en altta kompakt bir liste olarak yer veriyoruz.
const comingSoonOnlyGroups = new Set(
  categories.filter((category) => !category.hasAvailableTools).map((category) => category.name)
);

const comingSoonTools = tools.filter(
  (tool) => !tool.available && (!tool.group || comingSoonOnlyGroups.has(tool.group))
);

export default function ComingSoonStrip() {
  if (comingSoonTools.length === 0) return null;

  return (
    <div id="yakinda" className="mt-16 w-full max-w-3xl scroll-mt-20">
      <Reveal>
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          Yakında Gelecekler
        </h2>
        <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-black/[.06] bg-black/[.02] p-4 dark:border-white/[.06] dark:bg-white/[.02]">
          {comingSoonTools.map((tool) => (
            <span
              key={tool.name}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {tool.name}
              <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                yakında
              </span>
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

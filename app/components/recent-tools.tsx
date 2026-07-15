import AnimatedCard from "./animated-card";
import Reveal from "./reveal";
import { tools } from "../lib/tools";

const RECENT_COUNT = 4;

// tools.ts'deki yorum tek kaynak kuralını belirtir: yeni bir araç eklemenin
// tek yolu diziye yeni bir obje eklemektir - bu da yeni araçların dizinin
// sonuna eklendiği anlamına gelir. Ayrı bir "eklenme tarihi" alanı
// tutmadan, bu sırayı gerçek ve güncel kalan bir "en yeni" sinyali olarak
// kullanıyoruz.
const recentTools = tools.filter((tool) => tool.available).slice(-RECENT_COUNT).reverse();

export default function RecentTools() {
  if (recentTools.length === 0) return null;

  return (
    <div className="mt-16 w-full max-w-4xl">
      <Reveal>
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          🆕 Yeni Eklenen Araçlar
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {recentTools.map((tool, index) => (
          <Reveal key={tool.name} delayMs={index * 90}>
            <AnimatedCard
              title={tool.name}
              description={tool.description}
              accentClassName={tool.accentClassName}
              href={tool.href}
              badge="Yeni"
              beta={tool.beta}
              icon={tool.icon}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

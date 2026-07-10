import AnimatedCard from "./components/animated-card";
import { toolIcons } from "./components/icons";
import PromoBanner from "./components/promo-banner";
import Reveal from "./components/reveal";
import { tools, type Tool } from "./lib/tools";

const ungroupedTools = tools.filter((tool) => !tool.group);
const groupedTools = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
  if (tool.group) {
    acc[tool.group] = [...(acc[tool.group] ?? []), tool];
  }
  return acc;
}, {});

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="flex max-w-xl flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Pratikleştir&apos;e Hoş Geldiniz
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Günlük işlerini hızlandıran, ücretsiz ve kullanımı kolay küçük
          araçlar sunuyoruz. Başlamak için aşağıdan bir araç seç.
        </p>
      </div>

      <PromoBanner />

      <div id="araclar" className="w-full max-w-3xl pt-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ungroupedTools.map((tool, index) => (
            <Reveal key={tool.name} delayMs={(index % 6) * 90}>
              <AnimatedCard
                title={tool.name}
                description={tool.description}
                accentClassName={tool.accentClassName}
                href={tool.available ? tool.href : undefined}
                badge={tool.available ? undefined : "yakında"}
                beta={tool.beta}
                icon={toolIcons[tool.href]}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {Object.entries(groupedTools).map(([groupName, groupTools]) => (
        <div key={groupName} className="mt-12 w-full max-w-3xl">
          <Reveal>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              {groupName} Araçları
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groupTools.map((tool, index) => (
              <Reveal key={tool.name} delayMs={(index % 6) * 90}>
                <AnimatedCard
                  title={tool.name}
                  description={tool.description}
                  accentClassName={tool.accentClassName}
                  href={tool.available ? tool.href : undefined}
                  badge={tool.available ? undefined : "yakında"}
                  beta={tool.beta}
                  icon={toolIcons[tool.href]}
                />
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

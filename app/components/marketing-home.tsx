import Link from "next/link";
import AnimatedCard from "./animated-card";
import HowItWorks from "./how-it-works";
import HowItWorksButton from "./how-it-works-button";
import { toolIcons } from "./icons";
import PromoBanner from "./promo-banner";
import Reveal from "./reveal";
import { tools, type Tool } from "../lib/tools";

const ungroupedTools = tools.filter((tool) => !tool.group);
const groupedTools = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
  if (tool.group) {
    acc[tool.group] = [...(acc[tool.group] ?? []), tool];
  }
  return acc;
}, {});

export default function MarketingHome() {
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
        <HowItWorksButton />
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

      <Reveal>
        <Link
          href="/kayit"
          className="mt-14 inline-block text-center text-base font-semibold tracking-tight transition-[transform,opacity]! duration-200! hover:scale-105 hover:opacity-80 sm:text-lg"
        >
          <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Hemen ücretsiz kayıt ol, +50 araca daha erişim kazan
          </span>
        </Link>
      </Reveal>

      <HowItWorks />
    </div>
  );
}

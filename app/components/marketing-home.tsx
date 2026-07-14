import Link from "next/link";
import dynamic from "next/dynamic";
import AnimatedCard from "./animated-card";
import CategoryNav from "./category-nav";
import ComingSoonStrip from "./coming-soon-strip";
import FinalCta from "./final-cta";
import Hero from "./hero";
import HowItWorks from "./how-it-works";
import MoreToolsCta from "./more-tools-cta";
import PopularTools from "./popular-tools";
import Reveal from "./reveal";
import TrustBadges from "./trust-badges";
import { tools, type Tool } from "../lib/tools";
import { categories } from "../lib/categories";

// framer-motion kullanan alt-katlanmış (below-the-fold) bölüm; ayrı chunk'a
// alınarak ana marketing sayfası JS paketinden çıkarılır.
const Testimonials = dynamic(() => import("./testimonials"));

const PREVIEW_COUNT = 2;

const groupedTools = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
  if (tool.group) {
    acc[tool.group] = [...(acc[tool.group] ?? []), tool];
  }
  return acc;
}, {});

// Ana akışta yalnızca en az bir kullanılabilir aracı olan kategoriler
// gösterilir; tamamı "yakında" olan kategoriler (bkz. Category.hasAvailableTools)
// momentum kırmasın diye en alttaki ComingSoonStrip'e taşınır.
const activeCategoryEntries = categories
  .filter((category) => category.hasAvailableTools)
  .map((category) => [category.name, groupedTools[category.name] ?? []] as const);

const availableUngroupedTools = tools.filter((tool) => !tool.group && tool.available);

export default function MarketingHome() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <Hero />

      <TrustBadges />

      <CategoryNav />

      <PopularTools />

      <div id="araclar" className="w-full max-w-3xl pt-16">
        {activeCategoryEntries.map(([groupName, groupTools], index) => {
          const category = categories.find((c) => c.name === groupName);

          return (
            <div key={groupName} className={index === 0 ? "" : "mt-12"}>
              <Reveal>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                  {category ? (
                    <Link
                      href={`/${category.slug}`}
                      className="hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {groupName} Araçları
                    </Link>
                  ) : (
                    `${groupName} Araçları`
                  )}
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {groupTools.slice(0, PREVIEW_COUNT).map((tool, cardIndex) => (
                  <Reveal key={tool.name} delayMs={(cardIndex % 6) * 90}>
                    <AnimatedCard
                      title={tool.name}
                      description={tool.description}
                      accentClassName={tool.accentClassName}
                      href={tool.available ? tool.href : undefined}
                      badge={tool.available ? undefined : "yakında"}
                      beta={tool.beta}
                      icon={tool.icon}
                    />
                  </Reveal>
                ))}
              </div>
              {groupTools.length > PREVIEW_COUNT && (
                <MoreToolsCta count={groupTools.length - PREVIEW_COUNT} />
              )}
            </div>
          );
        })}

        {availableUngroupedTools.length > 0 && (
          <div className="mt-12">
            <Reveal>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                Araçlarımız
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {availableUngroupedTools.slice(0, PREVIEW_COUNT).map((tool, index) => (
                <Reveal key={tool.name} delayMs={(index % 6) * 90}>
                  <AnimatedCard
                    title={tool.name}
                    description={tool.description}
                    accentClassName={tool.accentClassName}
                    href={tool.href}
                    beta={tool.beta}
                    icon={tool.icon}
                  />
                </Reveal>
              ))}
            </div>
            {availableUngroupedTools.length > PREVIEW_COUNT && (
              <MoreToolsCta count={availableUngroupedTools.length - PREVIEW_COUNT} />
            )}
          </div>
        )}
      </div>

      <ComingSoonStrip />

      <Reveal className="mt-16 w-full max-w-2xl">
        <FinalCta />
      </Reveal>

      <HowItWorks />

      <Testimonials />
    </div>
  );
}

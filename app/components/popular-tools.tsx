import AnimatedCard from "./animated-card";
import Reveal from "./reveal";
import { tools } from "../lib/tools";

const popularTools = tools.filter((tool) => tool.popular);

export default function PopularTools() {
  if (popularTools.length === 0) return null;

  return (
    <div className="mt-14 w-full max-w-4xl">
      <Reveal>
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          🔥 En Popüler Araçlar
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {popularTools.map((tool, index) => (
          <Reveal key={tool.name} delayMs={index * 90}>
            <AnimatedCard
              title={tool.name}
              description={tool.description}
              accentClassName={tool.accentClassName}
              href={tool.available ? tool.href : undefined}
              badge="Popüler"
              beta={tool.beta}
              icon={tool.icon}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

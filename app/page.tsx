import AnimatedCard from "./components/animated-card";
import { tools } from "./lib/tools";

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

      <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <AnimatedCard
            key={tool.name}
            title={tool.name}
            description={tool.description}
            accentClassName={tool.accentClassName}
            href={tool.available ? tool.href : undefined}
            badge={tool.available ? undefined : "yakında"}
            beta={tool.beta}
          />
        ))}
      </div>
    </div>
  );
}

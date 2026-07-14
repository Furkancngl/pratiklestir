import Link from "next/link";
import type { Tool } from "../lib/tools";
import { type ToolScenario, getScenariosForTool } from "../lib/tool-scenarios";
import { getScenarioFaqJsonLd } from "../lib/scenario-metadata";

// ToolSeoSections'ın senaryo karşılığı - kasıtlı olarak "Araç Hakkında /
// Nasıl Kullanılır / Avantajları" bölümlerini TEKRARLAMAZ (bunlar ana araç
// sayfasında zaten var ve aynen kopyalamak thin/duplicate content
// oluştururdu). Bunun yerine yalnızca bu senaryoya özel içerik render eder:
// giriş, pratik ipuçları ve kendi SSS'si.
export default function ScenarioSeoSections({
  tool,
  scenario,
}: {
  tool: Tool;
  scenario: ToolScenario;
}) {
  const faqJsonLd = getScenarioFaqJsonLd(scenario);
  const siblingScenarios = getScenariosForTool(tool.href).filter(
    (s) => s.slug !== scenario.slug
  );

  return (
    <section className="flex w-full flex-1 flex-col items-center bg-zinc-50 px-6 pb-20 dark:bg-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="flex w-full max-w-2xl flex-col gap-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Bu Senaryo Hakkında
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {scenario.intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Pratik İpuçları
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {scenario.tips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/10 dark:bg-zinc-950"
              >
                <p className="text-sm font-semibold text-black dark:text-zinc-50">
                  {tip.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {tip.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Sık Sorulan Sorular
          </h2>
          <div className="mt-3 flex flex-col divide-y divide-black/[.06] rounded-xl border border-black/[.08] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-zinc-950">
            {scenario.faq.map((item) => (
              <details key={item.question} className="group px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-medium text-black marker:content-none dark:text-zinc-50">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/[.08] pt-6 dark:border-white/10">
          <Link
            href={tool.href}
            className="text-sm font-medium text-black underline-offset-2 hover:underline dark:text-zinc-50"
          >
            ← Genel {tool.name} sayfasına dön
          </Link>

          {siblingScenarios.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-black dark:text-zinc-50">
                Diğer kullanım senaryoları
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {siblingScenarios.map((sibling) => (
                  <li key={sibling.slug}>
                    <Link
                      href={`${tool.href}/${sibling.slug}`}
                      className="text-sm text-purple-600 hover:underline dark:text-purple-400"
                    >
                      {sibling.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

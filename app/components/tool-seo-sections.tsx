import Link from "next/link";
import { tools, type Tool } from "../lib/tools";
import { getToolSeoContent, getToolJsonLd } from "../lib/tool-metadata";
import { getCategoryForTool } from "../lib/categories";
import AnimatedCard from "./animated-card";

// Aynı gruptaki araçlar önceliklendirilir, grup dolmazsa (veya doldurmaya
// yetmezse) diğer aktif araçlarla tamamlanır. Yeni bir araç `tools.ts`de
// available:true olarak eklendiğinde otomatik olarak öneri havuzuna dahil
// olur - burada elle bir güncelleme gerekmez.
function getRelatedTools(tool: Tool, max = 3): Tool[] {
  const others = tools.filter((t) => t.available && t.href !== tool.href);
  const sameGroup = tool.group
    ? others.filter((t) => t.group === tool.group)
    : [];
  const rest = others.filter((t) => !sameGroup.includes(t));
  return [...sameGroup, ...rest].slice(0, max);
}

export default function ToolSeoSections({ tool }: { tool: Tool }) {
  const seo = getToolSeoContent(tool);
  const related = getRelatedTools(tool);
  const category = getCategoryForTool(tool);
  const jsonLd = getToolJsonLd(tool);

  return (
    <section className="flex w-full flex-1 flex-col items-center bg-zinc-50 px-6 pb-20 dark:bg-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="flex w-full max-w-2xl flex-col gap-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Araç Hakkında
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {seo.about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Nasıl Kullanılır?
          </h2>
          <ol className="mt-3 flex flex-col gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {seo.howTo.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-zinc-700 dark:bg-white/10 dark:text-zinc-300">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Avantajları
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {seo.advantages.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Sık Sorulan Sorular
          </h2>
          <div className="mt-3 flex flex-col divide-y divide-black/[.06] rounded-xl border border-black/[.08] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-zinc-950">
            {seo.faq.map((item) => (
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

        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
              Benzer Araçlar
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((relatedTool) => (
                <AnimatedCard
                  key={relatedTool.href}
                  title={relatedTool.name}
                  description={relatedTool.description}
                  accentClassName={relatedTool.accentClassName}
                  href={relatedTool.href}
                  beta={relatedTool.beta}
                  icon={relatedTool.icon}
                />
              ))}
            </div>
            {category && (
              <Link
                href={`/${category.slug}`}
                className="mt-4 inline-block text-sm font-medium text-black underline-offset-2 hover:underline dark:text-zinc-50"
              >
                Tüm {category.name} araçlarını gör →
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

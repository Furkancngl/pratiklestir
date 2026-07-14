import type { Tool } from "../lib/tools";
import type { ToolScenario } from "../lib/tool-scenarios";
import { getCategoryForTool } from "../lib/categories";
import { buildBreadcrumbSchema } from "../lib/breadcrumb-schema";
import Breadcrumbs from "./breadcrumbs";

// ToolBreadcrumbs ile aynı desen, tek fark: aracın kendisi de tıklanabilir
// bir ara adım olarak eklenir (Ana Sayfa > Kategori > Araç > Senaryo),
// böylece kullanıcı senaryo sayfasından genel araç sayfasına kolayca döner.
export default function ScenarioBreadcrumbs({
  tool,
  scenario,
}: {
  tool: Tool;
  scenario: ToolScenario;
}) {
  const category = getCategoryForTool(tool);

  const items = [
    { name: "Ana Sayfa", href: "/" },
    ...(category
      ? [{ name: `${category.name} Araçları`, href: `/${category.slug}` }]
      : []),
    { name: tool.name, href: tool.href },
    { name: scenario.h1 },
  ];

  return (
    <div className="w-full bg-zinc-50 px-6 pt-6 dark:bg-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema(items)).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <div className="mx-auto w-full max-w-2xl">
        <Breadcrumbs items={items} />
      </div>
    </div>
  );
}

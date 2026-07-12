import type { Tool } from "../lib/tools";
import { getCategoryForTool } from "../lib/categories";
import { buildBreadcrumbSchema } from "../lib/breadcrumb-schema";
import Breadcrumbs from "./breadcrumbs";

export default function ToolBreadcrumbs({ tool }: { tool: Tool }) {
  const category = getCategoryForTool(tool);

  const items = [
    { name: "Ana Sayfa", href: "/" },
    ...(category
      ? [{ name: `${category.name} Araçları`, href: `/${category.slug}` }]
      : []),
    { name: tool.name },
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

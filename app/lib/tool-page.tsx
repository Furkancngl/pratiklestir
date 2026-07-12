import type { ComponentType } from "react";
import type { Metadata } from "next";
import { tools } from "./tools";
import { getToolMetadata } from "./tool-metadata";
import ToolBreadcrumbs from "../components/tool-breadcrumbs";
import ToolSeoSections from "../components/tool-seo-sections";

// Her araç sayfasının tek yapması gereken şey: kendi page.tsx'inde bu
// fonksiyonu çağırmak. Breadcrumb, SEO H2 bölümleri, FAQ, "Benzer Araçlar"
// ve schema.org verisi burada merkezi olarak bağlanır - araç sayfaları bunu
// tekrar tekrar yazmaz.
//
// Kullanım (app/<araç>/page.tsx):
//   import { createToolPage } from "@/app/lib/tool-page";
//   import ToolClient from "./page-client";
//
//   const toolPage = createToolPage("/araç-href", ToolClient);
//   export const metadata = toolPage.metadata;
//   export default toolPage.Page;
export function createToolPage(
  href: string,
  ClientComponent: ComponentType
): { metadata: Metadata; Page: ComponentType } {
  const found = tools.find((t) => t.href === href);
  if (!found) {
    throw new Error(`tools.ts içinde ${href} için kayıt bulunamadı.`);
  }
  const tool = found;

  function Page() {
    return (
      <>
        <ToolBreadcrumbs tool={tool} />
        <ClientComponent />
        <ToolSeoSections tool={tool} />
      </>
    );
  }

  return { metadata: getToolMetadata(href), Page };
}

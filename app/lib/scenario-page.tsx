import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "./tools";
import { getToolScenario } from "./tool-scenarios";
import { getScenarioMetadata } from "./scenario-metadata";
import ScenarioBreadcrumbs from "../components/scenario-breadcrumbs";
import ScenarioSeoSections from "../components/scenario-seo-sections";

export type ScenarioClientComponent = ComponentType<{
  heading?: string;
  description?: string;
}>;

// Her araç sayfasının kendi createToolPage(...) çağrısı gibi, her senaryo
// rotası da (app/<araç>/[scenario]/page.tsx) bu iki fonksiyonu çağırır -
// gerçek içerik/mantık burada ve tool-scenarios.ts'de merkezi, rota
// dosyalarında yalnızca hangi aracın hangi component'i kullandığı bilgisi
// tekrarlanır.
export async function generateScenarioMetadata(
  toolHref: string,
  scenarioSlug: string
): Promise<Metadata> {
  const tool = tools.find((t) => t.href === toolHref);
  const scenario = tool ? getToolScenario(toolHref, scenarioSlug) : undefined;
  if (!tool || !scenario) return {};
  return getScenarioMetadata(tool, scenario);
}

export function ScenarioPage({
  toolHref,
  scenarioSlug,
  ClientComponent,
}: {
  toolHref: string;
  scenarioSlug: string;
  ClientComponent: ScenarioClientComponent;
}) {
  const tool = tools.find((t) => t.href === toolHref);
  const scenario = tool ? getToolScenario(toolHref, scenarioSlug) : undefined;
  if (!tool || !scenario) notFound();

  return (
    <>
      <ScenarioBreadcrumbs tool={tool} scenario={scenario} />
      <ClientComponent heading={scenario.h1} description={scenario.shortLede} />
      <ScenarioSeoSections tool={tool} scenario={scenario} />
    </>
  );
}

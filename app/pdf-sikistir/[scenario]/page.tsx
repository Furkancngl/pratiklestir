import { ScenarioPage, generateScenarioMetadata } from "@/app/lib/scenario-page";
import { getScenariosForTool } from "@/app/lib/tool-scenarios";
import PdfSikistirPage from "../page-client";

const TOOL_HREF = "/pdf-sikistir";

export function generateStaticParams() {
  return getScenariosForTool(TOOL_HREF).map((scenario) => ({
    scenario: scenario.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;
  return generateScenarioMetadata(TOOL_HREF, scenario);
}

export default async function Page({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;
  return (
    <ScenarioPage
      toolHref={TOOL_HREF}
      scenarioSlug={scenario}
      ClientComponent={PdfSikistirPage}
    />
  );
}

import { ScenarioPage, generateScenarioMetadata } from "@/app/lib/scenario-page";
import { getScenariosForTool } from "@/app/lib/tool-scenarios";
import GorselSikistirPage from "../page-client";

const TOOL_HREF = "/gorsel-sikistir";

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
      ClientComponent={GorselSikistirPage}
    />
  );
}

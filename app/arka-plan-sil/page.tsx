import { createToolPage } from "@/app/lib/tool-page";
import ArkaPlanSilPage from "./page-client";

const toolPage = createToolPage("/arka-plan-sil", ArkaPlanSilPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

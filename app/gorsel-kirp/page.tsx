import { createToolPage } from "@/app/lib/tool-page";
import GorselKirpPage from "./page-client";

const toolPage = createToolPage("/gorsel-kirp", GorselKirpPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

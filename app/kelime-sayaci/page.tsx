import { createToolPage } from "@/app/lib/tool-page";
import KelimeSayaciPage from "./page-client";

const toolPage = createToolPage("/kelime-sayaci", KelimeSayaciPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

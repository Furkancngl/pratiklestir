import { createToolPage } from "@/app/lib/tool-page";
import JpgPdfPage from "./page-client";

const toolPage = createToolPage("/jpg-pdf", JpgPdfPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

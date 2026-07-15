import { createToolPage } from "@/app/lib/tool-page";
import PdfSayfaSilPage from "./page-client";

const toolPage = createToolPage("/pdf-sayfa-sil", PdfSayfaSilPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

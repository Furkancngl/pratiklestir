import { createToolPage } from "@/app/lib/tool-page";
import PdfBolPage from "./page-client";

const toolPage = createToolPage("/pdf-bol", PdfBolPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

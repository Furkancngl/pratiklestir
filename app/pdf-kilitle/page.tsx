import { createToolPage } from "@/app/lib/tool-page";
import PdfKilitlePage from "./page-client";

const toolPage = createToolPage("/pdf-kilitle", PdfKilitlePage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

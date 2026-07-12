import { createToolPage } from "@/app/lib/tool-page";
import PdfSikistirPage from "./page-client";

const toolPage = createToolPage("/pdf-sikistir", PdfSikistirPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

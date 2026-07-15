import { createToolPage } from "@/app/lib/tool-page";
import PdfKilitKaldirPage from "./page-client";

const toolPage = createToolPage("/pdf-kilit-kaldir", PdfKilitKaldirPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

import { createToolPage } from "@/app/lib/tool-page";
import PdfJpgPage from "./page-client";

const toolPage = createToolPage("/pdf-jpg", PdfJpgPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

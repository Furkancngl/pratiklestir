import { createToolPage } from "@/app/lib/tool-page";
import PdfBirlestirPage from "./page-client";

const toolPage = createToolPage("/pdf-birlestir", PdfBirlestirPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

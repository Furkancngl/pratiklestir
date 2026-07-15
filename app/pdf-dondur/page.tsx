import { createToolPage } from "@/app/lib/tool-page";
import PdfDondurPage from "./page-client";

const toolPage = createToolPage("/pdf-dondur", PdfDondurPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

import { createToolPage } from "@/app/lib/tool-page";
import YuzdeHesaplaPage from "./page-client";

const toolPage = createToolPage("/yuzde-hesapla", YuzdeHesaplaPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

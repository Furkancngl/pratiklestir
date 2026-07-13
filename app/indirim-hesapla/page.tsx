import { createToolPage } from "@/app/lib/tool-page";
import IndirimHesaplaPage from "./page-client";

const toolPage = createToolPage("/indirim-hesapla", IndirimHesaplaPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

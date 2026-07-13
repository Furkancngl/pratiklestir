import { createToolPage } from "@/app/lib/tool-page";
import KrediHesaplaPage from "./page-client";

const toolPage = createToolPage("/kredi-hesapla", KrediHesaplaPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

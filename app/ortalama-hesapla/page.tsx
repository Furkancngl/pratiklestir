import { createToolPage } from "@/app/lib/tool-page";
import OrtalamaHesaplaPage from "./page-client";

const toolPage = createToolPage("/ortalama-hesapla", OrtalamaHesaplaPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

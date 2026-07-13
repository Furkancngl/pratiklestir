import { createToolPage } from "@/app/lib/tool-page";
import DovizHesaplaPage from "./page-client";

const toolPage = createToolPage("/doviz-hesapla", DovizHesaplaPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

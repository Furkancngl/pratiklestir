import { createToolPage } from "@/app/lib/tool-page";
import KdvHesaplaPage from "./page-client";

const toolPage = createToolPage("/kdv-hesapla", KdvHesaplaPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

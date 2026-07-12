import { createToolPage } from "@/app/lib/tool-page";
import SifreOlusturucuPage from "./page-client";

const toolPage = createToolPage("/sifre-olusturucu", SifreOlusturucuPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

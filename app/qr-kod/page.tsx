import { createToolPage } from "@/app/lib/tool-page";
import QrKodPage from "./page-client";

const toolPage = createToolPage("/qr-kod", QrKodPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

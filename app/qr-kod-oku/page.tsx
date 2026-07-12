import { createToolPage } from "@/app/lib/tool-page";
import QrKodOkuPage from "./page-client";

const toolPage = createToolPage("/qr-kod-oku", QrKodOkuPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

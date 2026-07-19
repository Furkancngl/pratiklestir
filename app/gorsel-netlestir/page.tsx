import { createToolPage } from "@/app/lib/tool-page";
import GorselNetlestirPage from "./page-client";

const toolPage = createToolPage("/gorsel-netlestir", GorselNetlestirPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

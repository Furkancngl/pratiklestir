import { createToolPage } from "@/app/lib/tool-page";
import GorselSikistirPage from "./page-client";

const toolPage = createToolPage("/gorsel-sikistir", GorselSikistirPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

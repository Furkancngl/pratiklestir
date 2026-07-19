import { createToolPage } from "@/app/lib/tool-page";
import GorselBoyutlandirPage from "./page-client";

const toolPage = createToolPage("/gorsel-boyutlandir", GorselBoyutlandirPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

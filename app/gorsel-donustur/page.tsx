import { createToolPage } from "@/app/lib/tool-page";
import GorselDonusturPage from "./page-client";

const toolPage = createToolPage("/gorsel-donustur", GorselDonusturPage);

export const metadata = toolPage.metadata;
export default toolPage.Page;

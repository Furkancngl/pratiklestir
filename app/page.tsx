import type { Metadata } from "next";
import { auth } from "@/auth";
import LoggedInHome from "./components/logged-in-home";
import MarketingHome from "./components/marketing-home";
import { SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
      <LoggedInHome name={session.user.name} plan={session.user.plan} />
    );
  }

  return <MarketingHome />;
}

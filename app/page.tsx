import { auth } from "@/auth";
import LoggedInHome from "./components/logged-in-home";
import MarketingHome from "./components/marketing-home";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
      <LoggedInHome name={session.user.name} plan={session.user.plan} />
    );
  }

  return <MarketingHome />;
}

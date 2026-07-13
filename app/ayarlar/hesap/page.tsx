import { requireCurrentUser } from "@/app/lib/current-user";
import AccountSettings from "./account-settings";

export default async function AyarlarHesapPage() {
  const user = await requireCurrentUser();

  return <AccountSettings email={user.email} hasPassword={user.passwordHash !== null} />;
}

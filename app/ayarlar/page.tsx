import { requireCurrentUser } from "@/app/lib/current-user";
import GeneralSettingsForm from "./general-settings-form";

export default async function AyarlarGenelPage() {
  const user = await requireCurrentUser();

  return (
    <GeneralSettingsForm
      name={user.name}
      email={user.email}
      plan={user.plan}
      memberSinceLabel={user.createdAt.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    />
  );
}

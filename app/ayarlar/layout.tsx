import { requireCurrentUser } from "@/app/lib/current-user";
import SettingsSidebar from "./settings-sidebar";

export default async function AyarlarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <SettingsSidebar
        userName={user.name}
        userEmail={user.email}
        userPlan={user.plan}
      />
      <div className="flex flex-1 justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[640px]">{children}</div>
      </div>
    </div>
  );
}

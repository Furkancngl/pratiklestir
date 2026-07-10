import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin";
import AdminSidebar from "@/app/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <AdminSidebar
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userPlan={session?.user?.plan}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

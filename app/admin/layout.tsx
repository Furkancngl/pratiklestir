import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin";
import AdminSidebar from "@/app/components/admin-sidebar";

// Yetkisiz erişim zaten sunucu tarafında "/" e yönlendiriliyor (aşağıda);
// bu noindex, o yönlendirme mantığı ileride değişse bile arama motorlarının
// admin sayfalarını indekslememesi için ek güvenlik katmanı.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Login+admin gerektiren, tamamen dinamik bir subtree - statik kabuk
// hedeflenmiyor. auth() (cookies() okur) yine de Cache Components altında
// <Suspense> ile sarılı olmak zorunda, aksi halde build hata verir;
// davranış aynı kalıyor.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

async function AdminLayoutContent({
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
      {/* Sidebar.tsx'teki aynı sabit (fixed) genişlik düzeltmesi - bkz.
          app-chrome.tsx yorumu. */}
      <div className="flex flex-1 flex-col md:pl-[250px]">{children}</div>
    </div>
  );
}

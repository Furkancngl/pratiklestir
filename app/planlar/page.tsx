import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PlanCards from "./plan-cards";

function buildProCheckoutUrl(email: string | null | undefined): string | null {
  const base = process.env.GUMROAD_PRODUCT_URL;
  if (!base) return null;

  const url = new URL(base);
  url.searchParams.set("wanted", "true");
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

// Login gerektiren, tamamen dinamik bir sayfa - statik kabuk hedeflenmiyor.
// auth() (cookies() okur) yine de Cache Components altında <Suspense> ile
// sarılı olmak zorunda, aksi halde build hata verir; davranış aynı kalıyor.
export default function PlanlarPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 bg-zinc-50 dark:bg-[#0a0a0f]" />}>
      <PlanlarContent />
    </Suspense>
  );
}

async function PlanlarContent() {
  const session = await auth();
  if (!session?.user) {
    redirect("/giris");
  }

  const proCheckoutUrl = buildProCheckoutUrl(session.user.email);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-[#0a0a0f]">
      <div className="w-full max-w-[900px]">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-[28px] font-extrabold tracking-tight text-black dark:text-white">
            Sana Uygun Planı Seç
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            İstediğin zaman yükselt veya iptal et, gizli ücret yok.
          </p>
        </div>

        <PlanCards proCheckoutUrl={proCheckoutUrl} />
      </div>
    </div>
  );
}

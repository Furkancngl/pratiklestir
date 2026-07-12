import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PlanCards from "./plan-cards";

export default async function PlanlarPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/giris");
  }

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

        <PlanCards />
      </div>
    </div>
  );
}

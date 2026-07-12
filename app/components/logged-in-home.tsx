import AnimatedCard from "./animated-card";
import DashboardCard from "./dashboard-card";
import { toolIcons } from "./icons";
import PlanBadge from "./plan-badge";
import QuickAccessMore from "./quick-access-more";
import RecentActivityCard from "./recent-activity-card";
import Reveal from "./reveal";
import { tools } from "../lib/tools";

const featuredHrefs = ["/qr-kod", "/pdf-birlestir"];
const quickAccessTools = featuredHrefs
  .map((href) => tools.find((tool) => tool.href === href))
  .filter((tool): tool is (typeof tools)[number] => tool != null);

export default function LoggedInHome({
  name,
  plan,
}: {
  name?: string | null;
  plan?: string | null;
}) {
  const isFree = (plan ?? "free").toLowerCase() === "free";

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Hoş geldin, {name || "Kullanıcı"} 👋
        </h1>
        <div className="flex items-center gap-3">
          <PlanBadge plan={plan} />
          {isFree && (
            <button
              type="button"
              className="touch-manipulation rounded-md bg-linear-to-r from-purple-500 to-indigo-500 px-3 py-2 text-sm font-medium text-white shadow-md shadow-purple-500/25 transition-all! duration-200! hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/35"
            >
              Pro&apos;ya Geç
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickAccessTools.map((tool, index) => (
              <Reveal key={tool.name} delayMs={(index % 6) * 90}>
                <AnimatedCard
                  title={tool.name}
                  description={tool.description}
                  accentClassName={tool.accentClassName}
                  href={tool.href}
                  beta={tool.beta}
                  icon={toolIcons[tool.href]}
                />
              </Reveal>
            ))}
          </div>
          <QuickAccessMore />
        </div>

        <div className="flex flex-col gap-6">
          <RecentActivityCard />
          <DashboardCard />
        </div>
      </div>
    </div>
  );
}

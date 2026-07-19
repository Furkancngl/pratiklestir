import { requireCurrentUser } from "@/app/lib/current-user";
import PlanBillingSettings from "./plan-billing-settings";

const RENEWAL_PERIOD_DAYS = 30;

export default async function AyarlarPlanFaturalamaPage() {
  const user = await requireCurrentUser();

  let renewalDateLabel: string | null = null;
  if (user.plan === "pro" && user.planSelectedAt) {
    const renewalDate = new Date(user.planSelectedAt);
    renewalDate.setDate(renewalDate.getDate() + RENEWAL_PERIOD_DAYS);
    renewalDateLabel = renewalDate.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <PlanBillingSettings
      plan={user.plan}
      renewalDateLabel={renewalDateLabel}
      cancelAtPeriodEnd={user.cancelAtPeriodEnd}
    />
  );
}

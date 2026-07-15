import dynamic from "next/dynamic";
import CategoryNav from "./category-nav";
import ComingSoonStrip from "./coming-soon-strip";
import FinalCta from "./final-cta";
import Hero from "./hero";
import HomeFaq from "./home-faq";
import HowItWorks from "./how-it-works";
import PopularTools from "./popular-tools";
import RecentTools from "./recent-tools";
import Reveal from "./reveal";
import StatsStrip from "./stats-strip";
import TrustBadges from "./trust-badges";
import WhyPratiklestir from "./why-pratiklestir";

// framer-motion kullanan alt-katlanmış (below-the-fold) bölüm; ayrı chunk'a
// alınarak ana marketing sayfası JS paketinden çıkarılır.
const Testimonials = dynamic(() => import("./testimonials"));

export default function MarketingHome() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <Hero />

      <TrustBadges />

      <CategoryNav />

      <ComingSoonStrip />

      <PopularTools />

      <RecentTools />

      <WhyPratiklestir />

      <HowItWorks />

      <StatsStrip />

      <Reveal className="mt-16 w-full max-w-2xl">
        <FinalCta />
      </Reveal>

      <HomeFaq />

      <Testimonials />
    </div>
  );
}

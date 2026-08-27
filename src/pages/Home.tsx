import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/sections/Hero";
import { StatsBand } from "@/sections/StatsBand";
import { CurriculumSection } from "@/sections/CurriculumSection";
import { PricingSection } from "@/sections/PricingSection";
import { FaqSection, Footer } from "@/sections/FaqSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader dark />
      <Hero />
      <StatsBand />
      <CurriculumSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

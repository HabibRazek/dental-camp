import { Suspense } from "react";
import ModernHeroSection from "./modern-hero-section";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";

export default function HeroWrapper() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <ModernHeroSection />
    </Suspense>
  );
}

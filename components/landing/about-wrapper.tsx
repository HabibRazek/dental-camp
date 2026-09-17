import { Suspense } from "react";
import AboutSection from "./about-section";
import { AboutSkeleton } from "@/components/skeletons/about-skeleton";

export default function AboutWrapper() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutSection />
    </Suspense>
  );
}

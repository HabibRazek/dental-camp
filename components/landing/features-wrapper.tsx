import { Suspense } from "react";
import InnovativeFeaturesSection from "./innovative-features-section";
import { FeaturesSkeleton } from "@/components/skeletons/features-skeleton";

export default function FeaturesWrapper() {
  return (
    <Suspense fallback={<FeaturesSkeleton />}>
      <InnovativeFeaturesSection />
    </Suspense>
  );
}

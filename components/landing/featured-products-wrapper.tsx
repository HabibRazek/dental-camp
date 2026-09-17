import { Suspense } from "react";
import FeaturedProductsSection from "./featured-products-section";
import { FeaturedProductsSkeleton } from "@/components/skeletons/featured-products-skeleton";

export default function FeaturedProductsWrapper() {
  return (
    <Suspense fallback={<FeaturedProductsSkeleton />}>
      <FeaturedProductsSection />
    </Suspense>
  );
}

import { Suspense } from "react";
import ProductGridSection from "./product-grid-section";
import { ProductGridSkeleton } from "@/components/skeletons/product-grid-skeleton";

export default function ProductGridWrapper() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductGridSection />
    </Suspense>
  );
}

import { Suspense } from "react";
import ModernTestimonialsSection from "./modern-testimonials-section";
import { TestimonialsSkeleton } from "@/components/skeletons/testimonials-skeleton";

export default function TestimonialsWrapper() {
  return (
    <Suspense fallback={<TestimonialsSkeleton />}>
      <ModernTestimonialsSection />
    </Suspense>
  );
}

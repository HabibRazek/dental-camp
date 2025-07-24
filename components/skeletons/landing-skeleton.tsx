import { HeroSkeleton } from "./hero-skeleton";
import { AboutSkeleton } from "./about-skeleton";
import { FeaturedProductsSkeleton } from "./featured-products-skeleton";
import { ProductGridSkeleton } from "./product-grid-skeleton";
import { FeaturesSkeleton } from "./features-skeleton";
import { TestimonialsSkeleton } from "./testimonials-skeleton";
import { ContactSkeleton } from "./contact-skeleton";

export function LandingSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <AboutSkeleton />
      <FeaturedProductsSkeleton />
      <ProductGridSkeleton />
      <FeaturesSkeleton />
      <TestimonialsSkeleton />
      <ContactSkeleton />
    </>
  );
}

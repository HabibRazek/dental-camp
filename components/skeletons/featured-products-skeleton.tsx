import { Card } from "@/components/ui/card";

export function FeaturedProductsSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 w-80 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="group overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="relative">
                {/* Image Skeleton */}
                <div className="w-full h-48 sm:h-56 bg-gray-200 animate-pulse"></div>
                
                {/* Badge Skeleton */}
                <div className="absolute top-3 left-3 h-6 w-16 bg-gray-300 rounded-full animate-pulse"></div>
                
                {/* Heart Icon Skeleton */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Category Skeleton */}
                <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                
                {/* Title Skeleton */}
                <div className="h-6 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                
                {/* Description Skeleton */}
                <div className="h-4 w-full bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                
                {/* Price Skeleton */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Buttons Skeleton */}
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center mt-12">
          <div className="h-12 w-40 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

import { Card } from "@/components/ui/card";

export function ProductGridSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 w-72 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="group overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="relative">
                {/* Image Skeleton */}
                <div className="w-full h-48 sm:h-56 bg-gray-200 animate-pulse"></div>
                
                {/* Overlay Skeleton */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Content Overlay Skeleton */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  {/* Icon Skeleton */}
                  <div className="w-8 h-8 bg-white/30 rounded-lg mb-3 animate-pulse"></div>
                  
                  {/* Title Skeleton */}
                  <div className="h-6 w-3/4 bg-white/30 rounded mb-2 animate-pulse"></div>
                  
                  {/* Description Skeleton */}
                  <div className="h-4 w-full bg-white/20 rounded mb-1 animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-white/20 rounded mb-3 animate-pulse"></div>
                  
                  {/* Product Count Skeleton */}
                  <div className="h-4 w-24 bg-white/30 rounded animate-pulse"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center mt-12">
          <div className="h-12 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

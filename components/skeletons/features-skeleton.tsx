import { Card } from "@/components/ui/card";

export function FeaturesSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 w-80 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              {/* Icon Skeleton */}
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
              
              {/* Title Skeleton */}
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>
              
              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

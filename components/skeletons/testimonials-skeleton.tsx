import { Card } from "@/components/ui/card";

export function TestimonialsSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-80 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Google Reviews Banner Skeleton */}
        <div className="bg-gradient-to-b from-blue-500 to-blue-700 rounded-3xl p-8 md:p-12 text-center mb-12">
          <div className="mb-6">
            <div className="h-8 w-32 bg-white/30 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="flex justify-center items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 w-6 bg-yellow-400/50 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-6 w-40 bg-white/20 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="flex justify-center">
            <div className="h-8 w-20 bg-white/30 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Testimonials Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="p-6 border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>

              {/* Content */}
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Read More */}
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Card } from "@/components/ui/card";

export function AboutSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content Skeleton */}
          <div>
            {/* Badge Skeleton */}
            <div className="h-6 w-32 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
            
            {/* Title Skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-4/5 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3 animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
            
            {/* Button Skeleton */}
            <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Right Content Skeleton */}
          <div className="relative">
            {/* Main Image Skeleton */}
            <div className="w-full h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
            
            {/* Floating Elements Skeleton */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

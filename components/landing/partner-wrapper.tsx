import { Suspense } from "react";
import OfficialPartnerSection from "./official-partner-section";
import { Card } from "@/components/ui/card";

// Partner Section Skeleton
function PartnerSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div className="h-12 w-96 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-80 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Partner Card Skeleton */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side Skeleton */}
              <div className="p-8 sm:p-12">
                <div className="h-16 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Right Side Skeleton */}
              <div className="bg-gray-200 p-8 sm:p-12 flex items-center justify-center animate-pulse">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
                  <div className="h-8 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-5 w-5 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                  <div className="h-4 w-48 bg-gray-300 rounded mx-auto mb-6"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-8 w-12 bg-gray-300 rounded mx-auto mb-2"></div>
                      <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div>
                      <div className="h-8 w-12 bg-gray-300 rounded mx-auto mb-2"></div>
                      <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function PartnerWrapper() {
  return (
    <Suspense fallback={<PartnerSkeleton />}>
      <OfficialPartnerSection />
    </Suspense>
  );
}

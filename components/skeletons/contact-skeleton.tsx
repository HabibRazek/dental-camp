import { Card } from "@/components/ui/card";

export function ContactSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-80 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info Skeleton */}
          <div>
            {/* Contact Cards Skeleton */}
            <div className="space-y-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Map Skeleton */}
            <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Right Side - Contact Form Skeleton */}
          <Card className="p-8 border border-gray-200 shadow-lg">
            <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
            
            <div className="space-y-6">
              {/* Form Fields Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              <div>
                <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Button Skeleton */}
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

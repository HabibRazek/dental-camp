export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Background Pattern Skeleton */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gray-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gray-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gray-200 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content Skeleton */}
          <div className="text-center lg:text-left">
            {/* Badge Skeleton */}
            <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto lg:mx-0 mb-6 animate-pulse"></div>
            
            {/* Title Skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-4/5 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="text-center">
                  <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
            
            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Right Content Skeleton */}
          <div className="relative">
            {/* Main Image Skeleton */}
            <div className="w-full h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
            
            {/* Floating Cards Skeleton */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

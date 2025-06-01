"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, PageLoader, SectionLoader, ButtonLoader } from "@/components/ui/loader";
import Header from "@/components/landing/header";
import Footer from "@/components/footer";

export default function LoaderDemo() {
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 3000);
  };

  const handlePageLoaderClick = () => {
    setShowPageLoader(true);
    setTimeout(() => setShowPageLoader(false), 3000);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Custom Blue Loader Components
            </h1>
            <p className="text-xl text-gray-600">
              Demonstration of all available loader variants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Loader - Small */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Small Loader</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <Loader size="sm" />
              </CardContent>
            </Card>

            {/* Basic Loader - Medium */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medium Loader</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <Loader size="md" />
              </CardContent>
            </Card>

            {/* Basic Loader - Large */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Large Loader</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <Loader size="lg" />
              </CardContent>
            </Card>

            {/* Section Loader - Small */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Section Loader - Small</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionLoader size="sm" />
              </CardContent>
            </Card>

            {/* Section Loader - Medium */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Section Loader - Medium</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionLoader size="md" />
              </CardContent>
            </Card>

            {/* Section Loader - Large */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Section Loader - Large</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionLoader size="lg" />
              </CardContent>
            </Card>

            {/* Button Loader */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Button with Loader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleButtonClick}
                  disabled={buttonLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {buttonLoading && <ButtonLoader />}
                  {buttonLoading ? "Processing..." : "Click to Load"}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleButtonClick}
                  disabled={buttonLoading}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {buttonLoading && <ButtonLoader />}
                  {buttonLoading ? "Loading..." : "Outline Button"}
                </Button>
              </CardContent>
            </Card>

            {/* Page Loader Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page Loader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Click to show full-page overlay loader
                </p>
                <Button 
                  onClick={handlePageLoaderClick}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Show Page Loader
                </Button>
              </CardContent>
            </Card>

            {/* CSS Classes Demo */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">CSS-Only Loaders</CardTitle>
                <p className="text-sm text-gray-600">
                  You can also use pure CSS classes for these loaders
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                  <div className="text-center">
                    <div className="loader loader-sm"></div>
                    <p className="mt-2 text-sm text-gray-600">Small (.loader-sm)</p>
                  </div>
                  <div className="text-center">
                    <div className="loader loader-md"></div>
                    <p className="mt-2 text-sm text-gray-600">Medium (.loader-md)</p>
                  </div>
                  <div className="text-center">
                    <div className="loader loader-lg"></div>
                    <p className="mt-2 text-sm text-gray-600">Large (.loader-lg)</p>
                  </div>
                  <div className="text-center">
                    <div className="loader"></div>
                    <p className="mt-2 text-sm text-gray-600">Default (.loader)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Examples */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Usage Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">React Component:</h4>
                  <code className="text-sm text-gray-700">
                    {`import { Loader, SectionLoader, PageLoader, ButtonLoader } from "@/components/ui/loader";`}
                  </code>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">CSS Classes:</h4>
                  <code className="text-sm text-gray-700">
                    {`<div className="loader loader-lg"></div>`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Page Loader Overlay */}
      {showPageLoader && (
        <PageLoader />
      )}

      <Footer />
    </>
  );
}

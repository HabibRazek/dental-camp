import { Suspense } from "react"
import { SignInForm } from "@/components/auth/signin-form"
import Header from "@/components/landing/header"
import { Metadata } from "next"
import Footer from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "Sign In | Dental Camp",
  description: "Sign in to your Dental Camp account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex-1 mt-16 sm:mt-20 flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Sign in to access your dental solutions dashboard
              </p>
            </div>
            <Suspense fallback={
              <div className="flex items-center justify-center">
                <div className="loader"></div>
              </div>
            }>
              <SignInForm />
            </Suspense>
          </div>
        </div>

        
      </div>
      <Footer />
    </div>
  )
}

import { Suspense } from "react"
import { SignInForm } from "@/components/auth/signin-form"
import Header from "@/components/landing/header"
import AuthFooter from "@/components/layouts/auth-footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | Dental Camp",
  description: "Sign in to your Dental Camp account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
      <AuthFooter />
    </div>
  )
}

import { Suspense } from "react"
import { SignInForm } from "@/components/auth/signin-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | Dental Camp",
  description: "Sign in to your Dental Camp account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  )
}

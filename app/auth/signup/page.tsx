import { SignUpForm } from "@/components/auth/signup-form"
import Header from "@/components/landing/header"
import AuthFooter from "@/components/layouts/auth-footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Dental Camp",
  description: "Create your Dental Camp account",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <SignUpForm />
      </div>
      <AuthFooter />
    </div>
  )
}

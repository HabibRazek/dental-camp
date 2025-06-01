import { SignUpForm } from "@/components/auth/signup-form"
import Footer from "@/components/landing/footer"
import Header from "@/components/landing/header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Dental Camp",
  description: "Create your Dental Camp account",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex-1 flex mt-28">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
                Join Dental Camp
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Create your account and discover premium dental solutions
              </p>
            </div>
            <SignUpForm />
          </div>
        </div>

        
      </div>
      <Footer />
    </div>
  )
}

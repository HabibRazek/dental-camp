import { SignUpForm } from "@/components/auth/signup-form"
import Footer from "@/components/landing/footer"
import Header from "@/components/landing/header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inscription | Dental Camp",
  description: "Créez votre compte Dental Camp",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex-1 flex mt-20 sm:mt-28">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
                Rejoignez Dental Camp
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Créez votre compte et découvrez des solutions dentaires premium
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

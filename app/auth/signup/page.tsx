import { SignUpForm } from "@/components/auth/signup-form"
import Footer from "@/components/landing/footer"
import Header from "@/components/landing/header"
import { Metadata } from "next"
import Image from "next/image"
import { TbDental } from "react-icons/tb"

export const metadata: Metadata = {
  title: "Inscription | Dental Camp",
  description: "Créez votre compte Dental Camp",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <Header />

      {/* Professional Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex-1 mt-20 sm:mt-24 flex min-h-[calc(100vh-6rem)]">
        {/* Integrated Form with Doctor Image */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full max-w-6xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Form (2/3 width) */}
                <div className="lg:col-span-2 p-8">
                  <div className="text-center mb-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center mx-auto mb-6">
                      <Image
                        src="/dental-camp-logo.png"
                        alt="Dental Camp Logo"
                        width={120}
                        height={120}
                        className="w-30 h-30 object-contain"
                      />
                    </div>
                    <h1 className="text-2xl -mt-10 sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
                      Rejoignez Dental Camp
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Créez votre compte et découvrez des solutions dentaires premium
                    </p>
                  </div>
                  <SignUpForm />
                </div>

                {/* Right Side - Doctor Image (1/3 width) */}
                <div className="hidden lg:block relative">
                  <Image
                    src="/images/Dr.webp"
                    alt="Professionnel dentaire expert"
                    width={400}
                    height={600}
                    className="w-full h-full object-cover"
                  />

                  {/* Professional overlay */}
                  <div className="absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <TbDental className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Expert Dentaire</div>
                        <div className="text-xs text-gray-600">Rejoignez notre communauté</div>
                        <div className="text-xs text-blue-600 font-medium">Solutions professionnelles</div>
                      </div>
                    </div>
                  </div>

                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

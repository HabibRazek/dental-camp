"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader } from "@/components/ui/loader"
import Header from "@/components/landing/header"
import { TbDental } from "react-icons/tb"
import Image from "next/image"

export default function AuthSuccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user) {
      router.push("/auth/signin")
      return
    }

    // Clean redirect without console logs
    const timer = setTimeout(() => {
      if (session.user.role === "ADMIN") {
        window.location.href = "/dashboard"
      } else {
        window.location.href = "/"
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <Header />

      {/* Professional Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-6rem)] px-4">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 max-w-md mx-auto">
            <div className="flex items-center justify-center mx-auto mb-8">
              <Image
                src="/dental-camp-logo.png"
                alt="Dental Camp Logo"
                width={120}
                height={120}
                className="w-30 h-30 object-contain"
              />
            </div>

            <Loader size="lg" />

            <div className="mt-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
                Welcome Back!
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Redirecting you to the main page...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

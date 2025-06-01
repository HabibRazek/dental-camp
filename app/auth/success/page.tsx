"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader } from "@/components/ui/loader"

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
        window.location.href = "/user-space"
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <Loader size="lg" />
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    </div>
  )
}

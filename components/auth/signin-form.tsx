"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInSchema, type SignInInput } from "@/lib/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { GoogleSignIn } from "./google-signin"
import { ButtonLoader } from "@/components/ui/loader"


export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password")
        } else {
          setError("Unable to sign in. Please try again.")
        }
      } else if (result?.ok) {
        // Get fresh session and redirect based on role and callback URL
        setTimeout(async () => {
          try {
            const sessionResponse = await fetch('/api/auth/session')
            const sessionData = await sessionResponse.json()

            // Determine redirect URL based on role and callback
            let redirectUrl = callbackUrl

            if (sessionData?.user?.role === "ADMIN") {
              // Admin users go to dashboard unless callback is specified
              redirectUrl = callbackUrl === '/dashboard' ? '/dashboard' : callbackUrl
            } else {
              // Regular users go to user-space unless callback is specified
              redirectUrl = callbackUrl === '/dashboard' ? '/user-space' : callbackUrl
            }

            console.log("Redirecting to:", redirectUrl)
            window.location.href = redirectUrl
          } catch (error) {
            console.error("Session fetch error:", error)
            // Fallback to success page
            window.location.href = "/auth/success"
          }
        }, 500)
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-blue-100">
        {/* Form header removed since it's now in the page layout */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className={`h-12 px-4 rounded-xl border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`h-12 px-4 pr-12 rounded-xl border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                  errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {error}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading && <ButtonLoader />}
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignIn />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

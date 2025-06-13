"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpSchema, type SignUpInput } from "@/lib/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { GoogleSignIn } from "./google-signin"
import { PasswordStrength } from "./password-strength"
import { ButtonLoader } from "@/components/ui/loader"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const watchedPassword = watch("password", "")

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Invalid response format")
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      // If verification is required, redirect to verification page
      if (result.requiresVerification) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        }, 2000)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/signin?message=Account created successfully")
        }, 2000)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg border">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Compte créé !</h1>
            <p className="text-gray-600">
              Votre compte a été créé avec succès. Veuillez vérifier votre email pour le code de vérification...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-blue-100">
        {/* Form header removed since it's now in the page layout */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Nom complet
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Entrez votre nom complet"
              {...register("name")}
              className={`h-12 px-4 rounded-xl border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Adresse email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Entrez votre adresse email"
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
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Créez un mot de passe fort"
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
            <PasswordStrength password={watchedPassword || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez votre mot de passe"
                {...register("confirmPassword")}
                className={`h-12 px-4 pr-12 rounded-xl border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.confirmPassword.message}
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
            {isLoading ? "Création du compte..." : "Créer un compte"}
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
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

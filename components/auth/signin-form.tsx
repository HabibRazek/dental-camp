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
  const [showBackupCode, setShowBackupCode] = useState(false)
  const [backupCode, setBackupCode] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/auth/success'

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
    setUserEmail(data.email) // Store email for backup code login

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Email ou mot de passe invalide. Veuillez vérifier vos informations ou créer un compte si vous n'en avez pas.")
        } else {
          setError("Impossible de se connecter. Veuillez réessayer.")
        }
      } else if (result?.ok) {
        // Redirect to success page for consistent role-based routing
        window.location.href = "/auth/success"
      }
    } catch {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackupCodeLogin = async () => {
    if (!backupCode.trim() || !userEmail) {
      setError("Please enter a backup code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/backup-codes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          backupCode: backupCode.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid backup code')
      }

      // If backup code is valid, sign in the user
      const result = await signIn("credentials", {
        email: userEmail,
        password: "backup-code-login", // Special password for backup code login
        redirect: false,
      })

      if (result?.ok) {
        window.location.href = "/auth/success"
      } else {
        setError("Failed to sign in with backup code")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid backup code"
      setError(errorMessage)
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
                placeholder="Entrez votre mot de passe"
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

          {!showBackupCode ? (
            <>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading && <ButtonLoader />}
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>


            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="backupCode" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Backup Code
                </Label>
                <Input
                  id="backupCode"
                  type="text"
                  placeholder="Enter your backup code (e.g., ABCD-1234)"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value)}
                  className="h-12 px-4 rounded-xl border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 border-gray-200"
                />
                <p className="text-xs text-gray-500">
                  Entrez l'un des codes de sauvegarde que vous avez téléchargés lors de la configuration de l'authentification à deux facteurs
                </p>
              </div>

              <Button
                type="button"
                onClick={handleBackupCodeLogin}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={isLoading || !backupCode.trim()}
              >
                {isLoading && <ButtonLoader />}
                {isLoading ? "Vérification..." : "Se connecter avec le code de sauvegarde"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowBackupCode(false)
                    setBackupCode("")
                    setError(null)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Back to password login
                </button>
              </div>
            </>
          )}
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

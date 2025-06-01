"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/landing/header"
import Footer from "@/components/landing/footer"

export default function LinkAccountPage() {
  const [isLinking, setIsLinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLinkAccount = async () => {
    setIsLinking(true)
    setError(null)

    try {
      // Force link the account by signing in with Google again
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/auth/success"
      })

      if (result?.error) {
        setError("Failed to link account. Please try again.")
      } else {
        // Redirect to success page
        window.location.href = "/auth/success"
      }
    } catch (error) {
      setError("An error occurred while linking your account.")
    } finally {
      setIsLinking(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Already Exists
            </CardTitle>
            <CardDescription>
              An account with this email already exists. Would you like to link your Google account?
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have an existing account with this email address. You can link your Google account to sign in with either method.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleLinkAccount}
                disabled={isLinking}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLinking ? "Linking Account..." : "Link Google Account"}
              </Button>

              <div className="text-center">
                <span className="text-gray-500">or</span>
              </div>

              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                You can also sign in with your email and password if you prefer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

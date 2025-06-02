"use client"

import { SessionProvider } from "next-auth/react"
import { AuthStatus } from "@/components/auth/auth-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, TestTube } from "lucide-react"

export default function AuthTestPage() {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/auth/signin">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <TestTube className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Authentication Test
              </h1>
            </div>
            <p className="text-gray-600">
              Test page to verify authentication functionality and debug any issues.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Auth Status */}
            <AuthStatus />

            {/* Environment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Information</CardTitle>
                <CardDescription>
                  Current environment configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Environment:</span>
                  <span className="text-sm">{process.env.NODE_ENV || "unknown"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Base URL:</span>
                  <span className="text-xs font-mono">
                    {typeof window !== "undefined" ? window.location.origin : "SSR"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auth URL:</span>
                  <span className="text-xs font-mono">
                    {typeof window !== "undefined" ? `${window.location.origin}/api/auth` : "SSR"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Test Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Test Actions</CardTitle>
                <CardDescription>
                  Quick actions to test authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/auth/signin">
                  <Button className="w-full" variant="outline">
                    Go to Sign In
                  </Button>
                </Link>
                <Link href="/user/dashboard">
                  <Button className="w-full" variant="outline">
                    Test User Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full" variant="outline">
                    Test Admin Dashboard
                  </Button>
                </Link>
                <Link href="/api/auth/session">
                  <Button className="w-full" variant="outline">
                    Check Session API
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>
                  To complete Google OAuth setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p className="font-medium">Add this redirect URI to Google Cloud Console:</p>
                  <code className="block p-2 bg-gray-100 rounded text-xs">
                    http://localhost:3000/api/auth/callback/google
                  </code>
                  <p className="text-gray-600">
                    1. Go to Google Cloud Console<br />
                    2. Navigate to APIs & Services → Credentials<br />
                    3. Edit your OAuth client<br />
                    4. Add the redirect URI above<br />
                    5. Save changes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}

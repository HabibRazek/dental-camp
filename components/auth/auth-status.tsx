"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "authenticated":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "unauthenticated":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "bg-yellow-100 text-yellow-800"
      case "authenticated":
        return "bg-green-100 text-green-800"
      case "unauthenticated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Authentication Status
        </CardTitle>
        <CardDescription>
          Current authentication state and session information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge className={getStatusColor()}>
            {status}
          </Badge>
        </div>

        {status === "authenticated" && session?.user && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{session.user.name || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{session.user.email || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role:</span>
              <Badge variant="outline">
                {session.user.role || "USER"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm font-mono text-xs">
                {session.user.id || "N/A"}
              </span>
            </div>
          </div>
        )}

        {status === "unauthenticated" && (
          <div className="text-sm text-gray-600">
            No active session. Please sign in to continue.
          </div>
        )}

        {status === "loading" && (
          <div className="text-sm text-gray-600">
            Loading authentication status...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

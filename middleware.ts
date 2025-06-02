import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and debug routes first
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/debug') ||
    pathname.startsWith('/test') ||
    pathname.startsWith('/setup') ||
    pathname.startsWith('/force') ||
    pathname.startsWith('/verify-email') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact')
  ) {
    return NextResponse.next()
  }

  // Get the JWT token to check authentication status
  let token = null
  try {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET || "fallback-secret-for-development",
      secureCookie: process.env.NODE_ENV === "production",
    })
  } catch (error) {
    console.error("Token error:", error)
    // Continue without token
  }

  // Handle auth routes - redirect authenticated users away from signin/signup
  if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) {
    if (token) {
      // User is authenticated, redirect to appropriate dashboard
      const dashboardUrl = token.role === 'ADMIN' ? '/dashboard' : '/user/dashboard'
      console.log(`Redirecting authenticated user to: ${dashboardUrl}`)
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
    // User is not authenticated, allow access to auth pages
    return NextResponse.next()
  }

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/admin') ||
                      pathname.startsWith('/customers')
  const isUserRoute = pathname.startsWith('/user-space') ||
                      pathname.startsWith('/customer-space')
  const isProtectedRoute = isAdminRoute || isUserRoute

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  try {
    if (!token) {
      // Not authenticated, redirect to signin
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check role-based access
    if (isAdminRoute && token.role !== 'ADMIN') {
      // Redirect non-admin users to user-space
      const userSpaceUrl = new URL('/user/dashboard', request.url)
      return NextResponse.redirect(userSpaceUrl)
    }

    // Allow access
    return NextResponse.next()

  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("Middleware auth error:", error)
    }

    // On error, redirect to signin
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
}

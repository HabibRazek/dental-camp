import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and debug routes
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

  // Get the JWT token to check authentication and role
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      // Add production-specific configuration
      secureCookie: process.env.NODE_ENV === "production",
    })

    if (!token) {
      // Not authenticated, redirect to signin
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check role-based access
    if (isAdminRoute && token.role !== 'ADMIN') {
      // Redirect non-admin users to user-space
      const userSpaceUrl = new URL('/user-space', request.url)
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

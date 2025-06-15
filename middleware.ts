import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/verify-email') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/catalog')
  ) {
    return NextResponse.next()
  }

  // Get authentication token
  let token = null
  try {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    })

    // Fallback for different cookie configurations
    if (!token) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        secureCookie: false,
      })
    }
  } catch (error) {
    // Silent error handling
  }

  const isAuthenticated = !!token
  const userRole = token?.role || 'USER'

  // Handle auth routes - redirect authenticated users to appropriate dashboard
  if (pathname.startsWith('/auth/')) {
    if (isAuthenticated) {
      const dashboardUrl = userRole === 'ADMIN' ? '/dashboard' : '/user/dashboard'
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
    return NextResponse.next()
  }

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/admin') ||
                      pathname.startsWith('/customers')
  const isUserRoute = pathname.startsWith('/user/')
  const isProtectedRoute = isAdminRoute || isUserRoute

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (!isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check role-based access
  if (isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/user/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
}

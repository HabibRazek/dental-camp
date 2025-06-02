import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add debug logging in development only
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] Processing: ${pathname}`)
  }

  // Skip middleware for API routes, static files, and debug routes first
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
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

  // Check authentication status using multiple methods
  let isAuthenticated = false
  let userRole = 'USER'
  let userEmail = ''

  try {
    // Method 1: Try to get JWT token with multiple configurations
    let token = null

    // Try standard configuration
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    })

    // Try alternative configurations if no token found
    if (!token) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        secureCookie: false, // Try without secure cookie
      })
    }

    if (!token) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        cookieName: "authjs.session-token",
      })
    }

    if (!token) {
      token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        cookieName: "next-auth.session-token",
      })
    }

    if (token) {
      isAuthenticated = true
      userRole = token.role || 'USER'
      userEmail = token.email || ''
    }

    // Method 2: ONLY check for REAL session tokens (not CSRF or callback cookies)
    if (!isAuthenticated) {
      const cookies = request.cookies.getAll()
      const realSessionCookies = cookies.filter(c =>
        (c.name === 'next-auth.session-token' && c.value.length > 100) ||
        (c.name === '__Secure-next-auth.session-token' && c.value.length > 100) ||
        (c.name === 'authjs.session-token' && c.value.length > 100) ||
        (c.name === '__Secure-authjs.session-token' && c.value.length > 100)
      )

      if (realSessionCookies.length > 0) {
        isAuthenticated = true
        // Try to extract role from cookie if possible
        const sessionCookie = realSessionCookies[0]
        try {
          // Try to decode the session cookie to get role
          const decoded = JSON.parse(atob(sessionCookie.value.split('.')[1] || ''))
          userRole = decoded.role || 'USER'
          userEmail = decoded.email || ''
        } catch {
          // If decoding fails, use defaults
          userRole = 'USER'
        }
      }
    }

    // Method 3: Only check for REAL session indicators (not CSRF tokens)
    if (!isAuthenticated) {
      const cookies = request.cookies.getAll()
      const hasRealSession = cookies.some(c =>
        (c.name.includes('session-token') && c.value.length > 100) ||
        (c.name.includes('next-auth.session-token') && c.value.length > 100)
      )

      if (hasRealSession) {
        // Real session found
        isAuthenticated = true
        userRole = 'USER'
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] 🔍 Authentication status:`, isAuthenticated)
      if (isAuthenticated) {
        console.log(`[Middleware] 👤 User role:`, userRole)
        console.log(`[Middleware] 📧 User email:`, userEmail)
      }

      // Debug all cookies to see what's available
      const cookies = request.cookies.getAll()
      console.log(`[Middleware] 🍪 Available cookies:`, cookies.map(c => `${c.name}=${c.value.length > 20 ? c.value.substring(0, 20) + '...' : c.value}`))
    }
  } catch (error) {
    console.error("[Middleware] ❌ Authentication check error:", error)
    // Continue with isAuthenticated = false
  }

  // Handle auth routes - redirect authenticated users away from signin/signup/success
  if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup') || pathname.startsWith('/auth/success')) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] 🔐 Auth route detected: ${pathname}`)
      console.log(`[Middleware] 🔍 User authenticated: ${isAuthenticated}`)
    }

    // EXTRA CHECK: Only check for REAL session tokens (not CSRF or callback cookies)
    const cookies = request.cookies.getAll()
    const hasRealSessionToken = cookies.some(c =>
      (c.name.includes('session-token') && c.value.length > 100) ||
      (c.name === 'next-auth.session-token' && c.value.length > 100) ||
      (c.name === '__Secure-next-auth.session-token' && c.value.length > 100)
    )

    const finalAuthStatus = isAuthenticated || hasRealSessionToken

    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] 🔍 Final auth status: ${finalAuthStatus} (original: ${isAuthenticated}, session token: ${hasRealSessionToken})`)
    }

    if (finalAuthStatus) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] 👤 User: ${userEmail} (${userRole})`)
      }

      // User is authenticated, redirect to appropriate dashboard
      const dashboardUrl = userRole === 'ADMIN' ? '/dashboard' : '/user/dashboard'

      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] 🚀 BLOCKING & REDIRECTING authenticated user from ${pathname} to: ${dashboardUrl}`)
      }

      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] ✅ Allowing access to ${pathname} (user not authenticated)`)
    }

    // User is not authenticated, allow access to auth pages
    return NextResponse.next()
  }

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/admin') ||
                      pathname.startsWith('/customers')
  const isUserRoute = pathname.startsWith('/user-space') ||
                      pathname.startsWith('/user/') ||
                      pathname.startsWith('/customer-space')
  const isProtectedRoute = isAdminRoute || isUserRoute

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  try {
    if (!isAuthenticated) {
      // Not authenticated, redirect to signin
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check role-based access
    if (isAdminRoute && userRole !== 'ADMIN') {
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

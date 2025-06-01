import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/admin') ||
                      pathname.startsWith('/customers')
  const isUserRoute = pathname.startsWith('/user')
  const isProtectedRoute = isAdminRoute || isUserRoute

  // Get session token from cookies
  const sessionToken = request.cookies.get('next-auth.session-token') ||
                      request.cookies.get('__Secure-next-auth.session-token')

  const isLoggedIn = !!sessionToken

  // Redirect non-logged-in users away from protected pages
  if (!isLoggedIn && isProtectedRoute) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
}

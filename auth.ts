import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { getToken } from "next-auth/jwt"
import { prisma } from "./lib/prisma"
import { signInSchema } from "./lib/zod"
import { getUserFromDb } from "./lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Temporarily disable database adapter for development
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  basePath: "/api/auth",
  useSecureCookies: process.env.NODE_ENV === "production",
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@example.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "********",
        },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)

          // Temporary mock authentication for development
          const mockUsers = [
            {
              id: "admin-1",
              email: "admin@example.com",
              password: "admin123456",
              name: "Admin User",
              role: "ADMIN"
            },
            {
              id: "admin-2",
              email: "admin@dental-camp.com",
              password: "admin123",
              name: "Admin User",
              role: "ADMIN"
            }
          ]

          const mockUser = mockUsers.find(u => u.email === email && u.password === password)

          if (mockUser) {
            return {
              id: mockUser.id,
              email: mockUser.email,
              name: mockUser.name,
              role: mockUser.role,
              image: null
            }
          }

          return null
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, ensure we have the user data and set default role
      if (account?.provider === "google" && profile) {
        // Update user object with Google profile data
        user.name = profile.name || user.name
        user.email = profile.email || user.email
        user.image = profile.picture || user.image

        // Ensure OAuth users have the correct role set
        if (!user.role) {
          user.role = "USER"
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || user.email // Use email as fallback ID
        token.role = user.role || "USER" // Default role for new users
        // Store user data in token for OAuth users
        if (account?.provider === "google") {
          token.name = user.name
          token.picture = user.image
          token.email = user.email
        }
      }

      // Set default role if not present
      if (!token.role) {
        token.role = "USER"
      }

      return token
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // Use token data (no database required)
        session.user.id = token.id as string || session.user.email
        session.user.role = token.role as string || "USER"
        session.user.name = token.name as string || session.user.name
        session.user.image = token.picture as string || session.user.image
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Use environment variable or fallback to baseUrl
      const validBaseUrl = process.env.NEXTAUTH_URL || baseUrl

      // If URL is relative, make it absolute
      if (url.startsWith("/")) {
        return `${validBaseUrl}${url}`
      }

      // If URL is from the same origin, allow it
      try {
        const urlObj = new URL(url)
        const baseUrlObj = new URL(validBaseUrl)
        if (urlObj.origin === baseUrlObj.origin) {
          return url
        }
      } catch (error) {
        // URL parsing failed, use default
      }

      // Default to auth success page for OAuth flows
      return `${validBaseUrl}/auth/success`
    },
  },
})
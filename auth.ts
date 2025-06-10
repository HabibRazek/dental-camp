import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { getToken } from "next-auth/jwt"
import { prisma } from "./lib/prisma"
import { signInSchema } from "./lib/zod"
import { getUserFromDb } from "./lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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

          const user = await getUserFromDb(email, password)

          if (!user) {
            return null
          }

          return user
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
        token.id = user.id
        token.role = user.role
        // Store user data in token for first-time Google users
        if (account?.provider === "google") {
          token.name = user.name
          token.picture = user.image
        }
      } else if (token.email) {
        // For existing tokens, fetch fresh role from database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true, name: true, image: true, isActive: true }
          })
          if (dbUser && dbUser.isActive) {
            token.id = dbUser.id
            token.role = dbUser.role
            token.name = dbUser.name
            token.picture = dbUser.image
          } else if (!token.role) {
            // Set default role if user not found or inactive
            token.role = "USER"
          }
        } catch (error) {
          // Log error in development and set default role
          if (process.env.NODE_ENV === "development") {
            console.error("JWT callback error:", error)
          }
          token.role = token.role || "USER"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Use token data first (more reliable)
          if (token.id && token.role) {
            session.user.id = token.id as string
            session.user.role = token.role
            session.user.name = token.name as string || session.user.name
            session.user.image = token.picture as string || session.user.image
            return session
          }

          // Fallback to database lookup - PrismaAdapter should have created the user
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
              id: true,
              role: true,
              name: true,
              image: true,
              isActive: true
            }
          })

          if (dbUser && dbUser.isActive) {
            session.user.id = dbUser.id
            session.user.role = dbUser.role
            session.user.name = dbUser.name || session.user.name
            session.user.image = dbUser.image || session.user.image
          } else {
            // Set default role if user not found or inactive
            session.user.role = "USER"
          }
        } catch (error) {
          // Log error in development for debugging
          if (process.env.NODE_ENV === "development") {
            console.error("Session callback error:", error)
          }
          // Set default role to prevent auth errors
          session.user.role = session.user.role || "USER"
        }
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
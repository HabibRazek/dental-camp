import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "./lib/prisma"
import { signInSchema } from "./lib/zod"
import { getUserFromDb } from "./lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      // Allow all sign-ins - we'll handle account linking automatically
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      } else if (token.email) {
        // For existing tokens, fetch fresh role from database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true }
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        } catch {
          // Silently fail - role will remain undefined
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Always fetch fresh user data from database
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email }
          })

          if (dbUser) {
            session.user.id = dbUser.id
            session.user.role = dbUser.role
            session.user.name = dbUser.name || session.user.name
            session.user.image = dbUser.image || session.user.image
          } else {
            // If user doesn't exist, create them (for Google OAuth)
            const newUser = await prisma.user.create({
              data: {
                email: session.user.email,
                name: session.user.name || "User",
                image: session.user.image,
                role: "USER",
                isActive: true,
                emailVerified: new Date()
              }
            })
            session.user.id = newUser.id
            session.user.role = newUser.role
          }
        } catch {
          // Silently fail - user will keep existing session data
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle post-signin redirects
      if (process.env.NODE_ENV === 'development') {
        console.log("Redirect callback:", { url, baseUrl })
      }

      // If URL is relative, make it absolute
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        if (process.env.NODE_ENV === 'development') {
          console.log("Relative URL redirect:", redirectUrl)
        }
        return redirectUrl
      }

      // If URL is from the same origin, allow it
      try {
        const urlObj = new URL(url)
        const baseUrlObj = new URL(baseUrl)
        if (urlObj.origin === baseUrlObj.origin) {
          if (process.env.NODE_ENV === 'development') {
            console.log("Same origin redirect:", url)
          }
          return url
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log("URL parsing error:", error)
        }
      }

      // Default to base URL
      if (process.env.NODE_ENV === 'development') {
        console.log("Default redirect to baseUrl:", baseUrl)
      }
      return baseUrl
    },
  },
})
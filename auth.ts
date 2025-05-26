import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
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
  },
  trustHost: true, // Required for Vercel deployment
  providers: [
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
            throw new Error("Invalid credentials.")
          }

          return user
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          throw error
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
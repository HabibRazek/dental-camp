import { DefaultSession } from "next-auth"

export type UserRole = "USER" | "ADMIN"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: UserRole
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    name?: string | null
    picture?: string | null
  }
}

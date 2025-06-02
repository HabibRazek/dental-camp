"use server"

import { signIn, auth } from "@/auth"
import { redirect } from "next/navigation"

export async function signInWithGoogle(callbackUrl?: string) {
  try {
    await signIn("google", {
      redirectTo: callbackUrl || "/auth/success",
      redirect: true
    })
  } catch (error) {
    // Handle authentication errors
    console.error("Google sign-in error:", error)
    throw error
  }
}

export async function handlePostAuthRedirect() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/auth/signin")
    }

    // Redirect based on user role
    if (session.user.role === "ADMIN") {
      redirect("/dashboard")
    } else {
      redirect("/user/dashboard")
    }
  } catch (error) {
    console.error("Post-auth redirect error:", error)
    redirect("/user/dashboard")
  }
}

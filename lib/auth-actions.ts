"use server"

import { signIn } from "@/auth"

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

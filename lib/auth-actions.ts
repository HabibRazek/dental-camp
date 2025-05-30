"use server"

import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export async function signInWithGoogle(callbackUrl?: string) {
  await signIn("google", {
    redirectTo: callbackUrl || "/dashboard"
  })
}

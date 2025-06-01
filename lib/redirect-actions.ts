"use server"

import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function redirectAfterLogin() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role === "ADMIN") {
    redirect("/dashboard")
  } else {
    redirect("/user/dashboard")
  }
}

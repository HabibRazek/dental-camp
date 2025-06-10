import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserProfileContent } from "@/components/user/user-profile-content"

export default async function UserProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return <UserProfileContent session={session} />
}

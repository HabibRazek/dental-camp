import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { UserSidebar } from "@/components/user/user-sidebar"
import { UserHeader } from "@/components/user/user-header"
import { UserDashboardContent } from "@/components/user/user-dashboard-content"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function UserDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Ensure only users with USER role can access this page
  if (session.user.role !== "USER") {
    redirect("/dashboard")
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
          <UserHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <UserDashboardContent user={session.user} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}

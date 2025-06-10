import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { UserSidebar } from "@/components/user/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserStatisticsContent } from "@/components/user/user-statistics-content"

export default async function UserStatisticsPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <UserSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50/30 via-white to-blue-100/20 min-h-screen">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-8 py-8 md:py-10">
                <UserStatisticsContent userId={session.user.id} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}

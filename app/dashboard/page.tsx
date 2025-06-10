import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { AdminActionsPanel } from "@/components/admin-actions-panel"
import { RealTimeNotifications } from "@/components/real-time-notifications"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Ensure only admins can access this dashboard
  if (session.user.role !== "ADMIN") {
    redirect("/user/dashboard")
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50/30 via-white to-blue-100/20 min-h-screen">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-8 py-8  md:py-10">
                {/* Welcome Section */}
                <div className="px-4 lg:px-6">
                  <div className="mb-8 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
                    <div className="relative">
                      <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                        Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{session.user.name || session.user.email?.split('@')[0] || 'Admin'}</span>! 👋
                      </h1>
                      <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-4">
                        Your dental e-commerce platform is performing exceptionally well. Here&apos;s your latest business insights.
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>System Online</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Real-time Updates</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Admin Access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SectionCards />

                <AdminActionsPanel />

                <RealTimeNotifications />

                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>

                <DataTable />

                {/* Footer Section */}
                <div className="px-4 lg:px-6 pb-8">
                  <div className="text-center py-8 border-t border-gray-200/50">
                    <p className="text-sm text-gray-500 font-medium">
                      © 2024 Dental Camp E-commerce Platform. Built with ❤️ for dental professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}

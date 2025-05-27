import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 min-h-screen">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
                {/* Welcome Section */}
                <div className="px-4 lg:px-6">
                  <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                      Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dr. Smith</span>! 👋
                    </h1>
                    <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                      Your dental e-commerce platform is performing exceptionally well. Here&apos;s your latest business insights.
                    </p>
                  </div>
                </div>

                <SectionCards />

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

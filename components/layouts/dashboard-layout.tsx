"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Loader2 } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50/30 via-white to-blue-100/20 min-h-screen">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-8 py-8 md:py-10">
              {/* Page Header */}
              {(title || description) && (
                <div className="px-4 lg:px-6">
                  <div className="mb-8">
                    {title && (
                      <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                        {title}
                      </h1>
                    )}
                    {description && (
                      <p className="text-lg text-gray-600 font-medium max-w-2xl">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="px-4 lg:px-6">
                {children}
              </div>

              {/* Footer Section */}
              <div className="px-4 lg:px-6 pb-8 mt-auto">
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
  )
}

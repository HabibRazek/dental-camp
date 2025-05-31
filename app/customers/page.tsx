import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { CustomersTable } from "@/components/customers/customers-table"
import { CustomersDashboard } from "@/components/customers/customers-dashboard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAllUsers } from "@/lib/db"
import { Users, UserPlus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function CustomersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Fetch initial users data
  let initialData
  try {
    const rawData = await getAllUsers(1, 10)
    // Convert Date objects to strings for client components
    initialData = {
      users: rawData.users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified?.toISOString() || null,
      })),
      pagination: rawData.pagination,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    initialData = {
      users: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50/30 via-white to-blue-100/20 min-h-screen">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-8 py-8 md:py-10">
                {/* Header Section */}
                <div className="px-4 lg:px-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-600" />
                        Customers
                      </h1>
                      <p className="text-lg text-gray-600">
                        Manage and view all registered customers in your dental e-commerce platform
                      </p>
                    </div>

                  </div>
                </div>

                {/* Dashboard with Charts */}
                <div className="px-4 lg:px-6">
                  <CustomersDashboard initialData={initialData} />
                </div>

                {/* Customers Table */}
                <div className="px-4 lg:px-6">
                  <CustomersTable
                    initialUsers={initialData.users}
                    initialPagination={initialData.pagination}
                  />
                </div>

                {/* Footer Section */}
                <div className="px-4 lg:px-6 pb-8">
                  <div className="text-center py-8 border-t border-gray-200/50">
                    <p className="text-sm text-gray-500 font-medium">
                      © 2024 Dental Camp E-commerce Platform. Customer management made easy.
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

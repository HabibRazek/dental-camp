import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { UserSidebar } from "@/components/user/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye,
  Calendar,
  CreditCard,
  MapPin
} from "lucide-react"
import { UserOrdersList } from "@/components/user/user-orders-list"
import { UserOrdersStats } from "@/components/user/user-orders-stats"

export default async function UserOrdersPage() {
  const session = await auth()

  if (!session) {
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
                
                {/* Header */}
                <div className="px-4 lg:px-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <ShoppingBag className="h-8 w-8 text-blue-500" />
                        My Orders
                      </h1>
                      <p className="text-gray-600 mt-2">
                        Track and manage all your orders in one place
                      </p>
                    </div>
                  </div>
                </div>

                {/* Orders Content */}
                <div className="px-4 lg:px-6">
                  <div className="grid grid-cols-1 gap-6">
                    
                    {/* Order Statistics Cards */}
                    <UserOrdersStats userId={session.user.id} />

                    {/* Orders List */}
                    <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                      <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50">
                        <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
                          Recent Orders
                        </CardTitle>
                        <CardDescription className="text-gray-600 font-medium">
                          Your order history and current status
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="p-0">
                        <UserOrdersList userId={session.user.id} />
                      </CardContent>
                    </Card>

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

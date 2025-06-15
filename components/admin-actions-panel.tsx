"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Settings, 
  Plus,
  Eye,
  AlertTriangle,
  TrendingUp,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickStats {
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  unreadMessages: number
  lowStockProducts: number
  recentSignups: number
}

export function AdminActionsPanel() {
  const router = useRouter()
  const [stats, setStats] = React.useState<QuickStats | null>(null)
  const [loading, setLoading] = React.useState(true)

  const fetchQuickStats = React.useCallback(async () => {
    try {
      setLoading(true)
      const [usersRes, productsRes, ordersRes, messagesRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/products'),
        fetch('/api/orders?status=PENDING'),
        fetch('/api/contact')
      ])

      const [users, products, orders, messages] = await Promise.all([
        usersRes.ok ? usersRes.json() : { users: [] },
        productsRes.ok ? productsRes.json() : { products: [] },
        ordersRes.ok ? ordersRes.json() : { orders: [] },
        messagesRes.ok ? messagesRes.json() : { messages: [] }
      ])

      setStats({
        totalUsers: users.users?.length || 0,
        totalProducts: products.products?.length || 0,
        pendingOrders: orders.orders?.length || 0,
        unreadMessages: messages.messages?.filter((m: any) => m.status === 'UNREAD').length || 0,
        lowStockProducts: products.products?.filter((p: any) => p.stockQuantity < p.lowStockThreshold).length || 0,
        recentSignups: users.users?.filter((u: any) => {
          const signupDate = new Date(u.createdAt)
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          return signupDate > weekAgo
        }).length || 0
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchQuickStats()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchQuickStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchQuickStats])

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage customer accounts",
      icon: Users,
      href: "/customers",
      color: "bg-blue-500",
      stat: stats?.totalUsers,
      statLabel: "Total Users"
    },
    {
      title: "View Products",
      description: "Browse and manage products",
      icon: Package,
      href: "/catalog",
      color: "bg-green-500",
      stat: stats?.totalProducts,
      statLabel: "Products"
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      icon: ShoppingCart,
      href: "/orders",
      color: "bg-purple-500",
      stat: stats?.pendingOrders,
      statLabel: "Pending",
      urgent: (stats?.pendingOrders || 0) > 0
    },
    {
      title: "Messages",
      description: "Customer support messages",
      icon: MessageSquare,
      href: "/admin/messages",
      color: "bg-orange-500",
      stat: stats?.unreadMessages,
      statLabel: "Unread",
      urgent: (stats?.unreadMessages || 0) > 0
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: TrendingUp,
      href: "/analytics",
      color: "bg-indigo-500",
      stat: stats?.recentSignups,
      statLabel: "New Users"
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: Settings,
      href: "/settings",
      color: "bg-gray-500",
      stat: stats?.lowStockProducts,
      statLabel: "Low Stock",
      urgent: (stats?.lowStockProducts || 0) > 0
    }
  ]

  return (
    <div className="px-4 lg:px-6 mb-8">
      <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-purple-500 rounded-full"></div>
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Manage your dental e-commerce platform efficiently
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchQuickStats}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card
                    key={action.title}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-gray-200 hover:border-gray-300"
                    onClick={() => router.push(action.href)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {action.urgent && (
                          <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          {action.description}
                        </p>
                        
                        {action.stat !== undefined && (
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">{action.statLabel}</span>
                            <Badge 
                              variant={action.urgent ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {action.stat}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RefreshCw, ExternalLink, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Order {
  id: string
  orderNumber: string
  status: string
  items: any[]
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  totals: {
    subtotal: number
    delivery: number
    total: number
  }
  createdAt: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "default"
    case "Shipped":
      return "secondary"
    case "Pending":
      return "outline"
    default:
      return "outline"
  }
}

export function DataTable() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date())

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders?limit=10')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        setLastUpdated(new Date())
      } else {
        console.warn('Failed to fetch orders, using empty array')
        setOrders([])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      // Set empty array on error to prevent crashes
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchOrders()

    // Auto-refresh every 3 minutes
    const interval = setInterval(fetchOrders, 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} TND`
  }

  const getStatusColor = (status: string) => {
    if (!status) return "outline"
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "default"
      case "SHIPPED":
        return "secondary"
      case "PROCESSING":
        return "outline"
      case "PENDING":
        return "outline"
      case "CANCELLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    if (!status) return "📦"
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "✅"
      case "SHIPPED":
        return "🚚"
      case "PROCESSING":
        return "⚙️"
      case "PENDING":
        return "⏳"
      case "CANCELLED":
        return "❌"
      default:
        return "📦"
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Recent Orders</CardTitle>
                  <CardDescription>Loading latest orders...</CardDescription>
                </div>
              </div>
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
                Recent Orders
                <Badge variant="outline" className="ml-2">
                  {orders.length} orders
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium flex items-center justify-between">
                <span>Latest orders from dental professionals and clinics</span>
                <span className="text-xs text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick stats */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                  <div className="text-xs text-gray-500 font-medium">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status && o.status.toUpperCase() === 'DELIVERED').length}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Delivered</div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 hover:from-gray-50 hover:to-gray-100/80 border-b border-gray-200/50">
                  <TableHead className="font-bold text-gray-800 py-4 px-6">
                    <div className="flex items-center gap-2">
                      👤 Customer
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    <div className="flex items-center gap-2">
                      📦 Product
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    <div className="flex items-center gap-2">
                      📅 Order Date
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    <div className="flex items-center gap-2">
                      🚚 Status
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-800 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      💰 Amount
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-4xl">📦</div>
                        <div className="text-gray-500">No orders found</div>
                        <Button variant="outline" onClick={fetchOrders}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Orders
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order, index) => {
                    // Get product info from items
                    let productName = "Unknown Product"
                    let itemCount = 0

                    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
                      productName = order.items[0].name || "Product"
                      itemCount = order.items.length
                    }

                    // Get customer info
                    const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}`.trim() : 'Unknown Customer'
                    const customerEmail = order.customer?.email || 'No email provided'
                    const orderTotal = order.totals?.total || 0

                    return (
                      <TableRow
                        key={order.id}
                        className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 border-b border-gray-100/50 cursor-pointer"
                      >
                        <TableCell className="font-medium py-6 px-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold text-sm">
                                {customerName ? customerName.split(' ').map(n => n[0]).join('') : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                                {customerName}
                              </div>
                              <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors font-medium">
                                {customerEmail}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                          <div className="max-w-[200px]">
                            <div className="font-bold text-gray-900">{productName}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Order #{order.orderNumber || order.id || 'N/A'} • {itemCount} item{itemCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                          <div className="flex flex-col">
                            <span>{formatDate(order.createdAt)}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={getStatusColor(order.status)}
                            className="font-bold px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-105"
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status || 'Unknown'}
                            </div>
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right font-black text-gray-900 text-xl pr-6 group-hover:text-blue-900 transition-colors">
                          <div className="flex flex-col items-end">
                            <span>{formatCurrency(Number(orderTotal))}</span>
                            <span className="text-xs text-gray-400 font-normal">TND</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

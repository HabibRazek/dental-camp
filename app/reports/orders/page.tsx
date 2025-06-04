"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface OrderReport {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  total: number
  itemsCount: number
  createdAt: string
}

interface ReportSummary {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
}

export default function OrderReportsPage() {
  const [orders, setOrders] = useState<OrderReport[]>([])
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchOrderReports()
  }, [dateRange, statusFilter])

  const fetchOrderReports = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        const ordersData = data.orders || []
        
        // Filter orders based on date range
        const filteredOrders = filterOrdersByDate(ordersData, dateRange)
        
        // Filter by status if not "all"
        const statusFilteredOrders = statusFilter === "all" 
          ? filteredOrders 
          : filteredOrders.filter((order: any) => order.status === statusFilter)

        // Transform orders for report
        const reportOrders: OrderReport[] = statusFilteredOrders.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customer?.firstName + ' ' + order.customer?.lastName || 'Unknown',
          customerEmail: order.customer?.email || '',
          status: order.status,
          total: order.totals?.total || 0,
          itemsCount: order.items?.length || 0,
          createdAt: order.createdAt
        }))

        setOrders(reportOrders)

        // Calculate summary
        const reportSummary: ReportSummary = {
          totalOrders: reportOrders.length,
          totalRevenue: reportOrders.reduce((sum, order) => sum + order.total, 0),
          averageOrderValue: reportOrders.length > 0 
            ? reportOrders.reduce((sum, order) => sum + order.total, 0) / reportOrders.length 
            : 0,
          completedOrders: reportOrders.filter(order => order.status === 'COMPLETED').length,
          pendingOrders: reportOrders.filter(order => order.status === 'PENDING').length,
          cancelledOrders: reportOrders.filter(order => order.status === 'CANCELLED').length
        }

        setSummary(reportSummary)
      }
    } catch (error) {
      console.error('Failed to fetch order reports:', error)
      toast.error('Failed to load order reports')
    } finally {
      setLoading(false)
    }
  }

  const filterOrdersByDate = (orders: any[], range: string) => {
    const now = new Date()
    let startDate: Date

    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        return orders
    }

    return orders.filter((order: any) => new Date(order.createdAt) >= startDate)
  }

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportToCSV = () => {
    const headers = ['Order Number', 'Customer Name', 'Customer Email', 'Status', 'Total (TND)', 'Items Count', 'Date']
    const csvData = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.status,
        order.total.toFixed(2),
        order.itemsCount,
        new Date(order.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `order-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Report exported successfully')
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      COMPLETED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800"
    }
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Prepare chart data
  const statusChartData = summary ? [
    { name: 'Completed', value: summary.completedOrders, color: '#10b981' },
    { name: 'Pending', value: summary.pendingOrders, color: '#f59e0b' },
    { name: 'Cancelled', value: summary.cancelledOrders, color: '#ef4444' }
  ].filter(item => item.value > 0) : []

  if (loading) {
    return (
      <DashboardLayout
        title="Order Reports"
        description="Comprehensive order analytics and reporting"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading order reports...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Order Reports"
      description="Comprehensive order analytics and detailed reporting for your dental e-commerce platform"
    >
      <div className="space-y-8">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Date Range:</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={fetchOrderReports}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{summary.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders in selected period</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">Revenue generated</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(summary.averageOrderValue)}</div>
                  <p className="text-xs text-muted-foreground">Per order average</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {summary.totalOrders > 0 ? Math.round((summary.completedOrders / summary.totalOrders) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Orders completed</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Status Distribution
                </CardTitle>
                <CardDescription>Breakdown of orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                {statusChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Order Statistics
                </CardTitle>
                <CardDescription>Key metrics for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Completed Orders</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{summary.completedOrders}</span>
                          <Badge className="bg-green-100 text-green-800">
                            {summary.totalOrders > 0 ? Math.round((summary.completedOrders / summary.totalOrders) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Pending Orders</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{summary.pendingOrders}</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {summary.totalOrders > 0 ? Math.round((summary.pendingOrders / summary.totalOrders) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cancelled Orders</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{summary.cancelledOrders}</span>
                          <Badge className="bg-red-100 text-red-800">
                            {summary.totalOrders > 0 ? Math.round((summary.cancelledOrders / summary.totalOrders) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Revenue</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(summary.totalRevenue)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Details
              </CardTitle>
              <CardDescription>
                Detailed list of orders ({filteredOrders.length} orders found)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Order Number</th>
                      <th className="text-left p-2 font-medium">Customer</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Items</th>
                      <th className="text-left p-2 font-medium">Total</th>
                      <th className="text-left p-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No orders found for the selected criteria
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <span className="font-mono text-sm">{order.orderNumber}</span>
                          </td>
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{order.customerName}</div>
                              <div className="text-sm text-gray-500">{order.customerEmail}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge className={getStatusBadge(order.status)}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <span className="text-sm">{order.itemsCount} items</span>
                          </td>
                          <td className="p-2">
                            <span className="font-medium">{formatCurrency(order.total)}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-sm">{formatDate(order.createdAt)}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

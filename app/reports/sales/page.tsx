"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Download,
  RefreshCw,
  Calendar,
  BarChart3
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface SalesData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  topSellingProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  salesByCategory: Array<{
    category: string
    revenue: number
    orders: number
  }>
  salesTrend: Array<{
    date: string
    revenue: number
    orders: number
  }>
  customerSegments: Array<{
    segment: string
    customers: number
    revenue: number
    percentage: number
  }>
}

export default function SalesAnalyticsPage() {
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [comparisonPeriod, setComparisonPeriod] = useState("previous")

  useEffect(() => {
    fetchSalesData()
  }, [timeRange])

  const fetchSalesData = async () => {
    setLoading(true)
    try {
      // Fetch real data from APIs
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/customers')
      ])

      const [ordersData, productsData, customersData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        customersRes.json()
      ])

      const orders = ordersData.orders || []
      const products = productsData.products || []
      const customers = customersData.customers || []

      // Filter orders by time range
      const filteredOrders = filterOrdersByTimeRange(orders, timeRange)

      // Calculate sales metrics
      const totalRevenue = filteredOrders.reduce((sum: number, order: any) => sum + (order.totals?.total || 0), 0)
      const totalOrders = filteredOrders.length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate top selling products (mock data for now)
      const topSellingProducts = products.slice(0, 5).map((product: any, index: number) => ({
        id: product.id,
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 20,
        revenue: Math.floor(Math.random() * 10000) + 2000
      }))

      // Calculate sales by category (mock data)
      const salesByCategory = [
        { category: 'Dental Implants', revenue: totalRevenue * 0.35, orders: Math.floor(totalOrders * 0.25) },
        { category: 'Orthodontics', revenue: totalRevenue * 0.25, orders: Math.floor(totalOrders * 0.30) },
        { category: 'Surgical Tools', revenue: totalRevenue * 0.20, orders: Math.floor(totalOrders * 0.20) },
        { category: 'Dental Materials', revenue: totalRevenue * 0.15, orders: Math.floor(totalOrders * 0.20) },
        { category: 'Equipment', revenue: totalRevenue * 0.05, orders: Math.floor(totalOrders * 0.05) }
      ]

      // Generate sales trend data
      const salesTrend = generateSalesTrend(filteredOrders, timeRange)

      // Customer segments
      const customerSegments = [
        { segment: 'New Customers', customers: Math.floor(customers.length * 0.4), revenue: totalRevenue * 0.25, percentage: 25 },
        { segment: 'Returning Customers', customers: Math.floor(customers.length * 0.45), revenue: totalRevenue * 0.55, percentage: 55 },
        { segment: 'VIP Customers', customers: Math.floor(customers.length * 0.15), revenue: totalRevenue * 0.20, percentage: 20 }
      ]

      const analytics: SalesData = {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        conversionRate: Math.random() * 5 + 2, // Mock conversion rate
        topSellingProducts,
        salesByCategory,
        salesTrend,
        customerSegments
      }

      setSalesData(analytics)
    } catch (error) {
      console.error('Failed to fetch sales data:', error)
      toast.error('Failed to load sales analytics')
    } finally {
      setLoading(false)
    }
  }

  const filterOrdersByTimeRange = (orders: any[], range: string) => {
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

  const generateSalesTrend = (orders: any[], range: string) => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
    const trend = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dayOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.toDateString() === date.toDateString()
      })
      
      trend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((sum: number, order: any) => sum + (order.totals?.total || 0), 0),
        orders: dayOrders.length
      })
    }
    
    return trend
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const exportSalesReport = () => {
    if (!salesData) return

    const reportData = {
      period: timeRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: salesData.totalRevenue,
        totalOrders: salesData.totalOrders,
        averageOrderValue: salesData.averageOrderValue,
        conversionRate: salesData.conversionRate
      },
      topProducts: salesData.topSellingProducts,
      categoryBreakdown: salesData.salesByCategory,
      customerSegments: salesData.customerSegments
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Sales report exported successfully')
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Sales Analytics"
        description="Comprehensive sales performance analysis and insights"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading sales analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!salesData) {
    return (
      <DashboardLayout
        title="Sales Analytics"
        description="Comprehensive sales performance analysis and insights"
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load sales data</p>
          <Button onClick={fetchSalesData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Sales Analytics"
      description="Comprehensive sales performance analysis and business insights for your dental e-commerce platform"
    >
      <div className="space-y-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
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
            <Button variant="outline" onClick={fetchSalesData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Button onClick={exportSalesReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(salesData.totalRevenue)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-600">+12.5%</span>
                  <span className="ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{salesData.totalOrders}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-600">+8.2%</span>
                  <span className="ml-1">from last period</span>
                </div>
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
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(salesData.averageOrderValue)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-600">+4.1%</span>
                  <span className="ml-1">from last period</span>
                </div>
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
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{salesData.conversionRate.toFixed(1)}%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-600">-1.2%</span>
                  <span className="ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Trend
                </CardTitle>
                <CardDescription>Revenue and orders over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value as number) : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Selling Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Top Selling Products
                </CardTitle>
                <CardDescription>Best performing products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData.topSellingProducts} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sales by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales by Category
                </CardTitle>
                <CardDescription>Revenue distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesData.salesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="revenue"
                      label={({ category, revenue }) => `${category}: ${formatCurrency(revenue)}`}
                    >
                      {salesData.salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Segments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Segments
                </CardTitle>
                <CardDescription>Revenue by customer type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.customerSegments.map((segment, index) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{segment.segment}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{segment.customers} customers</span>
                          <Badge variant="secondary">{segment.percentage}%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${segment.percentage}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium text-green-600">
                          {formatCurrency(segment.revenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Category Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Category Performance
              </CardTitle>
              <CardDescription>Detailed breakdown of sales by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-left p-2 font-medium">Revenue</th>
                      <th className="text-left p-2 font-medium">Orders</th>
                      <th className="text-left p-2 font-medium">Avg Order Value</th>
                      <th className="text-left p-2 font-medium">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.salesByCategory.map((category, index) => (
                      <tr key={category.category} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <span className="font-medium">{category.category}</span>
                        </td>
                        <td className="p-2">
                          <span className="font-medium text-green-600">{formatCurrency(category.revenue)}</span>
                        </td>
                        <td className="p-2">
                          <span>{category.orders}</span>
                        </td>
                        <td className="p-2">
                          <span>{formatCurrency(category.orders > 0 ? category.revenue / category.orders : 0)}</span>
                        </td>
                        <td className="p-2">
                          <Badge variant="secondary">
                            {((category.revenue / salesData.totalRevenue) * 100).toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
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
